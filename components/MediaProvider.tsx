import React from "react";
//import { TrackType } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { Storage, Auth } from "aws-amplify";
import MediaContext from "./MediaContext";

interface TrackType {
  title: string; // The title of the track
  artist: string; // The name of the artist
  source: string; // The source URL or path of the audio file
}

interface MediaProviderProps {
  children: React.ReactNode; // Specify the type for the children prop
}

// Function to get the artist name by sub ID
const getArtistNameBySubId = async (subId: string): Promise<string> => {
  try {
    // Get the user attributes from Cognito
    const user = await Auth.userAttributes(
      await Auth.currentAuthenticatedUser()
    );
    // Get the artist name from the "custom:Name" attribute
    const artistName = user.find((attr) => attr.Name === "custom:Name")?.Value;
    return artistName || "Unknown"; // Return 'Unknown' if the attribute is not found
  } catch (error) {
    console.error("Failed to get artist name:", error);
    return "Unknown";
  }
};

const MediaProvider = ({ children }: MediaProviderProps): JSX.Element => {
  /* States */
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>(
    {}
  );

  /* Map of audioRefs */
  /* const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const durRefs = useRef<Map<string, number>>(new Map()); */
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // List items in the "public/media/" folder
        const listResult = await Storage.list("media", { level: "public" });
        const results = (listResult.results || []) as { key: string }[];

        // Filter the items to include only audio files
        const audioFiles = results.filter(
          (item) => item.key.endsWith(".mp3") || item.key.endsWith(".wav")
        );

        console.log("Audio files:", audioFiles);

        // Iterate over each audio file to retrieve metadata
        const trackPromises = audioFiles.map(async (audioFile) => {
          const fileKey = audioFile.key;

          // Extract metadata from the file key
          const folderName = fileKey.split("/").slice(-2, -1)[0] || "";
          const subId = folderName.split("_")[0];
          const title = folderName.split("_")[1];
          const artist = await getArtistNameBySubId(subId);

          const fileUrl = await Storage.get(fileKey, { level: "public" });

          return {
            title: title,
            artist: artist,
            source: fileUrl as string,
          };
        });
        console.log("results", results);

        const trackList = (await Promise.all(trackPromises)).filter(
          (track) => track !== null
        ) as TrackType[];
        setTracks(trackList);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };
    fetchTracks();
  }, []);

  // Update the audio element's source when the current track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack;
      audioRef.current.onloadedmetadata = () => {
        setTrackDurations((prevDurations) => ({
          ...prevDurations,
          [currentTrack]: audioRef.current!.duration,
        }));
      };
    }
  }, [currentTrack]);

  /* Play/Pause Function */
  const handlePlayPause = (trackSource: string) => {
    // Get the audio element from the ref
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (currentTrack === trackSource) {
      if (audioElement.paused) {
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        setIsPlaying(true);
      } else {
        audioElement.pause();
        setIsPlaying(false);
      }
    } else {
      // Pause the current audio
      audioElement.pause();
      // Set the new source
      audioElement.src = trackSource;
      // Update the current track
      setCurrentTrack(trackSource);
      // Set isPlaying to true
      setIsPlaying(true);
      // Add an event listener for the canplaythrough event
      const handleCanPlayThrough = () => {
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        // Remove the event listener after playback starts
        audioElement.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
      };
      audioElement.addEventListener("canplaythrough", handleCanPlayThrough);
      // Load the new audio source
      audioElement.load();
    }
  };

  return (
    <MediaContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        currentTrack,
        setCurrentTrack,
        handlePlayPause,
        tracks,
        trackDurations,
        audioElement: audioRef.current,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </MediaContext.Provider>
  );
};

export default MediaProvider;

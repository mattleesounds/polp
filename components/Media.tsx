import React from "react";
//import { TrackType } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import Feed from "./Feed";
import ControlBar from "./ControlBar";
import { Storage, Auth } from "aws-amplify";

interface TrackType {
  title: string; // The title of the track
  artist: string; // The name of the artist
  source: string; // The source URL or path of the audio file
}

interface MediaContents {
  results: { key: string }[];
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

const Media = (): JSX.Element => {
  /* Tracks */
  /* const tracks: TrackType[] = [
    {
      title: "50 Ways to Leave Your Lover",
      artist: "Paul Simon",
      source: "song1.mp3",
    },
    {
      title: "So Fresh, So Clean",
      artist: "Outkast",
      source:
        "https://YOUR_S3_BUCKET_NAME.s3.us-east-2.amazonaws.com/Outkast+-+So+Fresh%2C+So+Clean+(Official+HD+Video).mp3",
    },
    {
      title: "Prelude in E Minor",
      artist: "Chopin",
      source: "song3.mp3",
    },
    {
      title: "Giant Steps",
      artist: "John Coltrane",
      source: "song4.mp3",
    },
    {
      title: "Set You Free",
      artist: "The Black Keys",
      source: "song5.mp3",
    },
    {
      title: "Special Affair/Curse",
      artist: "The Internet",
      source: "song6.mp3",
    },
  ]; */

  /* States */
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  /* Map of audioRefs */
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const durRefs = useRef<Map<string, number>>(new Map());

  interface MediaContents {
    results: { key: string }[];
  }

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

  /* Play/Pause Function */
  const handlePlayPause = (trackSource: string) => {
    if (currentTrack === trackSource) {
      const audioElement = audioRefs.current.get(trackSource);
      if (audioElement) {
        if (audioElement.paused) {
          audioElement.play();
          setIsPlaying(true);
        } else {
          audioElement.pause();
          setIsPlaying(false);
        }
      }
    } else {
      audioRefs.current.forEach((audioElement) => {
        audioElement.pause();
      });
      const audioElement = audioRefs.current.get(trackSource);
      if (audioElement) {
        audioElement.play();
        setIsPlaying(true);
      }
      setCurrentTrack(trackSource);
    }
  };

  return (
    <div>
      <Feed
        tracks={tracks}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
        handlePlayPause={handlePlayPause}
        audioRefs={audioRefs}
        durRefs={durRefs}
      />
      <ControlBar
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTrack={currentTrack}
        audioRefs={audioRefs}
        setCurrentTrack={setCurrentTrack}
        durRefs={durRefs}
        handlePlayPause={handlePlayPause}
        tracks={tracks}
      />
    </div>
  );
};

export default Media;

import React from "react";
//import { TrackType } from "@/lib/types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Storage, Auth } from "aws-amplify";
import MediaContext from "./MediaContext";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import awsExports from "../src/aws-exports.js";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { TrackType } from "./MediaContext";

interface MediaProviderProps {
  children: React.ReactNode; // Specify the type for the children prop
}

const MediaProvider = ({ children }: MediaProviderProps): JSX.Element => {
  /* States */
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>(
    {}
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  // Create an S3 client instance

  const fetchTracks = useCallback(async () => {
    // Retrieve the current user's credentials from Amplify
    const credentials = await Auth.currentCredentials();

    // Create an S3 client using the AWS SDK v3
    const s3Client = new S3Client({
      region: "us-east-2", // Update this to your desired region
      credentials: credentials,
    });

    try {
      const listResult = await Storage.list("media/");
      const audioFiles = listResult.results.filter((item) => {
        const key = item.key || "";
        return key.endsWith(".mp3") || key.endsWith(".wav");
      });

      const trackPromises = audioFiles.map(async (item) => {
        const fileKey = item.key || "";
        const trackId = fileKey.split("/")[1];

        const headObjectCommand = new HeadObjectCommand({
          Bucket: awsExports.aws_user_files_s3_bucket,
          Key: "public/" + fileKey,
        });
        const metadataResponse = await s3Client.send(headObjectCommand);

        const metadata = metadataResponse.Metadata;
        const title = metadata ? metadata["title"] : "";
        const artistSubId = metadata ? metadata["artist-sub-id"] : "";
        const color = metadata ? metadata["color"] : "";

        const fileUrl = await Storage.get(fileKey);

        return {
          title: title,
          artistSubId: artistSubId,
          source: fileUrl as string,
          color: color,
          trackId: trackId,
        };
      });

      const trackList = await Promise.all(trackPromises);
      setTracks(trackList);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  }, []); // Define any dependencies for fetchTracks here

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]); // Include fetchTracks in the dependency array

  // Update the audio element's source when the current track changes
  /*   useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.source;
    }
  }, [currentTrack]); */

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.source;
      audioRef.current.onloadedmetadata = () => {
        setTrackDurations((prevDurations) => ({
          ...prevDurations,
          [currentTrack.source]: audioRef.current!.duration,
        }));
      };
    }
  }, [currentTrack]);

  const handlePlayPause = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  /* Play/Pause Function */
  /* const handlePlayPause = (trackSource: string) => {
    // Get the audio element from the ref
    const audioElement = audioRef.current;
    if (!audioElement) return;

    console.log("handlePlayPause called:", trackSource);

    // Find the track object that matches the trackSource
    const selectedTrack = tracks.find((track) => track.source === trackSource);

    if (currentTrack && selectedTrack && currentTrack.source === trackSource) {
      console.log("Toggling play/pause for current track");
      if (audioElement.paused) {
        console.log("Attempting to play current track");
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        setIsPlaying(true);
      } else {
        console.log("Pausing current track");
        audioElement.pause();
        setIsPlaying(false);
      }
    } else {
      if (selectedTrack) {
        console.log("Switching to new track:", selectedTrack.source);
        // Pause the current audio
        audioElement.pause();
        // Set the new source
        audioElement.src = selectedTrack.source;
        // Update the current track
        setCurrentTrack(selectedTrack); // Set the entire track object
        // Set isPlaying to true
        setIsPlaying(true);
        // Add an event listener for the canplay event
        const handleCanPlay = () => {
          console.log("Can play event triggered, attempting to play new track");
          audioElement.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
          // Remove the event listener after playback starts
          audioElement.removeEventListener("canplay", handleCanPlay);
        };
        audioElement.addEventListener("canplay", handleCanPlay);
        // Load the new audio source
        audioElement.load();
      }
    }
  }; */

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

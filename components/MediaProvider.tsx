import React from "react";
//import { TrackType } from "@/lib/types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Storage, Auth } from "aws-amplify";
import MediaContext from "./MediaContext";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import awsExports from "../src/aws-exports.js";
import {
  S3Client,
  GetObjectCommand,
  GetObjectOutput,
} from "@aws-sdk/client-s3";
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

  async function streamToString(
    stream: ReadableStream<Uint8Array>
  ): Promise<string> {
    let result = "";
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder("utf-8").decode(value);
    }
    return result;
  }

  interface StorageObject {
    key: string;
    eTag?: string;
    lastModified?: string;
    size?: number;
  }

  const fetchTracks = useCallback(async () => {
    // Retrieve the current user's credentials from Amplify
    const credentials = await Auth.currentCredentials();

    // Create an S3 client using the AWS SDK v3
    const s3Client = new S3Client({
      region: "us-east-2", // Update this to your desired region
      credentials: credentials,
    });

    try {
      // List all files under 'public/media/' directory
      const listResult = await Storage.list("public/media/");

      const audioFiles = listResult.items.filter((item) => {
        const key = item.key || "";
        return key.endsWith(".mp3") || key.endsWith(".wav");
      });

      const trackPromises = audioFiles.map(async (item: StorageObject) => {
        const fileKey = item.key || "";
        const trackId = fileKey.split("/")[2];

        // Change the key to fetch metadata from the track's directory
        const metadataKey = `public/media/${trackId}/metadata.json`;
        const getObjectCommand = new GetObjectCommand({
          Bucket: awsExports.aws_user_files_s3_bucket,
          Key: metadataKey,
        });
        const metadataResponse = await s3Client.send(getObjectCommand);

        // Parse the metadata from the response
        const metadataString = await streamToString(
          (metadataResponse as GetObjectOutput)
            .Body as ReadableStream<Uint8Array>
        );

        const metadata = JSON.parse(metadataString);
        const title = metadata ? metadata["title"] : "";
        const artistSubId = metadata ? metadata["artist-sub-id"] : "";
        const color = metadata ? metadata["color"] : "";
        const timestamp = metadata ? metadata["timestamp"] : "";

        // Construct the CloudFront URL using the fileKey
        const fileUrl = `https://d2pg44z08okzoj.cloudfront.net/${fileKey}`;

        return {
          title: title,
          artistSubId: artistSubId,
          source: fileUrl,
          color: color,
          trackId: trackId,
          timestamp: timestamp,
        };
      });

      const trackList = await Promise.all(trackPromises);
      trackList.sort((a: any, b: any) => {
        if (a.timestamp && b.timestamp) {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        } else if (a.timestamp) {
          return -1; // a has a timestamp but b does not, so a should come first
        } else if (b.timestamp) {
          return 1; // b has a timestamp but a does not, so b should come first
        } else {
          return 0; // neither a nor b have a timestamp, so their order doesn't matter
        }
      });

      setTracks(trackList);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]); // Include fetchTracks in the dependency array

  // Update the audio element's source when the current track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.source;
    }
  }, [currentTrack]);

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

  const handlePlayPause = (trackSource: string) => {
    console.log("handlePlayPause called:", trackSource);
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Find the track object that matches the trackSource
    const selectedTrack = tracks.find((track) => track.source === trackSource);
    console.log("Audio source URL:", selectedTrack?.source);

    // If the selected track is the current track, toggle between play and pause
    if (currentTrack && selectedTrack && currentTrack.source === trackSource) {
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
      // If a different track is selected, switch to the new track
      if (selectedTrack) {
        // Pause the current audio
        audioElement.pause();
        // Set the new source
        audioElement.src = selectedTrack.source;
        // Update the current track
        setCurrentTrack(selectedTrack);
        // Set isPlaying to true
        setIsPlaying(true);
        // Add an event listener for the loadedmetadata event
        const handleLoadedMetadata = () => {
          audioElement.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
          // Remove the event listener after playback starts
          audioElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
        };
        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        // Load the new audio source
        audioElement.load();
      }
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
      <audio ref={audioRef} preload="auto" />
    </MediaContext.Provider>
  );
};

export default MediaProvider;

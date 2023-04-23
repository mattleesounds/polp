import React from "react";
//import { TrackType } from "@/lib/types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Storage, Auth } from "aws-amplify";
import MediaContext from "./MediaContext";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import awsExports from "../src/aws-exports.js";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

interface TrackType {
  title: string; // The title of the track
  artist: string; // The name of the artist
  source: string; // The source URL or path of the audio ile
  trackId: string; // The ID of the track
  color: string; // The color of the track
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

/* const getMetadata = async (trackId: string, audioFileName: string) => {
  const s3 = new S3(); // Create an instance of the S3 client
  const params = {
    Bucket: "YOUR_S3_BUCKET_NAME124813-dev", // Replace with your bucket name
    Key: `media/${trackId}/${audioFileName}`, // Use the correct key
  };
  try {
    const data = await s3.headObject(params).promise();
    return data.Metadata || {};
  } catch (error) {
    console.error("Error retrieving metadata:", error);
    return {};
  }
}; */

const MediaProvider = ({ children }: MediaProviderProps): JSX.Element => {
  /* States */
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
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

      console.log("Audio files:", audioFiles);

      const trackPromises = audioFiles.map(async (item) => {
        const fileKey = item.key || "";
        const trackId = fileKey.split("/")[1];

        const headObjectCommand = new HeadObjectCommand({
          Bucket: awsExports.aws_user_files_s3_bucket,
          Key: "public/" + fileKey,
        });
        const metadataResponse = await s3Client.send(headObjectCommand);
        console.log("Metadata response for file:", fileKey, metadataResponse);

        const metadata = metadataResponse.Metadata;
        const title = metadata ? metadata["x-amz-meta-title"] : "";
        const artist = metadata ? metadata["x-amz-meta-artist-name"] : "";
        const color = metadata ? metadata["x-amz-meta-color"] : "";

        const fileUrl = await Storage.get(fileKey);

        return {
          title: title,
          artist: artist,
          source: fileUrl as string,
          color: color,
          trackId: trackId,
        };
      });

      const trackList = await Promise.all(trackPromises);
      console.log("Track list:", trackList);
      setTracks(trackList);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  }, []); // Define any dependencies for fetchTracks here

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]); // Include fetchTracks in the dependency array

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

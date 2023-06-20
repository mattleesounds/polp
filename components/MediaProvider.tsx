import React from "react";
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
import {
  S3ProviderListOutputItem,
  S3ProviderListOutput,
} from "@aws-amplify/storage";

interface MediaProviderProps {
  children: React.ReactNode;
}

const MediaProvider = ({ children }: MediaProviderProps): JSX.Element => {
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

  const fetchTracks = useCallback(async () => {
    const credentials = await Auth.currentCredentials();
    const s3Client = new S3Client({
      region: "us-east-2",
      credentials: credentials,
    });

    try {
      const listResult = await Storage.list("media/");
      console.log("listResult:", listResult.results);

      const audioFiles: S3ProviderListOutputItem[] = listResult.results.filter(
        (item: S3ProviderListOutputItem) => {
          const key = item.key || "";
          return key.endsWith(".mp3") || key.endsWith(".wav");
        }
      );

      const trackPromises = audioFiles.map(
        async (item: S3ProviderListOutputItem) => {
          const fileKey = item.key!;
          const trackId = fileKey.split("/")[2];

          const metadataKey = `public/media/${trackId}/metadata.json`;
          const getObjectCommand = new GetObjectCommand({
            Bucket: awsExports.aws_user_files_s3_bucket,
            Key: metadataKey,
          });
          const metadataResponse = await s3Client.send(getObjectCommand);
          const metadataString = await streamToString(
            (metadataResponse as GetObjectOutput)
              .Body as ReadableStream<Uint8Array>
          );
          const metadata = JSON.parse(metadataString);
          const title = metadata ? metadata["title"] : "";
          const artistSubId = metadata ? metadata["artist-sub-id"] : "";
          const color = metadata ? metadata["color"] : "";
          const timestamp = metadata ? metadata["timestamp"] : "";
          const fileUrl = `https://d2pg44z08okzoj.cloudfront.net/${fileKey}`;

          return {
            title: title,
            artistSubId: artistSubId,
            source: fileUrl,
            color: color,
            trackId: trackId,
            timestamp: timestamp,
          };
        }
      );

      const trackList = await Promise.all(trackPromises);
      trackList.sort((a: any, b: any) => {
        if (a.timestamp && b.timestamp) {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        } else if (a.timestamp) {
          return -1;
        } else if (b.timestamp) {
          return 1;
        } else {
          return 0;
        }
      });
      console.log("trackList:", trackList);

      setTracks(trackList);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

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
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const selectedTrack = tracks.find((track) => track.source === trackSource);

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
      if (selectedTrack) {
        audioElement.pause();
        audioElement.src = selectedTrack.source;
        setCurrentTrack(selectedTrack);
        setIsPlaying(true);
        const handleLoadedMetadata = () => {
          audioElement.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
          audioElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
        };
        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
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

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

  /* Fetch tracks from S3 bucket */
  /* useEffect(() => {
    const fetchTracks = async () => {
      try {
        const items = (await Storage.list("public/media/", {
          level: "public",
        })) as unknown as { key: string }[];
        const trackPromises = items
          .filter(
            (item) => item.key.endsWith(".mp3") || item.key.endsWith(".wav")
          )
          .map(async (item) => {
            const fileName = item.key.split("/").pop() || "";
            const title = fileName.split(".")[0];
            const folderName = item.key.split("/").slice(-2, -1)[0] || "";
            const subId = folderName.split("_")[0];
            const artist = await getArtistNameBySubId(subId);
            return {
              title: title,
              artist: artist,
              source: item.key,
            };
          });
        const trackList = await Promise.all(trackPromises);
        setTracks(trackList);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };
    fetchTracks();
  }, []); */

  /*  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const result = await Storage.list("public/media/", { level: "public" });
        console.log(result); // Log the result to the console

        // Based on the structure of the result, extract the items array and process it
        // For now, we'll leave this part empty until we know the structure of the result

        // The rest of the code...
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };
    fetchTracks();
  }, []); */

  /* Fetch tracks from S3 bucket */
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // List track folders in the "public/media/" folder
        const trackFolders = (await Storage.list("public/media/", {
          level: "public",
        })) as unknown as { key: string }[];

        // Iterate over each track folder to retrieve audio files and metadata
        const trackPromises = trackFolders.map(async (trackFolder) => {
          const folderKey = trackFolder.key;
          const folderContents = (await Storage.list(folderKey, {
            level: "public",
          })) as unknown as { key: string }[];

          // Find the audio file in the folder contents
          const audioFile = folderContents.find(
            (item) => item.key.endsWith(".mp3") || item.key.endsWith(".wav")
          );
          if (!audioFile) return null; // Skip if no audio file found

          // Extract metadata from the folder name
          const folderName = folderKey.split("/").slice(-2, -1)[0] || "";
          const subId = folderName.split("_")[0];
          const title = folderName.split("_")[1];
          const artist = await getArtistNameBySubId(subId);

          return {
            title: title,
            artist: artist,
            source: audioFile.key,
          };
        });

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

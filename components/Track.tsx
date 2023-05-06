import React from "react";
import { AiOutlinePause } from "react-icons/ai";
import Image from "next/image";
import { IoMdShareAlt } from "react-icons/io";
import { BiPlay, BiPause } from "react-icons/bi";
//import { TrackType } from "@/lib/types";
import { useRef, useState, useEffect, useContext } from "react";
import MediaContext from "./MediaContext";
import { Storage } from "aws-amplify";
import { TrackType } from "./MediaContext";
import { Auth } from "aws-amplify";
import { getArtistNameBySubId } from "../utils";
interface TrackProps {
  track: TrackType;
}

const Track = ({ track }: TrackProps): JSX.Element => {
  const {
    isPlaying,
    setIsPlaying,
    currentTrack,
    setCurrentTrack,
    handlePlayPause,
    trackDurations,
  } = useContext(MediaContext);

  /* console.log("Track prop:", track); */

  const duration = trackDurations[track.source] || 0;
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);
  const durationDisplay = `${durationMinutes}:${durationSeconds
    .toString()
    .padStart(2, "0")}`;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const metadataFolderPath = `media/${track.trackId}/metadata/`;
      const response = await Storage.list(metadataFolderPath);
      const files = response.results || []; // Access the results property to get the array of files
      if (Array.isArray(files)) {
        // Check if files is an array
        const imageFile = files.find((file) => {
          // Ensure that the key property is defined before using it
          return (
            file.key && (file.key.endsWith(".jpg") || file.key.endsWith(".png"))
          );
        });
        if (imageFile && imageFile.key) {
          // Ensure that the key property is defined before using it
          const signedUrl = await Storage.get(imageFile.key);
          setImageUrl(signedUrl as string);
        } else {
          console.log("Image file not found:", imageFile); // Log if the image file is not found
        }
      } else {
        console.error("Files is not an array:", files);
      }
    };
    fetchImage();
  }, [track.trackId]);
  // ... (existing code)

  useEffect(() => {
    const fetchArtistName = async () => {
      const artistSubId = track.artistSubId; // Get the artistSubId from the track prop
      const name = await getArtistNameBySubId(artistSubId);
      setArtistName(name || "Unknown"); // Use "Unknown" as a fallback value
    };
    fetchArtistName();
  }, [track, artistName]); // Use the track prop as a dependency

  const addToCollection = async () => {
    try {
      // Get the current authenticated user's sub (unique identifier)
      const user = await Auth.currentAuthenticatedUser();
      const userSub = user.attributes.sub;

      // Get the artist's sub ID from the track metadata
      const artistSub = track.artistSubId;

      // Construct the path to the JSON file in the user's collection
      const userCollectionPath = `collections/${userSub}/${artistSub}/collection.json`;

      // Construct the path to the JSON file in the artist's collectors folder
      const artistCollectorsPath = `collectors/${artistSub}/${userSub}/collection.json`;

      // Initialize an empty array to store the trackIds
      let trackIds = [];

      try {
        // Try to download the JSON file from S3
        const fileUrl = await Storage.get(userCollectionPath);
        const response = await fetch(fileUrl as string);
        const data = await response.json();
        trackIds = data.trackIds || [];
      } catch (error) {
        // If the file does not exist, we will create a new one later
        console.warn("Collection file not found. Creating a new one.");
      }

      // Add the new trackId to the array
      trackIds.push(track.trackId);

      // Create an object to store in the JSON file
      const collectionData = {
        trackIds: trackIds,
      };

      // Upload the updated JSON file back to S3 (user's collection)
      await Storage.put(userCollectionPath, JSON.stringify(collectionData), {
        contentType: "application/json",
      });

      // Upload the updated JSON file to S3 (artist's collectors folder)
      await Storage.put(artistCollectorsPath, JSON.stringify(collectionData), {
        contentType: "application/json",
      });

      // Notify the user that the track has been added to their collection
      alert("Track added to your collection!");
    } catch (error) {
      console.error("Error adding track to collection:", error);
      alert("Failed to add track to collection.");
    }
  };

  return (
    <div className="m-3 flex h-32 w-[300px] rounded-lg bg-polp-white">
      {/* Art/Controls */}
      <div className="relative m-3 flex h-[100px] w-[100px] items-center justify-center bg-polp-grey align-middle">
        {/* Display the image using the Image component */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Track cover"
            className="h-full w-full object-cover"
          />
        )}

        {/* Play/Pause Button */}
        <button
          onClick={() => handlePlayPause(track.source)}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isPlaying && track.source === currentTrack!.source ? (
            <BiPause size={60} />
          ) : (
            <BiPlay size={60} />
          )}
        </button>
      </div>

      {/* Audio */}

      {/* Info/Progress */}
      <div className="h-full w-[175px] flex-col">
        <div className="h-[62px]">
          <h2 className="p-0 pt-2 text-lg">{track.title}</h2>
          <h3 className="p-0 pt-0 pb-1">{artistName}</h3>
          {/* <h4 className="p-1 pt-0 pb-1 text-polp-black">{durationDisplay}</h4> */}
        </div>
        <div className="mr-4 mt-1 flex h-[120px] justify-end">
          <button className="mb-2 mr-4 flex h-[42px] w-[42px] place-content-center items-center rounded-lg border-2 border-solid border-polp-black bg-polp-grey p-2 text-sm">
            <Image alt="share track" src="/share.png" width={20} height={20} />
          </button>
          <button
            onClick={addToCollection}
            className="w-[42px]place-content-center flex h-[42px] items-center rounded-lg border-2 border-solid border-black bg-black p-2 text-sm"
          >
            <Image alt="collect track" src="/plus.png" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Track;

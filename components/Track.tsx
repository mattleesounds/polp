import React from "react";
import { AiOutlinePause } from "react-icons/ai";
import Image from "next/image";
import { IoMdShareAlt } from "react-icons/io";
import { BiPlay, BiPause } from "react-icons/bi";
import { TrackType } from "@/lib/types";
import { useRef, useState, useEffect, useContext } from "react";
import MediaContext from "./MediaContext";
import { Storage } from "aws-amplify";

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

  const duration = trackDurations[track.source] || 0;
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);
  const durationDisplay = `${durationMinutes}:${durationSeconds
    .toString()
    .padStart(2, "0")}`;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const metadataFolderPath = `public/media/${track.trackId}/metadata/`;
      const response = await Storage.list(metadataFolderPath);
      const files = response.results || []; // Access the results property to get the array of files
      console.log("Files:", files); // Log the value of files to the console
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
        }
      } else {
        console.error("Files is not an array:", files);
      }
    };
    fetchImage();
  }, [track.trackId]);
  // ... (existing code)

  return (
    <div className="m-3 flex h-32 w-[300px] rounded-lg bg-polp-white">
      {/* Art/Controls */}
      <div className="bg-slate-400 z-10 m-3 flex h-[100px] w-[100px] items-center justify-center align-middle">
        {/* Display the image using the Image component */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Track cover"
            className="h-full w-full object-cover"
          />
        )}
        <button onClick={() => handlePlayPause(track.source)}>
          {isPlaying && track.source === currentTrack ? (
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
          <h3 className="p-0 pt-0 pb-1">{track.artist}</h3>
          {/* <h4 className="p-1 pt-0 pb-1 text-polp-black">{durationDisplay}</h4> */}
        </div>
        <div className="mr-4 mt-1 flex h-[120px] justify-end">
          <button className="mb-2 mr-4 flex h-[42px] w-[42px] place-content-center items-center rounded-lg border-2 border-solid border-polp-black bg-polp-grey p-2 text-sm">
            <Image alt="share track" src="/share.png" width={20} height={20} />
          </button>
          <button className="w-[42px]place-content-center flex h-[42px] items-center rounded-lg border-2 border-solid border-black bg-black p-2 text-sm">
            <Image alt="collect track" src="/plus.png" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Track;

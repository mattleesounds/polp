import React from "react";
import { AiOutlinePause } from "react-icons/ai";
import Image from "next/image";
import { IoMdShareAlt } from "react-icons/io";
import { BiPlay, BiPause } from "react-icons/bi";
import { TrackType } from "@/lib/types";
import { useRef, useState, useEffect, useContext } from "react";
import MediaContext from "./MediaContext";

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

  return (
    <div className=" m-3 flex h-32 w-[300px] rounded-lg bg-polp-white">
      {/* Art/Controls */}
      <div className="m-3 flex h-[100px] w-[100px] items-center justify-center bg-slate-400 align-middle">
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
          <h2 className="p-0 pt-2 text-xl">{track.title}</h2>
          <h3 className="p-0 pt-0 pb-1 text-lg">{track.artist}</h3>
          <h4 className="p-0 pt-0 pb-1 text-polp-black">{durationDisplay}</h4>
        </div>
        <div className="mr-5 mt-1 flex h-[120px] justify-end">
          <button className="mb-2 mr-3 flex h-12 w-12 place-content-center items-center rounded-lg border-2 border-solid border-polp-black bg-polp-grey p-2 text-sm">
            <Image
              alt="collect track"
              src="/share.png"
              width={20}
              height={20}
            />
          </button>
          <button className="flex h-12 w-12 place-content-center items-center rounded-lg border-2 border-solid border-black bg-black p-2 text-sm">
            <Image alt="collect track" src="/plus.png" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Track;

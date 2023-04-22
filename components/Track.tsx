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
    audioRefs,
    durRefs,
  } = useContext(MediaContext);

  /* States */
  const [duration, setDuration] = useState(0);

  /* Ref */
  const audioRef = useRef<HTMLAudioElement>(null);

  /* Set audioRef in Map */
  useEffect(() => {
    if (audioRef.current) {
      audioRefs.current.set(track.source, audioRef.current);
      setDuration(audioRef.current.duration);
      durRefs.current.set(track.source, duration);
    }
  }, [audioRefs, track.source, durRefs, duration]);

  return (
    <div className="left-[6%] m-3 flex h-36 w-[88%] bg-white">
      {/* Art/Controls */}
      <div className="flex h-[69%] w-[30%] items-center justify-center bg-slate-400">
        <button onClick={() => handlePlayPause(track.source)}>
          {isPlaying && track.source === currentTrack ? (
            <BiPause size={60} />
          ) : (
            <BiPlay size={60} />
          )}
        </button>
      </div>

      {/* Audio */}
      <audio ref={audioRef} src={track.source} />

      {/* Info/Progress */}
      <div className="h-full w-[70%] flex-col">
        <div className="h-[60%]">
          <h2 className="p-2 text-xl">{track.title}</h2>
          <h3 className="p-2 pt-0 pb-1 text-lg">{track.artist}</h3>
          <h4 className="p-2 pt-0 pb-1 text-polp-orange">
            {Math.floor(duration / 60)}:{Math.floor(duration % 60)}
          </h4>
        </div>
        <div className="mr-6 mt-0 flex h-[40%] justify-end">
          <button className="ml-[25px] flex h-12 w-24 place-content-center items-center border-2 border-solid border-polp-orange bg-cream">
            <p className="m-1">Share</p>
            <IoMdShareAlt size={20} className="m-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Track;

import React, { use } from "react";
import { useState, useRef, useEffect, createRef } from "react";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { TrackType } from "@/lib/types";
import { BiPlay, BiPause, BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { useContext } from "react";
import MediaContext from "./MediaContext";

interface Props {}

interface AudioRef {
  current: HTMLAudioElement | null;
  currentTime: number;
}

interface KnobRef extends HTMLDivElement {
  current: HTMLDivElement | null;
  parentElement: HTMLElement | null;
}

/* interface Props {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTrack: string | null;
  audioRefs: React.MutableRefObject<Map<string, HTMLAudioElement>>;
  setCurrentTrack: React.Dispatch<React.SetStateAction<any>>;
  durRefs: React.MutableRefObject<Map<string, number>>;
  handlePlayPause: (trackSource: string) => void;
  tracks: TrackType[];
} */

const ControlBar = (): JSX.Element => {
  const {
    isPlaying,
    setIsPlaying,
    currentTrack,
    setCurrentTrack,
    handlePlayPause,
    tracks,
    audioRefs,
    durRefs,
  } = useContext(MediaContext);

  const [progress, setProgress] = useState(0);
  //const audioRef = useRef<HTMLAudioElement>(null);
  /* const knobRef = useRef<KnobRef>({ current: null, parentElement: null }); */
  const knobRef = createRef<KnobRef>();
  const audioRefsArray = Array.from(audioRefs.current);
  const track = tracks.find((track) => track.source === currentTrack);

  const [progressMinSec, setProgressMinSec] = useState("");
  const [durationMinSec, setDurationMinSec] = useState("");

  // Progress Bar Hook
  useEffect(() => {
    if (!currentTrack) return;

    const audio = audioRefs.current.get(currentTrack);
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentTrack, audioRefs, durRefs]);

  // Duration and Progress Hook
  useEffect(() => {
    if (!currentTrack) return;

    const audio = audioRefs.current.get(currentTrack);
    if (!audio) return;

    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);
    setDurationMinSec(
      `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`
    );

    const progressMinutes = Math.floor(audio.currentTime / 60);
    const progressSeconds = Math.floor(audio.currentTime % 60);
    setProgressMinSec(
      `${progressMinutes}:${progressSeconds.toString().padStart(2, "0")}`
    );
  }, [currentTrack, audioRefs, progress, durationMinSec, progressMinSec]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!currentTrack) return;

    const audio = audioRefs.current.get(currentTrack);
    if (!audio) return;

    const progressBar = event.currentTarget;
    const mouseX = event.clientX;
    const rect = progressBar.getBoundingClientRect();
    const progress = (mouseX - rect.left) / rect.width;

    // Ensure that the calculated time is a valid finite number
    const newTime = progress * audio.duration;
    if (Number.isFinite(newTime)) {
      audio.currentTime = newTime;
    }
  };

  const handlePrevious = (trackSource: string) => {
    const audio = audioRefs.current.get(trackSource);
    if (!audio) return;

    if (audio.currentTime > 1) {
      audio.currentTime = 0;
    } else {
      const currentIndex = audioRefsArray.findIndex(
        (ref) => ref[0] === trackSource
      );
      if (currentIndex === 0) return;

      const previousTrack = audioRefsArray[currentIndex - 1]?.[0];
      console.log("previous track: ", previousTrack);
      setCurrentTrack(previousTrack);
      audioRefs.current.forEach((audioElement) => {
        audioElement.pause();
      });
      handlePlayPause(previousTrack);
      audio.currentTime = 0;
    }
  };

  const handleNext = (trackSource: string) => {
    const audio = audioRefs.current.get(trackSource);
    if (!audio) return;
    const currentIndex = audioRefsArray.findIndex(
      (ref) => ref[0] === trackSource
    );
    if (currentIndex === 0) return;

    const nextTrack = audioRefsArray[currentIndex + 1]?.[0];
    console.log("next track: ", nextTrack);
    setCurrentTrack(nextTrack);
    audioRefs.current.forEach((audioElement) => {
      audioElement.pause();
    });
    handlePlayPause(nextTrack);
    audio.currentTime = 0;
  };

  if (!track) {
    return <></>;
  }

  return (
    <div className="fixed bottom-0 m-0 h-16 w-full bg-white p-0 leading-none">
      <div className="m-0 flex justify-center p-0">
        {/* Now Playing */}
        <div className="absolute left-1">
          <div className="flex flex-col">
            <h2 className="pl-2 text-lg">
              {currentTrack ? track!.artist : ""}
            </h2>
            <h3 className="pl-2">{currentTrack ? track!.title : ""}</h3>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-1/2 relative top-0 m-0 bg-white p-0">
          <button
            className="relative"
            onClick={() => handlePrevious(currentTrack!)}
          >
            <BiSkipPrevious size={50} />
          </button>

          <button
            onClick={() => handlePlayPause(currentTrack!)}
            className="relative top-0 focus:outline-none"
          >
            {isPlaying ? (
              <BiPause size={50} className="mt-[3px]" />
            ) : (
              <BiPlay size={50} className="mt-[3px]" />
            )}
          </button>

          <button
            className="relative top-0"
            onClick={() => handleNext(currentTrack!)}
          >
            <BiSkipNext size={50} />
          </button>
        </div>
        {/*  <div className="absolute max-w-1/2 m-0 p-0 bg-white top-0">
        </div> */}

        {/* progress */}
        <div className="absolute right-5 top-[15px]">
          {progressMinSec} / {durationMinSec}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute left-[5%] bottom-2 h-[6px] w-[90%] cursor-pointer bg-cream"
        onMouseDown={handleMouseDown}
      >
        <div
          className="h-full bg-black"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Knob */}
      {/* <div ref={knobRef} className="" onMouseDown={handleKnobMouseDown}></div> */}
    </div>
  );
};

export default ControlBar;

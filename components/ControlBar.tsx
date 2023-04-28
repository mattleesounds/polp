import React from "react";
import { useState, useEffect } from "react";
import { BiPlay, BiPause, BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { useContext } from "react";
import MediaContext from "./MediaContext";
import { Auth } from "aws-amplify";
import { getArtistNameBySubId } from "../utils";

interface Props {}

const ControlBar = (): JSX.Element => {
  const {
    isPlaying,
    setIsPlaying,
    currentTrack,
    setCurrentTrack,
    handlePlayPause,
    tracks,
    trackDurations,
    audioElement, // Get the audio element instance from the context
  } = useContext(MediaContext);

  const [progress, setProgress] = useState(0);

  const [progressMinSec, setProgressMinSec] = useState("");
  const [durationMinSec, setDurationMinSec] = useState("");
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    if (!audioElement || !currentTrack) return;

    const fetchArtistName = async () => {
      const artistSubId = currentTrack.artistSubId; // Get the artistSubId from currentTrack
      const name = await getArtistNameBySubId(artistSubId);
      setArtistName(name || "Unknown"); // Use "Unknown" as a fallback value
    };
    fetchArtistName();
  }, [currentTrack, audioElement]);

  // Progress Bar Hook
  useEffect(() => {
    if (!audioElement || !currentTrack) return;

    const updateProgress = () => {
      setProgress((audioElement.currentTime / audioElement.duration) * 100);
    };

    audioElement.addEventListener("timeupdate", updateProgress);

    return () => {
      audioElement.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentTrack, audioElement]);

  // Duration and Progress Hook
  useEffect(() => {
    if (!audioElement || !currentTrack) return;

    const duration = trackDurations[currentTrack.source] || 0;
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    setDurationMinSec(
      `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`
    );

    const progressMinutes = Math.floor(audioElement.currentTime / 60);
    const progressSeconds = Math.floor(audioElement.currentTime % 60);
    setProgressMinSec(
      `${progressMinutes}:${progressSeconds.toString().padStart(2, "0")}`
    );
  }, [currentTrack, audioElement, progress, trackDurations]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!audioElement || !currentTrack) return;

    const progressBar = event.currentTarget;
    const mouseX = event.clientX;
    const rect = progressBar.getBoundingClientRect();
    const progress = (mouseX - rect.left) / rect.width;

    // Ensure that the calculated time is a valid finite number
    const newTime = progress * audioElement.duration;
    if (Number.isFinite(newTime)) {
      audioElement.currentTime = newTime;
    }
  };

  const handlePrevious = () => {
    if (!audioElement || !currentTrack) return;

    if (audioElement.currentTime > 1) {
      audioElement.currentTime = 0;
    } else {
      const currentIndex = tracks.findIndex(
        (track) => track.source === currentTrack.source
      );
      if (currentIndex === 0) return;

      const previousTrack = tracks[currentIndex - 1];
      setCurrentTrack(previousTrack);
      audioElement.pause();
      handlePlayPause(previousTrack.source);
      audioElement.currentTime = 0;
    }
  };

  const handleNext = () => {
    if (!audioElement || !currentTrack) return;

    const currentIndex = tracks.findIndex(
      (track) => track.source === currentTrack.source
    );
    if (currentIndex === tracks.length - 1) return;

    const nextTrack = tracks[currentIndex + 1];
    setCurrentTrack(nextTrack);
    audioElement.pause();
    handlePlayPause(nextTrack.source);
    audioElement.currentTime = 0;
  };

  return (
    <div className="fixed bottom-0 m-0 h-16 w-full bg-white p-0 leading-none">
      <div className="m-0 flex justify-center p-0">
        {/* Now Playing /}
<div className="absolute left-1">
<div className="flex flex-col">
<h2 className="pl-2 text-lg">{artistName}</h2>
<h3 className="pl-2">{currentTrack ? currentTrack.title : ""}</h3>
</div>
</div>
{/ Controls */}
        <div className="max-w-1/2 relative top-0 m-0 bg-white p-0">
          <button className="relative" onClick={handlePrevious}>
            <BiSkipPrevious size={50} />
          </button>
          <button
            onClick={() => handlePlayPause(currentTrack!.source)}
            className="relative top-0 focus:outline-none"
          >
            {isPlaying ? (
              <BiPause size={50} className="mt-[3px]" />
            ) : (
              <BiPlay size={50} className="mt-[3px]" />
            )}
          </button>

          <button className="relative top-0" onClick={handleNext}>
            <BiSkipNext size={50} />
          </button>
        </div>

        {/* progress */}
        <div className="absolute right-5 top-[15px]">
          {progressMinSec} / {durationMinSec}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute left-[5%] bottom-2 h-[6px] w-[90%] cursor-pointer rounded-lg bg-polp-grey"
        onMouseDown={handleMouseDown}
      >
        <div
          className="h-full rounded-lg bg-black"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ControlBar;

import React from "react";
import { TrackType } from "@/lib/types";
import { useState, useRef } from "react";
import Feed from "./Feed";
import ControlBar from "./ControlBar";

const Media = (): JSX.Element => {
  /* Tracks */
  const tracks: TrackType[] = [
    {
      title: "Never Gonna Give You Up",
      artist: "Rick Astley",
      source: "rickroll.mp3",
    },
  ];

  /* States */
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(
    "rickroll.mp3"
  );

  /* Map of audioRefs */
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const durRefs = useRef<Map<string, number>>(new Map());

  /* Play/Pause Function */
  const handlePlayPause = (trackSource: string) => {
    console.log("handlePlayPause: ", trackSource);
    if (currentTrack === trackSource) {
      const audioElement = audioRefs.current.get(trackSource);
      if (audioElement) {
        if (audioElement.paused) {
          audioElement.play();
          setIsPlaying(true);
        } else {
          audioElement.pause();
          setIsPlaying(false);
        }
      }
    } else {
      audioRefs.current.forEach((audioElement) => {
        audioElement.pause();
      });
      const audioElement = audioRefs.current.get(trackSource);
      if (audioElement) {
        audioElement.play();
        setIsPlaying(true);
      }
      setCurrentTrack(trackSource);
    }
  };

  return (
    <div>
      <Feed />
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
      {/* <audio ref={audioRefs[]} src={track.source} /> */}
    </div>
  );
};

export default Media;

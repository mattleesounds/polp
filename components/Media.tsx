import React from "react";
import { TrackType } from "@/lib/types";
import { useState, useRef } from "react";
import Feed from "./Feed";
import ControlBar from "./ControlBar";

const Media = (): JSX.Element => {
  /* Tracks */
  const tracks: TrackType[] = [
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
  ];

  /* States */
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  /* Map of audioRefs */
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const durRefs = useRef<Map<string, number>>(new Map());

  /* Play/Pause Function */
  const handlePlayPause = (trackSource: string) => {
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

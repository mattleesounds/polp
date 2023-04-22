import React from "react";

interface TrackType {
  title: string;
  artist: string;
  source: string;
}

const MediaContext = React.createContext<{
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTrack: string | null;
  setCurrentTrack: (track: string | null) => void;
  handlePlayPause: (trackSource: string) => void;
  tracks: TrackType[];
  audioRefs: React.MutableRefObject<Map<string, HTMLAudioElement>>;
  durRefs: React.MutableRefObject<Map<string, number>>;
}>({
  isPlaying: false,
  setIsPlaying: () => {},
  currentTrack: null,
  setCurrentTrack: () => {},
  handlePlayPause: () => {},
  tracks: [],
  audioRefs: { current: new Map<string, HTMLAudioElement>() }, // Updated initial value
  durRefs: { current: new Map<string, number>() }, // Updated initial value
});

export default MediaContext;

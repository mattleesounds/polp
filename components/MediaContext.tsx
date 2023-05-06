import React from "react";
export interface TrackType {
  title: string; // The title of the track
  artistSubId: string; // The name of the artist
  source: string; // The source URL or path of the audio ile
  trackId: string; // The ID of the track
  color: string; // The color of the track
}

const MediaContext = React.createContext<{
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTrack: TrackType | null;
  setCurrentTrack: (track: TrackType | null) => void;
  handlePlayPause: (trackSource: string) => void;
  tracks: TrackType[];
  trackDurations: { [trackSource: string]: number };
  audioElement: HTMLAudioElement | null;
  /*   audioRefs: React.MutableRefObject<Map<string, HTMLAudioElement>>;
  durRefs: React.MutableRefObject<Map<string, number>>; */
}>({
  isPlaying: false,
  setIsPlaying: () => {},
  currentTrack: null,
  setCurrentTrack: () => {},
  handlePlayPause: () => {},
  tracks: [],
  trackDurations: {},
  audioElement: null,
  /* audioRefs: { current: new Map<string, HTMLAudioElement>() }, // Updated initial value
  durRefs: { current: new Map<string, number>() }, // Updated initial value */
});

export default MediaContext;

import React from "react";
import Track from "./Track";
import { TrackType } from "@/lib/types";
import MediaContext from "./MediaContext";
import { useContext } from "react";

const Feed = (): JSX.Element => {
  const { tracks } = useContext(MediaContext);

  console.log("tracks:", tracks);

  return (
    <div className="z-0 m-2 mb-2 flex h-full flex-col place-items-center bg-polp-grey pb-24">
      {tracks.map((track) => (
        <Track key={track.title} track={track} />
      ))}
    </div>
  );
};

export default Feed;

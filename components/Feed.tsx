import React from "react";
import Link from "next/link";

interface FeedProps {}

const Feed = (): JSX.Element => {
  return (
    <div className="z-0 m-2 mb-2 flex h-full flex-col place-items-center bg-cream pb-24">
      <a
        href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
        className="m-24 flex h-[75px] w-48 content-center items-center justify-center bg-slate-400 text-center text-2xl text-white hover:bg-slate-500"
      >
        signup for the waitlist
      </a>
      <a
        href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
        className="m-6 flex h-[75px] w-48 content-center items-center justify-center bg-slate-400 text-center text-2xl text-white hover:bg-slate-500"
      >
        apply for artist account
      </a>
    </div>
  );
};

export default Feed;

import React from "react";
import Link from "next/link";

interface FeedProps {}

const Feed = (): JSX.Element => {
  return (
    <div className="z-0 m-2 mb-2 flex h-full flex-col place-items-center bg-cream pb-24">
      <div className="h-48 text-center">
        <h1 className="m-2 text-3xl text-polp-orange">
          music streaming for <br />
          crate diggers
        </h1>
        <p className="m-2">
          <span className="text-polp-orange">POLP</span> is the music streaming
          service for crate diggers and the community management tool for
          artists. We are launching in beta soon, and are looking for artists
          and crate diggers to join our community. If you are a crate digger and
          would like to join, please sign up for the waitlist.
        </p>
      </div>
      <div className="m-4 flex flex-col items-center justify-center text-center">
        <a
          href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
          className="m-12 mb-12 flex h-[75px] w-48 content-center items-center justify-center border-2 border-polp-orange bg-[#FDFDFD] text-center text-2xl text-[#020202] hover:bg-slate-200"
        >
          signup for the waitlist
        </a>
        <p>
          If you are an artist and would like to join our community, please
          apply for an artist account.
        </p>
        <a
          href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
          className="m-6 mb-12 flex h-[75px] w-48 content-center items-center justify-center border-2 border-[#010101] bg-polp-orange text-center text-2xl text-white hover:bg-[#efac90]"
        >
          apply for artist account
        </a>
        <p>
          To learn more about <span className="text-polp-orange">POLP</span>, go
          here.
        </p>
        <Link
          href="/profile"
          className="m-6 flex h-[75px] w-48 content-center items-center justify-center border-2 border-[#ffffff] bg-[#403030] text-center text-2xl text-polp-orange hover:bg-black"
        >
          more info
        </Link>
      </div>
    </div>
  );
};

export default Feed;

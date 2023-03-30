import React from "react";
import Link from "next/link";

interface FeedProps {
  handleProfile: () => void;
}

//comment

const Feed = ({ handleProfile }: FeedProps): JSX.Element => {
  return (
    <div className=" z-0 m-0 mb-2 mt-0 flex h-full flex-col place-items-center bg-cream pb-24 leading-normal">
      <div className="h-48 text-center">
        <h1 className="m-8 mt-4 font-blogger text-5xl text-polp-orange">
          escape the algorithm
        </h1>
        <p className="max-w-48 m-2 lg:ml-48 lg:mr-48">
          <span className="font-inter text-polp-orange">POLP</span> is the music
          streaming service for crate diggers and the community management tool
          for artists. We are launching in beta soon, and are looking for
          artists and music fans to join our community. If you would like to
          join, please sign up for the waitlist.
        </p>
      </div>
      <div className="m-4 mt-16 flex flex-col items-center justify-center text-center  md:mt-0">
        <a
          href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
          className="m-12 mt-12 mb-12 flex h-[75px] w-48 content-center items-center justify-center rounded-lg border-2 border-polp-orange bg-[#FDFDFD] text-center text-2xl text-[#020202] hover:bg-slate-200 lg:mt-0"
        >
          signup for the waitlist
        </a>
        <p>
          If you are an artist and would like to join our community, please
          apply for an artist account.
        </p>
        <a
          href="https://bsb2oht0phj.typeform.com/to/QFNUiYOa"
          className="m-6 mb-12 flex h-[75px] w-48 content-center items-center justify-center rounded-lg border-2 border-[#010101] bg-polp-orange text-center text-2xl text-white hover:bg-[#efac90]"
        >
          apply for artist account
        </a>
        <p>
          To learn more about <span className="text-polp-orange">POLP</span>, go
          here.
        </p>
        <button
          onClick={handleProfile}
          className="m-6 flex h-[75px] w-48 content-center items-center justify-center rounded-lg border-2 border-[#ffffff] bg-[#403030] text-center text-2xl text-polp-orange hover:bg-black"
        >
          more info
        </button>
      </div>
    </div>
  );
};

export default Feed;

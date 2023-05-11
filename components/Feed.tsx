import React from "react";
import Link from "next/link";

interface FeedProps {
  handleProfile: () => void;
}

//comment

const Feed = ({ handleProfile }: FeedProps): JSX.Element => {
  return (
    <div className=" z-0 m-0 mb-0 mt-0 flex h-full flex-col place-items-center bg-polp-grey pb-24 leading-normal">
      <div className="h-24 text-center">
        <h1 className="m-8 mt-2 mb-8 font-blogger text-5xl ">join us</h1>
        <p className="max-w-48 m-2 mb-4 lg:ml-48 lg:mr-48">
          If you are a listener, sign up for the waitlist to get notified when
          we launch.
        </p>
      </div>
      <div className="m-4 mt-8 mb-0 flex flex-col items-center justify-center text-center">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScfZlyDLwCOQYIVWgBqh2HJEJYtDOKV6JiPsk4o1O8mvk-w_g/viewform"
          className="m-12 mt-12 mb-12 flex h-[75px]  content-center items-center justify-center rounded-lg border-2 border-polp-black bg-[#FDFDFD] p-4 text-center  text-[#020202] hover:bg-slate-200 lg:mt-0"
        >
          signup for the waitlist
        </a>
        <p>
          If you are an artist, please contact Matt Lee directly through Twitter
          or email.
        </p>
        <div
          /*         href="https://bsb2oht0phj.typeform.com/to/QFNUiYOa" */
          className="m-6 mb-0 flex h-[200px] w-[90%] max-w-[1240px] content-center items-center justify-center rounded-lg border-2 border-[#010101] bg-polp-black p-4 text-center text-lg text-white"
        >
          Twitter: @matt_p_lee <br />
          Email: matt@polp.app
        </div>
      </div>
    </div>
  );
};

export default Feed;

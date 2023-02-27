import React from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import ControlBar from "@/components/ControlBar";

const cmt = () => {
  return (
    <div className="z-0 m-2 mb-2 flex h-full flex-col place-items-center bg-cream pb-24 font-merriweather">
      <NavBar />
      <h1 className="m-2 mt-16 text-center text-3xl text-polp-orange">
        community management tool <br />
        coming soon!
      </h1>
      <p>
        For now, let<span>&#39;</span>s introduce the{" "}
        <span className="text-polp-orange">POLP</span> team...
      </p>
      <div className="h-12"></div>
      <div className="ali m-4 flex-col items-center">
        <div>
          <h1 className="m-2 text-center text-3xl">Matt Lee</h1>
          <Image
            src="/linkedinpfp.jpeg"
            alt="Matt Lee"
            width="150"
            height="150"
            layout="fixed"
            className="m-auto"
          ></Image>
          <p className="m-4 text-center lg:ml-48 lg:mr-48">
            Matt is a software developer and POLP co-founder. He has several
            years of experience as a sound engineer and a degree in Music
            Business. He is endlessly passionate about music technology and
            music-based communities.
          </p>
        </div>
        <div className="mt-12">
          <h1 className="m-2 text-center text-3xl">Theo Melder</h1>
          <Image
            src="/TheoPfp.jpeg"
            alt="Matt Lee"
            width="150"
            height="150"
            layout="fixed"
            className="m-auto"
          ></Image>
          <p className="m-4 text-center lg:ml-48 lg:mr-48">
            Theo is a fan of manga, music, and wearing jackets in warm weather.
          </p>
        </div>
      </div>
    </div>
  );
};

export default cmt;

import React from "react";
import Image from "next/image";

const cmt = () => {
  return (
    <div className="z-0 m-2 mb-2 flex h-full flex-col place-items-center bg-cream pb-24">
      <h1 className="m-2 text-center text-3xl text-polp-orange">
        community management tool <br />
        coming soon!
      </h1>
      <p>
        For now, let's introduce the{" "}
        <span className="text-polp-orange">POLP</span> team...
      </p>
      <div className="h-12"></div>
      <div className="ali m-4 flex-col items-center">
        <h1 className="m-2 text-center text-3xl">Matt Lee</h1>
        <Image
          src="/linkedinpfp.jpeg"
          alt="Matt Lee"
          width="150"
          height="150"
          layout="fixed"
        ></Image>
        <p className="m-2 text-center">
          Matt Lee is dope as fuck in every way. Just swaggin out crazy.
        </p>
      </div>
    </div>
  );
};

export default cmt;

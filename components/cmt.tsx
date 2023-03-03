import React from "react";
import Image from "next/image";

const Cmt = () => {
  return (
    <div className="m-0 mt-4 mb-0 flex h-full w-[100%] flex-col place-items-center bg-cream pb-0">
      <h1 className="m-2 mb-8 mt-4 text-center font-blogger text-5xl text-polp-orange">
        build community
      </h1>
      <p className="text-slate-500">
        For now, let<span>&#39;</span>s introduce the{" "}
        <span className="text-polp-orange">POLP</span> team...
      </p>
      <div className="h-4"></div>
      <div className="ali m-4  mt-0 flex-col items-center">
        <div>
          <h1 className="m-2 text-center text-3xl">Matt Lee</h1>
          <Image
            src="/linkedinpfp.jpeg"
            alt="Matt Lee"
            width="150"
            height="150"
            layout="fixed"
            className="m-auto rounded-lg"
          ></Image>
          <p className="max-w-48 m-4 text-center lg:ml-48 lg:mr-48">
            Matt is a software developer and POLP co-founder. He has several
            years of experience as a sound engineer and a degree in Music
            Business. He is endlessly passionate about music and community
            building technologies.
          </p>
        </div>
        <div className="mt-12 mb-0">
          <h1 className="m-2 text-center text-3xl">Theo Melder</h1>
          <Image
            src="/TheoPfp.jpeg"
            alt="Matt Lee"
            width="150"
            height="150"
            layout="fixed"
            className="m-auto rounded-lg"
          ></Image>
          <p className="m-4 mb-0 text-center lg:ml-48 lg:mr-48">
            Theo is a fan of manga, music, and wearing jackets in warm weather.
          </p>
        </div>
      </div>
      <div className="m-4 mt-0 mb-8 flex items-center justify-center  text-center">
        <a
          href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
          className="m-12 mt-4 mb-12 flex h-[75px] w-36 content-center items-center justify-center rounded-lg border-2 border-polp-orange bg-[#FDFDFD] p-2 text-center text-lg text-[#020202] hover:bg-slate-200"
        >
          signup for the waitlist
        </a>
        <a
          href="https://bsb2oht0phj.typeform.com/to/QFNUiYOa"
          className="m-12 mb-12 mt-4 flex h-[75px] w-36 content-center items-center justify-center rounded-lg border-2 border-[#010101] bg-polp-orange p-2 text-center text-lg text-white hover:bg-[#efac90]"
        >
          apply for artist account
        </a>
      </div>
    </div>
  );
};

export default Cmt;

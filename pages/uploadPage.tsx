import React from "react";
import Upload from "@/components/Upload";
import NavBar from "@/components/NavBar";
import PageTitle from "@/components/PageTitle";
import ControlBar from "@/components/ControlBar";

const uploadPage = () => {
  return (
    <div>
      <main className="h-screen bg-polp-grey">
        <NavBar />
        <div className="h-20 w-full"></div>
        <h1 className="mb-8 h-8 text-center text-4xl text-black">
          upload a track
        </h1>
        <Upload />
        {/* <ControlBar /> */}
      </main>
    </div>
  );
};

export default uploadPage;

import React from "react";
import Listeners from "@/components/Listeners";
import NavBar from "@/components/NavBar";

const listenersPage = () => {
  return (
    <div>
      <main className="h-screen bg-polp-grey">
        <NavBar />
        <div className="h-20 w-full"></div>
        <h1 className="mb-8 h-8 text-center text-4xl text-black">
          your listeners
        </h1>
        <Listeners />
      </main>
    </div>
  );
};

export default listenersPage;

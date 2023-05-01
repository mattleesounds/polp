import React from "react";
import Collection from "@/components/Collection";
import NavBar from "@/components/NavBar";

const collectionPage = () => {
  return (
    <div>
      <main className="h-screen bg-polp-grey">
        <NavBar />
        <div className="h-20 w-full"></div>
        <h1 className="mb-8 h-8 text-center text-4xl text-black">
          your collection
        </h1>
        <Collection />
      </main>
    </div>
  );
};

export default collectionPage;

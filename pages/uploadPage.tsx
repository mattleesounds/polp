import React from "react";
import Upload from "@/components/Upload";
import NavBar from "@/components/NavBar";
import PageTitle from "@/components/PageTitle";

const uploadPage = () => {
  return (
    <div>
      <main className="h-screen bg-cream">
        <h1>Upload a Track</h1>
        <NavBar />
        <PageTitle />
        <Upload />
      </main>
    </div>
  );
};

export default uploadPage;

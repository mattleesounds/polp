import NavBar from "@/components/NavBar";
import React from "react";
import Image from "next/image";
import UserInfo from "@/components/UserInfo";
import Profile from "@/components/Profile";

const profile = () => {
  return <Profile />;
};

export default profile;

{
  /* <div className="h-screen bg-cream">
      <NavBar />
      <div className="h-4 bg-cream"></div>
      <div className="flex">
        <div className="relative mt-20 ml-4 h-24 w-24 bg-slate-500">
          <Image src="/pfp.jpeg" alt="profile pic" fill />
        </div>
        <h1 className="mt-20 ml-4 text-3xl">Matt Lee</h1>
      </div>
      <div className="flex place-content-center">
        <div className="w-full flex-col">
          <UserInfo />
          <UserInfo />
          <UserInfo />
        </div>
      </div>
    </div>  */
}

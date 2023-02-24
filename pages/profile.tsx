import NavBar from "@/components/NavBar";
import React from "react";
import Image from "next/image";
import GeneralInfo from "@/components/GeneralInfo";
import UserInfo1 from "@/components/UserInfo1";
import UserInfo2 from "@/components/UserInfo2";
import UserInfo3 from "@/components/UserInfo3";

const profile = () => {
  return (
    <div className="h-full bg-cream">
      <NavBar />
      {/* <div className="h-4 bg-cream"></div> */}
      <div className="m-auto flex justify-center">
        <div className="m-0 w-[90%] max-w-[1240px]">
          <div className="flex">
            <div className="relative mt-20 ml-4 h-24 w-24 bg-slate-500 bg-transparent">
              <Image src="/1.png" alt="profile pic" fill />
            </div>
            <div>
              <h1 className="mt-20 ml-4 text-3xl">POLP</h1>
              <p className="m-2 ml-4">Proof Of Listenership Platform</p>
            </div>
          </div>
          <div className="w-full flex-col justify-center">
            <UserInfo1 />
            <UserInfo2 />
            <UserInfo3 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default profile;

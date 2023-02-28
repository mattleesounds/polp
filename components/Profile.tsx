import NavBar from "@/components/NavBar";
import React from "react";
import Image from "next/image";
import GeneralInfo from "@/components/GeneralInfo";
import UserInfo1 from "@/components/UserInfo1";
import UserInfo2 from "@/components/UserInfo2";
import UserInfo3 from "@/components/UserInfo3";
import ControlBar from "@/components/ControlBar";

const Profile = () => {
  return (
    <div className="flex h-full bg-cream ">
      {/* <div className="h-4 bg-cream"></div> */}
      <div className="max-w-48 m-auto flex justify-center pb-12">
        <div className="m-0 w-[90%] max-w-[1240px]">
          <div className="m-4 mb-0 flex justify-center">
            <h1 className="m-2 font-merriweather text-3xl text-polp-orange">
              profile
            </h1>
          </div>
          <div className="flex">
            <div className="relative  ml-4 h-24 w-24 bg-slate-500 bg-transparent">
              <Image src="/1.png" alt="profile pic" fill />
            </div>
            <div className="">
              <h1 className="mt-4 ml-4 text-3xl">POLP</h1>
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

export default Profile;

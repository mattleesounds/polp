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
    <div className="mb-0 h-full flex-col bg-cream">
      <div className="mb-0 flex">
        {/* <div className="h-4 bg-cream"></div> */}
        <div className="max-w-48 m-auto mb-0 mt-8 flex justify-center pb-12">
          <div className="m-0 w-[90%] max-w-[1240px]">
            <div className="m-4 mt-0 mb-0 flex justify-center">
              <h1 className="m-2 mt-0 font-blogger text-5xl text-polp-orange">
                explore the sonic frontier
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
      <div className="m-4 mt-0 flex items-center justify-center  text-center">
        <a
          href="https://bsb2oht0phj.typeform.com/to/E2joby1U"
          className="m-12 mt-0 mb-12 flex h-[75px] w-48 content-center items-center justify-center rounded-lg border-2 border-polp-orange bg-[#FDFDFD] p-2 text-center text-lg text-[#020202] hover:bg-slate-200"
        >
          signup for the waitlist
        </a>
        <a
          href="https://bsb2oht0phj.typeform.com/to/QFNUiYOa"
          className="m-12 mb-12 mt-0 flex h-[75px] w-48 content-center items-center justify-center rounded-lg border-2 border-[#010101] bg-polp-orange p-2 text-center text-lg text-white hover:bg-[#efac90]"
        >
          apply for artist account
        </a>
      </div>
    </div>
  );
};

export default Profile;

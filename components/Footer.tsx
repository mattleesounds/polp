import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";

const Footer = () => {
  return (
    <div className="mt-2 flex h-36 justify-center bg-polp-grey p-4">
      <div className="flex w-full max-w-[1240px] text-slate-700">
        <div className="">
          <p>
            <span>&copy;</span> 2023 POLP
          </p>
        </div>
        {/* <div className="min-w-[20%]"></div> */}
        <div className="flex w-full justify-end">
          <div className="flex-col lg:mr-8">
            <div className="flex">
              <a
                href="https://twitter.com/POLP_app"
                className="pr-2 pl-2 hover:cursor-pointer"
              >
                <BsTwitter size={20} />
              </a>
              <a className="pl-2 hover:cursor-pointer">
                <SiDiscord size={20} />
              </a>
            </div>
            <a
              className="mt-4 hover:cursor-pointer hover:text-polp-orange"
              href="https://zippy-frangollo-058533.netlify.app/"
            >
              whitepaper
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

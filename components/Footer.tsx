import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="h-36 justify-center bg-cream p-2">
      <div className="grid w-full max-w-[1240px] grid-cols-12 justify-center text-slate-700">
        <div className="col-span-3 col-start-2">
          <span>&copy;</span> 2023 POLP <span>&#183;</span>{" "}
          <Link className="hover:text-polp-orange" href="">
            whitepaper
          </Link>
        </div>
        {/* <div className="w-[60%]"></div> */}
        <div className="right-0 col-start-12 items-end">
          <BsTwitter />
        </div>
      </div>
    </div>
  );
};

export default Footer;

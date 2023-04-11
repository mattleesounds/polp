import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import Upload from "./Upload";

const NavBar = () => {
  return (
    <div className="fixed top-0 z-10 h-16 max-h-16 w-full bg-white">
      <div className="m-auto flex h-full max-w-[1240px] items-center justify-between">
        {/* logo */}
        <div className="relative m-2 h-[32px] w-[90px]">
          <Link href="/" className="m-0">
            <Image src="/logo.png" alt="POLP Logo" fill />
          </Link>
        </div>

        {/* search bar */}
        <div className="w-half absolute top-1/2 left-1/2 z-20 h-full -translate-x-1/2 -translate-y-1/2 transform items-center">
          <input
            className="w-full translate-y-5 bg-cream"
            placeholder="search..."
          />
        </div>

        <Upload />

        {/* Menu */}
        <div className="m-0 grid h-full w-[90px] grid-cols-2">
          <button className="m-2">
            <AiOutlineMenu size={20} />
          </button>
          <Link href="/profile" className="mt-4">
            <MdAccountCircle size={30} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

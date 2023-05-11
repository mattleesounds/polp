import React from "react";
import Image from "next/image";
//import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import { Link, LinkProps } from "react-scroll";

interface props {
  handleFeed: () => void;
  handleProfile: () => void;
  handleCmt: () => void;
}

const NavBar = ({ handleProfile, handleFeed, handleCmt }: props) => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="fixed top-0 z-10 h-16 w-full bg-white font-inter">
      <div className="m-auto flex h-full max-w-[1240px] items-center justify-between">
        {/* logo */}
        <div className="relative m-2 h-[32px] w-[90px]">
          <div className="m-0">
            <button onClick={handleFeed}>
              <Image src="/logo.png" alt="POLP Logo" fill />
            </button>
          </div>
        </div>

        {/* search bar */}
        <div className="relative z-10 m-12 p-2">
          <input
            className="m-12 w-[80%] bg-polp-grey p-2"
            placeholder="App coming soon...!"
          />
        </div>

        {/* Menu */}
        <div className="m-0 flex h-full w-[120px] border border-black ">
          <button className="m-2 mr-4" onClick={toggleMenu}>
            <AiOutlineMenu size={20} />
          </button>
          {isOpen && (
            <div className="fixed top-12 right-0 z-50 bg-[#fdfdfd] p-2 text-xl shadow-lg md:w-[235px]">
              <ul>
                <button onClick={handleProfile} className="w-full">
                  <li className="p-2 hover:bg-polp-grey">feed</li>
                </button>
                <button onClick={handleProfile} className="w-full">
                  <li className="p-2 hover:bg-polp-grey">profile</li>
                </button>
              </ul>
            </div>
          )}
          <button onClick={handleProfile}>
            <MdAccountCircle size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

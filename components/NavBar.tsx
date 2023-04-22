import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import { Auth } from "aws-amplify";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await Auth.signOut({ global: true });
      console.log("Sign out successful.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

        {/* Menu */}
        <div className="m-0 flex h-full w-[90px] ">
          <button
            className="m-2 mr-4 hover:cursor-pointer"
            onClick={toggleMenu}
          >
            <AiOutlineMenu size={20} />
          </button>
          {isOpen && (
            <div className="fixed top-12 right-0 z-50 bg-[#fdfdfd] p-2 text-xl shadow-lg md:w-[235px]">
              <ul>
                <Link href={"/"} className="w-full">
                  <li className="p-2 hover:bg-cream">feed</li>
                </Link>
                <Link href="/profile" className="w-full">
                  <li className="p-2 hover:bg-cream">profile</li>
                </Link>
                <Link href="/">
                  <li className="p-2 hover:bg-cream">community</li>
                </Link>
                <Link href="/uploadPage">
                  <li className="p-2 hover:bg-cream">upload music</li>
                </Link>
                <button onClick={handleSignOut}>
                  <li className="p-2 hover:bg-cream">sign out</li>
                </button>
              </ul>
            </div>
          )}
          <Link href="/profile" className="mt-4">
            <MdAccountCircle size={30} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

import React from "react";
import { TrackType } from "@/lib/types";
import { useState, useRef } from "react";
import Feed from "./Feed";
import ControlBar from "./ControlBar";
import Profile from "./Profile";
import Cmtool from "./Cmtool";
import { Link, LinkProps, scroller, Element } from "react-scroll";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import Footer from "./Footer";

const Media = (): JSX.Element => {
  /* Tracks */
  const tracks: TrackType[] = [
    {
      title: "Never Gonna Give You Up",
      artist: "Rick Astley",
      source: "rickroll.mp3",
    },
  ];

  /* States */
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(
    "rickroll.mp3"
  );

  /* Map of audioRefs */
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const durRefs = useRef<Map<string, number>>(new Map());
  const audioRef = useRef<HTMLAudioElement>(null);

  /* Play/Pause Function */
  const handlePlayPause = (trackSource: string) => {
    console.log("handlePlayPause: ", trackSource);
    if (currentTrack === trackSource) {
      const audioElement = audioRefs.current.get(trackSource);
      if (audioElement) {
        if (audioElement.paused) {
          audioElement.play();
          setIsPlaying(true);
        } else {
          audioElement.pause();
          setIsPlaying(false);
        }
      }
    } else {
      audioRefs.current.forEach((audioElement) => {
        audioElement.pause();
      });
      const audioElement = audioRefs.current.get(trackSource);
      if (audioElement) {
        audioElement.play();
        setIsPlaying(true);
      }
      setCurrentTrack(trackSource);
    }
  };

  const handleProfile = () => {
    scroller.scrollTo("profile", {
      smooth: true,
      offset: -60,
    });
  };

  const handleFeed = () => {
    scroller.scrollTo("feed", {
      smooth: true,
      offset: -60,
    });
  };

  const handleCmt = () => {
    scroller.scrollTo("cmt", {
      smooth: true,
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      {/* NavBar */}
      <div className="fixed top-0 z-10 m-0 h-16 w-full bg-white p-0">
        <div className="m-auto flex h-full max-w-[1240px] items-center justify-between">
          {/* logo */}
          <div className="relative m-2 h-[32px] w-[90px] hover:cursor-pointer">
            <Link to="feed" className="w-full " offset={-60} smooth="true">
              <Image src="/logo.png" alt="POLP Logo" fill />
            </Link>
          </div>

          {/* search bar */}
          <div className="absolute top-1/2 left-1/2 z-20 h-full w-[40%] -translate-x-1/2 -translate-y-1/2 transform items-center md:w-[50%]">
            <input
              className="w-full translate-y-5 bg-polp-grey p-1"
              placeholder="App coming soon...!"
            />
          </div>

          {/* Menu */}
          <div className="m-0 flex h-full w-[110px] ">
            <button className="m-2 mr-4" onClick={toggleMenu}>
              <AiOutlineMenu size={20} />
            </button>
            {isOpen && (
              <div className="fixed top-12 right-0 z-50 bg-[#fdfdfd] p-2 text-xl shadow-lg md:w-[235px]">
                <ul>
                  <Link to="feed" className="w-full" offset={-60} smooth="true">
                    <button onClick={toggleMenu} className="w-full text-left">
                      <li className="p-2 hover:bg-polp-grey">feed</li>
                    </button>
                  </Link>
                  <Link
                    to="profile"
                    className="w-full "
                    offset={-60}
                    smooth="true"
                  >
                    <button onClick={toggleMenu} className="w-full text-left">
                      <li className="p-2 hover:bg-polp-grey">profile</li>
                    </button>
                  </Link>
                  <a href="https://zippy-frangollo-058533.netlify.app/">
                    <button onClick={toggleMenu} className="w-full text-left">
                      <li className="p-2 hover:bg-polp-grey">whitepaper</li>
                    </button>
                  </a>
                </ul>
              </div>
            )}
            <Link
              to="profile"
              offset={-60}
              smooth="true"
              className="mt-4 hover:cursor-pointer"
            >
              <MdAccountCircle size={30} />
            </Link>
          </div>
        </div>
      </div>

      <Element name="profile">
        <Profile />
      </Element>
      <Element name="feed">
        <div className="h-0"></div>
      </Element>
      <Feed handleProfile={handleProfile} />
      <div className="h-2 bg-[#FDFDFD]"></div>
      <Footer />
      <ControlBar
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTrack={currentTrack}
        audioRefs={audioRefs}
        setCurrentTrack={setCurrentTrack}
        durRefs={durRefs}
        handlePlayPause={handlePlayPause}
        tracks={tracks}
      />
      {/* <audio ref={audioRefs[]} src={track.source} /> */}
    </div>
  );
};

export default Media;

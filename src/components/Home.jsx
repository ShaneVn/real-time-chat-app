import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";
import ServerIcon from "./ServerIcon";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import Channel from "./Channel";

function Home() {
  const [user] = useAuthState(auth);

  return (
    <>
      {!user && <Navigate replace to="/" />}
      <div className="flex h-screen">
        <div
          className="flex flex-col bg-discord_serverContainer space-y-3
        p-3 min-w-max"
        >
          <div className="server-default hover:bg-discord_purple">
            <img src="../topicon.png" alt="" className="h-5" />
          </div>
          <hr className="border-gray-700 border w-8 mx-auto" />
          <ServerIcon image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3YraeeRnBhf1Sd-QQndtiCYLL5RTFWDhvjcooa9c8NqWeU6D0vP3x-3l1bfX5vskcToE&usqp=CAU" />
          <ServerIcon image="https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png" />
          <ServerIcon image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3YraeeRnBhf1Sd-QQndtiCYLL5RTFWDhvjcooa9c8NqWeU6D0vP3x-3l1bfX5vskcToE&usqp=CAU" />
          <ServerIcon image="https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png" />
          <div className="server-default hover:bg-discord_green group">
            <PlusIcon className="text-discord_green h-7 group-hover:text-white" />
          </div>
        </div>

        <div className="bg-discord_channelsBg flex flex-col min-w-max">
          <h2
            className="text-white font-bold text-sm flex items-center justify-between
          border-b border-gray-800 p-4 cursor-pointer
          hover:bg-discord_serverNameHoverBg"
          >
            Official Server
            <ChevronDownIcon className="h-5 ml-2" />
          </h2>

          <div className="text-discord_channel flex-grow first-letter:overflow-y-scroll scrollbar-hide">
            <div className="flex items-center p-2 mb-2">
              <ChevronDownIcon className="h-3 mr-2" />
              <h4 className="font-semibold">channels</h4>
              <PlusIcon className="h-6 ml-auto cursor-pointer hover:text-white" />
              
            </div>
            
            <div className="flex flex-col space-y-2 px-2 mb-4">
              <Channel className="mb-14" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

'use client';
import React from "react";
import Navbar from "@/app/components/Navbar";
import ChannelChat from "./channels.client";

export default function Channels() {
  
    return (
        <div className="flex flex-col text-slate-100 min-h-screen w-full">
                <div className="h-16 mb-7 w-full Large:h-24 truncate"><Navbar pageName="Channel Chat" /></div>
                <div className=" h-screen"><ChannelChat/></div>
        </div>
      )
    }
    
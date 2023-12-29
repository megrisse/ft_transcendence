'use client'
import React from "react";
import Navbar from "../components/Navbar";
import UserSettings from "./userSettings";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { PropagateLoader } from "react-spinners";

export default function SettingsForUser() {
  

  const loading: boolean = useSelector((state: RootState) => state.setuser.loading);
  const error: string | null = useSelector((state: RootState) => state.setuser.error);

  if (loading || error){
   return (
     <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
       <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
         <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
         <div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={loading} size={20} aria-label="Loading Spinner"/></div>
       </div>
     </div>
   )
 }
    return (
        <div className="flex flex-col text-slate-100 min-h-screen w-full">
                <div className="h-16 mb-7 w-full Large:h-24 truncate"><Navbar pageName="USER SETTINGS" /></div>
                <div className=" h-screen"><UserSettings/></div>
        </div>
      )
    }

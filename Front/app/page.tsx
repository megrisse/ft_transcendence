import React from "react";
import RootLayout from "./layout"; 
import Navbar from "./components/Navbar";

export default function Home() {

  return (
    
    <div className="flex flex-col text-slate-100 min-h-screen w-full">
            <div className=""><Navbar pageName="Home"/></div>
            <div className="border h-[87%] m-2 ">
              <p>HOME</p>
            </div>
          </div>
  )
}
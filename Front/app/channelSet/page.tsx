'use client'

import React from 'react';
import ChanSetting from "../components/channelsComponents/chanSetting";
import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { PropagateLoader } from 'react-spinners';


export default function Page() {

      const fetloading: boolean = useSelector((state: RootState) => state.channel.fetchloading);
      const feterror: string | null = useSelector((state: RootState) => state.channel.fetcherror);

      if (fetloading || feterror){
       return (
         <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
           <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
             <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
             <div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={fetloading} size={20} aria-label="Loading Spinner"/></div>
           </div>
         </div>
       )
     }


  return (
       <div className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen object-cover">
             <div className="h-16 w-full Large:h-24"><Navbar pageName="channel Settings" /></div>
                 <div className='h-[80%] min-h-[600px] medium:min-h-[700px] m-auto w-[410px] medium:w-[80%] mt-11  flex  items-center'>     
                    <ChanSetting />
                 </div>
             </div>
  );

}
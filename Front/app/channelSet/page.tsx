import React from 'react';
import ChanSetting from "../components/channelsComponents/chanSetting";
import Navbar from "../components/Navbar";


export default function page() {
 return (
//  <div className='h-screen w-full'>

//      <ChanSetting />
//  </div>
<div className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen object-cover">
      <div className="h-16 w-full Large:h-24"><Navbar pageName="channel Settings" /></div>
            <div className='h-[80%] min-h-[600px] medium:min-h-[700px] m-auto w-[410px] medium:w-[80%] mt-11  flex  items-center'>     
               <ChanSetting />
            </div>
            </div>
 );
}

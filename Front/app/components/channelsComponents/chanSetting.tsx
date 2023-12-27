//chanSettings.tsx
'use client';
import React, {useState } from 'react';
import { useSelector } from 'react-redux';
import ChannelCreate from './ChannelCreate';
import ChannelSelect from './channelList';
import DisplayUsersChannel from './displayUsersChannel';
import { RootState } from '../../store/store';
import { Channel } from '@/app/Slices/channelSlice';
import passwordParams from './channelpassword';
import PasswordParams from './channelpassword';


function ChanSetting() {
  const channelss = useSelector((state: RootState) => state.channel.channels);
   const loading = useSelector((state: RootState) => state.channel.loading);
   console.log("99999llaaaawiiiiiii ",channelss);

//  return (
//  <div className="w-full h-[70%] flex max-[640px]:flex-col max-[640px]:h-screen flex-row items-center justify-around justify-items-center pr-10 pl-10 max-[640px]:pl-2 ">
//   <div className="w-[50%] max-[640px]:w-[80%] max-[640px]:h-[30%] h-[50%] bg-[#30313E] mr-5 rounded-lg">
//     <ChannelCreate channel={channelss} />
//   </div>
//   <div className='w-[90%] max-[640px]:w-screen h-[70%] max-[640px]:h-[60%] mx-px flex items-center  m-2 flex-col'>
//     <div className="m-2 h-[10%] flex flex-row  items-center">
//       <div>
//           <h1>Select channel :</h1>
//       </div>
//       <ChannelSelect loading={loading} channel={channelss} />
//     </div>
//       <div className = "w-full h-full">
//           <DisplayUsersChannel/>
//       </div>
//       <div className='w-full h-[15%]  max-[640px]:h-full'>
//           <PasswordParams/>
//       </div>

//   </div>
//  </div>
//  );


return (
  <div className=" w-full flex flex-col justify-between items-center h-full  min-w-screen md:flex-row object-cover">
  <div className="w-full md:w-1/3 h-1/3 bg-[#30313E] mr-5 rounded-lg p-2 m-2">
    <ChannelCreate channel={channelss} />
  </div>
  <div className='w-full flex md:w-full h-[800px]  md:h-[700px] mx-px   p-1 flex-col border border-[#E58E27] '>
    <div className="m-2 flex flex-row items-center">
      <div>
        <h1 className="text-lg md:text-xl truncate">Select channel :</h1>
      </div>
      <ChannelSelect loading={loading} channel={channelss} />
    </div>
    <div className = "w-full p-4">
      <DisplayUsersChannel/>
    </div>
    <div className='w-full p-4'>
      <PasswordParams/>
    </div>
  </div>
  </div>
 );
 
}
export default ChanSetting;

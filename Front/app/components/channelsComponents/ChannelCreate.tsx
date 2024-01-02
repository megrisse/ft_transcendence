'use client';

import { Channel, createChannel } from '@/app/Slices/channelSlice';
import React, { useState } from 'react';
import { useAppDispatch } from './channelData';

type shn ={
 channel : Channel[];
};

export default function ChannelCreate(props:shn) {
 const dispatch = useAppDispatch();
 

 const [isProtected, setProtected] = useState<boolean>(false);
 const [isPrivate, setPrivat] = useState<boolean>(false);

 const handleSubmit = (event:any) => {
 const channelNameInput = document.getElementById('channelName')as HTMLInputElement;
 const passwordInput = document.getElementById('channelPassword') as HTMLInputElement;
const channelName = channelNameInput?.value!;
const password = passwordInput?.value!;
const isFormValid =  !(channelName === '' || (isProtected && password === ''))
 event.preventDefault();
 isFormValid && dispatch(
   createChannel({
     name: channelName,
     password: password,
     isPrivate: isPrivate,
     isProtected: isProtected,
   })
 );
 };

 return (
 <div className="  grid  h-full w-[90%] m-5 p-5 rounded-lg">
   <p className="text-i text-[#E58E27]">Create new channel</p>

   <input
     type="text"
     id='channelName'
     className="w-[70%] h-[40%] border border-[#E58E27] bg-[#30313E] border-spacing-10"
     placeholder="channel name"
     required
   />
   {isProtected && (
     <input
       type="text"
       id='channelPassword'
       className="w-[70%] h-[40%] border m2 border-[#E58E27] bg-[#30313E]"
       placeholder="password"
       required
     />
   )}

   <div className="flex flex-row items-center">
     <label htmlFor="isPrivate">Private</label>
     <input
       type="checkbox"
       id="isPrivate"
       name='isPrivate'
       checked={isPrivate}
       onChange={() => setPrivat(curr => !curr)}
     />
   </div>
   <div className="flex flex-row items-center">
     <label htmlFor="isProtected">Protected</label>
     <input
       type="checkbox"
       id="isProtected"
       name='isProtected'
       checked={isProtected}
       onChange={() => setProtected(curr => !curr)}
     />
   </div>

   <button
     className="bg-[#E58E27] w-[60%] h-[30px] rounded-lg"
     onClick={handleSubmit}
   >
     submit
   </button>
 </div>
 );
}
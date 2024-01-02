'use client'
import { RootState } from '@/app/store/store';
import React from 'react'
import { useSelector } from 'react-redux';
import { useAppDispatch } from './channelData';
import { addPasswordToChannel, removePasswordFromChannel } from '@/app/Slices/channelSlice';

export default function  PasswordParams() {
  
  const dispatch =useAppDispatch();
  const channelName = useSelector((state: RootState) => state.channel.selectedChannel.channelName);
  
  const handleAdd = (e:any) => {
    const passswordInput = document.getElementById('password') as HTMLInputElement;
    const password = passswordInput?.value!;

    const input = (password !== '')
    {channelName && input && dispatch(addPasswordToChannel({channelName,password}));}
  }
  const handleRemove = (e:any) => {
    dispatch(removePasswordFromChannel({channelName}));
  }
  return (
   <div className='w-full  h-[90%]  flex flex-row bg-[#323232] items-center rounded-lg '>
     <div className=' w-full  h-full flex flex-row gap-4 p-4 items-center justify-around'>
       <div className="w-full h-full flex  items-center justify-around">
         <p className='w-full h-full  truncate text-[#E58E27]'>Change Password</p>
         <input type="text" className="w-full bg-[#30313E]"
              id = "password"
              placeholder='Password'
              required
         />
       </div>
       <div className="flex justify-end">
         <button className="bg-[#E58E27] text-white px-4 py-2 mr-2"
          onClick = {handleAdd}
         >
          Add
         </button>
         <button className="bg-[#E58E27] text-white px-4 py-2"
         onClick ={handleRemove}
         >
          Remove
          </button>
       </div>
     </div>

   </div>
  )
 }
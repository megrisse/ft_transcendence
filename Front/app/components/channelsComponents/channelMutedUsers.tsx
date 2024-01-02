'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import Modal from './channelSetModal';
import ErrorModal from './errorModal';



type ChannelMutedUsersProps = {
  channelName : string;
 mutedUsers: string[];
 };


 type channelParams = {
  username : string;
  channelName : string;
};
const ChannelMutedUsers: React.FC= () => {
   const channelName = useSelector((state: RootState) => state.channel.selectedChannel.channelName);
  const mutedUsers = useSelector((state: RootState) => state.channel.selectedChannel.mutedUsers);

  const error = useSelector((state: RootState) => state.channel.error);
  const dispatch = useDispatch<AppDispatch>();
  if (error) {
   return  <ErrorModal message={error} dispatch={dispatch} />;}
  
  return (

    <div className = "w-full h-full flex flex-col items-center bg-[#323232]">
    <div className=" w-full h-[5%] flex  flex-row items-center justify-between  truncate "> 
          <p className = "text-[#E58E27] truncate">Muted Users</p>
          <Modal content='+' channelName={channelName} title='mute'/>
      </div>
  
          <div className = "w-full h-[5%] flex flex-row items-center justify-between ">    
            <div className = "w-full h-full flex items-center flex-col  ">
            {mutedUsers?.map((user, index) => {
                return (
                  <div key={index} className ='w-full h-full flex items-center justify-between flex-row  '>
                  <li >{user}</li>
                  </div>
                  )
              })}
            </div>
              
          </div>
          </div>
    
  )
}

export default ChannelMutedUsers;
import { unBanUserFromChannel } from '@/app/Slices/channelSlice';
import { AppDispatch, RootState } from '@/app/store/store';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Modal from './channelSetModal';
import ErrorModal from './errorModal';

type ChannelUserbannedProps = {
  channelName : string;
  bandUsers: string[];
 };

 type channelParams = {
  username : string;
  channelName : string;
};

const ChannelUserbanned: React.FC = () => {
  const channelName = useSelector((state: RootState) => state.channel.selectedChannel.channelName);
  const bandUsers = useSelector((state: RootState) => state.channel.selectedChannel.bandUsers);
  const error = useSelector((state: RootState) => state.channel.error);
  const dispatch = useDispatch<AppDispatch>()
  function handleClick(_username: string, _channelName : string) {
    dispatch(unBanUserFromChannel({ username: _username, channelName }));
    const bodyData : channelParams= {
      username : _username,
      channelName : _channelName
    };
  }

  if (error) {
   return  <ErrorModal message={error} dispatch={dispatch} />;}
 
  return (
    <div className = "w-full h-full flex flex-col items-center bg-[#323232]">
    <div className=" w-full h-[5%] flex   flex-row items-center justify-between  truncate "> 
          <p className = "text-[#E58E27] truncate  ">Banned Users</p>
           <Modal content='+' channelName={channelName} title='ban'/>
      </div>
  
          <div className = "w-full h-[5%] flex flex-row items-center justify-between ">
            <div className = "w-full h-full flex items-center flex-col ">
            {bandUsers && bandUsers?.map((user, index) => {
                return (
                  <div key={index} className ='w-full h-full flex items-center justify-between flex-row  '>
                  <li >{user}</li>
                <button className="text-red-600" onClick={() => {handleClick(user, channelName)}}>X</button>
                  </div>
                  )
              })}
            </div>
              
          </div>
  </div>
  )
}

export default ChannelUserbanned;
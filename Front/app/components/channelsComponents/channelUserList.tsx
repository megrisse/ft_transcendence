'use client';
import React ,{useState}from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState ,AppDispatch} from '../../store/store';
import { addUserFromChannel, removeUserFromChannel } from '@/app/Slices/channelSlice';
import Modal from './channelSetModal';
import ErrorModal from './errorModal';



 type channelParams = {
  username : string;
  channelName : string;
};

const ChannelUserList: React.FC= () => {
  const channelName = useSelector((state: RootState) => state.channel.selectedChannel.channelName);
  const users = useSelector((state: RootState) => state.channel.selectedChannel.users);
  const dispatch = useDispatch<AppDispatch>();
  
  
  function handleClick(_username: string, _channelName : string) {
    dispatch(removeUserFromChannel({ username: _username, channelName }));
    
    const bodyData : channelParams= {
      username : _username,
      channelName : _channelName
    };
  }
  
  const error = useSelector((state: RootState) => state.channel.error);
  if (error) {
   return  <ErrorModal message={error} dispatch={dispatch} />;}
  
 return (
   <div className = "w-full h-full flex flex-col items-center bg-[#323232]">
  <div className=" w-full h-[5%] flex  flex-row items-center justify-between  truncate "> 
        <p className = "text-[#E58E27] truncate">Users List</p>
        <Modal content='+' channelName={channelName} title='add'/>
    </div>

        <div className = "w-full h-[5%] flex flex-row items-center justify-between ">    
          <div className = "w-full h-full flex items-center flex-col  ">
          {users && users?.map((user, index) => {
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
 );
};

export default ChannelUserList;
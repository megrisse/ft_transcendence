'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../Contexts/socket';
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { addMessageToChannel, fetchChannelData, leaveChannel, updateChannelMessages } from '../Slices/channelMessagesSlice';
import Link from 'next/link';
import ChannelSearch from '../components/channelSearch';

type channelNames = {
  channels: channelConversation[],
  username : string
 };

type channelConversation = {
  channelName : string,
  messages : channelMessages[]
};

 type channelMessages = {
  userId : string,
  sender : string,
  content : string,
  channelName : string
 }

function ChannelChat() {
  const socket = useContext(WebsocketContext);
  const [channelToRender, setChannelData] = useState<channelConversation>({ channelName: "", messages: [] });
  const [ChoosenChannel, SetChoosenChannel] = useState<string>();
  const [inputValue, setInputValue] = useState('');
  const [redirecting, setRedirection] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  let channelData: channelNames = useSelector((state: RootState) => state.channelMessages.entity);
 

  const handleChannelMessage = useCallback((res : channelMessages) => {
    console.log(res);
    dispatch(addMessageToChannel(res));
    setChannelData((prevChannelData) => {
      return { ...prevChannelData, messages: [...prevChannelData.messages, res] };
    });
  }, [dispatch]);
  

  useEffect(() => {
		// no-op if the socket is already connected
		socket.connect();

		return () => {
		  socket.disconnect();
		};
	  }, []);
    
  useEffect (() => {
      if (!socket.hasListeners("channelMessage")) {
        socket.on("channelMessage", handleChannelMessage);
        console.log("current data : ", channelData);
      }
  }, [socket]); 
  useEffect(() => {
    dispatch(fetchChannelData());
  }, [dispatch]);
 
  useEffect(() => {
    const channelToRender = channelData.channels.find(channel => channel.channelName === ChoosenChannel) || { channelName: "", messages: [] };
    setChannelData(channelToRender);
    console.log("channel to render : ",channelToRender);
  }, [channelData, ChoosenChannel]);
  

  async function handlLeave() {
    dispatch(leaveChannel(ChoosenChannel as string));
    SetChoosenChannel("");
   }   

  async function handleClick(name: string) {
    let response = await fetch(`http://localhost:4000/Chat/channel`, {
      method: 'POST', 
      mode: 'cors',
      credentials : 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"_channel" : name})
    })
    const data : channelConversation = await response.json() as channelConversation;
    console.log("data : ", data);
    dispatch(updateChannelMessages({ channelName: name, messages: data}));
    SetChoosenChannel(name);
  }
  if (redirecting)
    return (
      <div className='w-full h-full flex justify-center items-center text-orange-500'>
        <h1  >Redirecting to Profile ... Please Wait ...</h1>
      </div>
  )
 return (
    <div className="relative h-[80%] w-full flex flex-row md:flex-col items-center justify-around p-5">
      <div className=' w-[30%] h-full flex flex-col items-center rounded-lg border border-[#E58E27]'>
        <div className='flex flex-row'>
          <h3 className='p-4 flex-start'>conversations</h3>
          <ChannelSearch />
        </div>
           <div className='w-full h-full text-white flex flex-col items-center overflow-y-auto scrollbar-hide'>
              {channelData && channelData.channels.map((channel, index) => {
               return (
               <div className='w-full text-center bg-[#E58E27] bg-opacity-50 p-2 rounded-lg m-2 border border-[#E58E27]' key={index} style={{cursor: 'pointer'}} onClick={() => handleClick(channel.channelName)}>{channel.channelName}</div>
             );
           })}
           </div>
        </div>

    <div className='overflow-hidden w-[60%]  h-full flex flex-col items-center rounded-lg border border-[#E58E27] relative'>
        {ChoosenChannel && <div className='w-full flex flex-row justify-between text-center border border-[#E58E27]'>
          <h3 className='p-4'>{ChoosenChannel}</h3>
           <button className='m-2 p-2 rounded-lg border border-[#E58E27]' onClick={()=> {handlLeave()}} >Leave</button>
        </div>}
        <div className='w-full h-[80%] flex flex-col overflow-y-auto scrollbar-hide'>
        {channelToRender && Array.isArray(channelToRender.messages) && channelToRender.messages.map((channel, index) => (
          <div key={index} className={`flex flex-row max-w-[600px] rounded-lg p-2 m-4 text-ellipsis ${channel.sender === channelData.username ? ' bg-[#E58E27] self-start flex-start bg-opacity-50' : ' bg-[#323232] self-end justify-end bg-opacity-50'}`}>
                <Link href={`/profile/${channel.userId}`}><p>{channel?.sender}</p></Link>
                <p className='break-all'>  : {channel?.content}</p>
          </div>
        ))}
        </div>
        {ChoosenChannel && <div className='absolute bottom-0 w-full flex-end rounded-lg border  border-black flex'>
        <input 
         className="w-full text-white rounded-lg border border-black bg-[#323232] p-4"
         value={inputValue}
         onChange={(e) => setInputValue(e.target.value)}
       />
       <button 
      className="w-1/10 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
      const newMessage = {
        sender: "",
        content: inputValue,
        channelName: ChoosenChannel,
      };
     socket.emit('channelMessage', newMessage);
  }}>
     Send
  </button>
        </div>}
    </div>
   </div>
   
  );
}

export default ChannelChat;
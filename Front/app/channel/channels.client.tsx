'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../Contexts/socket';
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { addMessageToChannel, fetchChannelData, leaveChannel, updateChannelMessages } from '../Slices/channelMessagesSlice';
import Link from 'next/link';
import ChannelSearch from '../components/channelSearch';
import { PropagateLoader } from 'react-spinners';

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
  const dispatch = useDispatch<AppDispatch>();
  let channelData: channelNames = useSelector((state: RootState) => state.channelMessages.entity);
  const loading: boolean = useSelector((state: RootState) => state.channelMessages.loading);
  const error: string | null = useSelector((state: RootState) => state.channelMessages.error);
 

  const handleChannelMessage = useCallback((res : channelMessages) => {
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
      }
  }, [socket]); 
  
  useEffect(() => {
    const channelToRender = channelData.channels.find(channel => channel.channelName === ChoosenChannel) || { channelName: "", messages: [] };
    setChannelData(channelToRender);
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
    dispatch(updateChannelMessages({ channelName: name, messages: data}));
    SetChoosenChannel(name);
  }
  if (loading ){
    return (
      <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
        <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
          <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
          <div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={loading} size={20} aria-label="Loading Spinner"/></div>
        </div>
      </div>
    )
  }
 return (
    <div className="relative h-[100%] w-full flex flex-col md:flex-row items-center justify-between p-5 min-h-[400px] gap-5">
      <div className=' w-[60%] h-[40%] md:h-[90%] md:w-[30%]  flex flex-col items-center rounded-lg border border-[#323232] min-w-[300px]'>
        <div className='flex items-center justify-between rounded-t-lg bg-[#323232] w-full h-20 p-4 border-b border-b-[#E58E27]'>
          <h3 className='p-4 flex-start'>conversations</h3>
          <ChannelSearch />
        </div>
           <div className='w-full h-full text-white flex flex-col items-center overflow-y-auto scrollbar-hide '>
              {channelData && channelData.channels.map((channel, index) => {
               return (
               <div className='w-full text-center bg-[#E58E27] bg-opacity-50 p-2 rounded-lg m-2 border-2 border-[#E58E27] ' key={index} style={{cursor: 'pointer'}} onClick={() => handleClick(channel.channelName)}>{channel.channelName}</div>
             );
           })}
           </div>
        </div>

    <div className='overflow-hidden h-[90%] md:w-[80%] w-[60%]  md:h-[90%] flex flex-col items-center rounded-lg border-2 border-[#323232] relative min-w-[300px]'>
        {ChoosenChannel && <div className='w-full flex justify-between items-center text-center h-20 bg-[#323232] border-b border-b-[#E58E27]'>
          <h3 className='px-3'>{ChoosenChannel}</h3>
           <button className='mr-2 py-2 px-5 items-center rounded-lg border border-[#E58E27]' onClick={()=> {handlLeave()}} >Leave</button>
        </div>}
        <div className='w-full h-[80%] flex flex-col overflow-y-auto scrollbar-hide'>
        {channelToRender && Array.isArray(channelToRender.messages) && channelToRender.messages.map((channel, index) => (
          <div key={index} className={`flex flex-row max-w-[600px] rounded-lg p-2 m-4 text-ellipsis ${channel.sender === channelData.username ? ' bg-[#E58E27] self-start flex-start bg-opacity-50' : ' bg-[#323232] self-end justify-end bg-opacity-50'}`}>
                <Link href={channel.sender === channelData.username ? '/profile' : `/profile/${channel.userId}`}><p>{channel?.sender}</p></Link>
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
      className="w-1/10 bg-[#E58E27] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
      const newMessage = {
        sender: "",
        content: inputValue,
        channelName: ChoosenChannel,
      };
     socket.emit('channelMessage', newMessage);
     setInputValue('');
  }}>
     Send
  </button>
        </div>}
    </div>
   </div>
   
  );
}

export default ChannelChat;
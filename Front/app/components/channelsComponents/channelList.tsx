//selctedChannel.tsx
import { fetchChannelData, setSelectedChannel,Channel } from "../../Slices/channelSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type shn ={
  channel : Channel[];
  loading : boolean;
};

function ChannelSelect(props:shn)  {

 const dispatch = useDispatch<AppDispatch>();

  // console.log("===============================" , users);

 
 useEffect(() => {
   dispatch(fetchChannelData());
 }, [dispatch]);

 
 if (props.loading) {
   return <div>Loading...</div>;
 }
 
 console.log("zbi oh my code ",props.channel);
 return (
   <select className='text-[#E58E27] bg-[#30313E]' onClick={(e :any) => {
     const selectedChannel = props.channel.find(channel => channel.channelName === e.target.value);
     
     if (selectedChannel) {
       dispatch(setSelectedChannel(selectedChannel));
     }
   }} onChange={(e :any) => {
    const selectedChannel = props.channel.find(channel => channel.channelName === e.target.value);
    
    if (selectedChannel) {
      dispatch(setSelectedChannel(selectedChannel));
    }
  }}>
     {props.channel.map(channel => (
       <option key={channel.channelName} value={channel.channelName}>
         {channel.channelName}
       </option>
     ))}
   </select>
 );
};

export default ChannelSelect;
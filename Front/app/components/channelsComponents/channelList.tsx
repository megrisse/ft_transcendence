import { setSelectedChannel,Channel } from "../../Slices/channelSlice";
import { AppDispatch } from "@/app/store/store";
import React from "react";
import { useDispatch } from "react-redux";

type shn ={
  channel : Channel[];
  loading : boolean;
};

function ChannelSelect(props:shn)  {

 const dispatch = useDispatch<AppDispatch>();
 
 if (props.loading) {
   return <div>Loading...</div>;
 }
 
 return (
   <select className='text-[#E58E27] bg-[#323232]' onClick={(e :any) => {
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
     {Array.isArray(props.channel) && props.channel.map(channel => (
       <option key={channel.channelName} value={channel.channelName}>
         {channel.channelName}
       </option>
     ))}
   </select>
 );
};

export default ChannelSelect;

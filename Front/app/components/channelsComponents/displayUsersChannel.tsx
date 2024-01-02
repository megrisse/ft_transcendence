'use client'
import React from 'react'
import ChannelUserbanned from './channelUserbanned'
import ChannelMutedUsers from './channelMutedUsers'
import ChannelUserList from './channelUserList'
import ChannelAdminList from './channelAdminList'


export default function DisplayUsersChannel() {
  return (
    <div className="w-full h-full flex flex-col  md:flex-row ">
      <div className=' w-full h-full flex flex-row'>
          <div className="w-full  md:w-1/2  min-h-[300px] md:h-[600px] max-h-[500px] bg-[#323232] rounded-lg flex flex-col justify-around overflow-x-auto overflow-y-auto m-2 ">
            <ChannelUserbanned />
          </div>
          <div className="w-full md:w-1/2   min-h-[300px] max-h-[500px] bg-[#323232] rounded-lg flex flex-col justify-around overflow-x-auto overflow-y-auto m-2 ">
            <ChannelMutedUsers    />
          </div>

      </div>
      <div className=' h-full w-full flex flex-row'>
          <div className="w-full md:w-1/2  min-h-[300px] max-h-[500px] bg-[#323232] rounded-lg flex flex-col justify-around overflow-x-auto overflow-y-auto  m-2 ">
            <ChannelUserList />
          </div>
          <div className="w-full md:w-1/2  min-h-[300px] max-h-[500px] bg-[#323232] rounded-lg flex flex-col justify-around overflow-x-auto overflow-y-auto  m-2">
            <ChannelAdminList />
          </div>

      </div>
    </div>
  )
}
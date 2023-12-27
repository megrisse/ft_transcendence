'use client'
import { useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import Image from "next/image"
import { useEffect } from "react"
import Sidebar from "../components/Sidebar"


export default function Profile() {

  const user = useSelector((state: any) => state.user)

  useEffect(() => {

  }, [])
  return (
    
    <div className="flex flex-col h-screen w-full">
            <div className=""><Navbar pageName="Profile"/></div>
            <div className="flex overflow-y-auto max-h-500 h-[87%] m-2 ">
              <div className="flex flex-col h-full w-[40%]">
                <div className="flex w-[97%] h-[40%] rounded-lg mb-2 mx-auto">
                  <div className="p-2 w-[40%] h-full relative ">
                    <div className="grid content-center w-full h-full">
                      <Image className='m-auto items-center p-3 rounded-full shadow-neon-light' layout="fill" objectFit="contain" src={'/batman.png'} alt="PING PONG" priority={true} />
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] md:text-[16px] w-[60%] rounded-lg bg-[#30313E] h-full">
                    <div className="flex flex-col m-auto text-slate-500">
                      <div className="md:py-2">Name :</div>
                      <div className="md:py-2">User Name :</div>
                      <div className="md:py-2">Rank :</div>
                      <div className="md:py-2">Level :</div>
                    </div>
                    <div  className="m-auto text-white">
                      <div className="md:py-2">{user.name}</div>
                      <div className="md:py-2">{user.userName}</div>
                      <div className="md:py-2">02</div>
                      <div className="md:py-2">8.5</div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className="w-[97%] h-[60%] rounded-lg bg-[#30313E] mt-2 mx-auto">

                </div>
                
              </div>
              <div className="h-full w-[60%]">
                <div className="w-[97%] h-full rounded-lg bg-[#30313E] mx-auto">

                </div>
              </div>
            </div>
          </div>

  )
}
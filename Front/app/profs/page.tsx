'use client'
import Navbar from "../components/Navbar"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Achievements from "../components/Achievements"
import MatchHist from "../components/MatchHist"
import { UserInfos, fetchInfos, userState } from "../Slices/userSlice"
import { AsyncThunk } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "../store/store";
import { BsPersonFillAdd } from "react-icons/bs";
import Options from "../components/profComp/Options";


type Props = {
  isOpen: boolean;
}

export default function Pra({isOpen}: Props) {

  const matchHIst = useSelector((state: RootState) => state.user);
  const Achievs = useSelector((state: RootState) => state.user);
  const dataUser = useSelector((state: RootState) => state.user.entity);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  if (isOpen === undefined) {
    console.log('isOpen prop is required');
  }


  // console.log(matchHIst);
  // console.log(dataUser);
  // const status = useSelector((state: any) => state.user.status);
  // const error = useSelector((state: any) => state.user.error);


  // localStorage.setItem('user', JSON.stringify({ name: 'anas jaidi', userName: ' mqwed khou anas', rank: 1000000000, level: 100000 }))
  // const [data, setData] = useState(null)
  // const [isLoading, setLoading] = useState(true)
 
  // useEffect(() => {
  //   fetch('http://10.11.3.8:3000/users/GetUsers')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  // }, [])
  const handleFriendship = () => {
    setIsFriend(true);
  }

  return (

    <main className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen">
      <div className="h-16 w-full Large:h-24"><Navbar pageName="Profile" /></div>
      <div className="space-y-5 flex justify-between flex-col items-center medium:space-y-0 h-full  medium:flex-row xMedium:h-[90vh]  medium:gap-12 w-[410px] medium:w-[95%] medium:min-w-[1000px] medium:min-h-[750px] medium:mx-auto">
        <div className="w-[100%] xMedium:w-[45%] medium:h-[90%] xMedium:h-[90%] Large:h-full items-center xMedium:ml-0 m-auto flex flex-col">
          <div className="flex flex-col xMedium:flex-row w-[100%] items-center xMedium:w-full medium:h-[50%] xMedium:h-[35%] xLarge:h-[45%] Large:h-[38%] rounded-lg medium:mb-2 mx-auto">
            <div className="relative min-w-[30%] w-72 h-[70%] medium:h-[45%]">
              <div className="grid h-full w-full content-center ">
                {<Image className='rounded-full border-4 mx-auto w-40 h-40 xMedium:w-36 xMedium:h-36 Large:w-56 Large:h-56 border-[#E58E27]' alt='' src={"/gsus.gpeg"} height={150} width={150}/>}

                {/* <Image className='shadow-neon-light' layout="fill" objectFit="contain" src={'/gsus.jpeg'} alt="PING PONG" /> */}
              </div>
              <button onClick={handleFriendship} className={`${isFriend ? "hidden" : "block"} text-[#E58E27] w-[60%] text-3xl absolute top-36 left-52 medium:top-[120px] xMedium:top-32 xMedium:left-8`}><BsPersonFillAdd /><span className={`text-sm hidden top-2 left-8 xMedium:block absolute`}>Add new friend</span></button>
              <Options isFriend={isFriend}/>
            </div>
            <div className="flex flex-col my-auto h-48 medium:h-[57%] w-[70%] justify-between text-[14px] xMedium:w-[90%] medium:rounded-xl rounded-2xl min-w-[320px] Large:h-[90%] xLarge:h-[95%] xMedium:h-[95%] xMedium:text-[16px]">
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Name :</div>
                <div>{dataUser?.firstName} {dataUser?.lastName}</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>User Name :</div>
                <div>{dataUser?.login}</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Rank :</div>
                <div>19</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Level :</div>
                <div>105</div>
              </div>
            </div>
          </div>
          {/* <Achievements noBadge={"user.pathImg"}/> */}
          <Achievements noBadge="/noBadge.png" Achievs={Achievs}/>
        </div>
        <div className=" medium:h-[90%] Large:h-full w-full medium:w-[38%] medium:min-w-[50%] bg-[#323232] flex flex-col items-center rounded-2xl">
          <h1 className=" xLarge:text-3xl medium:pt-9 text-[#E58E27] p-5">LAST MATCH HISTORY</h1>
          <div className="overflow-y-scroll flex flex-col h-[100%] medium:h-[90%] w-[100%] medium:w-[100%] text-[#E58E27] m-auto scrollbar-hide">
          {matchHIst?.map((_: any, index: number) => (
            <div key={index} className="p-5">
              <MatchHist index={index} />
            </div>
  ))}
          </div>
        </div>
      </div>

    </main>
  )
} 
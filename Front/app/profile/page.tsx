'use client'
import Navbar from "../components/Navbar"
import Image from "next/image"
import { useSelector } from 'react-redux';
import Achievements from "../components/Achievements"
import MatchHist from "../components/MatchHist"
import { RootState } from "../store/store";
import { PropagateLoader } from "react-spinners";
import { FaUserEdit } from "react-icons/fa";
import Link from "next/link";


type Props = {
  isOpen: boolean;
}

export default function Pra({isOpen}: Props) {

  const loading: boolean = useSelector((state:RootState) => state.user.loading);
  const error: string | null = useSelector((state:RootState) => state.user.error);
  const matchHIst = useSelector((state: RootState) => state.user.entity?.matches);
  const Achievs = useSelector((state: RootState) => state.user.entity?.achievements);
  const dataUser = useSelector((state: RootState) => state.user.entity?.userData);

  if (loading || error){
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
    <main className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen">
      <div className="h-16 w-full Large:h-24"><Navbar pageName="Profile" /></div>
      <div className="flex justify-between flex-col items-center space-y-5 medium:space-y-0 h-full  medium:flex-row xMedium:h-[90vh]  medium:gap-12 w-[410px] medium:w-[95%] medium:min-w-[1000px] medium:min-h-[750px] medium:mx-auto">
        <div className="w-[100%] xMedium:w-[45%] medium:h-[90%] xMedium:h-[90%] Large:h-full items-center xMedium:ml-0 m-auto flex flex-col">
          <div className="flex flex-col xMedium:flex-row w-[100%] items-center xMedium:w-full medium:h-[50%] xMedium:h-[35%] xLarge:h-[45%] Large:h-[38%] rounded-lg medium:mb-2 mx-auto">
            <div className="min-w-[30%] w-72 h-[70%] medium:h-[45%]">
              <div className="grid h-full w-full content-center relative">
                {<Image className='rounded-full border-4 mx-auto w-40 h-40 xMedium:w-36 xMedium:h-36 Large:w-56 Large:h-56 border-[#E58E27]' alt='' src={dataUser?.avatar || "/noBadge.png"} height={150} width={150}/>}
                {/* <Image className='shadow-neon-light' layout="fill" objectFit="contain" src={'/gsus.jpeg'} alt="PING PONG" /> */}
                <div className="absolute xMedium:w-full top-36 left-52 medium:top-28 xMedium:left-12 xMedium:top-32">
                  <Link href={"/setting"} className="flex items-end">
                    <div className=" py-2 xMedium:py-0 xMedium:px-1 text-2xl text-[#E58E27]"><FaUserEdit /></div>
                    <div className="text-sm text-[#E58E27]">Edit profile</div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col my-auto h-48 medium:h-[50%] w-[70%] justify-between text-[14px] xMedium:w-[90%] medium:rounded-xl rounded-2xl min-w-[320px] Large:h-[90%] xLarge:h-[95%] xMedium:h-[95%] xMedium:text-[16px]">
              
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>User Name :</div>
                <div>{dataUser?.username}</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Rank :</div>
                <div>{dataUser?.rank}</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Level :</div>
                <div>{dataUser?.level}</div>
              </div>
            </div>
          </div>
          {Achievs && <Achievements noBadge="/noBadge.png" Achievs={Achievs} />}
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
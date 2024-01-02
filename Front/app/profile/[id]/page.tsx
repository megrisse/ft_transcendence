'use client'
import Navbar from "../../components/Navbar"
import Image from "next/image"
import axios from "axios";
import { useState, useEffect, useRef } from "react"
import { useSelector } from 'react-redux';
import Achievements, { Achievement } from "../../components/Achievements"
import MatchHist, { MatchHIst } from "../../components/MatchHist"
import { UserInfos } from "../../Slices/userSlice"
import { RootState } from "../../store/store";
import { PropagateLoader } from "react-spinners";
import { BsPersonFillAdd } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { useRouter } from "next/navigation";




type Props = {
  params: {id: string}
}

export default function Pra({params}: Props) {

  const Achievs = useSelector((state: RootState) => state.user.entity?.achievements);

  const [data, setData] = useState<UserInfos | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [matchHist, setmatchHist] = useState<MatchHIst[]>([]);
  const [achievs, setAchievs] = useState<Achievement[]>([]);
  const [isOption, setIsOption] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/Profile/${params.id}`, {withCredentials: true });
        if (response.data){
          setData(response.data);
          setAchievs(response.data.achievements);
          setmatchHist(response.data.matches);
          setIsFriend(response.data.isFriend);
          setLoading(false);
        }
        } catch (error) {
          setLoading(false);
          setError("Error profile not something !");
        }
      };
      
      fetchData();
      
    }, [params.id]);
    

  const matchHIst = useSelector((state: RootState) => state.user.entity?.matches);
  const dataUser = useSelector((state: RootState) => state.user.entity?.userData);

  const handleAddFriendClick = async () => {
    const username = data?.userData.username;
    if (!isFriend){
      const response = await axios.post(`http://localhost:4000/Chat/invite`, {username}, {withCredentials: true });
      if (response.status === 200)
        setIsFriend(true);
    }
  }

  const handleOptionClick  = () => {
    setIsOption(!isOption);
    router.push('/userSettings');
  }

  if (loading){
    return (
      <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
        <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
          <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
          <div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={loading} size={20} aria-label="Loading Spinner"/></div>
        </div>
      </div>
    )
  }
  if (error){
    return (
      <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
        <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
          <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  Something went wrong ! </div>
        </div> 
      </div>
    )
  }

  return (
      <>
    <main className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen">
      <div className="h-16 w-full Large:h-24"><Navbar pageName="Profile" /></div>
      <div className="flex flex-col items-center medium:space-y-0 h-full gap-2 medium:flex-row xMedium:h-[90vh]  medium:gap-12 w-[410px] medium:w-[95%] medium:min-w-[1000px] medium:min-h-[950px] medium:mx-auto">
        <div className="w-[100%] xMedium:w-[45%] medium:h-[90%] xMedium:h-[90%] Large:h-[90%] items-center xMedium:ml-0 flex flex-col">
          <div className="flex flex-col xMedium:flex-row w-[100%] items-center xMedium:w-full medium:h-[40%] xMedium:h-[35%] xLarge:h-[45%] Large:h-[38%] rounded-lg medium:mb-2 m-auto">
            <div className="min-w-[30%] w-72 h-[70%] medium:h-[45%] relative">
              <div className="grid h-full w-full content-center ">
                {<Image className='rounded-full border-4 mx-auto w-40 h-40 xMedium:w-32 xMedium:h-32 Large:w-40 Large:h-40 border-[#E58E27]' alt='user Image' src={data?.userData?.avatar || "/noBadge.png"} height={150} width={150} priority/>}
              </div>
              <div className="absolute xMedium:w-full top-36 left-52 medium:top-36 xMedium:left-9 xMedium:top-36 Large:top-48 Large:left-16 xLarge:left-24 xLarge:top-52">
                  <button onClick={handleAddFriendClick} className={`${isFriend ? "hidden" : "flex"} items-end`}>
                    <div className={` py-2 xMedium:py-0 xMedium:px-1 text-2xl text-[#E58E27]`}><BsPersonFillAdd /></div>
                    <div className="text-sm text-[#E58E27]">Add friend</div>
                  </button>
                  <button onClick={handleOptionClick} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className={`${isFriend ? "flex" : "hidden"} z-50 items-end py-2 xMedium:py-0 xMedium:px-1 text-2xl text-[#E58E27] relative`}><div ref={dropdownRef}><SlOptions className="absolute left-1 top-3 medium:left-3 medium::top-5 xMedium:-left-5 xMedium:-top-5"/></div></button>
                </div>
            </div>
            <div className="flex flex-col my-auto h-48 medium:h-[40%] w-[70%] justify-between text-[14px] xMedium:w-[90%] medium:rounded-xl rounded-2xl min-w-[320px] Large:h-[90%] xLarge:h-[95%] xMedium:h-[60%] xMedium:text-[16px]">
              
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>User Name :</div>
                <div>{data?.userData?.username}</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Rank :</div>
                <div>{data?.userData?.rank}</div>
              </div>
              <div className="flex xLarge:text-2xl Large:text-xl Large:p-5 xLarge:p-6 justify-between w-full p-2 medium:p-3 mx-auto bg-[#323232] rounded-2xl">
                <div>Level :</div>
                <div>{data?.userData?.level}</div>
              </div>
            </div>
          </div>
          {Achievs && <Achievements noBadge="/noBadge.png" Achievs={data?.achievements} />}
        </div>
        <div className=" medium:h-[90%] Large:h-[95%] w-full medium:w-[38%] medium:min-w-[50%] m-auto bg-[#323232] flex flex-col items-center rounded-2xl">
          <h1 className=" xLarge:text-3xl medium:pt-9 text-[#E58E27] p-5">LAST MATCH HISTORY</h1>
          <div className="overflow-y-scroll flex flex-col h-[100%] medium:h-[90%] w-[100%] medium:w-[100%] text-[#E58E27] m-auto scrollbar-hide">
            {matchHist?.map((_: any, index: number) => (
              <div key={index} className="p-5">
                <MatchHist index={index} matche={matchHist[index]} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  </>
  )
} 
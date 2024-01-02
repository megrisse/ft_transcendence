// import React from 'react';
// import UserRank from '../components/userRank';
// import Navbar from "../components/Navbar";

// export default function page() {
//  return (

// <div className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen object-cover">
//       <div className="h-16 w-full Large:h-24"><Navbar pageName="Rank" /></div>
//             <div className='h-[80%] min-h-[600px] medium:min-h-[700px] m-auto w-[410px] medium:w-[80%] mt-11  flex   items-center'>     
//                   <UserRank   />
               
//             </div>
//             </div>
//  );
// }
'use client';
import UserRank from '../components/userRank';
import Navbar from "../components/Navbar";
import axios from 'axios';
import React, {useEffect,useState} from 'react';
import { PropagateLoader } from 'react-spinners';
import { socket } from '../Contexts/socket';


type LeaderboardDto = {
  username: string;
  avatar: string;
  rank: number;
  level: number;
  GamesPlayed : number;
  achievements: string[];
 };

export default function page() {
      const [userData, setUserData] = useState<LeaderboardDto[]>([]);

      const [Pending, setPending] = useState<boolean>(true);
      useEffect(()=> {
            socket.connect()
            fetchData();
            return () => {
              socket.disconnect()
            }
          },[])
    
          const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:4000/leaderboard', {withCredentials: true })
              if (response.status === 401){
                setPending(true);
              }
              if (response.status === 200) {
                setUserData(response.data);
                setPending(false);
              }else {
                setPending(true);
              }
        
            } catch (err) {
              setPending(true)
            }
          };

          if (Pending){
            return (
              <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
                <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
                  <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
                  <div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={Pending} size={20} aria-label="Loading Spinner"/></div>
                </div>
              </div>
            )
          }
          else {
                return (
                      <div className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen object-cover">
                  <div className="h-16 w-full Large:h-24"><Navbar pageName="Rank" /></div>
                        <div className='h-[80%] min-h-[600px] medium:min-h-[700px] m-auto w-[410px] medium:w-[80%] mt-11  flex   items-center'>     
                              <UserRank   data={userData}/>
                        </div>
                        </div>
             );
            }
      }
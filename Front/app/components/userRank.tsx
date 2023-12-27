'use client';

import React, {useEffect,useState} from 'react';

type LeaderboardDto = {
  username: string;
  avatar: string;
  rank: number;
  level: number;
  GamesPlayed : number;
  achievements: string[];
 };

function UserRank() {
  const [userData, setUserData] = useState<LeaderboardDto[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/leaderboard', {
      method: "GET",
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log("ibzdane n jesus",data);
        setUserData(data);
      })
      .catch(error => console.error('Error:', error));
   }, []);

   const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

   useEffect(() => {
    if (typeof window !== 'undefined') {
     const handleResize = () => setWindowWidth(window.innerWidth);
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
    }
   }, []);
      
  return (
   
  <div className="w-full h-full">
    <div className=" w-full md:hidden flex h-[3%] items-center justify-between bg-[#E58E27] rounded-lg m-2"> 
        <div className=' flex justify-center  '><p className='font-mono'>Avatar </p></div>
          <div className='w-[20%] flex justify-center   '><p className='font-mono'>Username </p></div>
          <div className='w-[15%] flex justify-center  '><p className='font-mono'>Rank </p> </div>
          <div className='w-[15%] flex justify-center     '><p className='font-mono'>Lvl</p></div>
          <div className='w-[15%]  flex justify-center    '><p className='font-mono'>PG</p></div>
          <div className=' w-[20%] flex justify-center    '><p className='font-mono'>ACHV</p></div>
    </div>
  {userData.map((user, index) => (

    <div key={index} className='w-full flex h-[5%]  bg-[#30313E] rounded-lg m-2'>
      <div className='w-full flex flex-row justify-between  '>
        <div className='  w-full justify-around items-center  flex items-center justify-center '>
            <div className='w-[10%] flex justify-center '>
              <img className='   bg-black rounded-full w-10 h-10 object-cover' src={user.avatar} />
            </div>
            <div className=' w-[20%] flex flex-row justify-center truncate '>
                <h1 className='max-md:hidden  '>Username :</h1>
                <h1 className='text-[#E58E27]'>{windowWidth < 640  && user.username.length > 7 ? `${user.username.slice(0, 7)}...` : user.username}</h1>
            </div>
          <div className=' w-[10%] flex flex-row justify-center truncate'><h1 className='max-md:hidden '>Rank :</h1><h1 className='text-[#E58E27]'>{index + 1}</h1></div>
          <div className=' w-[10%] flex flex-row  justify-center truncate '><h1 className='max-md:hidden '>Level :</h1><h1 className='text-[#E58E27]'>{user.level.toPrecision(2)}</h1></div>
          <div className=' w-[20%] flex flex-row justify-center truncate'><h1 className=' max-md:hidden '>Games played :</h1><h1 className='text-[#E58E27]'>{user.GamesPlayed}</h1></div>
        <div className='   flex justify-center items-center truncate'>
          <h1 className='max-md:hidden '>Acheivements :</h1>
          <img className=' bg-[#30313E] rounded-full w-10 h-10 object-cover bg-[#E58E27]' src ={user.achievements[0]} />
          <img className= 'max-md:hidden profile-img bg-[#30313E] rounded-full w-10 h-10 object-cover bg-[#E58E27] 'src ={user.achievements[1]} />
          <img className='max-md:hidden profile-img bg-[#30313E] rounded-full w-10 h-10 object-cover bg-[#E58E27] 'src ={user.achievements[2]} />
        </div>
        </div>
      </div>
    </div>
  ))}
 
 </div>
   
  );
}



export default UserRank;





'use client'
import Link from 'next/link';
import React, { useEffect } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useState } from 'react';
import { ClipLoader } from "react-spinners";
import axios from 'axios';

type Props = {
    pageName: string
}

interface userr {
  id: string;
  username: string
}

export default function Navbar({pageName}:Props) {
  
  const usersData = [
    { id: 1, name: 'dser1', username: 'user1' },
    { id: 2, name: 'dser2', username: 'user2' },
    { id: 3, name: 'doyo', username: 'yoyo' },
    { id: 4, name: 'dodo', username: 'dodo' },
    { id: 5, name: 'doro', username: 'doro' },
    { id: 6, name: 'dppl', username: 'dppl' },
  ];
  const [searchInput, setSearchInput] = useState<string>('');
  const [hideIt, setHideIt] = useState<boolean>(false);
  const [loadingCode, setLoadingCode] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [userData, setUserData] = useState<userr[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setLoadingCode(true);
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (searchInput.length === 0)
          setLoadingCode(false);
        if (searchInput.trim().length === 0)
          setLoadingCode(false);

        if (searchInput.trim().length > 0) {
          const response = await axios.get(`http://localhost:4000/Search/${searchInput}`, {withCredentials: true });
          setLoadingCode(false);
          setUserData(response.data);
        }
      } catch (error) {
        setLoadingCode(false);
        setErrorCode(error as string)
      }
    };
    fetchUserData();
    
  }, [searchInput]);

  return (
    <div className='flex justify-between min-w-[350px] h-16 Large:h-24 mx-6'>
      <div className='flex w-[50%] text-[#E58E27] items-center justify-around'>
        <h3 className='ml-7 medium:ml-3 text-sm Large:text-xl w-28 whitespace-normal overflow-auto'>{pageName}</h3>
        <div className='relative h-full w-full'>
          <div>
            <input maxLength={13} type='text' name={searchInput} onChange={handleSearch} className={`${hideIt ? "w-[220px]" : "hidden"} bg-red-900 medium:block top-[18px] absolute Large:top-7 text-orange-100 pl-1 py-1 text-sm focus:outline-none Large:w-[400px] w-52 Large:text-lg medium:w-[300px] border rounded-lg bg-transparent border-[#E58E27]`}></input>
            <ul className={` overflow-y-auto scrollbar-hide max-h-48 list-none p-1 m-0 absolute top-[52px] text-sm Large:w-[400px] w-[220px] Large:text-lg medium:w-[300px] ${searchInput && userData.length > 0 ? "" : "hidden"} ${searchInput && userData.length > 0 ? "" : "bg-opacity-0"} border-t-0 rounded-b-lg bg-opacity-80 z-50 bg-[#323232] border-[#E58E27]`}>
              {userData &&  userData?.length === 0 ? (<li></li>) :
              (userData?.map((user) => (
                <li
                key={user.id}
                className="cursor-pointer p-2 hover:text-orange-500 hover:bg-white rounded-md text-slate-200"
                >
                  <Link href={`/profile/${user.id}`}>
                    {user.username}
                  </Link>
                </li>
              )) )}
            </ul>
          </div>
          {!loadingCode ? (<div className='hidden medium:block absolute top-5 left-[240px] Large:left-[368px] medium:left-[270px] text-2xl Large:top-8 Large:text-3xl'><AiOutlineSearch/></div>) : (<ClipLoader className='absolute Large:top-8 top-6 left-[240px] Large:left-[368px] medium:left-[270px] text-2xl Large:text-3xl' color={"#E58E27"} loading={loadingCode} size={20} aria-label="Loading Spinner" />)}
          <button onClick={() => setHideIt(!hideIt)} className={`absolute top-5 ${hideIt ? "left-[190px]" : "left-[5px]"} left-5 Large:left-[368px] medium:hidden text-2xl Large:text-3xl`}><AiOutlineSearch/></button>
        </div>
      </div>
      <div className='flex w-[40%] text-[#E58E27] justify-end items-center'>
        <Link href={'/profile'}><h1 className={`${hideIt ? "hidden medium:block" : ""} text-[#E58E27] text-sm mr-2 md:mr-8 font-sans medium:text-md font-semibold flex-none Large:text-xl`}>AREA 420</h1></Link>
        <Link href={'/game'} className="medium:py-1 medium:px-6 Large:px-8 bg-[#E58E27] text-sm text-slate-100 rounded-full medium:rounded-sm flex-none Large:text-lg  ml-8">
          <div className='hidden medium:block'>PLAY</div>
          <div className='text-3xl rounded-full medium:hidden'><BsFillPlayCircleFill/></div>
        </Link>
      </div>
    </div>
  )

}
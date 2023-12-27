'use client'
import Image from 'next/image'
import React from 'react'
import MCard from './MCard'
import CardM from './CardM'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'


// export interface UserInfos {
//   id: number;
//   firstName: string;
//   lastName: string;
//   login: string;
//   ran?: number;
//   level?: number;
//   avatar: string;
// }

// export interface matchHistory {
//   title: string;
//   icon: string;
//   unlocked:boolean;
// }

// export interface Achievement {
//   id: number;
//   name: string;
//   userName: string;
//   rank: number;
//   level: number;
//   avatar: string;
// }



// export interface userState {
//   userData:UserInfos;
//   Achiev:Achievement[];
//   matches:matchHistory[];
//   loading: boolean;
//   error: string | null;
// }

// export const initialState: userState = {
//   userData: {
//     id: 0,
//     login: '',
//     firstName: '',
//     lastName: '',
//     avatar: '',
//   },
//   Achiev: [],
//   matches: [],
//   loading: false,
//   error: null,
// }

interface MatchHIst {
  id: number;
  playerAId:number;
  playerBId:number;
  playerAAvatar:string;
  playerBAvatar:string;
  playerAUsername:string;
  playerBUsername:string;
  playerBScore:number;
  playerAScore:number;
}

type Props = {
    index:number;
  };



function MatchHist({index}:Props) {

// function MatchHist() {

  // const {user_Data} = useSelector((state: RootState) => state.user);
  

  return (
    <div className='flex min-w-[300px] w-[85%] h-32 justify-between m-auto'>
        <div>
          <MCard index={index}/>
        </div>
          <div className='text-center m-auto text-xl medium:text-2xl'>vs</div>
        <div>
          <CardM index={index}/>
        </div>
    </div>
  )
}

export default MatchHist
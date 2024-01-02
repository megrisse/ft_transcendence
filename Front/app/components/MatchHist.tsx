'use client'
import Image from 'next/image'
import React from 'react'
import MCard from './MCard'
import CardM from './CardM'

export interface MatchHIst {
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
    matche: MatchHIst;
  };



function MatchHist({index, matche}:Props) {

  return (
    <div className='flex min-w-[300px] w-[85%] h-32 justify-between m-auto'>
        <div>
          <MCard index={index} matche={matche}/>
        </div>
          <div className='text-center m-auto text-xl medium:text-2xl'>vs</div>
        <div>
          <CardM index={index} matche={matche}/>
        </div>
    </div>
  )
}

export default MatchHist
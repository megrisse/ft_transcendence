'use client'
import React from 'react'
import Image from 'next/image'
import { MatchHIst } from './MatchHist';


type Props = {
    index: number;
    matche: MatchHIst
}

function CardM({index, matche} : Props) {

  return (

        <div className='flex h-32 xMedium:h-40 w-40 m-auto'>
            <div className='m-auto pr-4 medium:text-2xl'>{matche?.playerAScore}</div>
            <div className='flex flex-col'>
                <Image className='rounded-full m-auto h-16 w-16 xMedium:h-28 medium:h-16 xMedium:w-28 medium:w-16' alt='' src={matche?.playerAAvatar as string} height={100} width={100} priority/>
                <div className='text-center medium:text-2xl text-slate-500'>{matche?.playerAUsername}</div>
            </div>
        </div>
    );
  
}

export default CardM
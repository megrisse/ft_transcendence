'use client'
import React from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


type Props = {
    index: number;
}

function CardM({index} : Props) {


  const matchHIst = useSelector((state: RootState) => state.user.user_Data?.matches);
//   console.log("****");
//   console.log(matchHIst?.[index]?.id);
//   console.log("****");
  return (

        <div className='flex h-32 xMedium:h-40 w-40 m-auto'>
            <div className='m-auto pr-4 medium:text-2xl'>{matchHIst?.[index]?.playerAScore}</div>
            <div >
                <Image className='rounded-full m-auto h-16 w-16 medium:h-28 medium:w-28' alt='' src={matchHIst?.[index]?.playerAAvatar} height={150} width={150}/>
                <div className='text-center medium:text-2xl text-slate-500'>{matchHIst?.[index]?.playerAUsername}</div>
            </div>
        </div>
    );
  
}

export default CardM
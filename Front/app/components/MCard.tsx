import React from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

type Props = {
    index: number;
}

function MCard({index} : Props) {
  const matchHIst = useSelector((state: RootState) => state.user.user_Data?.matches);

  return (

        <div className='flex h-32 xMedium:h-40 w-40 m-auto'>
            <div className='flex flex-col'>
                <Image className='rounded-full h-16 w-16  medium:h-28 medium:w-28' alt='' src={matchHIst?.[index]?.playerBAvatar} height={150} width={150}/>
                <div className='text-center text-slate-500 medium:text-2xl'>{matchHIst?.[index]?.playerBUsername}</div>
            </div>
            <div className='m-auto medium:text-2xl pl-4'>{matchHIst?.[index]?.playerBScore}</div>
        </div>
    );
  
}

export default MCard
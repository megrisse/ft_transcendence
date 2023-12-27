import React from 'react'
import Image from 'next/image'
function NotFoud404() {
  return (
    <div className='bg-[#131313] h-screen w-screen items-center flex m-auto justify-center'>
      <Image src={'/40-4.png'} height={400} width={600} alt='Page Not Found'/>
    </div>
  )
}

export default NotFoud404
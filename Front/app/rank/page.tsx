import React from 'react';
import UserRank from '../components/userRank';
import Navbar from "../components/Navbar";

export default function page() {
 return (

<div className="flex flex-col justify-between items-center h-screen min-h-screen min-w-screen object-cover">
      <div className="h-16 w-full Large:h-24"><Navbar pageName="Rank" /></div>
            <div className='h-[80%] min-h-[600px] medium:min-h-[700px] m-auto w-[410px] medium:w-[80%] mt-11  flex   items-center'>     
                  <UserRank   />
               
            </div>
            </div>
 );
}
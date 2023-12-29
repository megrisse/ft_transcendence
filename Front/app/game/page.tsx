"use client";

import Navbar from "../components/Navbar";
import GameButtons from "../components/GameComonents/GameButtons"
import { WebsocketProvider , socket} from "../Contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

export default function Game() {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('You')
	const [avatar, setAvatar] = useState<string>('http://res.cloudinary.com/dvmxfvju3/image/upload/v1700925320/wu4zkfcugvnsbykwmzpw.jpg')


  useEffect(() => {
		// no-op if the socket is already connected
		socket.connect();
		console.log("HYYYYYY: ", socket.connected);
		socket.on("CONNECTED",(res : {name: string, avatar: string, IsEnebled: boolean, IsAuth: boolean})=>{
      console.log("CONNECTED", res);
			setName(res.name)
			setAvatar(res.avatar)
      console.log("IsEnabled: ", res.IsEnebled, " IsAuth: ", res.IsAuth);
      
      if ((res.IsEnebled && res.IsAuth) || !res.IsEnebled)
        setLoading(false);
    })

		return () => {
		  socket.disconnect();
		};
	  }, []);

  
  console.log("Hellllllloooo ");
  if (loading){
		return (
			<div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
			  <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
				<div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
				<div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={loading} size={20} aria-label="Loading Spinner"/></div>
			  </div>
			</div>
		  )
	}
  return (
          <div className=" flex flex-col text-slate-100 h-screen w-full">
            <div className=""><Navbar pageName="Game"/></div>
            <div className="border h-[87%] m-2 ">
              <div className="w-full h-full">
                <WebsocketProvider value={socket}>  
				          <GameButtons setLoading={setLoading} name={name} avatar={avatar}/>
                </WebsocketProvider>
              </div>
            </div>
          </div>

  )
}
import React, { useEffect, useState } from "react";
// import { socket } from "./socket";
import { socket } from "@/app/Contexts/socket";
import { useRouter } from "next/navigation";
import GameInviteModal from "@/app/chat/gameInvite.modal";
import { MdVideogameAsset } from "react-icons/md";


interface ChatHeaderProps {
  name: string;
  avatar: string;
  reciever : string;
}

const ChatHeader = ({ name, reciever, avatar }: ChatHeaderProps) => {

  const router = useRouter()
  const [ShowInvite, SetShowInvite] = useState(false);
  const [invite, SetInvite] = useState<[string, string]>();

  const handlePlayClick = (name : string) => {
    console.log("NEW PLAY: ", name);
    //SEND THE ID OF CLIENT WITH INVIT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    socket.emit("INVITE", reciever)
  }

  const redirectToGame = () => {
    setTimeout(()=>{

      router.push('/game');
    }, 500)
  }
  const popEnvite = async (res: {recieverId: string, senderId: string}) => {
    console.log("IVITE recieved: ", res);
    SetInvite([res.recieverId, res.senderId]);
    SetShowInvite(true)
  }

  useEffect (() => {
    /***
     * INVITE send by the first client,{
     * we send a GameInvite demande to second player
     *    if the second player accepte
     *        redirect to game
     *    else
     *      send to first client refuse
     * }when 2em client accepte the demande 
     */
    // if (!socket.hasListeners("INVITE")) {
    //   socket.on("INVITE", redirectToGame);
    // }
    if (!socket.hasListeners("GameInvite")) {
      
      socket.on("GameInvite", popEnvite);
    }
    if (!socket.hasListeners("EnterGame")) {
      socket.on("EnterGame", redirectToGame)
    }
    if (!socket.hasListeners("ERROR",)) {
      socket.on("ERROR", (res : string)=> {console.log(res);
      })
    }

    return ()=>{
      //socket.off all l3aybat
      socket.off("GameInvite")
      socket.off("EnterGame")
      socket.off("ERROR")
      // socket.disconnect()
    }
   
}, [socket, ShowInvite, invite]); 
  

  return (
    <div className="border-b border-b-[#E58E27] bg-[#323232] rounded-t-lg h-20 w-full px-6 flex flex-row justify-between items-center">
      <div className="flex justify-between h-7 xMedium:h-10 space-x-1.5 w-full  ">
      {ShowInvite && invite && <GameInviteModal socket={socket} setGameInviteModal={SetShowInvite} reciever={invite[0]} sender={invite[1]}/>}
          <div className="flex space-x-1.5 justify-around items-center">
            <img src={avatar} alt="Your Image" className=" w-11 h-11 rounded-lg border flex"/>                                           
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-600">{name}</p>
            </div>
          </div>
          <button className="w-32 flex rounded-lg bg-[#E58E27] text-sm" onClick={ 
              () => {
                 handlePlayClick(name)
              }
            }>
            <h1 className="m-auto text-center">Invite</h1>
            <h1 className="text-2xl text-[#E58E27] bg-white rounded-lg m-auto"><MdVideogameAsset /></h1>
          </button>
      </div>
    </div>
  );
};

export default ChatHeader;
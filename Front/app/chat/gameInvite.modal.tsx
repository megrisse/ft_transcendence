//error modal
import { clearError } from "@/app/Slices/channelSlice";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";


interface GameInviteModalProps{
  setGameInviteModal: Dispatch<SetStateAction<boolean>>;
  socket: Socket;
  reciever : string;
  sender : string;
}

const GameInviteModal : React.FC<GameInviteModalProps> = (props) => {

 return (
   <>
       <>
         <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
           <div className="relative w-auto my-6 mx-auto max-w-3xl">
             <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#323232] outline-none focus:outline-none">
               <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() =>{
                    props.setGameInviteModal(false);
                    props.socket.emit("GameInvite", {state: "OK", recieverId: props.reciever, senderId: props.sender})
                  }}
                >
                  <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    Yes
                  </span>
                </button>
                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => {
                    props.setGameInviteModal(false);
                    props.socket.emit("GameInvite", {state: "KO", recieverId: props.reciever, senderId: props.sender})
                  }}
                  >
                  <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    No
                  </span>
                </button>
               </div>
               <div className="flex flex-col items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <p>GAME INVITE</p>
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => {
                    props.setGameInviteModal(false);
                    props.socket.emit("GameInvite", {state: "KO", recieverId: props.reciever, senderId: props.sender})  
                    }}>
                  Close
                </button>
               </div>
             </div>
           </div>
         </div>
       </>
   </>
 );
};

export default GameInviteModal;
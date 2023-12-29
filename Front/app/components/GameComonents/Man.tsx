import { WebsocketContext } from "@/app/Contexts/WebSocketContext";
import { List, ListItem, Typography  } from "@mui/material";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Image from "next/image";

const Man = ()=>{
	const [showModal, setShowModal] = useState(false);

	return (
		<>
		  <button
			className="w-[200px] h-[50px] bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]"
			type="button"
			onClick={() => setShowModal(true)}
		  >
		  Man
		  </button>
		  {showModal ? (
			<>
			<div className="flex flex-col justify-center w-[60%] h-[80%] items-center overflow-x-hidden overflow-y-auto fixed inset-50 z-50 outline-none focus:outline-none">
				<div className=" border-0 rounded-lg shadow-lg relative  w-full bg-black outline-none focus:outline-none">
					<div className=" justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
						<h3 className="text-3xl font=semibold">MAN</h3>
						<button
						className=""
						onClick={() => setShowModal(false)}
						>
							<span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
							x
							</span>
						</button>
					</div>
					<div className="relative p-6 flex flex-col justify-center items-center">
                        <div><h2>Move the Mouse inside the game to play</h2></div>
                        <div><h2>You can Play with RAndom connected Users when clicking on Play With Random</h2></div>
                        <div><h2>You can choose between 3 Mods "BEGIINER" , "INEMIDIER" And "ADVENCED"</h2></div>
                        <div><h2>You can Play with Bot, Have Fun Training ...</h2></div>
                        <div><h2 className="text-red-500">YOU CAN ONLY INCREASE YOUR RANK BY PLAYING WITH OTHER PLAYERS -HXH-</h2></div>
					</div>
					<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
					  <button
						className=" bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#b41f1fde]"
						type="button"
						onClick={() => setShowModal(false)}
					  >
						Close
					  </button>
					 
					</div>
				  </div>
				</div>
			</>
		  ) : null}
		</>
	  );
};

export default Man;
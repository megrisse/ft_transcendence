import { WebsocketContext } from "@/app/Contexts/WebSocketContext";
import { List, ListItem, Typography  } from "@mui/material";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Image from "next/image";

interface RandomButtonsProps  {
    setMap: Dispatch<SetStateAction<string>>;
};

const RandomButtons : React.FC<RandomButtonsProps> = (props)=>{
	const [showModal, setShowModal] = useState(false);
    const [map, setMap] = useState('BEGINNER');
	const socket :Socket = useContext(WebsocketContext);
	
  const [gameMode, setGameMode] = useState("");

  // Define an array of game modes
  const gameModes = [
    { id: 1, name: 'BEGINNER', image: "http://res.cloudinary.com/dvmxfvju3/image/upload/v1702993365/x5gipkz1uezgmji8nbdi.png" },
    { id: 2, name: 'INTEMIDIER', image: "http://res.cloudinary.com/dvmxfvju3/image/upload/v1702995300/awl7nouym8qnbmkqjvgt.png" },
    { id: 3, name: 'ADVANCED', image: "http://res.cloudinary.com/dvmxfvju3/image/upload/v1702995260/ybxaxwntkioeh0avzmqz.png" },
  ];

    const handleMap = (value: string) => {
		
		setMap(value);
		console.log("----> aaaa", value);

    };

    const Submit = ()=>{
		console.log("SUBMIT", socket.id, "MAP: ", map);
		
		socket.emit("RANDOM", {
			map: map,	
		})
		props.setMap(map)
		setMap(map);
		console.log("MAP: ", map);
		setShowModal(false);
	}

	return (
		<>
		  <button
			className="w-[200px] h-[50px] bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]"
			type="button"
			onClick={() => setShowModal(true)}
		  >
		  Play with Random
		  </button>
		  {showModal ? (
			<>
			<div className="flex flex-col justify-center w-[60%] h-[80%] items-center overflow-x-hidden overflow-y-auto fixed inset-50 z-50 outline-none focus:outline-none">
				<div className=" border-0 rounded-lg shadow-lg relative  w-full bg-black outline-none focus:outline-none">
					<div className=" justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
						<h3 className="text-3xl font=semibold">Play With Randoms</h3>
						<button
						className=""
						onClick={() => setShowModal(false)}
						>
							<span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
							x
							</span>
						</button>
					</div>
					<div className="relative p-6 flex-auto">
				<Typography variant="h6">Select a game mode:</Typography>
				<List>
          	<div className="flex flex-row justify-center w-full h-full">
				{gameModes.map((mode) => (
					<button key={mode.id} onClick={() => handleMap(mode.name)} className="focus:outline-none">
						<div className={`flex flex-col rounded-md items-center p-6  hover:scale-90 scale-50 hover:bg-[#AF6915] ${mode.name === map ? "bg-[#AF6915] scale-100 p-8" : "p-6"}`}>
							<Image width={150} height={200} src={mode.image} alt={mode.name} />
							<p>{mode.name}</p>
						</div>
					</button>
				))}

			</div>
				</List>
			{gameMode && <Typography variant="h6">Selected Game Mode: {gameMode}</Typography>}
						
					</div>
					<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
					  <button
						className=" bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#b41f1fde]"
						type="button"
						onClick={() => setShowModal(false)}
					  >
						Close
					  </button>
					  <button
						className="bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]"
						type="button"
						onClick={Submit}
					  >
						Submit
					  </button>
					</div>
				  </div>
				</div>
			</>
		  ) : null}
		</>
	  );
};

export default RandomButtons;


// import React, { useState } from 'react';
// import { List, ListItem, Typography } from '@material-ui/core';
// // import gameMode1 from '/_next/image?url=%2Fbatman.png&w=3840&q=75';
// // import gameMode2 from './path-to-game-mode-2-image';
// // import gameMode3 from './path-to-game-mode-3-image';

// const RandomButtons = () => {
  // const [gameMode, setGameMode] = useState("");

  // // Define an array of game modes
  // const gameModes = [
  //   // { id: 1, name: 'Game Mode 1', image: gameMode1 },
  //   // { id: 2, name: 'Game Mode 2', image: gameMode2 },
  //   // { id: 3, name: 'Game Mode 3', image: gameMode3 },
  // ];

//   const handleClick = (mode: React.SetStateAction<string>) => {
//     console.log(`Selected game mode: ${mode}`);
//     setGameMode(mode);
//   };

//   return (
//     <div>
//       <Typography variant="h6">Select a game mode:</Typography>
//       <List>
//         {/* {gameModes.map((mode) => (
//           <ListItem button key={mode.id} onClick={() => handleClick(mode.name)}>
//             <img src={mode.image} alt={mode.name} />
//           </ListItem>
//         ))} */}
//       </List>
//       {gameMode && <Typography variant="h6">Selected Game Mode: {gameMode}</Typography>}
//     </div>
//   );
// };

// export default RandomButtons;
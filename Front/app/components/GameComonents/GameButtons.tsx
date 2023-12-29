"use client";

import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import GameClass from "./GameClass";
import { WebsocketContext } from '../../Contexts/WebSocketContext';
import RandomButtons from './RandomButtons';
import { Socket } from 'socket.io-client';
import BotButtons from './BotButtons';
import BotComponent from './botComponent';
import Loadig from './LoadingComponent';
import Score from './scoreComponent';
import { Vector } from 'matter-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { PropagateLoader } from 'react-spinners';
import Man from './Man';

interface Update{
	ball	:Vector
	p1		:Vector
	p2		:Vector
	ID		:number
	score1	:number
	score2	:number
}

interface Loading  {
    setLoading: Dispatch<SetStateAction<boolean>>;
	name: string;
	avatar: string;
};

let game: GameClass | null = null;

const GameButtons : React.FC<Loading> = (props) => {
    const router = useRouter()
    const socket :Socket = useContext(WebsocketContext);
	const gameDiv = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<string>('BEGINNER');
    const [wait, setWait] = useState<boolean>(false);
	const [waitmsg, setWaitMsg] = useState<string>('WAITTTTT')
    const [showBotGame, setShowBotGame] = useState(false)
    const [showRandomGame, setShowRandomGame] = useState(false)
	const [dep1, setDep1] = useState<[string, string]>(["", ""])
	const [dep2, setDep2] = useState<[string, string]>(["", ""])
	// const [name, setName] = useState<string>('You')
	// const [avatar, setAvatar] = useState<string>('http://res.cloudinary.com/dvmxfvju3/image/upload/v1700925320/wu4zkfcugvnsbykwmzpw.jpg')

	const [score, setScore] = useState<[number, number]>([0, 0])
	const [Id, setId] = useState<number>(0)

	const handlePlay = async (res: {gameId: string} & Update & {avatar: [string, string], names: [string, string]}) => {
		console.log("START");
		setDep1([res.avatar[0], res.names[0]])
		setDep2([res.avatar[1], res.names[1]])
		setId(res.ID);
		console.log("dep: ", res.avatar, res.names);

		console.log("gameid : ", res.gameId);
		setWait(false);
		setShowRandomGame(true);
		setTimeout(() => {
			console.log({ adiv: gameDiv.current })
			console.log("MAAAAAAP:::: ", map);

			game = new GameClass(gameDiv.current!, map, "RANDOM", res.gameId, socket);
			console.log("==> GAMEID CREATED: ", game.Id)
			game.startOnligneGame(res.p1, res.p2, res.ball, res.ID);
			game.updateScore(res.score1, res.score2);
			setScore([res.score1, res.score2])
			console.log({ showRandomGame })
		}, 200)
	};

	function removeGame() {
		setShowRandomGame(false);
		game?.destroyGame();
		game = null;
	}

	useEffect(()=>{console.log("MAP IN: ", map);
	}, [map])

	useEffect(()=>{
		if (!socket){
			console.log("ID: ", socket);
			router.push("/profile")
		}
		socket.on("START", handlePlay);

		socket.on("UPDATE", (res : Update)=> {
			game?.updateState(res.p1, res.p2, res.ball);
			// console.log("res: ", res);
			setScore([res.score1, res.score2])

			game?.updateScore(res.score1, res.score2);
		});
		socket.on("WinOrLose", (res:{content:  string}) => {
			console.log("WINORLOSE", res.content);
			removeGame();
			if(res.content === "win")
				notifyWin();
			else if (res.content === 'lose')
				notifyLose();
		} )

		socket.on("GAMEOVER", ()=>{
			console.log("GAMEOVER");
			removeGame();
			notifyGameOver();

		})

		socket.on("WAIT", (req: {map: string})=>{
			console.log("WAITTTTTT");
			setMap(req.map)
			setWait(true);

		})

		socket.on("ERROR", (res: string) => {
			console.log("ERROR BUTT", res);
		})

		socket.on("REDIRECT", (res: {url: string}) => {
			// window.location.href = url;
			console.log("REDIRECT : ", res.url);
			router.push(res.url)

		})

		// socket.on("CONNECTED", (res : {name: string, avatar: string})=>{
		// 	console.log("CONNECTED");
			
		// 	props.setLoading(false);
		// 	setName(res.name)
		// 	setAvatar(res.avatar)
		// })
		

		const notifyGameOver = () =>{
			toast.warn('Your Adverser Disconnected', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				});
		}

		const notifyWin= ()=> {
			toast.success('You Win', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				});
		}
		const notifyLose= ()=> {
			toast.error('You Lose', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				});
		}

		/**
		 * events: ERROR, GAMEOVER, CREATE, WAIT, UPDATE, PLAY
		*/
		return ()=>{
			console.log('remove game listeners')
			socket.off("REDIRECT")
			socket.off("CONNECTED")
			socket.off("CREATE");
			socket.off("PLAY")
			socket.off("START");
            socket.off("UPDATE");
			socket.off("WAIT")
			socket.off("GAMEOVER");
			socket.off("WinOrLose");
			socket.off("ERROR")
			console.log(showRandomGame, "usestate");

        }
    } , [socket,map, dep1]);

	useEffect(() => {
		return () => {
			console.log('remove game')
			removeGame();
		}
	}, [])

	// useEffect(() => {
	// 	// no-op if the socket is already connected
	// 	socket.connect();
	// 	console.log("HYYYYYY: ", socket.connected);
		

	// 	return () => {
	// 	  socket.disconnect();
	// 	};
	//   }, []);
	
    return (
		<div className='flex justify-center items-center w-full h-full flex-col '>
			{!showRandomGame && !showBotGame && !wait && (
			<>
					<BotButtons setShowBotGame={setShowBotGame} setMap={setMap}/>
					<RandomButtons setMap={setMap} />
					<Man/>
			</>
			)}
			{(showBotGame ) && <BotComponent name={props.name} avatar={props.avatar} map={map} setBotGame={setShowBotGame}></BotComponent>}
			{showRandomGame && (
				<div className="flex flex-col w-full h-full items-center">
					<div className='flex sm:flex-row flex-col w-full h-full justify-center items-center'>
						<div className="flex flex-col items-center justify-end">
							{
								showRandomGame && (Id === 1 ? <Score avatar={dep2[0]} name={dep2[1]} score={score[1]}></Score>
								: <Score avatar={dep1[0]} name={dep1[1]} score={score[0]}></Score>)
							}
						</div>
						<div ref={gameDiv} className={`flex justify-center w-[60%] h-[60%] ${!showRandomGame ? 'hidden' : ''}`}></div>
						<div className="flex flex-col items-center justify-start">
							{
								showRandomGame && (Id === 1 ? <Score avatar={dep1[0]} name={dep1[1]} score={score[0]}></Score>
								: <Score avatar={dep2[0]} name={dep2[1]} score={score[1]}></Score>)
							}
						</div>
					</div>
					<div >
						{ showRandomGame && game  &&  <button className="w-[200px] h-[50px] bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]" type="button" onClick={()=>{setShowRandomGame(false);socket.emit("EXITGAME", {gameId: game!.gameId});removeGame();}}>Cancel</button>}
					</div>
				</div>
			)}
			{((wait) && 
				// <div>
					<div className="text-white red flex flex-col justify-around items-center w-full h-[70%] xMedium:h-screen">
						<div className="m-auto flex flex-col justify-center items-center text-xl h-[30%]">
							<div className="top-[45%] left-[42%] medium:left-[45%] pb-5">  WAITING . . .</div>
							<div className="top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={wait} size={20} aria-label="Loading Spinner"/></div>
						</div>
						<div className='m-auto flex flex-col w-auto h-auto'>
							<button
								className=" bg-black text-[white] cursor-pointer text-base  px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]"
								type="button" onClick={()=>{setWait(false);socket.emit("EXITWAIT")}}>Cancel
							</button>
						</div>
					</div>
				// </div>
			)}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme="dark"
				/>
		</div>
  );
};

export default GameButtons;

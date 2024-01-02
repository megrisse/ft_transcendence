"use client";

import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import GameClass from "./GameClass";
import { WebsocketContext } from '../../Contexts/WebSocketContext';
import RandomButtons from './RandomButtons';
import { Socket } from 'socket.io-client';
import BotButtons from './BotButtons';
import BotComponent from './botComponent';
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
    const [map, setMap] = useState<string>('ADVANCED');
    const [wait, setWait] = useState<boolean>(false);
    const [showBotGame, setShowBotGame] = useState(false)
    const [showRandomGame, setShowRandomGame] = useState(false)
	const [dep1, setDep1] = useState<[string, string]>(["", ""])
	const [dep2, setDep2] = useState<[string, string]>(["", ""])

	const [score, setScore] = useState<[number, number]>([0, 0])
	const [Id, setId] = useState<number>(0)

	const handlePlay = async (res: {gameId: string} & Update & {avatar: [string, string], names: [string, string]}) => {
		setDep1([res.avatar[0], res.names[0]])
		setDep2([res.avatar[1], res.names[1]])
		setId(res.ID);
		setWait(false);
		setShowRandomGame(true);
		setTimeout(() => {
			game = new GameClass(gameDiv.current!, map, "RANDOM", res.gameId, socket);
			game.startOnligneGame(res.p1, res.p2, res.ball, res.ID);
			game.updateScore(res.score1, res.score2);
			setScore([res.score1, res.score2])
		}, 200)
	};

	function removeGame() {
		setShowRandomGame(false);
		game?.destroyGame();
		game = null;
	}

	useEffect(()=>{
		if (!socket)
			router.push("/profile")
		socket.on("START", handlePlay);

		socket.on("UPDATE", (res : Update)=> {
			game?.updateState(res.p1, res.p2, res.ball);
			setScore([res.score1, res.score2])

			game?.updateScore(res.score1, res.score2);
		});
		socket.on("WinOrLose", (res:{content:  string}) => {
			removeGame();
			if(res.content === "win")
				notifyWin();
			else if (res.content === 'lose')
				notifyLose();
		} )

		socket.on("GAMEOVER", ()=>{
			removeGame();
			notifyGameOver();

		})

		socket.on("WAIT", (req: {map: string})=>{
			setMap(req.map)
			setWait(true);

		})


		socket.on("REDIRECT", (res: {url: string}) => {
			router.push(res.url)

		})

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

        }
    } , [socket,map, dep1]);

	useEffect(() => {
		return () => {
			removeGame();
		}
	}, [])
	
    return (
		<div className='flex flex-col  justify-center items-center w-full h-full'>
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
							 <Score avatar={dep1[0]} name={dep1[1]} score={score[0]}></Score>
						</div>
						<div ref={gameDiv} className="relative flex w-[90%] h-[50%] medium:w-[60%] medium:h-[60%] justify-center"
						>
							<div 
								className="absolute inset-y-0 left-0 w-1/2 h-full opacity-0"
								onMouseDown={() => game?.setLeftPressed(true)}
								onMouseUp={() => game?.setLeftPressed(false)}
								onTouchStart={() => game?.setLeftPressed(true)}
								onTouchEnd={() => game?.setLeftPressed(false)}
							/>
							<div 
								className="absolute inset-y-0 right-0 w-1/2 h-full opacity-0"
								onMouseDown={() => game?.setRightPressed(true)}
								onMouseUp={() => game?.setRightPressed(false)}
								onTouchStart={() => game?.setRightPressed(true)}
								onTouchEnd={() => game?.setRightPressed(false)}
							/>
						</div>
						<div className="flex flex-col items-center justify-start">
							<Score avatar={dep2[0]} name={dep2[1]} score={score[1]}></Score>
						</div>
					</div>
					<div >
						{ showRandomGame && game  &&  <button className="w-[200px] h-[50px] bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]" type="button" onClick={()=>{setShowRandomGame(false);socket.emit("EXITGAME", {gameId: game!.gameId});removeGame();}}>Cancel</button>}
					</div>
				</div>
			)}
			{((wait) && 
				// <div>
					<div className="text-white flex flex-col justify-around items-center w-full h-[70%] xMedium:h-screen">
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

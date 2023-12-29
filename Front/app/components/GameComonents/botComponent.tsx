"use client"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import GameClass from './GameClass';
import Score from './scoreComponent';

interface BotMap{
    name: string
    avatar: string
    map: string
    setBotGame:  Dispatch<SetStateAction<boolean>>;
}

let game: GameClass | null = null;

const BotComponent : React.FC<BotMap> = (prop) => {
    const gameDiv = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (gameDiv && gameDiv.current)
            { game = new GameClass(gameDiv.current, prop.map, "BOT", "BOT"); console.log("GAMECLASS"); }
        console.log("offs: ", gameDiv.current?.offsetTop);
        
        return () => {
            if (game)
                game.destroyGame();
        }
    }, []);

    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className='flex sm:flex-row flex-col w-full h-full justify-center items-center'>
                <div className="flex flex-col items-center justify-end">
                     <Score avatar="/_next/image?url=%2Fbatman.png&w=3840&q=75" name="BATMAN" score={Infinity} />
                </div>
                <div 
                    ref={gameDiv} 
                    className="flex w-[60%] h-[60%] justify-center bg-white">
                </div>
                <div className="flex flex-col items-center justify-start">
                     <Score avatar={prop.avatar} name={prop.name} score={Infinity} />
                </div>
            </div>
            <div>
                <button
                    className="w-[200px] h-[50px] bg-black text-[white] cursor-pointer text-base m-2.5 px-5 py-2.5 rounded-[5px] border-[none] hover:bg-[#AF6915]"
                    type="button" onClick={()=>prop.setBotGame(false)}>
                        Cancel
                </button>
            </div>
        </div>
    );
};

export default BotComponent
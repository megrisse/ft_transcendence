import Modal from "../components/modal"
import React, { useEffect } from "react";
import { RootState, useAppDispatch } from "../store/store";
import { Action, fetchUserSettings } from "../Slices/userSettingsSlice";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Socket } from "socket.io-client";


type friends = {
  name : string;
  online : boolean;
  inGame : boolean;
  id    : string;
  socket : Socket;
}

type CardData = {
    title : string;
    socket : Socket;
};

type bodyData = {
  username : string;
}

function FriendsCard(props : CardData) {
    const dispatch = useAppDispatch();
    const data : friends[] = useSelector((state: RootState) => state.setuser.entity?.friends) as friends[]
    const user : string = useSelector((state: RootState) => state.setuser.entity?.user) as string
    function handleClick(endpoint: string | undefined, username: string) {
        if (!endpoint)
          return
        const bodyData : bodyData = {
          username : username,
        }
        dispatch(Action({endpoint : endpoint, bodyData : bodyData}));
      }
      let myMap = new Map<string, string>();
      myMap.set("Friends","removeFriend");
      useEffect(()=> {
        props.socket.on("invite", (username : string)=> {
          setTimeout(() => {
            dispatch(fetchUserSettings());
          }, 200);
        });
        return ()=> {
          props.socket.off("invite");
        }
       },[props.socket])
    return (
        <div className="w-[80%] md:w-1/4 h-[30%] flex flex-col m-5 p-5 items-center rounded-md bg-[#323232]">
            <div className="w-full flex flex-row justify-around ">
                <h3>{props.title}</h3>
                {props.title != "Friends" && <Modal content="+" title={props.title} socket={props.socket}/>}
            </div>
            <div className=" w-full h-[10%] flex flex-col">
             {data  && data?.map((user, index)=> {
                return (
                  <div key={index} className="w-full flex flex-row p-2 justify-between">
                    <div><Link href={`/profile/${user.id}`}>{user.name}</Link></div>
                    {user.online && !user.inGame && <div className="text-white rounded-sm truncate bg-green-600"><p >Online</p></div>}
                    {user.inGame && <div className="text-white rounded-full border bg-yellow-600"><p>InGame</p></div>}
                    {!user.online && !user.inGame &&  <div className="text-white rounded-full  bg-gray-600"><p>offline</p></div>}
                    <div><button className="text-red-600" onClick={() => handleClick(myMap.get(props.title), user.name)}>X</button></div>
                  </div>
                    )
                })}
            </div>
        </div>
    );
}


export default FriendsCard;
import Modal from "../components/modal"
import React from "react";
import { RootState, useAppDispatch } from "../store/store";
import { Action } from "../Slices/userSettingsSlice";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";

type CardData = {
    title : string;
    socket : Socket;
};

type bodyData = {
  username : string;
}

function BandCard(props : CardData) {
    const dispatch = useAppDispatch();
    const bandData : string[] = useSelector((state: RootState) => state.setuser.entity?.bandUsers as string[])
    
    function handleClick(endpoint: string | undefined, username: string) {
        if (!endpoint)
          return
        const bodyData : bodyData = {
          username : username,
        }
        dispatch(Action({endpoint : endpoint, bodyData : bodyData}));
      }
      let myMap = new Map<string, string>();
      myMap.set("BandUsers","unBanUser");
    return (
        <div className="w-[80%] md:w-1/4 h-[30%] flex flex-col m-5 p-5 items-center rounded-md bg-[#323232]">
            <div className="w-full flex flex-row justify-around ">
                <h3>{props.title}</h3>
                {props.title != "Friends" && <Modal content="+" title={props.title} socket={props.socket}/>}
            </div>
            <div className=" w-[50%] h-[10%] grid items-center">
             {bandData && bandData?.map((user, index)=> {
                return (
                    <div key={index} className="flex flex-row justify-around">
                        {user && <p>{user}</p>} 
                        {user && <button className="text-red-600" onClick={() => handleClick(myMap.get(props.title), user)}>X</button>}
                    </div>
                    )
                })}
            </div>
        </div>
    );
}


export default BandCard;
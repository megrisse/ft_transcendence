import Modal from "../components/modal"
import React from "react";
import { useAppDispatch } from "../store/store";
import { Action } from "../Slices/userSettingsSlice";

type CardData = {
    user : string;
    title : string;
    data : string[];
};

type bodyData = {
  username : string;
}

function Card(props : CardData) {
    const dispatch = useAppDispatch();
    function handleClick(endpoint: string | undefined, username: string) {
        if (!endpoint)
          return
        const bodyData : bodyData = {
          username : username,
        }
        console.log(`http://localhost:4000/Chat/${endpoint}`);
        dispatch(Action({endpoint : endpoint, bodyData : bodyData}));
      }
      let myMap = new Map<string, string>();
      myMap.set("BandUsers","unBanUser");
      myMap.set("Invitations","accepteInvite");
      myMap.set("Invitationsx","deleteInvite");
      myMap.set("Friends","removeFriend");
      console.log('ikhan: ',       props.data);
    return (
        <div className="w-[80%] md:w-1/4 h-[30%] flex flex-col m-5 p-5 items-center rounded-md bg-[#323232]">
            <div className="w-full flex flex-row justify-around ">
                <h3>{props.title}</h3>
                {props.title != "Friends" && <Modal content="+" title={props.title}/>}
            </div>
            <div className=" w-[50%] h-[10%] grid items-center">
             {props?.data  && props?.data?.map((user, index)=> {
                return (
                    <div key={index} className="flex flex-row justify-around">
                        {user && <p>{user}</p>} 
                        {props.title != "Invitations" && <button className="text-red-600" onClick={() => handleClick(myMap.get(props.title), user)}>X</button>}
                        {props.title == "Invitations" && <button className="text-red-600" onClick={() => handleClick(myMap.get(`${props.title}x`), user)}>X</button>}
                        {props.title == "Invitations" && <button className="text-red-600" onClick={() => handleClick(myMap.get(props.title), user)}>Y</button>}
                    </div>
                    )
                })}
            </div>
        </div>
    );
}


export default Card;
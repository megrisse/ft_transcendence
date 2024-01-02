'use client';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import React, { useEffect, useState } from 'react';
import { addInvitation, fetchUserSettings } from "../Slices/userSettingsSlice";
import FriendsCard from "./FriendsCard";
import {socket} from "./userSettings.socket"
import BandCard from "./band.card";
import InviteCard from "./invite.card";

type friends = {
    name : string;
    online : boolean;
    inGame : boolean;
    id      : string;
}

export type userSettingsData = {
    user :      string;
    invitations : string[];
    friends     : friends[];
    bandUsers   : string[];
};
 
function UserSettings() {
    const [data, SetReceived] = useState<string[]>([])
    const dispatch = useAppDispatch()
    useEffect(()=> {
        socket.connect();
        return ()=> {
            socket.disconnect();
        }
    },[])
    // useEffect(() => {

    // },[])
    // useEffect(()=> {
    //     socket.on("invite", (username : string)=> {
    //         // SetReceived([...])
    //         // console.log("recieved : ", username);
    //     });
    //     return ()=> {
    //       socket.off("invite");
    //     }
    //    },[socket])
    const userSettingsData : userSettingsData | null = useSelector((state: RootState) => state.setuser.entity)
    return (
             <div className="h-full w-full flex md:flex-row flex-col items-center justify-around min-w-1179px max-w-1179px">
                {/* <FriendsCard title="Friends" user={userSettingsData?.user as string} socket={socket}/>
                <BandCard title="BandUsers" user={userSettingsData?.user as string} socket={socket}/>
                <InviteCard title="Invitations" user={userSettingsData?.user as string} socket={socket}/> */}
                <FriendsCard title="Friends"socket={socket}/>
                <BandCard title="BandUsers" socket={socket}/>
                <InviteCard title="Invitations" socket={socket}/>
            </div>
    );
}

export default UserSettings;
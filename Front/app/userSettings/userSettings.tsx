'use client';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import Card from "./Card";
import React, { useEffect, useState } from 'react';
import { fetchUserSettings } from "../Slices/userSettingsSlice";
import FriendsCard from "./FriendsCard";

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
    // const dispatch = useAppDispatch();
    const userSettingsData : userSettingsData | null = useSelector((state: RootState) => state.setuser.entity)
    
    // const fetchInfo = () => { 
    //     return fetch("http://localhost:4000/Chat/userSettings", {
    //         method : "GET",
    //         credentials : 'include'
    //     }) 
    //             .then((res) => res.json()) 
    //             .then((d) => 
    //             {
    //                 console.log(d);
    //             }).catch((error) => {
    //                 console.error('Error:', error);
    //             })
    //     }
        
        // useEffect(() => {
            // dispatch(fetchUserSettings());
        // }, [dispatch])
        // console.log("fetched Data : ", userSettingsData);
    return (
             <div className="h-full w-full flex md:flex-row flex-col items-center justify-around min-w-1179px max-w-1179px">
                <FriendsCard title="Friends" user={userSettingsData?.user as string}/>
                <Card data={userSettingsData?.bandUsers as string[]} title="BandUsers" user={userSettingsData?.user as string}/>
                <Card data={userSettingsData?.invitations as string[]} title="Invitations" user={userSettingsData?.user as string}/>
            </div>
    );
}

export default UserSettings;
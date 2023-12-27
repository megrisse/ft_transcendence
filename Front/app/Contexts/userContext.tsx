'use client'
import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

export type User = {
  name: string;
  userName:string;
  rank: number;
  level: number;
}

export interface interUserCxt {
    user: User,
    test: (user: User) => void
}


const defaultUser = {
    user: {
        name: '',
        userName: '',
        rank: 0.0,
        level: 0.0
    },
    test: (user: User) => {},
} as interUserCxt

export const userContext = createContext(defaultUser);

type userProviderProps = {children: ReactNode}

export default function UserProvider ({children}: userProviderProps){


    
    const [user, setUser] = useState<User>({
        name: '',
        userName: '',
        rank: 0.0,
        level: 0.0
    });

    const test = (user: User) => {
        console.log('yes im in the pooker face');
        console.log(user);
        
        
        setUser(user)
    }
    
    return (
        <userContext.Provider value={{user, test}}>
            {children}
        </userContext.Provider>
    )
}
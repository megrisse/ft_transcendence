import { createSlice } from "@reduxjs/toolkit";


export type User = {
    name: string;
    userName: string;
    rank: number;
    level: number;
}

const initialState: User = (() => {
    return {
        name: 'CAAAKKK',
        userName: 'XXMCC',
        rank: 13.0,
        level: 6.0
    }
})()

interface UserPayload {
    type: string,
    payload: User | string;
}

const userSlice2 = createSlice({
    name: 'user', initialState, reducers: {
        changUser: (state, payload: UserPayload) => {
            console.log(payload);
            state = payload.payload as User ;
            return state
        }
    }
})


export const {actions: UserActions} = userSlice2

export default userSlice2
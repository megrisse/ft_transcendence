import { createAsyncThunk ,createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store/store';
import { log } from 'console'
import axios from 'axios';
import { userInfo } from 'os';
import { getCookies } from 'cookies-next';
import { cookies } from 'next/headers';
import { Cookies } from 'react-cookie';

interface UserData {
  id: number;
  name: string;
  username: string;
  rank: number;
  level: number;
  avatar: string;
  IsEnabled?: boolean
}

interface MatchHIst {
  id: number;
  playerAId:number;
  playerBId:number;
  playerAAvatar:string;
  playerBAvatar:string;
  playerAUsername:string;
  playerBUsername:string;
  playerBScore:number;
  playerAScore:number;
}

interface Achievs {
  title : string;
  unlocked : boolean;
  icon : string;
}

export interface UserInfos {
  userData: UserData;
  matches: MatchHIst[];
  achievements: Achievs[];

}


// export const initialState: userState = {
//   user_Data: {
//     id: 0,
//     name: '',
//     userName: '',http://localhost:3000/_next/image?url=%2Fgsus.jpeg&w=640&q=75
//     rank: 0,
//     level: 0,
//     avatar: '',
//   },
//   loading: false,
//   error: null,
// }
// const UserInfo:UserInfos = {
//   name: 'hassaaaaaaan',
//   userName: '',
//   rank: 0,
//   level: 0,
//   pathImg: '',
// }


// export interface tInitialState  {
//   userInfo: UserInfos;
//   status: string;
//   error: any;
// }

// export const initialState:tInitialState = {
//   userInfo: UserInfo,
//   status: 'none',
//   error: null
// }

//const initialState = {
//  entity: [],
//} as any;


const initialState:{entity: null | UserInfos ; loading: boolean; error: null | string } = {
  entity: null,
  loading: true,
  error: null,
};

  export const fetchInfos = createAsyncThunk("user/fetch", async (thunkApi) => {

    const response = await axios.get('http://localhost:4000/Profile', {withCredentials: true });
    if (response.status === 401){
      console.log('Eroororororo 401');
    }
    if (response.status === 200) {
      console.log('Data getted successfully:', response.data);
      console.log("status = ", response.headers["set-cookies"]);
      return (response.data);
    }else {
      console.error('Data getting failed:', response.data);
    }
  } )

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserNameValue: (state, action: PayloadAction<string>) => {
      if (state.entity && state.entity.userData) {
        state.entity.userData.username = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUserImage: (state, action: PayloadAction<string>) => {
      if (state.entity && state.entity.userData) {
        state.entity.userData.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInfos.fulfilled, (state, action) => {
        state.entity = action.payload;
        console.log("data received : ", state.entity);
        if (state.entity !== undefined)
          state.loading = false;
      })
      .addCase(fetchInfos.rejected, (state, action) => {
        state.loading = false;
        console.log("slice error ==> ", action.error.message);
        state.error = action.error.message || 'Something went wrong !';
      });
  },
});


// export const { addInfos } = userSlice.actions;
export default userSlice.reducer;
export const { updateUserNameValue, updateUserImage } = userSlice.actions;
export const { setLoading } = userSlice.actions;


// export const selectUser = (state: RootState) => state.user.user_Data
// export const selectLoading = (state: RootState) => state.user.loading
// export const selectError = (state: RootState) => state.user.error


import { createAsyncThunk ,createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserData {
  id: number;
  name: string;
  username: string;
  rank: number;
  level: number;
  avatar: string;
  IsEnabled?: boolean;
  isAuth: boolean;
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

const initialState:{entity: null | UserInfos ; loading: boolean; error: null | string } = {
  entity: null,
  loading: true,
  error: null,
};

  export const fetchInfos = createAsyncThunk("user/fetch", async (thunkApi) => {

    const response = await axios.get('http://localhost:4000/Profile', {withCredentials: true });
    if (response.status === 200) {
      return (response.data);
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
    updateUser2FaValue: (state, action: PayloadAction<boolean>) => {
      if (state.entity && state.entity.userData) {
        state.entity.userData.IsEnabled = action.payload;
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
        if (state.entity !== undefined)
          state.loading = false;
      })
      .addCase(fetchInfos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong !';
      });
  },
});

export default userSlice.reducer;
export const { updateUserNameValue, updateUserImage, updateUser2FaValue } = userSlice.actions;
export const { setLoading } = userSlice.actions;
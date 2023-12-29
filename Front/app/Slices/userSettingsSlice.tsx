import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


type friends = {
  name : string;
  online : boolean;
  inGame : boolean;
  id    : string;
}

type userSettingsData = {
   user :     string;
   invitations : string[];
   friends    : friends[];
   bandUsers  : string[];
};

type bodyData = {
  username : string;
}

export const fetchUserSettings = createAsyncThunk('setuser/fetch',async (thunkAPI) => {
  const response = await axios.get('http://localhost:4000/Chat/userSettings', {withCredentials: true });
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



export const Action = createAsyncThunk(
   'setuser/action',
   async ({endpoint, bodyData} : {endpoint : string, bodyData : bodyData}, thunnkAPi) => {
      try {
        const response = await fetch(`http://localhost:4000/Chat/${endpoint}`, {
          method: 'POST', 
          mode: 'cors',
          credentials : 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData)
        })
        let res = await response.json();
        return res;
      }
      catch (error) {
        throw error;
      }
    }
);

const initialState: {entity: null | userSettingsData ; loading: boolean; error: null | string } = {
  entity:null,
  loading:true,
  error: null

} ;

const userSettingSlice = createSlice({
 name: 'setuser',
 initialState,
 reducers: {
  //  setUserSettings: (state, action: PayloadAction<{entity: null | userSettingsData ; loading: boolean; error: null | string }>) => {
  //    state.entity?.bandUsers =  action.payload.entity;
  //  },
 },
 extraReducers: (builder) => {
    builder
    .addCase(fetchUserSettings.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(fetchUserSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.entity = action.payload;
    })
    .addCase(fetchUserSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'User settings error !';
      console.error('Error:', action.error);
    })
    .addCase(Action.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.action == "unBan") {
        let index : number = state.entity?.bandUsers.indexOf(action.payload.username) as number
        state.entity?.bandUsers.splice(index, 1);
      }
      else if (action.payload.action == "addFriend") {
        let index : number = state.entity?.invitations.indexOf(action.payload.username) as number
        state.entity?.invitations.splice(index, 1);
        state.entity?.friends.push({name : action.payload.username, online : false, inGame : false, id : action.payload.id});
      }
      else if (action.payload.action == "removeFriend") { // modify this part
        let index : number = state.entity?.friends.indexOf(action.payload.username) as number
        state.entity?.friends.splice(index, 1);
      }
      else if (action.payload.action == "deleteInvite") {
        let index : number = state.entity?.invitations.indexOf(action.payload.username) as number
        state.entity?.invitations.splice(index, 1);
      }
      else if (action.payload.action == "Ban") {
        let index : number = state.entity?.friends.indexOf(action.payload.username) as number
        state.entity?.friends.splice(index, 1);
        state.entity?.bandUsers.push(action.payload.username);
      }
    });
   },

});

// export const { setUserSettings } = userSettingSlice.actions;

export default userSettingSlice.reducer;

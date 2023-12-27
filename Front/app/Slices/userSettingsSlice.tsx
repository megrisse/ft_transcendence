import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';


type friends = {
  name : string;
  online : boolean;
  inGame : boolean;
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

export const fetchUserSettings = createAsyncThunk(
 'user/fetch',
 async (thunkAPI) => {
 try {
   const response = await fetch(`http://localhost:4000/Chat/userSettings`, {
     method: 'GET',
     credentials: 'include'
   });
   const responseData = await response.json();
   console.log("userSettings data : ", responseData);
   return responseData.data;
 } catch (error) {
   console.error('Error:', error);
   throw error;
 }
 }
);


export const Action = createAsyncThunk(
   'user/action',
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

const userSlice = createSlice({
 name: 'user',
 initialState: {
   user: "",
   friends: [],
   bandUsers: [],
   invitations : []
 } as userSettingsData,
 reducers: {
   setUserSettings: (state, action: PayloadAction<userSettingsData>) => {
     return action.payload;
   },
 },
 extraReducers: (builder) => {
    builder
    .addCase(fetchUserSettings.fulfilled, (state, action) => {
      return action.payload;
    })
    .addCase(fetchUserSettings.rejected, (state, action) => {
      console.error('Error:', action.error);
    })
    .addCase(Action.fulfilled, (state, action) => {
      if (action.payload.action == "unBan") {
        let index = state.bandUsers.indexOf(action.payload.username)
        state.bandUsers.splice(index, 1);
      }
      else if (action.payload.action == "addFriend") {
        let index = state.invitations.indexOf(action.payload.username)
        state.invitations.splice(index, 1);
        state.friends.push({name : action.payload.username, online : false, inGame : false});
      }
      else if (action.payload.action == "removeFriend") { // modify this part
        let index = state.friends.indexOf(action.payload.username)
        state.friends.splice(index, 1);
      }
      else if (action.payload.action == "deleteInvite") {
        let index = state.invitations.indexOf(action.payload.username)
        state.invitations.splice(index, 1);
      }
      else if (action.payload.action == "Ban") {
        let index = state.friends.indexOf(action.payload.username)
        state.friends.splice(index, 1);
        state.bandUsers.push(action.payload.username);
      }
    });
   },

});

export const { setUserSettings } = userSlice.actions;

export default userSlice.reducer;

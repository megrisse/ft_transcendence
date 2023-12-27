//channelSlice.tsx
import { createAction, createAsyncThunk ,createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from '../store/store';
import { log } from 'console';

export interface Channel {
    channelName: string;
    users: string[];
    admins: string[];
    bandUsers: string[];
    mutedUsers: string[];
}
interface ChannelState {
    channels: Channel[];
    loading: boolean;
    selectedChannel: Channel;
    error : string;
   }

const initialState = {
    channelName: '',
    users: [],
    admins: [],
    bandUsers: [],
    mutedUsers: [],
    loading: true,
    channels: [] as Channel [],
    selectedChannel: {} as Channel,
    error : '',
   };
   interface ChannelCreate {
    name: string;
    password: string;
    isPrivate: boolean;
    isProtected: boolean;
   }
  
   interface ChannelCreatedAction {
    type: 'CHANNEL_CREATED';
    payload: ChannelCreate; // replace 'any' with the actual type of 'data'
   }

   
 
     const ChannelSlice = createSlice({
       name: 'Channel',
       initialState,
       reducers: {
         setChannels: (state, action: PayloadAction<Channel[]>) => {
             state.channels = action.payload;
             state.loading = false;
             console.log('Channel setChannelsss:', action.payload);
           },
           setSelectedChannel: (state, action: PayloadAction<Channel>) => {
                state.selectedChannel = action.payload;
        
               console.log('Channel data from bolaaalabla:', action.payload);
           }
     
       },
       extraReducers: (builder) => {
         builder
         // FETCH CHANNEL DATA_____________________________________________________________________________________________________
           .addCase(fetchChannelData.pending, (state) => {
             state.loading = true;
           })
           .addCase(fetchChannelData.fulfilled, (state, action) => {
             state.channels = action.payload;
             
             state.loading = false;
            })
            .addCase(fetchChannelData.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message!;
            })
            // CREATE CHANNEL++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            .addCase(createChannel.pending, (state) => {
             state.loading = true;
           })
           .addCase(createChannel.fulfilled, (state,action) => {
             state.channels = [...state.channels,action.payload];
             console.log("action payload create channel",action.payload);
             
             state.loading = false;
            })
            .addCase(createChannel.rejected, (state, action) => {
              state.loading = false;
              if (action.error.message !== undefined) {
                state.error = action.error.message;
            }
            })
            // REMOVE USER FROM CHANNEL-----------------------------------------------------------------------------------
            .addCase(removeUserFromChannel.pending, (state, action) => {
              state.loading = true;
            })
            .addCase(removeUserFromChannel.fulfilled, (state, action) => {
              state.loading = false;
              const UserIndex = state.selectedChannel.users.indexOf(action.payload);
                 const adminIndex = state.selectedChannel.admins.indexOf(action.payload);
                 const bandindex = state.selectedChannel.bandUsers.indexOf(action.payload);
                 const mutedindex = state.selectedChannel.mutedUsers.indexOf(action.payload);
              if (adminIndex !== -1) {
                state.selectedChannel.admins.splice(adminIndex, 1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.admins.splice(adminIndex,1);
              }
              if (bandindex !== -1) {
                state.selectedChannel.bandUsers.splice(bandindex, 1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.bandUsers.splice(bandindex,1);
              }
              if (mutedindex !== -1) {
                state.selectedChannel.mutedUsers.splice(mutedindex, 1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.mutedUsers.splice(mutedindex,1);
              }
              if (UserIndex !== -1) {
                state.selectedChannel.users.splice(UserIndex, 1);}
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.splice(UserIndex,1);
            })
            .addCase(removeUserFromChannel.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message!;
            })
            //UNBAN USER FROM CHANNEL-----------------------+---------------------------------------------------------------
            .addCase(unBanUserFromChannel.pending, (state, action) => {
              state.loading = true;
            })
            .addCase(unBanUserFromChannel.fulfilled, (state, action) => {
              state.loading = false;
              const userBannedIndex = state.selectedChannel.bandUsers.indexOf(action.payload);
              if (userBannedIndex !== -1) {
                state.selectedChannel.bandUsers.splice(userBannedIndex, 1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.bandUsers.splice(userBannedIndex,1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.push(action.payload)
                state.selectedChannel.users = [...state.selectedChannel.users,action.payload];
              }
              const userfind = state.selectedChannel.users.indexOf(action.payload);
              if (userfind === -1)
              {
                state.selectedChannel.users.push(action.payload);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.push(action.payload)

              }
            })

            .addCase(unBanUserFromChannel.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message!;
            })
            //BANNNN USER FROM CHANNEl
                  .addCase(BanUserFromChannel.pending, (state, action) => {
                    state.loading = true;
                  })
                  .addCase(BanUserFromChannel.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("ban user action payloadDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD" , action.payload);
                    const adminIndex = state.selectedChannel.admins.indexOf(action.payload);
                    if (adminIndex !== -1) {
                      state.selectedChannel.admins.splice(adminIndex, 1);
                      state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.admins.splice(adminIndex,1);
                    }
                        const userIndexx = state.selectedChannel.users.indexOf(action.payload);
                        if (userIndexx !== -1) {
                          state.selectedChannel.users.splice(userIndexx, 1);
                          state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.splice(userIndexx,1)
                        }
                        state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.bandUsers.push(action.payload);
                        state.selectedChannel.bandUsers = [...state.selectedChannel.bandUsers,action.payload];

                  
                  })
                  .addCase(BanUserFromChannel.rejected, (state, action) => {
                    console.log("action error", action.error.message);
                    state.loading = false;
                    state.error = action.error.message!; 
                  })
            // UNMUTE USER FROM CHANNEL--------------------------------------------------------------------------------
            .addCase(muteFromChannel.pending, (state, action) => {
              state.loading = true;
            })
            .addCase(muteFromChannel.fulfilled, (state, action) => {
                  state.loading = false;
              // const muteuserIndexx = state.selectedChannel.users.indexOf(action.payload);
              // if (muteuserIndexx !== -1) {
                // state.selectedChannel.users.splice(muteuserIndexx, 1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.mutedUsers.push(action.payload);
                // state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.splice(muteuserIndexx,1)
                state.selectedChannel.mutedUsers = [...state.selectedChannel.mutedUsers,action.payload];
              // }
            })
            .addCase(muteFromChannel.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message!;
            })
            // UNADMIN USER FROM CHANNEL----------------------------------------------------
            .addCase(unAdminFromChannel.pending, (state, action) => {
              console.log("KANNN HNAYA");
              
              state.loading = true;
            })
            .addCase(unAdminFromChannel.fulfilled, (state, action) => {
              console.log("unadmin user from channel action. payload: ```````````````````````````````````````````` " + action.payload);
              state.loading = false;
              const adminIndex = state.selectedChannel.admins.indexOf(action.payload);
              console.log("addddddmmmmiiinnn indeeecxxxxx",adminIndex);
              
              if (adminIndex !== -1) {
                state.selectedChannel.admins.splice(adminIndex, 1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.admins.splice(adminIndex,1);
              }
              
              const userfind = state.selectedChannel.users.indexOf(action.payload);
              if (userfind === -1)
              {
                state.selectedChannel.users.push(action.payload);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.push(action.payload)

              }
                // state.selectedChannel.users = [...state.selectedChannel.users,action.payload];
            })
            .addCase(unAdminFromChannel.rejected, (state, action) => {
              console.log("action error", action.error.message);
              
              state.loading = false;
              state.error = action.error.message!;
            })
            //admin admin user to chnnel
            .addCase(addAdminToChannel.pending, (state, action) => {
              console.log("KANNN HNAYA");
              
              state.loading = true;
            })
            .addCase(addAdminToChannel.fulfilled, (state, action) => {
              console.log("add admin user from channel action. payload: ```````````````````````````````````````````` " + action.payload);
              state.loading = false;
              const addadminIndex = state.selectedChannel.users.indexOf(action.payload);
              if (addadminIndex !== -1) {
                // state.selectedChannel.users.splice(addadminIndex, 1);
                state.selectedChannel.admins = [...state.selectedChannel.admins,action.payload];
                // state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.splice(addadminIndex,1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.admins.push(action.payload)
              }
              const userfind = state.selectedChannel.users.indexOf(action.payload);
              if (userfind !== -1)
              {
                state.selectedChannel.users.splice(userfind,1);
                state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.splice(userfind,1)

              }
            })
            .addCase(addAdminToChannel.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message!;
            })
            //ADD USER TO CHANNEL
            .addCase(addUserFromChannel.pending, (state, action) => {
              console.log("KANNN HNAYA");
              
              state.loading = true;
            })
            .addCase(addUserFromChannel.fulfilled, (state, action) => {
              console.log("AAAAAAADDDDDDD user from channel action. payload: ```````````````````````````````````````````` " + action.payload);
              state.loading = false;
              const userIndex = state.selectedChannel.users.indexOf(action.payload);
              if (userIndex == -1) {
                state.selectedChannel.users = [...state.selectedChannel.users,action.payload];
              }
              state.channels.find((ch) => ch.channelName === state.selectedChannel.channelName)?.users.push(action.payload)
            })
            .addCase(addUserFromChannel.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message!;
            })
            .addCase(clearError, (state) => {
              state.error = '';
            });
            ;
       },
     });

     export const clearError = createAction('Channel/clearError');
export const fetchChannelData = createAsyncThunk("Channel/fetch", async (thunkApi) => {
  try {
    const response = await fetch("http://localhost:4000/Chat/channelSettings", {
      method: "GET",
      credentials: 'include',
    });
    const data = await response.json();
    console.log('Channel data from server:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Channel Channel data:', error);
    throw error;
  }
})

export const removeUserFromChannel = createAsyncThunk(
    'Channel/removeUser',
    async ({ username, channelName }: { username: string; channelName: string }) => {
      const response = await fetch(`http://localhost:4000/Chat/kick`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, channelName }),
      });
      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else if (response.status === 400) {
        throw new Error('Unauthorized action');
      }
    }
   );
   export const addUserFromChannel = createAsyncThunk(
    'Channel/addUser',
    async ({ username, channelName }: { username: string; channelName: string }) => {
      const response = await fetch(`http://localhost:4000/Chat/AddUserToChannel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, channelName }),
      });
      const data = await response.json();
      console.log("add user to channel ", data);
      if (response.status === 200) {
        return data;
      } else if (response.status === 400) {
        throw new Error(`Unauthorized action ${username}`);
      }
    }
   );


   export const unBanUserFromChannel = createAsyncThunk(
    'Channel/unBanUser',
    async ({ username, channelName }: { username: string; channelName: string }) => {
    const response = await fetch(`http://localhost:4000/Chat/unBanUserFromChannel`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, channelName }),
    });
    const data = await response.json();
    
    if (response.status === 200) {
      return data;
    } else if (response.status === 400) {
      throw new Error('Unauthorized action');
    }
    }
   );


   async function banUserFromChannel(username:string , channelName:string) {
    const response = await fetch(`http://localhost:4000/Chat/BanUserFromChannel`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, channelName }),
    });
    const clonedResponse = response.clone();
    console.log("response .... : ", clonedResponse.json());
    console.log("response status bannn userr",response.status)
   
    if (!response.ok) {
      throw new Error(`Unauthorized action ${username}`);
    }
   
    return response.json();
   }
   
   export const BanUserFromChannel = createAsyncThunk(
    'Channel/BanUser',
    async ({ username, channelName }: { username: string; channelName: string }) => {
      try {
        const data = await banUserFromChannel(username, channelName);
       
        return data;
      } catch (error) {
        console.error("Error banning user", error);
        throw error;
      }
    }
   );
   

   export const muteFromChannel = createAsyncThunk(
    'Channel/muteUser',
    async ({ username, channelName }: { username: string; channelName: string }) => {
    const response = await fetch(`http://localhost:4000/Chat/mute`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, channelName }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else if (response.status === 400) {
      throw new Error(`Unauthorized action ${username}`);
    }
    }
   );

   export const unAdminFromChannel = createAsyncThunk(
    'Channel/unAdmin',
    async ({ username, channelName }: { username: string; channelName: string }) => {
      console.log("wwwwwwwowowowoowowowowowoowowoowowowoowowoowowowoowowoow usernasme" ,username, "channel name", channelName);
    const response = await fetch(`http://localhost:4000/Chat/RemoveAdminFromChannel`, {
     method: 'POST',
     mode: 'cors',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ username, channelName }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else if (response.status === 400) {
      throw new Error('Unauthorized action');
    }
    }
   );

   export const addAdminToChannel = createAsyncThunk(
    'Channel/Admin',
    async ({ username, channelName }: { username: string; channelName: string }) => {
      console.log("add admin to channel usernasme" ,username, "channel name", channelName);
    const response = await fetch(`http://localhost:4000/Chat/addAdminToChannel`, {
     method: 'POST',
     mode: 'cors',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ username, channelName }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else if (response.status === 400) {
      throw new Error('Unauthorized action');
    }
    }
   );
   export const  addPasswordToChannel =   createAsyncThunk( 
    'Channel/addPassword',
    async({channelName, password}: {channelName: string; password: string}) => {
      const response = await fetch(`http://localhost:4000/Chat/addPasswordToChannel`,{
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({channelName: channelName, password: password},)
      });
      const data = await response.json();
      if (response.status === 200)
        return data;
      else if (response.status === 400)
        throw new Error('Unauthorized action');
    }
    );
    export const  removePasswordFromChannel = createAsyncThunk(
      'Channel/removePasword',
      async({channelName}: {channelName: string}) =>{
        const response = await fetch(`http://localhost:4000/Chat/removePasswordToChannel`, {
          method : 'POST',
          mode : 'cors',
          credentials : 'include',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({channelName: channelName})
        });
        const data = await response.json();
        if (response.status === 200)
          return (data);
        else if (response.status === 400)
          throw new Error('Unthorized action');
      })
    ;

   export const createChannel = createAsyncThunk(
    'Channel/createChannel',
    async ({ name, password, isPrivate, isProtected }: ChannelCreate) => {
      const response = await fetch('http://localhost:4000/Chat/createChannel', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password, isPrivate, isProtected }),
      });
      const data = await response.json();
      if (response.status === 200) {
        return data;
      } else if (response.status === 400) {
        throw new Error('Unauthorized action');
      }
    }
   );
   

   export const { setChannels } = ChannelSlice.actions;
   
   export const { setSelectedChannel } = ChannelSlice.actions;

export default ChannelSlice.reducer;
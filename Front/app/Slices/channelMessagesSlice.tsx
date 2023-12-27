//channelSlice.tsx
import { createAsyncThunk ,createSlice, PayloadAction } from '@reduxjs/toolkit'
import { STATUS_CODES } from 'http';
import store from "../store/store"
import { channelSearchType } from '../components/channelSearch';

type channelNames = {
    channels: channelConversation[],
    username : string
   };
   
type channelConversation = {
    channelName : string,
    messages : channelMessages[]
};

   type channelMessages = {
    userId :  string,
    sender : string,
    content : string,
    channelName : string
   }

   export const leaveChannel = createAsyncThunk(
    'channel/leave',
    async (channelName: string, thunkAPI) => {
     try {
       const response = await fetch(`http://localhost:4000/Chat/leaveChannel`, {
         method: 'POST',
         mode: 'cors',
         credentials: 'include',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           "channelName": channelName
         })
       });
       const responseData = await response.json();
       return responseData;
     } catch (error) {
       console.error('Error:', error);
       throw error;
     }
    }
   );
   

   export const joinChannel = createAsyncThunk(
    'channel/join',
    async ({data, password} : {data: channelSearchType, password: string}, thunkAPI) => {
     try {
       const response = await fetch(`http://localhost:4000/Chat/joinChannel`, {
         method: 'POST',
         mode: 'cors',
         credentials: 'include',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           "channelName": data.name,
           "password": password
         })
       });
       const responseData = await response.json();
       return responseData;
     } catch (error) {
       console.error('Error:', error);
       throw error;
     }
    }
   );
   
   

   export const fetchChannelData = createAsyncThunk("channel/fetch", async (thunkApi) => {
    try {
        const response = await fetch("http://localhost:4000/Chat/channel", {
          method: "GET",
          credentials: 'include',
        });
        const data = await response.json();
        // console.log('Chat data from server:', data);
        return data;
      } catch (error) {
        console.error('Error fetching chat chat data:', error);
        throw error;
      }
})   
   
const initialState:{entity:channelNames, loading : boolean, error : string} = {
    entity: {
        channels : [],
        username : ''
    },
    loading : true,
    error : ''
  };

const channelMessagesSlice = createSlice({
  name: 'channelMessages',
  initialState,
  reducers: {
    updateChannelMessages: (state, action) => {
        const { channelName, messages } = action.payload;
        const channel = state.entity.channels.find(channel => channel.channelName === channelName);
        if (channel) {
          channel.messages = messages;
        }
      },
      addMessageToChannel : (state, action) => {
        const message: channelMessages  = action.payload;
        console.log('got here ....');
        state.entity.channels.find(channel => channel.channelName === message.channelName)?.messages.push(message);  
        console.log(state.entity.channels);
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelData.fulfilled, (state, action) => {
        state.entity = action.payload;
        state.loading = false;
      })
      .addCase(fetchChannelData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong !';
      })
      .addCase(joinChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        if (action.payload != "can't join") {
          state.entity.channels.push({
            channelName : action.payload,
            messages : [],
          })
          state.loading = false;
        }
      })
      .addCase(joinChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong !';
      })
      .addCase(leaveChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        // let index = state.entity.channels.indexOf({channelName : action.payload, messages : []})
        let index : number = 0;
        for (; index < state.entity.channels.length ; index++) {
          if (state.entity.channels[index].channelName == action.payload) {
            break ;
          }
        }
        state.entity.channels.splice(index, 1);
        state.loading = false;
      })
      .addCase(leaveChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong !';
      });
  },
});


export const { updateChannelMessages } = channelMessagesSlice.actions;
export const { addMessageToChannel } = channelMessagesSlice.actions;

// export const { addInfos } = chatSlice.actions;
export default channelMessagesSlice.reducer;
// export const selectUser = (state: RootState) => state.user.user_Data
// export const selectLoading = (state: RootState) => state.user.loading
// export const selectError = (state: RootState) => state.user.error


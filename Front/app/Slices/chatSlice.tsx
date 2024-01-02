import { createAsyncThunk ,createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Message {
  avatar: string,
  content: string;
  sender: string;
  reciever:string;
  senderId: string;
  recieverId:string;
  isOwner: boolean;
  conversationId: string;
  date: number
}

export interface Conversation {
  id: number;
  online: boolean;
  username: string;
  avatar: string;
  owner:string;
  timestamp?: number;
  messages: Message[];
  senderId: string;
  Conversationid: string;
  recieverId:string;
  sender: string;
  reciever:string;
}

const initialState:{entity:Conversation []; loading: boolean; error: null | string } = {
  entity: [],
  loading: true,
  error: null,
};


export const fetchChatData = createAsyncThunk("chat/fetch", async (thunkApi) => {

  const response = await axios.get('http://localhost:4000/Chat/user', {withCredentials: true });

  if (response.status === 200) {
    return (response.data);
  }
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addNewConv: (state, action: PayloadAction<{Conversation: Conversation}>) => {
      for (let index : number = 0; index < state.entity.length; index++) {
        if (state?.entity[index]?.Conversationid === action.payload.Conversation?.Conversationid) {
          state.entity[index].messages = action.payload.Conversation?.messages;
          state.entity[index].timestamp = action.payload.Conversation?.timestamp;
        }
      }
    },
    addMessage: (state, action: PayloadAction<{ convId: string, message: Message }>) => {
     const conversation = state.entity.find(conv => conv.Conversationid === action.payload.convId);
     if (conversation){
      conversation.messages.push(action.payload.message);
     }
    },
    
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.entity = action.payload;
        if (state.entity !== undefined)
          state.loading = false;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message || 'Something went wrong !';
      });
  },
});

export default chatSlice.reducer;
export const { addMessage, addNewConv } = chatSlice.actions;

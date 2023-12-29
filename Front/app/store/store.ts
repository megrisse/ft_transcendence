import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../Slices/userSlice'
import chatReducer from '../Slices/chatSlice'
import { useDispatch } from 'react-redux';
import channelMessagesSlice from '../Slices/channelMessagesSlice';
import  userSettingsReducer from '../Slices/userSettingsSlice';
import channelReducer from "../Slices/channelSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        channelMessages : channelMessagesSlice,
        setuser : userSettingsReducer,
        channel: channelReducer,
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
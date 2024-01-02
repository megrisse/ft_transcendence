// import React, { useEffect } from 'react'
// import Image from 'next/legacy/image'
// import Link from 'next/link'
// import axios from 'axios';
// import { GoPerson, GoTrophy } from "react-icons/go";
// import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
// import { IoSettingsOutline } from "react-icons/io5";
// import { useRouter } from 'next/navigation';
// import { BiLogOutCircle } from 'react-icons/bi';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../store/store';
// import { UserInfos, fetchInfos } from '../Slices/userSlice';
// import { fetchChatData } from '../Slices/chatSlice';
// import { socket } from './SideBar.socket';
// import { fetchChannelData } from '../Slices/channelMessagesSlice';
// import { fetchChannelSetData } from '../Slices/channelSlice';
// import { fetchUserSettings } from '../Slices/userSettingsSlice';
// import { LiaUserCogSolid } from "react-icons/lia";
// import { PiChats } from "react-icons/pi";
// import { MdOutlineDisplaySettings } from "react-icons/md";

// interface Datas {
//     loading: boolean;
//     error: string | null;
//    }

// interface Props {
//     onData: (data: Datas) => void;
// }

// export default function Sidebar({onData}: Props) {
    
//     const loadingUser = useSelector((state: RootState) => state.user.loading);
//     const loadingChat = useSelector((state: RootState) => state.chat.loading);
//     const errorUser = useSelector((state: RootState) => state.user.error);
//     const errorChat = useSelector((state: RootState) => state.chat.error);
//     const channelError = useSelector((state:RootState) => state.channelMessages.error);
//     const channelLoading = useSelector((state:RootState) => state.channelMessages.loading);
//     const loadingChannelSet = useSelector((state: RootState) => state.channel.fetchloading);
//     const errorChannelSet = useSelector((state: RootState) => state.channel.fetcherror);
//     const entity: UserInfos | null = useSelector((state: RootState) => state.user.entity);

//     const dispatch = useDispatch<AppDispatch>();

//     const router = useRouter();
    
//     useEffect(()=> {
        
//         socket.connect();
//         return ()=> {socket.disconnect()}
//     }, [])
    
//     useEffect(()=> {
//         socket.on("ERROR", (message :string) => {
//         })
//         return ()=> {
//             socket.off("ERROR")
//         }
//     }, [socket])

//     useEffect(() => {
//     if (errorChat || errorUser || channelError || errorChannelSet) {
//         router.push('/login');
//     }
//     }, [errorChat, errorUser, channelError, errorChannelSet]);
    
//     useEffect(() => {
//         dispatch(fetchInfos());
//         dispatch(fetchChannelData());
//         dispatch(fetchChatData());
//         dispatch(fetchChannelSetData());
//         dispatch(fetchUserSettings());
//     }, [])

//     useEffect(() => {
//         onData({ loading: loadingUser, error: errorUser });
//     }, [loadingUser, errorUser])
    
//     const handlelogout = async () => {
        
//         await axios.post('http://localhost:4000/auth/logout', {} ,{withCredentials: true})
//         .then(response => {
//             if (response.status === 200) {
//                 router.push('/login')
//             }
//         })
//         .catch(error => {
            
//             if (error.response && error.response.status === 401) {
//             }
//         })
//     }
//     if(loadingUser || loadingChat || channelLoading || loadingChannelSet){
//         return <div></div>
//     }

//     return (
//         <div id="navbar1" className="bg-[#323232] text-slate-100 flex flex-col justify-between h-full fixed w-12 medium:w-20">                
//                 <div className='flex flex-col justify-between h-[60%] '>
//                     <div className="rounded-full border-2 border-[#E58E27] xLarge:p-0 h-12 medium:h-20 ">
//                         <Image className='rounded-full shadow-neon-light' src={entity?.userData?.avatar || "/noBadge.png"} layout="responsive" width={30} height={30} alt="PING PONG" priority={true}/>
//                     </div>
//                     <div className='flex flex-col justify-between mt-10 xLarge:mt-24 h-[75%] min-h-[35px] max-h-[750px] overflow-y-auto scrollbar-none'>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/profile'}><GoPerson/></Link>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/rank'}><GoTrophy/></Link>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/chat'}><HiOutlineChatBubbleLeftEllipsis/></Link>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/channel'}><PiChats/></Link>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/setting'}><IoSettingsOutline/></Link>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/userSettings'}><LiaUserCogSolid/></Link>
//                         <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/channelSet'}><MdOutlineDisplaySettings/></Link>
//                     </div>
//                 </div>
//                 <Link className="text-[#E58E27] mx-auto my-5 text-2xl medium:text-3xl grid place-items-end h-[30%]" onClick={handlelogout} href={'/login'}><BiLogOutCircle/></Link>
//             </div>
//         )
// }
import React, { useEffect } from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import axios from 'axios';
import { GoPerson, GoTrophy } from "react-icons/go";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { BiLogOutCircle } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { UserInfos, fetchInfos } from '../Slices/userSlice';
import { fetchChatData } from '../Slices/chatSlice';
import { socket } from './SideBar.socket';
import { fetchChannelData } from '../Slices/channelMessagesSlice';
import { fetchChannelSetData } from '../Slices/channelSlice';
import { fetchUserSettings } from '../Slices/userSettingsSlice';
import { LiaUserCogSolid } from "react-icons/lia";
import { PiChats } from "react-icons/pi";
import { MdOutlineDisplaySettings } from "react-icons/md";

interface Datas {
    loading: boolean;
    error: string | null;
   }

interface Props {
    onData: (data: Datas) => void;
}

export default function Sidebar({onData}: Props) {
    
    const loadingUser = useSelector((state: RootState) => state.user.loading);
    const loadingChat = useSelector((state: RootState) => state.chat.loading);
    const errorUser = useSelector((state: RootState) => state.user.error);
    const errorChat = useSelector((state: RootState) => state.chat.error);
    const channelError = useSelector((state:RootState) => state.channelMessages.error);
    const channelLoading = useSelector((state:RootState) => state.channelMessages.loading);
    const loadingChannelSet = useSelector((state: RootState) => state.channel.fetchloading);
    const errorChannelSet = useSelector((state: RootState) => state.channel.fetcherror);
    const entity: UserInfos | null = useSelector((state: RootState) => state.user.entity);

    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();
    
    useEffect(()=> {
        
        socket.connect();
        return ()=> {socket.disconnect()}
    }, [])
    
    useEffect(()=> {
        socket.on("ERROR", (message :string) => {
        })
        return ()=> {
            socket.off("ERROR")
        }
    }, [socket])

    useEffect(() => {
    if (errorChat || errorUser || channelError || errorChannelSet) {
        router.push('/login');
    }
    }, [errorChat, errorUser, channelError, errorChannelSet]);
    
    useEffect(() => {
        dispatch(fetchInfos());
        dispatch(fetchChannelData());
        dispatch(fetchChatData());
        dispatch(fetchChannelSetData());
        dispatch(fetchUserSettings());
    }, [])

    useEffect(() => {
        onData({ loading: loadingUser, error: errorUser });
    }, [loadingUser, errorUser])
    
    const handlelogout = async () => {
        
        await axios.post('http://localhost:4000/auth/logout', {} ,{withCredentials: true})
        .then(response => {
            if (response.status === 200) {
                router.push('/login')
            }
        })
        .catch(error => {
            
            if (error.response && error.response.status === 401) {
            }
        })
    }
    if(loadingUser || loadingChat || channelLoading || loadingChannelSet){
        return <div></div>
    }

    return (
        <div id="navbar1" className="bg-[#323232] text-slate-100 flex flex-col justify-between h-full fixed w-12 medium:w-20">                
                <div className='flex flex-col justify-between h-[60%] '>
                    <div className="rounded-full border-2 border-[#E58E27] xLarge:p-0 h-12 medium:h-20 ">
                        <Image className='rounded-full shadow-neon-light' src={entity?.userData?.avatar || "/noBadge.png"} layout="responsive" width={30} height={30} alt="PING PONG" priority={true} />
                    </div>
                    <div className='flex flex-col justify-between mt-10 xLarge:mt-24 h-[75%] min-h-[35px] max-h-[750px] overflow-y-auto scrollbar-none'>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/profile'}><GoPerson/></Link>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/rank'}><GoTrophy/></Link>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/chat'} onClick={()=> {dispatch(fetchChatData())}}><HiOutlineChatBubbleLeftEllipsis/></Link>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/channel'} onClick={()=> {dispatch(fetchChannelData())}}><PiChats/></Link>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/setting'}><IoSettingsOutline/></Link>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/userSettings'} onClick={()=> {dispatch(fetchUserSettings())}}><LiaUserCogSolid/></Link>
                        <Link className="text-[#E58E27] m-auto text-2xl medium:text-3xl" href={'/channelSet'} onClick={()=> {dispatch(fetchChannelSetData())}}><MdOutlineDisplaySettings/></Link>
                    </div>
                </div>
                <Link className="text-[#E58E27] mx-auto my-5 text-2xl medium:text-3xl grid place-items-end h-[30%]" onClick={handlelogout} href={'/login'}><BiLogOutCircle/></Link>
            </div>
        )
}

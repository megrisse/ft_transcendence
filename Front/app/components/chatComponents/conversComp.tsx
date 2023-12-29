import React from 'react'
import { Conversation, Message } from '@/app/chat/page';

interface chatConversProps {
    conversation: Conversation;
}

function ConversComp({conversation}: chatConversProps) {
    // console.log(typeof(conversation.messages))
    const content:string | undefined = conversation?.messages?.at(conversation.messages.findLastIndex((index) => {} ))?.content;
    const avatar:string | undefined = conversation?.messages?.at(conversation.messages.findLastIndex((index) => {} ))?.avatar;
    const sender:string | undefined = conversation?.messages?.at(conversation.messages.findLastIndex((index) => {} ))?.sender;
    // console.log("senderwdjkeljdbkle")
    // console.log(conversation)
    // console.log("senderwdjkeljdbkle")
    // const avatar:string | undefined = conversation.messages.at(conversation.messages.length - 1)?.avatar;

  return (
    <div className='flex justify-between p-2'>
        <div className='flex justify-between items-center w-full'>
            <img src={avatar} alt="Your Image" className=" w-10 h-10 rounded-lg border flex "/> 
            <div className='w-4/6 medium:w-[76%] xMedium:w-4/6 h-12 flex items-start justify-start flex-col'>
                <div className='text-[#131313] font-semibold'>{sender}</div>
                <div className='max-w-[200px] truncate'>{content}</div>
            </div>
            <div className={`${conversation.online ? "text-green-500" : "text-red-500"} w-1/6`}>status</div>
        </div>
    </div>
  )
}

export default ConversComp
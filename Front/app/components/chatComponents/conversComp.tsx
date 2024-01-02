import React from 'react'
import { Conversation, Message } from '@/app/chat/page';

interface chatConversProps {
    conversation: Conversation;
}

function ConversComp({conversation}: chatConversProps) {
    const content:string | undefined = conversation?.messages?.at(conversation.messages.findLastIndex((index) => {} ))?.content;
    const avatar:string | undefined = conversation?.messages?.at(conversation.messages.findLastIndex((index) => {} ))?.avatar;
    const sender:string | undefined = conversation?.messages?.at(conversation.messages.findLastIndex((index) => {} ))?.sender;

  return (
    <div className='flex justify-between p-2'>
        <div className='flex justify-between items-center w-full'>
            <img src={avatar} alt="Your Image" className=" w-10 h-10 rounded-lg border flex "/> 
            <div className='w-4/6 medium:w-[76%] xMedium:w-4/6 h-12 flex items-start justify-start flex-col'>
                <div className='text-[#131313] font-semibold'>{sender}</div>
                <div className='max-w-[200px] truncate'>{content}</div>
            </div>
            <div className={`text-[#131313] w-1/6`}></div>
        </div>
    </div>
  )
}

export default ConversComp
import React from 'react'
import { conversations } from './messages'
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
        <div className='flex '>
            <div className='w-16'>{avatar}</div>
            <div className='w-32 h-12 flex items-start justify-start flex-col'>
                <div className=' text-[#131313]'>{sender}</div>
                <div className='max-w-[200px] truncate'>{content}</div>
            </div>
        </div>
        <div className={`${conversation.online ? "text-green-500" : "text-red-500"}`}>status</div>
    </div>
  )
}

export default ConversComp
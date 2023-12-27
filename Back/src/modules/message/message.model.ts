import { Injectable } from "@nestjs/common";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";


@Injectable()
export class MessageModel {
    id: string;
    conversationId : string
    time : string
    content : string
    senderId : string
    recieverId: string
    recieved : boolean
    conversation: ConversationDto

    constructor (_conversationId : string, _content : string, _senderId : string, _recieverId :string ) {
        this.conversationId = _conversationId;
        this.content = _content;
        this.recieved = false;
        this.senderId = _senderId;
        this.recieverId = _recieverId;
    }
}
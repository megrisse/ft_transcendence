import { Injectable } from "@nestjs/common";
import { UserDto } from "src/DTOs/User/user.dto";
import { messageDto } from "src/DTOs/message/message.dto";

@Injectable()

export class ConversationModel {
    id : string;
    senderId : string;
    recieverId : string;
    userA   : UserDto
    userB   : UserDto
    messages : messageDto[]

    constructor (_senderId :string, _recieverId: string) {}
}
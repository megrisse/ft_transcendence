import { IsDate, IsString } from "class-validator";

export class messageDto {
    @IsString({message : "must be a string ."})
    id ?             : string

    @IsString({message : "must be a string ."})
    conversationId ? :       string

    @IsString({message : "must be a string ."})
    content         :       string

    @IsString({message : "must be a string ."})
    senderId      ? :       string
    
    @IsString({message : "must be a string ."})
    recieverId      :       string

    @IsDate({message : "must be a date type ."})
    date          ? :       Date
}
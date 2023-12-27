import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class channelMessageDto {

    @IsString()
    sender  :   string
    
    @IsString({message : "channel name must be a string ."})
    @MinLength(1, {message : "need at least one charactere "})
    @MaxLength(100 , {message : "can't have more the 100 characters each time"})
    content  :   string
    
    @IsString({message : "channel name must be a string ."})
    @IsNotEmpty({message : "channel name is empty ."})
    @MaxLength(20, {message : "channel name is too long ."})
    channelName : string
    
    userId  : string;

}
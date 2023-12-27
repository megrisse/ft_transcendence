import { IsString } from "class-validator";


export class InviteDto {
        @IsString()
        id      ? :string;

        @IsString()
        invitationRecieverId :string;
        
        @IsString()
        invitationSenderId :string;

        inviteStatus : number // need to be removed from the prisma schema and form this dto  TO FIX
}
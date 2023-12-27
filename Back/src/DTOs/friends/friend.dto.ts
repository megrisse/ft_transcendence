import { IsString } from "class-validator";


export class FriendDto {
        constructor (Reciever: string , Sender :string, message : string) {
                this.inviteRecieverId = Reciever
                this.inviteSenderId = Sender
                this.latestMessage = message
        }

        @IsString()
        id     ? :string;

        @IsString()
        inviteRecieverId :string;
        
        @IsString()
        inviteSenderId :string;
        
        @IsString()
        latestMessage ? :string
}

// model Friend {
//         id                    String @id @default(uuid())
//         inviteRecieverId      String
//         inviteSenderId        String
//         inviteReciever        User @relation("inviteReciever", fields: [inviteRecieverId], references: [id])
//         inviteSender          User @relation("inviteSender", fields: [inviteSenderId], references: [id])
//         latestMessage         String?
//         latestMessageDate     DateTime?
//       }
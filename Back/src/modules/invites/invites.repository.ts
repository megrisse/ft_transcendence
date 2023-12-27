import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { InviteDto } from 'src/DTOs/invitation/invite.dto';
import { FriendDto } from 'src/DTOs/friends/friend.dto';

@Injectable()
export class InvitesRepository {
    constructor (private prisma: PrismaService) {}

    async createInvite (data : InviteDto) : Promise<InviteDto | null> {
        let friends : FriendDto[] = await this.prisma.friend.findMany({where : {
            OR : [
                {
                    inviteRecieverId : data.invitationRecieverId,
                    inviteSenderId : data.invitationSenderId,
                },
                {
                    inviteSenderId : data.invitationRecieverId,
                    inviteRecieverId  : data.invitationSenderId,
                }
            ]
        }})
        let invites : InviteDto[] = await this.prisma.invitation.findMany({where : {
            OR : [
                {
                    invitationRecieverId : data.invitationRecieverId,
                    invitationSenderId : data.invitationSenderId,
                },
                {
                    invitationSenderId : data.invitationRecieverId,
                    invitationRecieverId  : data.invitationSenderId,
                }
            ]
        }})
        console.log(friends);
        if (invites.length || friends.length)
            return null;
        return await this.prisma.invitation.create({data});
    }

    async getInvite(id : string) : Promise<InviteDto> {
        return await this.prisma.invitation.findUnique({where : {id: id}});
    }

    async getInviteToValidate(sender : string, reciever : string) : Promise<InviteDto> {
        try {
            console.log('got here ...');
            
            return await this.prisma.invitation.findFirst({where : {
                invitationSenderId : sender,
                invitationRecieverId : reciever
            }})
        }catch (error) {
            console.log('got an error //');
            
        }
    }

    async getUserInviations(id: string) : Promise<InviteDto[]> {
        return await this.prisma.invitation.findMany({
            where : {
                invitationRecieverId : id,
            }
        })
    }

    async deleteInvite (_id :string) : Promise<any> {
        console.log(`the id is : ${_id}`)
        await this.prisma.invitation.delete({where : {id: _id}});
        console.log("Deleted");
    }
}

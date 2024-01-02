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
        if (invites.length || friends.length)
            return null;
        return await this.prisma.invitation.create({data});
    }

    async getInvite(id : string) : Promise<InviteDto> {
        return await this.prisma.invitation.findUnique({where : {id: id}});
    }

    async getInviteToValidate(sender : string, reciever : string) : Promise<InviteDto> {
        try {
            
            return await this.prisma.invitation.findFirst({where : {
                invitationSenderId : sender,
                invitationRecieverId : reciever
            }})
        }catch (error) { }
    }

    async getUserInviations(id: string) : Promise<InviteDto[]> {
        return await this.prisma.invitation.findMany({
            where : {
                invitationRecieverId : id,
            }
        })
    }

    async hasInvite(id : string, _id : string) : Promise<boolean> {
        let check : InviteDto = await this.prisma.invitation.findFirst({
            where : {
                OR : [
                    {
                        invitationSenderId : id,
                        invitationRecieverId : _id,
                    },
                    {
                        invitationRecieverId : id,
                        invitationSenderId : id,
                    }
                ]
            }
        })
        if (check) {
            return true
        }
        return false
    }

    async deleteInvite (_id :string) : Promise<any> {
        await this.prisma.invitation.delete({where : {id: _id}});
    }
}

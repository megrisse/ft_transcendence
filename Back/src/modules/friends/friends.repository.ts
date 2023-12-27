import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendDto } from 'src/DTOs/friends/friend.dto';
import { UsersRepository } from '../users/users.repository';
import { use } from 'passport';

@Injectable()
export class FriendsRepository {
    constructor (private prisma: PrismaService, private user: UsersRepository) {}

    async createFriend (data : FriendDto, _id : string) : Promise<FriendDto> {
        let friends : FriendDto[] =  await this.prisma.friend.findMany({
            where: {
                OR: [
                    { inviteRecieverId: _id },
                    { inviteSenderId: _id },
                ],
            },
        });
        let check : boolean = false
        friends.forEach((friend) => {
            if (friend.inviteRecieverId == data.inviteRecieverId && friend.inviteSenderId == data.inviteSenderId)
                check = true
        })
        let tmp;
        if (!check)
            tmp = this.prisma.friend.create({data});
        let user : string[] = (await this.prisma.user.findFirst({where : {id : _id}})).achievements
        if (friends.length > 0)
            if (!user.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323498/kncbovhc1fbuqkilrgjm.png')) // add ur first friend
                this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323498/kncbovhc1fbuqkilrgjm.png', _id)
        if (friends.length > 9)
            if (!user.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322969/drbaiumfsn0dp6ij908s.png'))
                this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322969/drbaiumfsn0dp6ij908s.png', _id)
        return tmp
    }

    async getFriends (_id : string) : Promise<any> {
        let friends : FriendDto[] =  await this.prisma.friend.findMany({
            where: {
                OR: [
                    { inviteRecieverId: _id },
                    { inviteSenderId: _id },
                ],
            },
            include : {
                inviteReciever : {
                    select : {
                        username : true,
                        online : true,
                        avatar : true,
                    }
                },
                inviteSender : {
                    select : {
                        username : true,
                        online : true,
                        avatar : true,
                    }
                }
            }
        });
        return friends;
    }

    async isFriend(First : string, Second : string) : Promise<boolean> {
        let tmp : FriendDto = await this.prisma.friend.findFirst({
            where : {
                OR : [
                    {
                        inviteRecieverId : First,
                        inviteSenderId : Second,
                    },
                    {
                        inviteRecieverId : Second,
                        inviteSenderId : First,
                    },
                ]
            }
        })
        if (tmp)
            return true
        return false
    }

    async updateFriend (id: string, data: FriendDto) : Promise<FriendDto> {
        return await this.prisma.friend.update({
            where: {id},
            data: {
                latestMessage : data.latestMessage
            }
        })
    }

    async deleteFriend (id: string, user: string ) : Promise<string> {
        // await this.prisma.friend.delete({where : {
            
        // }});
        let tmp : FriendDto = await this.prisma.friend.findFirst({
            where : {
                OR : [
                    {
                        inviteRecieverId : id,
                        inviteSenderId : user,
                    },
                    {
                        inviteRecieverId : user,
                        inviteSenderId : id,
                    }
                ]
            }
        })
        if (tmp) {
            await this.prisma.friend.delete({where : {id: tmp.id}})
        }
        return `Deleted : ${id}`
    }
}

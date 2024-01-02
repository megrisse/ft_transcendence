import { Injectable } from "@nestjs/common";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
import { PrismaService } from "src/modules/database/prisma.service";

@Injectable()
export class converationRepositroy {
    constructor (private Prisma : PrismaService) {}

    async createConversation(_recieverId : string, _senderId : string) : Promise<ConversationDto> {
        return await this.Prisma.conversation.create({data : {
            recieverId : _recieverId,
            senderId : _senderId,
        }})
    }

    async numberOfConversations(_id : string) : Promise<number> {
        let count  = await this.Prisma.conversation.findMany({where : {
            OR : [
                {
                    senderId : _id,
                },
                {
                    recieverId : _id,
                }]}})
        return count.length;
    }

    async getConversations(_id : string) : Promise<ConversationDto[]> {
        let counversations : ConversationDto[]  = await this.Prisma.conversation.findMany({where : {
            OR : [
                {
                    senderId : _id,
                },
                {
                    recieverId : _id,
                }]
            },
            orderBy: {
                updatedAt: 'asc',
              },
            })
        return counversations;
    }

    async findConversations(_recieverId : string, _senderId : string) : Promise<string> {
        let tmp : ConversationDto[] = await this.Prisma.conversation.findMany({where : {
            OR : [
                {   senderId : _senderId,
                    recieverId : _recieverId
                },
                {
                    recieverId : _senderId,
                    senderId : _recieverId
                }
            ]
        }})
        if (tmp.length > 0)
            return tmp[0].id
        return ""
    }

async updateConversationDate(conversationId: string) {
    let toUpdate : ConversationDto = await this.Prisma.conversation.findFirst({
        where : {
            id : conversationId
        }
    })
    if (toUpdate)
    await this.Prisma.conversation.update({where : {id : toUpdate.id},
        data : {
            updatedAt : new Date()
        }
    })
}

    async deleteConversation(conversationData: ConversationDto ) : Promise<string> {
        await this.Prisma.conversation.delete({where : {id : conversationData.id,}})
        return "deleted"
    }

    async conversationExist(sender: string, receiver : string) : Promise<ConversationDto> {
        try {
            let exist : ConversationDto = await this.Prisma.conversation.findFirst({
                where : {
                    OR : [
                        {
                            senderId : sender,
                            recieverId : receiver
                        },
                        {
                            senderId : receiver,
                            recieverId : sender
                        }
                    ]
                }
            })
            if (!exist) {
                return null
            }
            return exist
        }
        catch (error) {
            return null
        }
    }
}
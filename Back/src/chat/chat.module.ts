import { Module } from '@nestjs/common';
import { AchievementRepository } from 'src/modules/achievement/achievement.repository';
import { converationRepositroy } from 'src/modules/conversation/conversation.repository';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendsRepository } from 'src/modules/friends/friends.repository';
import { InvitesRepository } from 'src/modules/invites/invites.repository';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { messageRepository } from 'src/modules/message/message.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChannelsService } from './chat.service';
import { UserService } from 'src/auth/Services/user.service';
import { GameGeteway } from 'src/game/game.gateway';

@Module({
    imports :[],
    providers: [UsersRepository, PrismaService, FriendsRepository, InvitesRepository,ChatGateway,  MatchesRepository, messageRepository, converationRepositroy, PrismaService, AchievementRepository, InvitesRepository, UserService, ChannelsService],
    controllers: [ChatController],
})
export class ChatModule {}

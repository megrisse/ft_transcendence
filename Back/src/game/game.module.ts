import { Module } from '@nestjs/common';
import { AchievementRepository } from 'src/modules/achievement/achievement.repository';
import { converationRepositroy } from 'src/modules/conversation/conversation.repository';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendsRepository } from 'src/modules/friends/friends.repository';
import { InvitesRepository } from 'src/modules/invites/invites.repository';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { messageRepository } from 'src/modules/message/message.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { GameController } from './game.controller';
import { GameGeteway } from './game.gateway';

@Module({
    imports :[],
    providers: [
        GameGeteway,
        UsersRepository, 
        PrismaService,
        FriendsRepository,
        InvitesRepository,
        MatchesRepository,
        messageRepository,
        converationRepositroy,
        PrismaService,
        AchievementRepository
    ],
    controllers:[GameController],
})
export class GameModule {}
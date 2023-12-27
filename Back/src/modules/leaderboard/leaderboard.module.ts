import { Module } from '@nestjs/common';
import { AchievementRepository } from 'src/modules/achievement/achievement.repository';
import { converationRepositroy } from 'src/modules/conversation/conversation.repository';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendsRepository } from 'src/modules/friends/friends.repository';
import { InvitesRepository } from 'src/modules/invites/invites.repository';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { messageRepository } from 'src/modules/message/message.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { FileService } from 'src/modules/readfile/readfile';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { LeaderboardController } from './leaderboard.controller';
import { UserService } from 'src/auth/Services/user.service';

@Module({
    imports :[],
    providers: [UsersRepository, PrismaService, FriendsRepository, InvitesRepository, MatchesRepository, messageRepository, converationRepositroy, PrismaService, AchievementRepository, FileService, CloudinaryService, UserService],
    controllers : [LeaderboardController]
})

export class LeaderboardModule {}
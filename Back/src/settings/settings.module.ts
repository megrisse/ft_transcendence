import { Module } from '@nestjs/common';
import { AchievementRepository } from 'src/modules/achievement/achievement.repository';
import { converationRepositroy } from 'src/modules/conversation/conversation.repository';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendsRepository } from 'src/modules/friends/friends.repository';
import { InvitesRepository } from 'src/modules/invites/invites.repository';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { messageRepository } from 'src/modules/message/message.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { settingsController } from './settings.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDto } from 'src/DTOs/User/user.dto';
import { UserService } from 'src/auth/Services/user.service';
import { JwtAuth } from 'src/auth/Guards/jwt.guard';
import { TwoFAService } from 'src/auth/Services/2FA.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports :[],
    providers: [UsersRepository, PrismaService, FriendsRepository, InvitesRepository, MatchesRepository, messageRepository, converationRepositroy, PrismaService, AchievementRepository, CloudinaryService, JwtAuth, UserService, TwoFAService, ConfigService],
    controllers : [settingsController],
})
export class SettingsModule {}

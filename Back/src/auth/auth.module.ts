import { Module } from '@nestjs/common';
import { AchievementRepository } from 'src/modules/achievement/achievement.repository';
import { converationRepositroy } from 'src/modules/conversation/conversation.repository';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendsRepository } from 'src/modules/friends/friends.repository';
import { InvitesRepository } from 'src/modules/invites/invites.repository';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { messageRepository } from 'src/modules/message/message.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OAuth } from './Strategies/42.strategy';
import { GoogleStrategy } from './Strategies/google.strategy';
import { AuthController } from './controllers/auth.controller';
import { TwoFAConroller } from './controllers/2FA.controller';
import { UserService } from './Services/user.service';
import { TwoFAService } from './Services/2FA.service';


@Module({
    imports: [ConfigModule.forRoot(), JwtModule.register({
        global: true,
        secret: process.env.JWTSECRET,
        signOptions: {expiresIn: '1d'},
      }),
    ],
    providers: [UsersRepository, PrismaService, FriendsRepository, InvitesRepository, MatchesRepository, messageRepository, converationRepositroy, PrismaService, AchievementRepository, OAuth , PrismaService, GoogleStrategy, UserService, TwoFAService],
    controllers: [AuthController, TwoFAConroller],
})
export class AuthModule {}

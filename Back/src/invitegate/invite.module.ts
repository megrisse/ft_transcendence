import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../modules/users/users.repository";
import { PrismaService } from "../modules/database/prisma.service";
import { ConfigService } from "@nestjs/config";
import { InvitesRepository } from "../modules/invites/invites.repository";
import { FriendsRepository } from "../modules/friends/friends.repository";
import { InvitesGateway } from "./invite.gateway";



@Module({
  imports: [],
  controllers: [],
  providers: [JwtService, UsersRepository, PrismaService, ConfigService, InvitesGateway, InvitesRepository, FriendsRepository]
})
export class invitesModule {}
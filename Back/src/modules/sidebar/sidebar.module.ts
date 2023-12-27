import { Module } from "@nestjs/common";
import { SideBarGateway } from "./sidebar.gatway";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { PrismaService } from "../database/prisma.service";
import { ConfigService } from "@nestjs/config";



@Module({
  imports: [],
  controllers: [],
  providers: [SideBarGateway, JwtService, UsersRepository, PrismaService, ConfigService]
})
export class SideBarModule {}
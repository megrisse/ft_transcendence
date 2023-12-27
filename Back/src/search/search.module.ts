import { Module } from '@nestjs/common';
import { SearchController } from './search.controler';
import { UsersRepository } from 'src/modules/users/users.repository';
import { JwtAuth } from 'src/auth/Guards/jwt.guard';
import { PrismaService } from 'src/modules/database/prisma.service';
import { UserService } from 'src/auth/Services/user.service';

@Module({
    providers: [UsersRepository, JwtAuth, PrismaService, UserService],
    controllers : [SearchController],
})
export class SearchModule {}

import { Injectable } from '@nestjs/common';
import { MatchDto } from 'src/DTOs/Match/match.dto';
import { UserDto } from 'src/DTOs/User/user.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class MatchesRepository {
    constructor (private prisma: PrismaService, private user : UsersRepository) {}

    async CreateMatch(playerA : UserDto, playerB : UserDto, _playerAScore : number, _playerBScore : number) : Promise<MatchDto> {
        try {
            return await this.prisma.match.create({data : {
                playerAId : playerA.id,
                playerBId : playerB.id,
                playerAScore : _playerAScore,
                playerBScore : _playerBScore,
            }})
        }
        catch (error) {}
    }
    
    async GetMatches() : Promise<MatchDto[]> {
        return await this.prisma.match.findMany();
    }

    async findMatchesByUserId(id: string): Promise<any> {
        return await this.prisma.match.findMany({
            where: {
                OR: [
                    { playerAId: id },
                    { playerBId: id },
                ],
            },
            include : {
                playerA : {
                    select : {
                        username : true,
                    }
                },
                playerB : {
                    select : {
                        username : true,
                    }
                }
            }
        });
    }

    async CheckForGamesAchievements(matches: MatchDto[], _id : string) : Promise<any> {
        let user : UserDto = await this.prisma.user.findUnique({where : {id : _id}})
        if (!user)
            return
        if (matches.length > 0 && !user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322232/umkxxvgtxbe2bowynp8v.png')) {
            if (!user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322232/umkxxvgtxbe2bowynp8v.png"))
                this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322232/umkxxvgtxbe2bowynp8v.png", _id)
        }
        if (matches.length > 2 && !user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png')) {
            if (!user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png"))
                this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png", _id)
        } 
        if (matches.length > 9 && !user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png')){
            if (!user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png"))
                this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png", _id)
        }
        if (matches.length > 99 && !user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png')){
            if (!user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png"))
            this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png", _id)
        }
        matches.forEach((match) => {
            if (!user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png")) {
                if (match.playerAId == _id) {
                    if (match.playerAScore > match.playerBScore)
                        this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png", _id)
                }
                else {
                    if (match.playerAScore < match.playerBScore)
                        this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png", _id)
                }
            }
        })
        return ;
    }
}

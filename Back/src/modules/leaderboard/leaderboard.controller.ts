import { Body, Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { log } from "console";
import { Request } from "express";
import { use } from "passport";
import { async } from "rxjs";
import { MatchDto } from "src/DTOs/Match/match.dto";
import { UserDto } from "src/DTOs/User/user.dto";
import { UserData } from "src/DTOs/User/user.profileData";
import { AchievementDto } from "src/DTOs/achievement/achievement.dto";
import { LeaderboardDto } from "src/DTOs/leaderboard/leaderboard.dto";
import { JwtAuth } from "src/auth/Guards/jwt.guard";
import { AchievementRepository } from "src/modules/achievement/achievement.repository";
import { FriendsRepository } from "src/modules/friends/friends.repository";
import { MatchesRepository } from "src/modules/matches/matches.repository";
import { FileService } from "src/modules/readfile/readfile";
import { UsersRepository } from "src/modules/users/users.repository";

@Controller('leaderboard')
export class LeaderboardController {
    constructor (private user: UsersRepository,
                 private achievement: AchievementRepository,
                 private match: MatchesRepository,
                 private file : FileService,
                 private friend: FriendsRepository) {}
    
                @Get()
                @UseGuards(JwtAuth)
                async getLeaderboard(@Req() req: Request & {user : UserDto}) : Promise<any> {
                    let users: UserDto[] = await this.user.getAllUsers()
                    let leaderboard : LeaderboardDto[] = []
                    let _userAchievements : AchievementDto[] = await this.achievement.getAchievements()
                    users.forEach((user) => {
                        user.achievements.map(async (achievement)=> {
                            achievement = await this.achievement.getAchievementImage(achievement)
                        })
                    })
                    for (let index : number = 0; index < users.length; index++ ) {
                        let num : number = await this.user.getMatches(users[index].id);
                            leaderboard.push({
                            username: users[index].username,
                            avatar: users[index].avatar,
                            achievements : users[index].achievements,
                            rank : 0,
                            level : users[index].level,
                            GamesPlayed : num,
                        })
                    }
                    return (leaderboard)
                }
       
}

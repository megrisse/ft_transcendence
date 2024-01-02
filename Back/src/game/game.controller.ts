import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchDto } from 'src/DTOs/Match/match.dto';
import { UserDto } from 'src/DTOs/User/user.dto';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { UsersRepository } from 'src/modules/users/users.repository';

@Controller('Game')
export class GameController {
    constructor (private user: UsersRepository, private games: MatchesRepository) {}

    @Get()
    async greetplayer() : Promise<MatchDto> {
        let matches : MatchDto[] = await this.games.findMatchesByUserId('98861')
        return await this.games.CheckForGamesAchievements(matches, '98861')
    }

    @Post('create')
    async CreateGame(@Body() data : MatchDto) : Promise<any> {
        const playerA : UserDto = await this.user.getUserById(data.playerAId);
        const playerB : UserDto = await this.user.getUserById(data.playerBId);
        return await this.games.CreateMatch(playerA, playerB,  data.playerAScore, data.playerBScore);
    }
}

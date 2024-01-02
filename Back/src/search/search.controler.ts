import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { UserDto } from "src/DTOs/User/user.dto";
import { searchDto } from "src/DTOs/search/search.dto";
import { JwtAuth } from "src/auth/Guards/jwt.guard";
import { UsersRepository } from "src/modules/users/users.repository";

@Controller('search')
export class SearchController {
    constructor (
        private user: UsersRepository,
    ) {}

    @Get(':data')
    @UseGuards(JwtAuth)
    async Search(@Param('data') data: string, @Req() req: Request & {user: UserDto}, @Res() res : Response) : Promise<any> {
        try {

            let users : UserDto[] = await this.user.getUserWith(data);
            let searchResult : searchDto[] = []
            if (users) {
                users.forEach((user)=> {
                    if (user.id != req.user.id) {
                        searchResult.push({
                            id : user.id,
                            username : user.username
                        })
                    }
                })
            }
            res.status(200).json(searchResult)
        }
        catch(error) {}
    }
}
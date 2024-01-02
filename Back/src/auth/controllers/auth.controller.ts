import { Controller, Get, UseGuards, Res, Req, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { UserDto } from "src/DTOs/User/user.dto";
import { FortyTwoOauthGuard } from "../Guards/42-oauth.guard";
import { GoogleGuard } from "../Guards/google.OAuth.guard";
import { JwtAuth } from "../Guards/jwt.guard";
import { UserService } from "../Services/user.service";
import { UsersRepository } from "src/modules/users/users.repository";

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private user : UsersRepository) {}

    @Get('42')
    @UseGuards(FortyTwoOauthGuard)
    async fortytwoAuth(@Req() req:Request) {}

    @Get('google')
    @UseGuards(GoogleGuard)
    async GoogleAuth(@Req() req: Request) {}

    @Get('42/callback')
    @UseGuards(FortyTwoOauthGuard)
    async fortytwoAuthCallback(@Req() req:Request & {user: UserDto},  @Res() res: Response) {

        const user1 : UserDto = await this.user.getUserByUsername(req.user.username)

        if (user1 && user1.id !== req.user.id) {
            var user : UserDto = await this.userService.createUser(req.user);
            user = await this.user.updateUsername(req.user.id, req.user.username + "-")
            var token = await this.userService.sign(user.id, user.username);
        }
        else {
            var user : UserDto = await this.userService.createUser(req.user);
            var token = await this.userService.sign(user.id, user.username);
        }
        res.cookie('jwt-token', token, {
            expires: new Date(Date.now() + 900000000),
            httpOnly: true
        })

        if (user.IsEnabled)
            res.redirect('http://localhost:3000/2FaValidation')
        else if ((user.isLogg) === false) {

            console.log("user", user);
            await this.userService.updateIslogg(user.id, true)
            res.redirect(`http://localhost:3000/setting`);
        }
        else if (user.isLogg === true) {

            console.log("user else ", user);
            res.redirect(`http://localhost:3000/profile`);
        }
    }

    @Get('google/callback')
    @UseGuards(GoogleGuard)
    async GoogleCallBack(@Req() req:Request & {user: UserDto}, @Res() res:Response) {

        const user = await this.userService.createUser(req.user);

        const token = await this.userService.sign(user.id, user.username);
        res.cookie('jwt-token', token, {
            expires: new Date(Date.now() * 1000),
            httpOnly: true
        })
        res.redirect(`http://localhost:4000/auth/home`);
    }

    @Post('logout')
    @UseGuards(JwtAuth)
    async logout(@Res() res : Response, @Req() req : Request & {user : UserDto}) {

        res.clearCookie('jwt-token');
        await this.userService.updateIsAuthupdate(req.user.id, false);
        res.status(200).send('cookie was deleted');
    }
}

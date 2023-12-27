import { Controller, Get, UseGuards, Res, Req, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { UserDto } from "src/DTOs/User/user.dto";
import { FortyTwoOauthGuard } from "../Guards/42-oauth.guard";
import { GoogleGuard } from "../Guards/google.OAuth.guard";
import { JwtAuth } from "../Guards/jwt.guard";
import { UserService } from "../Services/user.service";

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService) {}

    @Get('42')
    @UseGuards(FortyTwoOauthGuard)
    async fortytwoAuth(@Req() req:Request) {}

    @Get('google')
    @UseGuards(GoogleGuard)
    async GoogleAuth(@Req() req: Request) {}

    @Get('42/callback')
    @UseGuards(FortyTwoOauthGuard)
    async fortytwoAuthCallback(@Req() req:Request & {user: UserDto},  @Res() res: Response) {

        const user = await this.userService.createUser(req.user);

        const token = await this.userService.sign(user.id, user.username);
        res.cookie('jwt-token', token, {
            expires: new Date(Date.now() + 900000000),
            httpOnly: true
        })
        if (user.IsEnabled)
            res.redirect('http://localhost:3000/2FaValidation')
        else
            res.redirect(`http://localhost:3000/setting`);
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

    @Get('home')
    @UseGuards(JwtAuth)
    async home(@Req() req: Request & {user: UserDto}) {
        console.log(req.user);
        return ;
    }

    @Post('logout')
    @UseGuards(JwtAuth)
    async logout(@Res() res : Response, @Req() req : Request & {user : UserDto}) {

        res.clearCookie('jwt-token');
        await this.userService.updateIsAuthupdate(req.user.id, false);
        res.status(200).send('cookie was deleted');
    }
}

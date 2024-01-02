import { Body, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { Request, Response } from 'express';
import { UserDto } from 'src/DTOs/User/user.dto';
import { settingsDto } from 'src/DTOs/settings/setting.dto';
import { JwtAuth } from 'src/auth/Guards/jwt.guard';
import { TwoFAService } from 'src/auth/Services/2FA.service';
import { PrismaService } from 'src/modules/database/prisma.service';

@Controller('Settings')
export class settingsController {
    constructor (private user: UsersRepository, private Cloudinary: CloudinaryService, private TwoFaService: TwoFAService, private Prisma : PrismaService) {}
    @Get(':id')
    async GetUserData(@Param('id') id: string) : Promise<UserDto> {
        return await this.user.getUserById(id);
    }

    @Post('image')
    @UseGuards(JwtAuth)
    async updateUserAvatar(@Res() res: Response, @Body('url') url : string, @Req() req: Request & {user : UserDto}) {
        try {
            if (url.length == 0) {
                res.status(400).json("invalid url .....");
                return;
            }
            await this.Prisma.user.update({
                where : {
                    id : req.user.id
                },
                data  : {
                    avatar : url,
                }
            })
            res.status(200).json("update Avatar Success .")
        } catch (error) {;
            res.status(400).json("can't upload image.")
            
        }
    }

    @Post('username')
    @UseGuards(JwtAuth)
    async   updateUsername(@Res() res: Response, @Body() data : settingsDto, @Req() req: Request & {user : UserDto}) {

        try {
            const user = req.user
            let tmp : UserDto = await this.user.getUserByUsername(data.username)
            if (tmp && req.user.username != data.username) {
                res.status(400).json("username already used")
                return
            }
            var userData = await this.user.updateUsername(user.id, data.username)
            if (data.checked_ === false && data.checked_ !== req.user.IsEnabled) {

                userData = await this.user.updateIsEnabled(user.id, data.checked_);
                res.status(201).json(userData);
            }
            else if (data.checked_ === true && data.checked_ !== req.user.IsEnabled) {
                var code = await this.TwoFaService.generate2FASecret(userData);
                userData = await this.user.getUserById(userData.id);
                res.status(201).json({code, userData});
            }
            else
                res.status(201).json(userData)
        }
        catch (error) {
            throw Error(error)
        }
    }
}

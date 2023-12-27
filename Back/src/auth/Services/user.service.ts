import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/DTOs/User/user.dto";
import { PrismaService } from "src/modules/database/prisma.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async getallUsers(): Promise<UserDto[]> {
        return await this.prisma.user.findMany()
    }

    async getUser(id:string):Promise<UserDto | null> {
        try {
            return await this.prisma.user.findUnique({where: {id: id}})
        }
        catch (error) {
            console.log("error ...");
            
        }
    }

    async getgoogleUser(id:string): Promise<UserDto | null > {

        return await this.prisma.user.findUnique({where: {email:id}})
    }

    async createUser(data: UserDto):Promise<UserDto> {

        try {
            
            if (data.id)
                var user = await this.getUser(data.id)
            else
                var user = await this.getgoogleUser(data.email)
            if (!user)
                user = await this.prisma.user.create({data})
            return user;
        }
        catch (error) {
            throw error;
        }
    }

    async updateUser(id:string, data:UserDto): Promise<UserDto> {

        return await this.prisma.user.update({
            where: { id:id },
            data: {
                email: data.email }
        })
    }

    async deleteUser(id:string):Promise<UserDto> {

        return await this.prisma.user.delete({
            where: { id: id }
        })
    }

    async sign(id:string, username:string):Promise<string> {

        try {
            var user = await this.getUser(id)
            if (user.id != id)
                return ;
            const payload = {sub: user.id, username: user.username};
            const token:string = await this.jwtService.signAsync(payload)
            return token
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async set2FaScret(secret: string, id: string):Promise<UserDto> {

        return await this.prisma.user.update({
            where: {id:id},
            data: { TwoFASecret: secret,
                    IsEnabled: true }
        });
    }

    async updateIsAuthupdate(id : string, state : boolean):Promise<UserDto> {

        return await this.prisma.user.update({
            where: {id:id},
            data: {isAuth: state}
        });
    }
}
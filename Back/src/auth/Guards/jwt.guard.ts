import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "../Services/user.service";


@Injectable()
export class JwtAuth implements CanActivate {
    constructor(private jwtService: JwtService, private userService: UserService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            var request = context.switchToHttp().getRequest();
            var token : string = this.extractTokenFromHeader(request);
            // var token : string = request.header.Authorization;
            
            // console.log(request.header.);
            
            // console.log(`token ====== ${token}`);
            
            var payload = this.jwtService.verify(token)
            // console.log(`user dyal jwt : ${payload.username}, token ${token}`);
            if (!token) 
                return false;

            const user = await this.userService.getUser(payload.sub)
            // console.log(`user :: ${user.username}`);

            if (!user) {
                return false;
            }
            request.user = user;
            return true;
            
        } catch (error) {
            throw new UnauthorizedException('sir awldi, 7na kanla3bo hna')   
        }
        
    }

    extractTokenFromHeader(req: Request) {
        
        return req.cookies['jwt-token'];
    }
}
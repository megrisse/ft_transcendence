import { JwtService } from "@nestjs/jwt";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserDto } from "src/DTOs/User/user.dto";
import { UsersRepository } from "src/modules/users/users.repository";
import { chatDto } from "src/DTOs/chat/chat.dto";

import { Inject, UseFilters } from "@nestjs/common";
import { MatchMaking } from "src/DTOs/User/matchMaking";
import { ClientProxy } from "@nestjs/microservices";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AllExceptionsSocketFilter } from "src/chat/socket.exceptionHandler";
import { PrismaService } from "../database/prisma.service";
import { ConfigService } from '@nestjs/config';


@WebSocketGateway(8008, {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    }
  })
@UseFilters(new AllExceptionsSocketFilter())
export class SideBarGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private jwtService: JwtService, 
        private user: UsersRepository,
        private prisma : PrismaService,
        private configService: ConfigService,
    ) {}
    @WebSocketServer() server: Server;

    async handleConnection(client: any, ...args: any[]) {
        try {
            let cookie : string = client.client.request.headers.cookie;
            
            if (cookie) {
                const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET') });
                if (user) {
                    const test = await this.user.getUserById(user.sub);
                    if (test) {
                        await this.user.updateUserOnlineStatus(true, test.id)
                    }
                }
            } else {
                throw("error")
            }
        } catch (error) {
            client.emit("ERROR", "invalid token ...")
            
        }
    }
    
    async handleDisconnect(client: any) {
        try {
            let cookie : string = client.client.request.headers.cookie;
            
            if (cookie) {
                const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET') });
                if (user) {
                    const test = await this.user.getUserById(user.sub);
                    if (test) 
                        await this.user.updateUserOnlineStatus(false, test.id)
            }
        }
        } catch (error) {
            client.emit("ERROR", "invalid token ...")
        }
    }
}

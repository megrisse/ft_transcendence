import { Injectable, OnModuleInit, Redirect, UseFilters } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";

import { Body , Vector } from 'matter-js';

import { gameMods} from "../DTOs/game/game.dto";
import { GameService } from "./game.service";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "src/modules/users/users.repository";
import { UserDto } from "src/DTOs/User/user.dto";
import { AllExceptionsSocketFilter } from "./socketExceptionHandler";
import { PrismaService } from "src/modules/database/prisma.service";
import { OnEvent } from "@nestjs/event-emitter";



const randomString = (length = 20) => {
    return Math.random().toString(36).substring(2, length + 2);
};

@WebSocketGateway(8080, {
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    }
})
@Injectable()
@UseFilters(new AllExceptionsSocketFilter())
export class GameGeteway implements  OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;


    private clients:Map<string, [Socket, UserDto]> ;
    private Random: Map<string, GameService>;
    private friendGame: Record<string, GameService>;
    private randomBeg: string[] = [];
    private randomInt: string[] = [];
    private randomAdv: string[] = [];
    private index: number;
    private friend: Map<number, [[string, boolean], [string, boolean]]>;

    constructor(private jwtService: JwtService, private user: UsersRepository, private prisma : PrismaService){
        this.clients = new Map<string, [Socket, UserDto]>();
        this.Random = new Map<string, GameService>();
        this.friend = new Map<number, [[string, boolean], [string, boolean]]>();
        this.index = 0;
    };
    async handleConnection( client: Socket, ...args: any[]) {

        try{
            let userdto: UserDto | null = await this.getUser(client)
            if (userdto){
                if (this.clientInMap(userdto.id)) { //CLIENT ALREDY CONNECTED
                    client.emit("REDIRECT", { "url" : '/profile'});
                    client.disconnect();
                }
                else{
                    this.clients.set(client.id, [client, userdto]);
                    client.emit("CONNECTED", {name: userdto.username, avatar: userdto.avatar, IsEnebled: userdto.IsEnabled, IsAuth: userdto.isAuth})
                    await this.user.updateUserOnlineStatus(true, userdto.id);
                    this.checkFriendsMatch(client.id)
                }
            }
            else{
                client.emit('ERROR', "YOU ARE NOT EXIST IN DATABASE")
                client.disconnect();
            }
        }
        catch(error){
            client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM")
            client.disconnect()
        }
    }

    async handleDisconnect(client: Socket) {
        try{
            let userdto: UserDto| null = null;
            if (this.clients.has(client.id)) userdto = this.clients.get(client.id)[1]
            //REDIRECT TO PROFILE
            if (userdto){
                //CLEAR THE ARRAY OF GAME MODS !!!!!!!!!
                this.deleteUserFromArrays(client.id);

                //clear the element in Random Map
                this.Random.forEach(async (value, key) => {
                    if (value.ifPlayerInGame(client.id)){
                        value.stop();
                        value.client1.emit("GAMEOVER")
                        value.client2.emit("GAMEOVER")
                        this.Random.delete(key);
                        await this.prisma.user.update({
                            where : {
                                id : value.user1Dto.id,
                            },
                            data : {
                                inGame : false,
                            }
                        })
                        await this.prisma.user.update({
                            where : {
                                id : value.user2Dto.id,
                            },
                            data : {
                                inGame : false,
                            }
                        })
                    }
                })
                this.clients.delete(client.id);
            }
            // client.disconnect();
        }catch(error){
            // client.disconnect();
        }
    };


    private checkFriendsMatch(id: string){
        const userId = this.clients.get(id)[1].id;
        for (let [key, value] of this.friend){
            if (userId === value[0][0] || userId === value[1][0]){
                if (value[0][1] === false && value[1][1] === false){
                    this.clients.get(id)[0].emit("WAIT", {map: "ADVANCED"});
                    userId === value[0][0] ? value[0][1] = true : value[1][1] = true
                }
                else{
                    this.clients.get(id)[0].emit("WAIT", {map: "ADVANCED"});
                    let player2Id = this.getSockId(value[0][1] === false ? value[1][0]: value[0][0])
                    if (player2Id.length != 0)
                        this.createNewGame(this.clients.get(id)[0].id, "ADVANCED", player2Id)
                    this.friend.delete(key);

                }
            }

        }
    }

    @SubscribeMessage("RANDOM")
    async randomGame(@MessageBody() req: {  map: string, mod: string} , @ConnectedSocket() client : Socket){
        try{

            let userdto: UserDto = this.clients.get(client.id)[1]
            this.clients.get(client.id)[0].emit("WAIT", {map: req.map})
            if (!userdto)
                return ;

            this.createRandomGame(client.id , req.map);
        }catch(error){}
    }

    @SubscribeMessage("PLAY")
    async beginningGame(@MessageBody() req : {gameId: string}, @ConnectedSocket() client : Socket){
        this.Random.get(req.gameId).startGame();
    }

    @SubscribeMessage("UPDATE")
    async updatePaddle(@MessageBody() req: {gameId: string, vec: Vector }, @ConnectedSocket() client : Socket){
        try{
            let userdto: UserDto = this.clients.get(client.id)[1]
            let game: GameService = this.Random.get(req.gameId);
            const min : number = game.paddleWidth / 2 + 1
            const max: number = game.width - min; 
            if (!userdto)
                throw "invalid user"
            if (client.id === game.player1Id && req.vec.x > min && req.vec.x < max){
              let vec: Vector = {x: req.vec.x ,y:780}
              Body.setPosition(game.p1, vec);
            }
            else if (client.id === game.player2Id && req.vec.x > min && req.vec.x < max){
                let vec : Vector = {x: req.vec.x ,y:20}
                Body.setPosition(game.p2, vec);
            }
        }catch(err){}
    }

    @SubscribeMessage("EXITGAME")
    async exitGame(@MessageBody() req: {gameId: string}, @ConnectedSocket() client : Socket){
        if (this.Random.has(req.gameId)){
            this.Random.get(req.gameId).stop;
            client.id === this.Random.get(req.gameId).client1.id ? this.Random.get(req.gameId).client2.emit("GAMEOVER"): this.Random.get(req.gameId).client1.emit("GAMEOVER");
            this.Random.get(req.gameId).stop()
            this.Random.get(req.gameId).user1Dto.id

            await this.prisma.user.update({
                where : {
                    id : this.Random.get(req.gameId).user1Dto.id,
                },
                data : {
                    inGame : false,
                }
            })
            await this.prisma.user.update({
                where : {
                    id : this.Random.get(req.gameId).user2Dto.id,
                },
                data : {
                    inGame : false,
                }
            })
            this.Random.delete(req.gameId);
        }
    }

    @SubscribeMessage("EXITWAIT")
    async exitWait(@ConnectedSocket() client : Socket){
        this.deleteUserFromArrays(client.id);
    }

    @OnEvent('chat.INVITE')
    handleChatMessage(payload: {recieverId: string, senderId: string/**add mod */}) {
        // handle the message
        if (payload && payload.recieverId && payload.senderId)
            this.friend.set(this.index++, [[payload.recieverId, false], [payload.senderId, false]]);
    }


    //GET USER FROM DATABASE
    private async getUser(client: Socket): Promise<UserDto> | null{
        let cookie : string = client.client.request.headers.cookie;

        if (cookie){
            const user = this.jwtService.verify(cookie.substring(cookie.indexOf("=") + 1));
            if (user){
                const userdto: UserDto = await this.user.getUserById(user.sub);
                if (userdto)
                    return userdto;
            }
        }
        return null;
    }

    ///        CREATE GAME FUNCTION             ///

    private createNewGame(player1: string, map: string, player2: string){
        const gameId = randomString(20);
        this.Random.set(gameId, new GameService(this.prisma, this.clients.get(player1),player1, gameId, map, gameMods.DEFI, (gameId: string) => {this.Random.delete(gameId);}));
        this.Random.get(gameId).setPlayer2(this.clients.get(player2), player2);
        this.Random.get(gameId).startGame();
    }

    private createRandomGame (player: string, map: string){
        // const
        if (map === "BEGINNER")this.randomBeg.push(player)
        else if (map === "INTEMIDIER")this.randomInt.push(player)
        else if (map === "ADVANCED")this.randomAdv.push(player)
        let player1: string;
        let player2: string;
        if (map === "BEGINNER" && this.randomBeg.length >= 2) {
            player1 = this.randomBeg.shift();
            player2 = this.randomBeg.shift();
            this.createNewGame(player1 , map, player2);
        }
        else if (map === "INTEMIDIER" && this.randomInt.length >= 2) {
            player1 = this.randomInt.shift();
            player2 = this.randomInt.shift();
            this.createNewGame(player1 , map, player2);
        }
        else if (map === "ADVANCED" && this.randomAdv.length >= 2) {
            player1 = this.randomAdv.shift();
            player2 = this.randomAdv.shift();
            this.createNewGame(player1 , map, player2);
        }
    }

    private clientInMap(dtoId: string): boolean{
        for (let [key, value] of this.clients) {
            if (value[1].id === dtoId)
                return true
        }
        return false
    }
    private getSockId(dtoId: string): string{

        for (let [key, value] of this.clients) {
            if (value[1].id === dtoId)
                return (key)
        }
        return ('');
    }


    private deleteUserFromArrays(id: string){
        let index : number = -1;
        if ((index = this.randomBeg.indexOf(id)) !== -1)
            this.randomBeg.splice(index, 1)
        if ((index = this.randomInt.indexOf(id)) !== -1)
            this.randomInt.splice(index, 1)
        if ((index = this.randomAdv.indexOf(id)) !== -1)
            this.randomAdv.splice(index, 1)
    }

}

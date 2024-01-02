import { Injectable } from "@nestjs/common";

import { 
    Engine, 
    Bodies, 
    Composite, 
    Runner, 
    Body,
    Events,
    Vector
} from 'matter-js';

import { Socket } from "socket.io";
import { MatchDto } from "src/DTOs/Match/match.dto";
import { UserDto } from "src/DTOs/User/user.dto";

import { gameMods } from "src/DTOs/game/game.dto";
import { PrismaService } from "src/modules/database/prisma.service";


const width             :number = 600;
const height            :number = 800;
const paddleWidth       :number = 125;
const paddleHeight      :number = 20;
const AdvancedObs       :Body[] = [
    Bodies.rectangle(width / 4, height / 4, 100, 10, { isStatic: true ,chamfer: { radius: 5}, label: "ADV"}),
    Bodies.rectangle(3 * width / 4, 3 * height / 4, 100, 10, { isStatic: true ,chamfer: { radius: 5}, label: "ADV"}),
]
const IntemidierObs     :Body[] = [
    Bodies.circle(width / 4, height / 4, 20, {isStatic: true, label: "INTE"}),
    Bodies.circle(3 * width / 4, 3 * height / 4, 20, {isStatic: true, label: "INTE"}),
    Bodies.circle(width / 4, 3 * height / 4, 20, {isStatic: true, label: "INTE"}),
    Bodies.circle(3 * width / 4, height / 4, 20, {isStatic: true, label: "INTE"}),
]


@Injectable()
export class GameService{
    id              :string;             ;;;;;;;
    player1Id       :string;
    player2Id       :string;
    user1Dto        :UserDto;
    user2Dto        :UserDto;
    mode            :gameMods; // DEFI OR TIME
    map             :string; // BEGINNER INTEMIDIER ADVANCED
    serve           :boolean;
    client1         :Socket;
    client2         :Socket;
    width           : number
    height          : number
    paddleWidth     : number
    paddleHeight    : number

    // Engine Attribute
    engine          :Engine;
    runner          :Runner;
    ball            :Body;
    p1              :Body;
    p2              :Body;
    grounds         :Body[];
    obstacles       :Body[];
    isRunning       :boolean;

    maxVelocity     :number;
    public score1          :number;
    public score2          :number;
    maxScore        :number;
    maxTime         :number; // in minutes
    public gameOverCallback: (gameId: string) => void;

    constructor(private prisma: PrismaService , [client, userdto]: [Socket, UserDto],clientId: string,gameId: string , map: string, mode: gameMods, gameOverCallback: (gameId: string) => void){
        this.width = width
        this.height = height
        this.paddleHeight = paddleHeight
        this.paddleWidth = paddleWidth
        this.id = gameId;
        this.player1Id = clientId;
        this.user1Dto = userdto;
        this.client1 = client;
        this.map = map;
        this.mode = mode;
        this.serve = true;
        this.isRunning = true;
        this.score1 = 0;
        this.score2 = 0;
        
        this.engine = Engine.create({
            gravity: {x: 0, y: 0, scale: 0.001},
            positionIterations: 10,
            velocityIterations: 8,
        });
        this.runner = Runner.create()
        
        this.ball = Bodies.circle(width / 2, height / 2, 10, { 
            restitution: 1,
            frictionAir: 0,
            friction:0,
            inertia: Infinity,
            label: "ball"
        });
        Body.setVelocity(this.ball, {x: 5, y: 5});
        this.p1 = Bodies.rectangle(width / 2, 780, paddleWidth, paddleHeight, {
            isStatic: true,
            chamfer: { radius: 10},
        });
        this.p2 = Bodies.rectangle(width / 2, 20, paddleWidth, paddleHeight, { 
            isStatic: true,
            chamfer: { radius: 10},
        });
        this.grounds = [
            Bodies.rectangle((0 + width / 2), 0, width, 10, { isStatic: true , label: "TOP"}),
            Bodies.rectangle((0 + width / 2), height, width, 10, { isStatic: true , label: "DOWN"}),
            Bodies.rectangle(0, (0 + height / 2), 10, height, { isStatic: true , label: "LEFT"}),
            Bodies.rectangle(width, (0 + height / 2), 10, height, { isStatic: true , label: "RIGHT"}),
        ];
        
        this.obstacles = [];
        
        if (this.map === "ADVANCED")
        {
            this.obstacles = AdvancedObs;
            this.maxVelocity = 13;
            this.maxScore = 7;
            
        }
        else if (this.map === "INTEMIDIER"){
            this.obstacles = IntemidierObs
            this.maxVelocity = 10
            this.maxScore = 5;
        }
        else if (this.map === "BEGINNER"){
            this.maxVelocity = 7
            this.maxScore = 3;
       }
       this.gameOverCallback = gameOverCallback;
       
    }


    private async sendStart(){
        /**
         * UPDATE THE STATE OF USER IN DATABASE AND SEND START EVENT
         */
        await this.prisma.user.update({
            where :{
                id : this.user1Dto.id,
            },
            data : {
                inGame : true,
            }
        })
        await this.prisma.user.update({
            where :{
                id : this.user2Dto.id,
            },
            data : {
                inGame : true,
            }
        })
        this.client1.emit("START", {
            "ID"    :1,
            "ball"  : this.ball.position,
            "p1"    : this.p1.position,
            "p2"    : this.p2.position,
            "score1": this.score1,
            "score2": this.score2,
            gameId: this.id,
            avatar: [this.user1Dto.avatar, this.user2Dto.avatar],
            names: [this.user1Dto.username, this.user2Dto.username]
        });
        
        this.client2.emit("START", {
            "ID"    :2,
            "ball"  : this.reverseVector(this.ball.position),
            "p1"    : this.reverseVector(this.p1.position),
            "p2"    : this.reverseVector(this.p2.position),
            "score1": this.score1,
            "score2": this.score2,
            gameId: this.id,
            avatar: [this.user1Dto.avatar, this.user2Dto.avatar],
            names: [this.user1Dto.username, this.user2Dto.username]
        });
    }


    public async startGame(){
        this.sendStart();
        Runner.run(this.runner, this.engine);
        Composite.add(this.engine.world, [this.p1, this.p2 , ...this.grounds, ...this.obstacles]);
        this.spownBall();
        this.checkBallPosition();
        try
        {
            Events.on(this.engine, "collisionStart", async event =>{
            let     stop : boolean = false; 
            event.pairs.forEach((pair)=>{
                const bodyA :Body = pair.bodyA;
                const bodyB : Body = pair.bodyB;
                
                
                if (bodyA === this.ball || bodyB == this.ball){
                    const normal = pair.collision.normal;
                    const Threshold = 0.1;
                    if (Math.abs(normal.x) < Threshold){
                        const sign = Math.sign(this.ball.velocity.x);
                        const i = 0.5;
                        let newVelocity : Vector = { x : Math.min(this.ball.velocity.x + sign * i , this.maxVelocity), y : this.ball.velocity.y}
                        if (Math.abs(newVelocity.x) < 1) newVelocity.x = sign * 1; // Minimum horizontal velocity
                        if (Math.abs(newVelocity.y) < 1) newVelocity.y = sign * 1;
                        Body.setVelocity(this.ball, newVelocity)
                    }
                    const otherBody = bodyA === this.ball ? bodyB : bodyA;
                    if (otherBody.label === "TOP" || otherBody.label === "DOWN"){
                        if (otherBody.label === "TOP")          this.score1++;
                        else if (otherBody.label === "DOWN")    this.score2++;
                        Body.setPosition(this.ball, { x: 300, y: 400 });
                        Body.setVelocity(this.ball, { x: this.ball.velocity.x < 0 ? 5 : -5 , y: this.ball.velocity.y > 0 ? 5:  -5});
                    }
                }
            });
            if (this.score1 === this.maxScore || this.score2 === this.maxScore ){
                this.stop();
                let winnerUser : UserDto;
                let looserUser : UserDto;
                this.score1 === this.maxScore ? 
                    (this.client1.emit("WinOrLose", {content: "win"}), winnerUser = this.user1Dto)
                    :( this.client2.emit("WinOrLose", {content: "win"}), winnerUser = this.user2Dto);
                this.score1 === this.maxScore ? 
                    (this.client2.emit("WinOrLose", {content: "lose"}), looserUser = this.user2Dto)
                    : (this.client1.emit("WinOrLose", {content: "lose"}), looserUser = this.user1Dto);
                //STORE THE GAME RESULT IN DATABASE
                if (!winnerUser.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png")){
                    winnerUser.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png")
                    await this.prisma.user.update({
                        where : {
                            id : winnerUser.id,
                        },
                        data : {
                            achievements : winnerUser.achievements,
                        }
                    })
                }
                await this.prisma.match.create({
                    data:{
                        playerAId: this.user1Dto.id,
                        playerBId: this.user2Dto.id,
                        playerAScore: this.score1,
                        playerBScore: this.score2,
                    }
                })
                let winnerXp : number = Number(((((this.user1Dto.level + 1) * 10) / 100) + winnerUser.level).toPrecision(2)); 
                let looserXp: number  = Number((((looserUser.level * 2) / 100) + looserUser.level).toPrecision(2));
                
                await this.prisma.user.update({
                    where: {
                        id : winnerUser.id,
                    },
                    data :{
                        level : winnerXp,
                        inGame : false,
                    }
                })
                await this.prisma.user.update({
                    where: {
                        id : looserUser.id,
                    },
                    data :{
                        level : looserXp,
                        inGame : false,
                    }
                })
                
                await this.updateAchivements(winnerUser.id, looserUser.id);
                this.gameOverCallback(this.id);
            }
        })}
        catch (error) {}


        

        Events.on(this.engine, "afterUpdate", ()=>{
            this.client1.emit('UPDATE', {
                "ball"  : this.ball.position,
                "p1"    : this.p1.position,
                "p2"    : this.p2.position,
                "score1": this.score1,
                "score2": this.score2,
                // gameId: this.id
            });
            
            this.client2.emit('UPDATE', {
                "ball"  : this.reverseVector(this.ball.position),
                "p1"    : this.reverseVector(this.p1.position),
                "p2"    : this.reverseVector(this.p2.position),
                "score1": this.score1,
                "score2": this.score2,
            });
            if ((this.ball.velocity.x <= 0.5 && this.ball.velocity.x >= -0.5) || 
                        (this.ball.velocity.y <= 0.5 && this.ball.velocity.y >= -0.5))
                    Body.setVelocity(this.ball, {x: this.ball.velocity.x + 0.5, y: this.ball.velocity.y + 0.5})
            
        });

    }   

    public setPlayer1(sock: Socket, id: string){
        this.player1Id = id;
        this.client1 = sock;
    }
    public setPlayer2([sock, user]: [Socket, UserDto], id: string){
        this.player2Id = id;
        this.user2Dto = user;
        
        this.client2 = sock;
    }
    public getPlayer1(): Socket {
        return this.client1;
    }

    public getPlayer2(): Socket {
        return this.client2;
    }

    public ifPlayerInGame(id : string) : boolean{
        if (id === this.player1Id || id === this.player2Id)
            return true;
        return false;
    }
    public reverseVector(vector: Vector): Vector {
        return ({ x: width - vector.x, y: height - vector.y });
    }

    checkBallPosition(){
        setInterval(()=>{
        }, 1000/60);
    }

    spownBall(): void{
        if (!this.isRunning){
            
            this.isRunning = !this.isRunning;
            Runner.run(this.runner,this.engine);
            return
        }
        setTimeout(() =>{
            Composite.add(this.engine.world, this.ball);
        }, 1000)
    }

    

    public stop(){
        Runner.stop(this.runner);
        Engine.clear(this.engine);
        this.isRunning = false;
    }

    private async updateAchivements(winnerId: string, looserId: string){
        const winner :UserDto = await this.prisma.user.findUnique({
            where: {
                id: winnerId,
            }
        })
        const looser :UserDto = await this.prisma.user.findUnique({
            where:{
                id: looserId,
            }
        })
        if (winner && looser) {
            let WinnerMatches : MatchDto[] = await this.prisma.match.findMany({
                where : {
                    OR : [
                        {
                            playerAId : winnerId,
                        },
                        {
                            playerBId : winnerId,
                        }
                    ]
                }
            })
            let LooserMatches : MatchDto[] = await this.prisma.match.findMany({
                where : {
                    OR : [
                        {
                            playerAId : looserId,
                        },
                        {
                            playerBId : looserId,
                        }
                    ]
                }
            })
            
            if (WinnerMatches.length == 3) {
                winner.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png")
                await this.prisma.user.update({
                    where : {
                        id : winnerId,
                    },
                    data : {
                        achievements : winner.achievements,
                    }
                })
            }
            if (WinnerMatches.length == 10) {
                winner.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png")
                await this.prisma.user.update({
                    where : {
                        id : winnerId,
                    },
                    data : {
                        achievements : winner.achievements,
                    }
                })
            }
            if (WinnerMatches.length == 100) {
                winner.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png")
                await this.prisma.user.update({
                    where : {
                        id : winnerId,
                    },
                    data : {
                        achievements : winner.achievements,
                    }
                })
            }
            if (LooserMatches.length == 3) {
                looser.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png")
                await this.prisma.user.update({
                    where : {
                        id : looserId,
                    },
                    data : {
                        achievements : looser.achievements,
                    }
                })
            }
            if (LooserMatches.length == 10) {
                looser.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png")
                await this.prisma.user.update({
                    where : {
                        id : looserId,
                    },
                    data : {
                        achievements : looser.achievements,
                    }
                })
            }
            if (LooserMatches.length == 100) {
                looser.achievements.push("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png")
                await this.prisma.user.update({
                    where : {
                        id : looserId,
                    },
                    data : {
                        achievements : looser.achievements,
                    }
                })
            }


        }
        
    }


}

import { GameService } from "src/game/game.service";

export interface Game  {
    game: GameService
    id :string;
    player1Id: string
    player2Id: string
    map: string // 
    mode: string // DEFI OR TIME
    state: boolean
}



export class playerDto{
    
    id : string;
    paddleX: number;
    score: number;
    playerWidth: number;
    playerHeight: number;
    x: number;
    y: number

    constructor(x: number, y: number, id : string, paddleX: number, score: number){
        this.x = x;
        this.y = y;
        this.id = id;
        this.paddleX = paddleX;
        this.score = score;
    }
    
    public setPaddleX(newX: number){
        this.paddleX = newX;
    }
    public IncrementScore(){this.score++;}
    
}

export class ballDto{
    constructor(x: number, y: number, velocityX: number, velocityY: number){
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
    
    public setPosition(x: number, y : number){
        this.x = x;
        this.y = y;
    }
    
    public setVelocity(x: number, y : number){
        this.velocityX = x;
        this.velocityY = y;
    }
    
    x: number;
    y: number;
    velocityX: number
    velocityY: number
}

export class GameDto{
    id: string;
    player1: playerDto;
    player2: playerDto;
    ball : ballDto
    height: number;
    width: number;
    
    
    constructor(
        id: string,
        player1: playerDto,
        player2: playerDto,
        ball : ballDto, 
        height: number,
        width: number,
        ){
            this.id = id;
            this.player1 = player1;
            this.player2 = player2;
            this.ball = ball;
            this.height = height;
            this.width = width;
        }
        
        public setDimention(height: number,width: number){
            this.height = height;
            this.width = width;
        }
        
}

export class engineOption{
    gravityX: number;gravityY: number;gravityScale: number
    positionIterations : number;
    velocityIterations :number;

    constructor(x: number, y: number, scale:number, positionIterations : number, velocityIterations :number){
        this.gravityX = x ;
        this.gravityY = y;
        this.gravityScale = scale;
        this.positionIterations =positionIterations;
        this.velocityIterations = velocityIterations;
    }

}

export class renderOptions{
    background: string;
    wireframe: boolean;
    constructor(background: string, wireframe: boolean){
        this.background = background;
        this.wireframe = wireframe;
    }
}

export class ballOptions{
    restitution: number
    frictionAir: number
    friction: number
    inertia: number
    color:string
    velocityX: number
    velocityY: number

    constructor(restitution: number, frictionAir: number, friction: number, inertia: number ,color:string, velocityX: number, velocityY: number){
        this.restitution = restitution;
        this.frictionAir = frictionAir;   
        this.friction = friction;
        this.inertia = inertia;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
}

export class playersOption{

    chamferReduis: number;
    color: string;;

    constructor(reduis: number, color: string){
        this.chamferReduis = reduis;
        this.color = color;
    }
}

export class GameDependency{
    engineOption: engineOption;
    renderOptions : renderOptions;
    ballOptions : ballOptions;
    playersOption: playersOption
    
    constructor(
            engineX: number, engineY: number, scale: number,
            positionIterations : number,
            velocityIterations :number,
            background: string, wireframe: boolean,
            restitution: number,
            frictionAir: number,
            friction: number,
            inertia: number,
            ballColor:string,
            velocityX: number,velocityY: number,
            reduis: number,
            playerColor: string

    ){
        this.engineOption =new engineOption(engineX, engineY, scale, positionIterations, velocityIterations);
        this.renderOptions = new renderOptions(background, wireframe);
        this.ballOptions = new ballOptions(restitution, frictionAir, friction, inertia, ballColor, velocityX, velocityY);
        this.playersOption = new playersOption(reduis, playerColor);
    }
}


export enum gameMaps{
    BEGINNER,
    INTEMIDIER,
    ADVANCED,
}




export enum gameMods {
    DEFI,
    TIME,
}
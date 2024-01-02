"use client"
import { Engine, Render, Bodies, Composite, Runner, Body, Vector, Events} from 'matter-js';
import Matter from "matter-js";
import 'tailwindcss/tailwind.css';
import { Socket } from "socket.io-client";



const globalWidth = 600;
const globalHeight = 800;
const aspectRatio = globalWidth / globalHeight;
const paddleWidth = 125;
const paddleHeight = 20;
let wallOptions = {
    isStatic: true,
    render: {
        fillStyle: '#AF6915',
        strokeStyle: '#000',
        lineWidth: 1,
    },
};

function generateColor(map: string) : string{
    if (map === "ADVANCED")
        return '#000000'
    else if (map === 'INTEMIDIER')
        return '#191919'
    return '#999999'
}

class GameClass {
    engine: Engine = Engine.create({gravity: {x: 0, y: 0, scale: 0},});//
    render: Render;//
    runner: Runner = Runner.create();//
    element :HTMLDivElement;
    ball: Body = Bodies.circle(0, 0, 0);
    p1: Body = Bodies.rectangle(0,0,0,0);
    p2: Body =Bodies.rectangle(0,0,0,0);;
    topWall: Body =Bodies.rectangle(0,0,0,0);;
    downWall: Body =Bodies.rectangle(0,0,0,0);;
    walls: Body[] = [
        Bodies.rectangle(0,0,0,0),
        Bodies.rectangle(0,0,0,0),
        Bodies.rectangle(0,0,0,0),
        Bodies.rectangle(0,0,0,0),
    ];
    obstacles: Body[] = [];
    width: number;
    height: number
    map:string;
    socket: Socket | null = null;
    mod: string;
    maxVelocity: number = 5;
    score1: number = 0;
    score2: number = 0;
    Id: number = 0;
    gameId: string;
    state: boolean;
    // mouse: Matter.Mouse;
    // mouseConstraint: Matter.MouseConstraint;
    public leftPressed: boolean = false;
    public rightPressed: boolean = false;
    private paddleVitess: number = 5;


    private boundHandleKeyDown: (event: KeyboardEvent) => void;
    private boundHandleKeyUp: (event: KeyboardEvent) => void;

    constructor(element: HTMLDivElement, map: string, mod: string, gameId: string, socket?: Socket){
        this.state = false;
        if (socket)
            this.socket = socket
        this.gameId = gameId;
        this.map = map;
        this.mod = mod;
        
        this.element = element;
        [this.width, this.height] = this.calculateSize();
        if (map === "ADVANCED") {this.maxVelocity += 6;this.paddleVitess += 6}
        else if (map === "INTEMIDIER") {this.maxVelocity += 3;this.paddleVitess += 3}
        this.render = Render.create({
            engine: this.engine,
            element : this.element,
            options: {
                background: generateColor(map),
                width: this.width,
                height: this.height,
                wireframes: false,
            }
        })
        this.generateObs();
        this.updatePaddlePosition();
        if (mod === "BOT"){
            this.Id = 2;
            this.createWorld();
            this.handleCollistion()
            this.handleBotMovement()
            this.handleBallOut()
            Render.run(this.render);
            Runner.run(this.runner, this.engine);
        }

        this.boundHandleKeyDown = this.keyDownHandler.bind(this);
        this.boundHandleKeyUp = this.keyUpHandler.bind(this);
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
    }
    private keyDownHandler(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowLeft':
                
                this.leftPressed = true;
                break;
                case 'ArrowRight':
                    this.rightPressed = true;
                    break;
                }
            }
            
    private keyUpHandler(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowLeft':
                this.leftPressed = false;
                break;
            case 'ArrowRight':
                this.rightPressed = false;
                break;
            }
    }


    private handleBallOut(){
        Events.on(this.engine, "afterUpdate", ()=>{
            if ((this.ball.position.y < 0 || this.ball.position.y > this.height) || (this.ball.position.x < 0 || this.ball.position.x > this.width)){
                Runner.stop(this.runner);
                Body.setPosition(this.ball, {x: this.width / 2, y: this.height / 2})
                Body.setVelocity(this.ball, {x: -5, y: -5})
                Runner.start(this.runner, this.engine);
                
            }

            if((this.ball.velocity.x >= -0.5 && this.ball.velocity.x <= 0.5) ||
                (this.ball.velocity.y >= -0.5 && this.ball.velocity.y <= 0.5))
                    Body.setVelocity(this.ball, {x: this.ball.velocity.x + 0.5, y: this.ball.velocity.y + 0.5})
                
        })
    }

    public updateState(p1: Vector, p2: Vector, ball: Vector){
        Body.setPosition(this.p1, {x:this.normalise(p1.x, 0, globalWidth, 0, this.width),y:this.normalise(p1.y, 0, globalHeight, 0, this.height)})
        Body.setPosition(this.p2, {x:this.normalise(p2.x, 0, globalWidth, 0, this.width),y:this.normalise(p2.y, 0, globalHeight, 0, this.height)})
        Body.setPosition(this.ball, {x:this.normalise(ball.x, 0, globalWidth, 0, this.width),y:this.normalise(ball.y, 0, globalHeight, 0, this.height)})
        Engine.update(this.engine);
    }

    public updateScore(s1: number, s2: number){
        this.score1 = s1;
        this.score2 = s2;
    }

    public startOnligneGame(p1: Vector, p2: Vector, ball: Vector, id: number){
        // create all elements of engine
        this.state = true;
        this.Id = id;
        this.p1 = Bodies.rectangle(
            this.normalise(p1.x, 0, globalWidth, 0, this.width),
            this.normalise(p1.y, 0, globalHeight, 0, this.height),
            this.normalise(paddleWidth, 0, globalWidth, 0, this.width),
            this.normalise(paddleHeight, 0, globalHeight, 0, this.height),
            {
                isStatic: true,
                chamfer: {radius: 10 * this.calculateScale() },
                render: {fillStyle: '#AF6915'}
            }
        )
        this.p2 = Bodies.rectangle(
            this.normalise(p2.x, 0, globalWidth, 0, this.width),
            this.normalise(p2.y, 0, globalHeight, 0, this.height),
            this.normalise(paddleWidth, 0, globalWidth, 0, this.width),
            this.normalise(paddleHeight, 0, globalHeight, 0, this.height),
            {
                isStatic: true,
                chamfer: {radius: 10 * this.calculateScale() },
                render: {fillStyle: '#AF6915'}
            }
            )
            this.ball = Bodies.circle(
                this.normalise(ball.x, 0, globalWidth, 0, this.width),
                this.normalise(ball.y, 0, globalHeight, 0, this.height),
                10 * this.calculateScale(),
                {render: {fillStyle: '#AF6915'}}
        )
        //
        Body.setVelocity(this.ball, {x: this.normalise(this.ball.velocity.x, 0 , globalWidth, 0, this.width), y: this.normalise(this.ball.velocity.y, 0 , globalHeight, 0, this.height)})
        Composite.add(this.engine.world, [this.ball, this.p1, this.p2]);
        Composite.add(this.engine.world, [...this.obstacles]);
        Render.run(this.render);
        Runner.run(this.runner, this.engine);
    }

    private handleBotMovement(){
        Matter.Events.on(this.engine, "beforeUpdate", () => {
            const newPosX : number = this.ball.position.x
            const min : number = this.normalise(paddleWidth / 2, 0, globalWidth, 0, this.width);
            const max : number = this.width - min;
            if (newPosX > min && newPosX < max){
                if (this.map === "ADVANCED")
                    Body.setPosition(this.p1,  { x: newPosX, y : this.p1.position.y})
                else if (this.map === "INTEMIDIER"){
                    if (this.ball.position.x < this.height / 2)
                        Body.setPosition(this.p1,  { x: newPosX, y : this.p1.position.y})
                    else
                        Body.setPosition(this.p1,  { x: this.width - this.p2.position.x, y : this.p1.position.y})

                }
                else{
                    if (this.ball.position.x < this.height / 4)
                        Body.setPosition(this.p1,  { x: newPosX, y : this.p1.position.y})
                    else
                        Body.setPosition(this.p1,  { x: this.width - this.p2.position.x, y : this.p1.position.y})

                }
            }
        });
    }

    private createWorld(){
        this.p1 = Bodies.rectangle(
            this.normalise(globalWidth / 2, 0,globalWidth, 0, this.width),
            this.normalise( 20 , 0 , globalHeight , 0, this.height),
            this.normalise( paddleWidth , 0 , globalWidth , 0, this.width),
            this.normalise( paddleHeight , 0 , globalHeight , 0, this.height),
            {
                isStatic: true,
                chamfer: {radius: 10 * this.calculateScale() },
                render: {fillStyle: '#AF6915'}
            }
            
        );
        this.p2 = Bodies.rectangle(
            this.normalise(globalWidth / 2, 0,globalWidth, 0, this.width),
            this.normalise( 780 , 0 , globalHeight , 0, this.height),
            this.normalise( paddleWidth , 0 , globalWidth , 0, this.width),
            this.normalise( paddleHeight , 0 , globalHeight , 0, this.height),
            {
                isStatic: true,
                chamfer: {radius: 10 * this.calculateScale() },
                render: {fillStyle: '#AF6915'}
            }
        );

        this.ball = Bodies.circle(this.width / 2, this.height / 2, 10 * this.calculateScale(), 
            {
                restitution: 1,
                frictionAir: 0,
                friction:0,
                inertia: Infinity,
                render:{
                    fillStyle: "#AF6915"
                }
            }
        )
        const velocityScale = 0.01; // Adjust this value to change the speed of the ball
        Body.setVelocity(this.ball, {x: this.width * velocityScale, y: this.height * velocityScale});
        Composite.add(this.engine.world, [this.ball, this.p1, this.p2]);
        Composite.add(this.engine.world, [...this.obstacles]);

    }

    private updatePaddlePosition() {
        Events.on(this.engine, 'beforeUpdate', (event : any)=>{
            const min : number = this.normalise(paddleWidth / 2, 0, globalWidth, 0, this.width);
            const max : number = this.width - min;
            
            const scale = Math.min(this.width / globalWidth, this.height / globalHeight);
            const adjustedPaddleVitess = this.paddleVitess * scale; // Adjust the paddle velocity

            if(this.leftPressed) {
                const newX = this.Id === 1 ? this.p1.position.x - adjustedPaddleVitess : this.p2.position.x - adjustedPaddleVitess;
                if (this.mod === "BOT" && newX >= min && newX <= max)Body.setPosition(this.p2, {x: newX, y: this.p2.position.y});
                else if (this.socket && this.mod === "RANDOM")this.socket?.emit("UPDATE", {
                    gameId: this.gameId,
                    vec: {
                        x: this.Id === 1 ? this.normalise(newX, 0, this.width, 0, globalWidth) : this.normalise(this.width - newX, 0, this.width, 0, globalWidth),
                        y : this.Id === 1 ? 780: 20
                    }
                });
            }
            if(this.rightPressed) {
                const newX = this.Id === 1 ? this.p1.position.x + adjustedPaddleVitess : this.p2.position.x + adjustedPaddleVitess;
                if (this.mod === "BOT" && newX >= min && newX <= max)Body.setPosition(this.p2, {x: newX, y: this.p2.position.y});
                else if (this.socket && this.mod === "RANDOM")this.socket?.emit("UPDATE", {
                    gameId: this.gameId,
                    vec: {
                        x: this.Id === 1 ? this.normalise(newX, 0, this.width, 0, globalWidth) : this.normalise(this.width - newX, 0, this.width, 0, globalWidth),
                        y : this.Id === 1 ? 780: 20
                    }
                });
            }

        })
    }


    private calculateScale(): number {
        let scale: number = this.width / globalWidth;
        let scale2: number = this.height / globalHeight;
    
        return Math.min(scale, scale2);
    }

    public calculateSize(): [number, number]{
        let width: number, height: number;
        if (this.element.clientHeight > this.element.clientWidth){
            width = this.element.clientWidth;
            height = width / aspectRatio;
            if (height > this.element.clientHeight){
                height = this.element.clientHeight;
                width = height * aspectRatio;
            }
        }else{
            height = this.element.clientHeight;
            width = height * aspectRatio;
            if (width > this.element.clientWidth){
                width = this.element.clientWidth
                height = width / aspectRatio;
            }
        }
        return [width, height]
    }

    private generateObs(){
        if (this.map === "ADVANCED")
            this.obstacles.push(
                Bodies.rectangle( 
                    3 * this.width / 4,
                    3 * this.height / 4,
                    this.normalise(100, 0, globalWidth, 0, this.width), 
                    this.normalise(10,0, globalHeight, 0, this.height), 
                    { isStatic: true, chamfer: { radius: 5 * this.calculateScale() } , render: {fillStyle: '#AF6915'},  label: "ADV"}
                ),
                Bodies.rectangle(
                    this.width / 4, 
                    this.height / 4,
                    this.normalise(100, 0, globalWidth, 0, this.width), 
                    this.normalise(10,0, globalHeight, 0, this.height), 
                    { isStatic: true, chamfer: { radius: 5 * this.calculateScale() } , render: {fillStyle: '#AF6915'} , label: "ADV"}
                ),
            )
        else if (this.map === "INTEMIDIER")
            this.obstacles.push(Bodies.circle(
                this.width / 4, 
                this.height / 4, 
                20 * this.calculateScale(),
                {
                    isStatic: true,
                    render: {fillStyle: '#AF6915'}
                }
            ), Bodies.circle(
                3 * this.width / 4, 
                this.height / 4, 
                20 * this.calculateScale(), 
                {
                    isStatic: true,
                    render: {fillStyle: '#AF6915'}
                }
            ), Bodies.circle(
                this.width / 4, 
                3 * this.height / 4, 
                20 * this.calculateScale(),
                {
                    isStatic: true,
                    render: {fillStyle: '#AF6915'}
                }
            ), Bodies.circle(
                3 * this.width / 4, 
                3 * this.height / 4, 
                20 * this.calculateScale(), 
                {
                    isStatic: true,
                    render: {fillStyle: '#AF6915'}
                }
            ))

        //add walls
        this.topWall = Bodies.rectangle(
            this.normalise((0 + globalWidth / 2), 0, globalWidth, 0, this.width),
            0,
            this.width,
            this.normalise(10, 0,globalHeight,0,this.height),
            wallOptions,
        );
        this.downWall = Bodies.rectangle(
            this.normalise((0 + globalWidth / 2), 0, globalWidth, 0, this.width),
            this.height,
            this.width,
            this.normalise(10, 0,globalHeight,0,this.height),
            wallOptions,
            
        )
        this.obstacles.push(this.topWall, this.downWall)
        this.obstacles.push(Bodies.rectangle(//left
            0,
            this.normalise((0 + globalHeight / 2), 0, globalHeight, 0, this.height),
            this.normalise(10, 0, globalWidth, 0, this.width),
            this.height,
            wallOptions,
        ))
        this.obstacles.push(Bodies.rectangle(//right
            this.width,
            this.normalise((0 + globalHeight / 2), 0, globalHeight, 0, this.height),
            this.normalise(10, 0, globalWidth, 0, this.width),
            this.height,
            wallOptions,
        ))
    }

    private normalise(x: number, a: number, b: number, c: number, d: number){
        return c + (d - c) * ((x - a) / (b - a));
    }

    private handleCollistion(){
        Events.on(this.engine, "collisionStart", (event) =>{
            event.pairs.forEach((pair)=>{
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;
                        
                        
                if (bodyA === this.ball || bodyB == this.ball){
                    const normal = pair.collision.normal;
                    const Threshold = 0.1;
                    if (Math.abs(normal.x) < Threshold){
                        const sign = Math.sign(this.ball.velocity.x);
                        const i = 0.5;
                        let newVelocity : Vector = { x : Math.min(this.ball.velocity.x + sign * i , this.maxVelocity), y : this.ball.velocity.y}
                        if (Math.abs(newVelocity.x) < 1) newVelocity.x = sign * 1; // Minimum horizontal velocity
                        if (Math.abs(newVelocity.y) < 1) newVelocity.y = sign * 1; // Minimum vertical velocity
                        Body.setVelocity(this.ball, newVelocity)
                    }
                    const otherBody = bodyA === this.ball ? bodyB : bodyA;
                    if (otherBody === this.topWall || otherBody === this.downWall){
                        Body.setPosition(this.ball, { x: this.width / 2, y: this.height / 2 });
                        const velocityScale = 0.01; // Adjust this value to change the speed of the ball
                        Body.setVelocity(this.ball, {x: this.ball.velocity.x < 0 ? this.width * velocityScale : -this.width * velocityScale, y: this.ball.velocity.y > 0 ? -this.height * velocityScale : this.height * velocityScale});
                    }
                    else{
                        let newVelocity : Vector = { x : Math.min(this.ball.velocity.x + Math.sign(this.ball.velocity.x) * 0.5 , this.maxVelocity), y : this.ball.velocity.y}
                        if ( (newVelocity.x >= -0.5 && newVelocity.x <= 0.5) ||  (newVelocity.y >= -0.5 && newVelocity.y <= 0.5))
                            newVelocity = { x : newVelocity.x + (newVelocity.x < 0 ? -0.5: 0.5), y : this.ball.velocity.y + (newVelocity.y < 0 ? -0.5: 0.5)}
                    }
                }            
            });
        }); 
    }


    public  getSize(){return [this.width, this.height]}

    public  setLeftPressed(value: boolean): void {
        this.leftPressed = value;
      }
      
    public  setRightPressed(value: boolean): void {
        this.rightPressed = value;
      }

    public destroyGame(){
        this.state = false;
        Runner.stop(this.runner);
        Render.stop(this.render);
        this.render.canvas.remove();
        Engine.clear(this.engine);
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
    }
}

export default GameClass;
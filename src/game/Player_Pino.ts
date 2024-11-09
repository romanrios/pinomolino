import { Graphics, ObservablePoint, Rectangle } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Keyboard } from "../utils/Keyboard";
import { IHitbox } from "./IHitbox";
import { StateAnimation } from "./StateAnimation";
import { sound } from "@pixi/sound";
import { GamepadController } from "../utils/GamepadController";


export class Player_Pino extends PhysicsContainer implements IHitbox {


    private static readonly GRAVITY = 3000;
    private static readonly MOVE_SPEED = 350;
    private static readonly JUMP = 1200;
    public isMoving = false;
    public canJump = true;
    private robotAnimated: StateAnimation;
    private hitbox: Graphics;

    constructor() {
        super();

        this.robotAnimated = new StateAnimation();
        this.robotAnimated.pivot.set(this.robotAnimated.width / 2, this.robotAnimated.height)

        this.robotAnimated.addState("run", [
            ("walk0.png"),
            ("walk1.png"),
            ("walk2.png"),
            ("walk3.png"),
            ("walk4.png"),
            ("walk5.png"),
            ("walk6.png"),
            ("walk7.png")
        ]);

        this.robotAnimated.addState("jump", [
            ("jump.png"),
        ]);

        this.robotAnimated.addState("idle", [
            ("idle.png"),
        ]);

        this.robotAnimated.playState("run", true);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF);
        this.hitbox.visible = false;
        this.hitbox.drawRect(0, -175, 100, 175);
        this.hitbox.endFill;
        this.hitbox.pivot.x = this.hitbox.width / 2;

        this.addChild(this.robotAnimated);
        this.addChild(this.hitbox);

        this.acceleration.y = Player_Pino.GRAVITY;

    }




    public override update(deltaMS: number) {
        super.update(deltaMS / 1000);
        //this.robotAnimated.update(deltaMS / (1000 / 60), 0)

        // Prioridad para controles de teclado
        if (Keyboard.state.get("ArrowRight")) {
            this.moveRight();
        } else if (Keyboard.state.get("ArrowLeft")) {
            this.moveLeft();
        } else {
            // Si el teclado no está en uso, usar controles de gamepad
            const joystickDirection = GamepadController.getJoystickDirection();
            if (joystickDirection) {
                if (joystickDirection.x > 0.5) {
                    this.moveRight();
                } else if (joystickDirection.x < -0.5) {
                    this.moveLeft();
                } else if (!this.isMoving) {
                    this.speed.x = 0;
                }
            } else if (!this.isMoving) {
                this.speed.x = 0;
            }
        }


        // Control de salto
        if ((Keyboard.state.get("ArrowUp") || GamepadController.isButtonPressed(0) || GamepadController.isButtonPressed(1) || GamepadController.isButtonPressed(2) || GamepadController.isButtonPressed(3)) && this.canJump) {
            this.jump();
        }
        



    }



    private moveRight() {
        this.speed.x = Player_Pino.MOVE_SPEED;
        this.robotAnimated.scale.x = 1;
    }


    private moveLeft() {
        this.speed.x = -Player_Pino.MOVE_SPEED;
        this.robotAnimated.scale.x = -1;
    }




    // Pública para poder acceder desde la escena
    jump() {
        this.canJump = false;
        sound.play("jump", { volume: 0.4, singleInstance: true });
        this.speed.y = -Player_Pino.JUMP;
        this.robotAnimated.playState("jump", false);
    }


    public getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }

    public separate(overlap: Rectangle, platform: ObservablePoint<any>, platformSpeed: number) {
        if (overlap.width < overlap.height) {
            if (this.x > platform.x) {
                //this.x += overlap.width;
            } else if (this.x < platform.x) {
                //this.x -= overlap.width;
            }
        }
        else {

            if (this.y < platform.y && this.speed.y > 1) {
                this.y -= overlap.height;
                this.speed.y = 0;
                this.canJump = true;

                //
                this.x += platformSpeed;


                if (this.speed.x !== 0) {
                    this.robotAnimated.playState("run", false)
                }
                else {
                    this.robotAnimated.playState("idle", true)
                }

            } else if (this.y > platform.y) {
                // this.y += overlap.height;
                //  this.speed.y = 0;
            }
        }
    }

    public setPlayerScaleX(scaleX: number) {
        this.robotAnimated.scale.x = scaleX;
    }

    public playState(state: string, value: boolean) {
        this.robotAnimated.playState(state, value);
    }
}
import { Graphics, ObservablePoint, Rectangle } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Keyboard } from "../utils/Keyboard";
import { IHitbox } from "./IHitbox";
import { StateAnimation } from "./StateAnimation";

export class Player_clase12 extends PhysicsContainer implements IHitbox {


    private static readonly GRAVITY = 3000;
    private static readonly MOVE_SPEED = 350;
    private static readonly JUMP = 1200;
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
        this.hitbox.beginFill(0xFF00FF, 0.0001);
        this.hitbox.drawRect(0, -175, 100, 175);
        this.hitbox.endFill;
        this.hitbox.pivot.x = this.hitbox.width / 2;

        this.addChild(this.robotAnimated);
        this.addChild(this.hitbox);

        this.acceleration.y = Player_clase12.GRAVITY;

        Keyboard.down.on("ArrowUp", this.jump, this)

        // agregado para que no anule botones touch
        Keyboard.up.on("ArrowLeft", () => {
            this.speed.x = 0;
        });

        Keyboard.up.on("ArrowRight", () => {
            this.speed.x = 0;
        });
    }









    public override update(deltaMS: number) {
        super.update(deltaMS / 1000);
        //this.robotAnimated.update(deltaMS / (1000 / 60), 0)

        if (Keyboard.state.get("ArrowRight")) {
            this.speed.x = Player_clase12.MOVE_SPEED;
            this.robotAnimated.scale.x = 1
        } else if (Keyboard.state.get("ArrowLeft")) {
            this.speed.x = -Player_clase12.MOVE_SPEED;
            this.robotAnimated.scale.x = -1;

        }

        if (Keyboard.state.get("ArrowDown")) {
            this.speed.y = 1400;
        }
    }

    // la contraparte de agregar eventos al teclado, debemos apagarlos
    public override destroy(options: any) {
        super.destroy(options);
        Keyboard.down.off("ArrowUp", this.jump)
    }

    // Pública para poder acceder desde Clase_12_AnimationScene.ts
    jump() {
        if (this.canJump) {
            this.canJump = false;
            this.speed.y = -Player_clase12.JUMP;
            this.robotAnimated.playState("jump", false);
        }
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
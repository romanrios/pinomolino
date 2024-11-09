import { Container, } from "pixi.js";
import { Button } from "./Button";
import { Player_Pino } from "../game/Player_Pino";

export class TouchControllers extends Container {
    constructor(player: Player_Pino) {
        super();

        // Movement buttons
        const buttonLeft = new Button(0xf52261, "next.png");
        buttonLeft.position.set(150, 650);
        buttonLeft.getChildAt(1).angle = 180
        buttonLeft.getChildAt(1).position.x -= 2
        this.addChild(buttonLeft);
        buttonLeft.on('pointerdown', () => {
            player.isMoving = true;
            player.speed.x = -350;
            player.setPlayerScaleX(-1);
        })
            .on('pointerup', () => { player.isMoving = false })
            .on('pointerout', () => { player.isMoving = false })
            .on('pointerupoutside', () => { player.isMoving = false });

        const buttonRight: Button = new Button(0xf52261, "next.png");
        buttonRight.position.set(300, 650);
        this.addChild(buttonRight);
        buttonRight.on('pointerdown', () => {
            player.isMoving = true;
            player.speed.x = 350;
            player.setPlayerScaleX(1);
        })
            .on('pointerup', () => { player.isMoving = false })
            .on('pointerupoutside', () => { player.isMoving = false })
            .on('pointerout', () => { player.isMoving = false });

        const buttonJump: Button = new Button(0xf52261, "next.png");
        buttonJump.position.set(1100, 650);
        buttonJump.getChildAt(1).angle = -90;
        buttonJump.getChildAt(1).position.y -= 3;
        this.addChild(buttonJump);
        buttonJump.on('pointerdown', () => { if(player.canJump)player.jump() });


    }
};
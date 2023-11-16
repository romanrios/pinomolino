import { Container, NineSlicePlane, Sprite, SpriteSource, Texture } from "pixi.js";

export class Button extends Container {
    constructor(tint: number, buttonSprite: SpriteSource) {
        super();


        const button = new NineSlicePlane(
            Texture.from("panel3.png"),
            30, 30, 30, 30
        );
        button.width = 140;
        button.height = 140;
        button.pivot.set(button.width / 2);
        button.alpha = 0.5;
        button.tint = tint;
        this.addChild(button);

        const buttonContent = Sprite.from(buttonSprite)
        buttonContent.pivot.set(buttonContent.width / 2);
        buttonContent.scale.set(0.7);
        buttonContent.position.set(button.x, button.y);
        this.addChild(buttonContent);

        this.eventMode = 'static'; // replaces interactive true
        this.cursor = 'pointer';


        this.onpointerdown = () => {
            button.tint = button.tint as number - 10000;
        }



        this.onpointerup = () => {
            button.tint = 0xf52261;
        }

        this.onpointerupoutside = () => {
            button.tint = 0xf52261;
        }

    }
};
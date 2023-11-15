import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";

export class Item extends Container implements IHitbox {

    collision = false;

    private hitbox: Graphics;
    tween1: any;
    tween2: any;

    constructor() {

        super();

        const container = new Container();
        this.addChild(container);

        const botones = ["boton1.png", "boton2.png", "boton3.png", "boton4.png", "boton5.png", "boton6.png"];
        const boton = Sprite.from(botones[Math.floor(Math.random() * 5.99)])
        boton.anchor.set(0.5);
        container.addChild(boton);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF);
        this.hitbox.visible = false;
        this.hitbox.drawCircle(0, 0, 25);
        container.addChild(this.hitbox);

        this.tween1 = new Tween(container)
            .to({ angle: 360 }, 3000)
            .start()
            .repeat(Infinity);

        this.tween2 = new Tween(container)
            .to({ y: this.y - 50 }, Math.random() * 1000 + 2000)
            .start()
            .yoyo(true)
            .repeat(Infinity)
    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds()
    }
}
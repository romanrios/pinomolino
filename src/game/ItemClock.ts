import { Container, Rectangle, Sprite } from "pixi.js";
import { IHitbox } from "./IHitbox";
import { Tween } from "tweedle.js";

export class ItemClock extends Container implements IHitbox {

    collision = false;

    constructor() {

        super();

        const boton = Sprite.from("clock_color.png")
        boton.anchor.set(0.5);

        this.addChild(boton);

        new Tween(boton)
            .to({ y: boton.y - 50 }, Math.random()*1000+2000)
            .start()
            .yoyo(true)
            .repeat(Infinity)

    }

    public getHitbox(): Rectangle {
        return this.getBounds()
    }
}
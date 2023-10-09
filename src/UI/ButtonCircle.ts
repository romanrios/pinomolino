import { Container, Sprite } from "pixi.js";
// import { Sound } from "@pixi/sound";

export class ButtonCircle extends Container {
    constructor(sprite: string) {
        super()

        const button = Sprite.from(sprite);
        button.anchor.set(0.5);     
        
        button.eventMode = "static";
        button.cursor = "pointer";
        button.on("pointerover", () => { button.scale.set(button.scale.x*1.1) })
        button.on("pointerout", () => { button.scale.set(button.scale.x/1.1) })
        button.on("pointerup", () => { 
            
            // Sound.from({
            //     url: "whoosh.ogg", singleInstance: true, volume: 0.5
            // }).play();

         })

        this.addChild(button);
    }
}
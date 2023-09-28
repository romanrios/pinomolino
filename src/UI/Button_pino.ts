import { Container, Sprite, Text } from "pixi.js";


export class Button_pino extends Container {
    constructor(text: string) {
        super()

        const button_bg = Sprite.from("Button_bg");
        button_bg.anchor.set(0.5);
        const text_button = new Text(text, { fontFamily: "Montserrat Bold", fill: 0xFFFFFF, fontSize: 27, align: "center" });
        text_button.position.set(0, -3);
        text_button.anchor.set(0.5);
        const button_play = new Container();
        button_play.addChild(button_bg, text_button);
        button_play.eventMode = "static";
        button_play.cursor = "pointer";
        button_play.on("pointerover", () => { button_play.scale.set(1.1) })
        button_play.on("pointerout", () => { button_play.scale.set(1) })
        this.addChild(button_play);
    }
}
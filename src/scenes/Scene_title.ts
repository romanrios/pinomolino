import { Container, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Item } from "../game/Item";
import { Scene_level_1 } from "./Scene_level_1";
import { Sound } from "@pixi/sound";

export class Scene_title extends Container implements IScene {

    constructor() {
        super()

        Sound.from({ url: "pino_song.ogg", singleInstance: true, loop: true, volume: 0.5 }).play();

        const bg = Sprite.from("bg_molino");
        bg.anchor.set(0.5);
        bg.position.set(Manager.width / 2, Manager.height / 2)
        bg.scale.set(1.2);
        this.addChild(bg);

        const title = Sprite.from("title");
        title.anchor.set(0.5);
        title.position.set(Manager.width / 2, Manager.height / 2 - 20);
        this.addChild(title);

        const item0 = new Item();
        item0.position.set(372, 527);
        this.addChild(item0);

        const item1 = new Item();
        item1.position.set(396, 312);
        this.addChild(item1);

        const item2 = new Item();
        item2.position.set(424, 377);
        this.addChild(item2);

        const item3 = new Item();
        item3.position.set(333, 433);
        this.addChild(item3);

        const item4 = new Item();
        item4.position.set(807, 326);
        this.addChild(item4);

        const item5 = new Item();
        item5.position.set(898, 333);
        this.addChild(item5);

        const item6 = new Item();
        item6.position.set(944, 387);
        this.addChild(item6);

        const item7 = new Item();
        item7.position.set(898, 445);
        this.addChild(item7);

        const item8 = new Item();
        item8.position.set(968, 467);
        this.addChild(item8);

        const text1 = new Text(
            "¡Hola! Soy Pino, vivo en\nEl Molino Fábrica Cultural\n¿Lo conocés?\n¡Acompañame a descubrirlo!"
            , { fontFamily: "Montserrat Bold", fill: 0x4D4D4D, fontSize: 15, lineHeight: 30 });
        text1.position.set(620, 350);
        this.addChild(text1)

        const button_bg = Sprite.from("Button_bg");
        button_bg.anchor.set(0.5);
        const text_button = new Text("Jugar", { fontFamily: "Montserrat Bold", fill: 0xFFFFFF, fontSize: 27, align: "center" });
        text_button.position.set(0, -3);
        text_button.anchor.set(0.5);
        const button_play = new Container();
        button_play.addChild(button_bg, text_button);
        button_play.position.set(740, 520);
        button_play.eventMode = "static";
        button_play.cursor = "pointer";
        button_play.on("pointerover", () => { button_play.scale.set(1.1) })
        button_play.on("pointerout", () => { button_play.scale.set(1) })
        button_play.on("pointerup", () => { Manager.changeScene(new Scene_level_1()) })
        
        this.addChild(button_play);


        const text2 = new Text(
            "© 2023 Román Ríos\nCreado con el apoyo de The Rabbit Hole\ny Capital Activa, Municipalidad de Santa Fe"
            , { fontFamily: "Montserrat Bold", fill: 0xFFFFFF, fontSize: 15, lineHeight: 30, align: "center" });
        text2.anchor.x = 0.5;
        text2.position.set(Manager.width / 2, 605);
        this.addChild(text2)





    }



    update(_deltaTime: number, _deltaFrame: number): void {
        // throw new Error("Method not implemented.");
    }
}
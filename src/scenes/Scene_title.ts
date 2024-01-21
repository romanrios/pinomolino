import { Container, Graphics, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Item } from "../game/Item";
import { sound } from "@pixi/sound";
import { Button_pino } from "../UI/ButtonText";
import { Scene_level_1 } from "./Scene_level_1";
import { Easing, Tween } from "tweedle.js";
import { HighScore } from "../UI/HighScore";
import { ButtonCircle } from "../UI/ButtonCircle";

export class Scene_title extends Container implements IScene {

    constructor(title_or_highscore: string) {
        super()

        sound.play("pinosong_title", { singleInstance: true, loop: true, volume: 0.5 });

        const bg = Sprite.from("bg_molino.jpg");
        bg.anchor.set(0.5);
        bg.position.set(Manager.width / 2, Manager.height / 2)
        bg.scale.set(1.2);
        this.addChild(bg);

        const container = new Container();
        container.y = -720;
        this.addChild(container);

        const title = Sprite.from("title.png");
        title.anchor.set(0.5);
        title.position.set(Manager.width / 2, Manager.height / 2 - 20);
        container.addChild(title);

        // Crear un arreglo para almacenar las posiciones de los elementos
        const posiciones = [
            { x: 372, y: 527 },
            { x: 396, y: 312 },
            { x: 424, y: 377 },
            { x: 333, y: 433 },
            { x: 807, y: 326 },
            { x: 898, y: 333 },
            { x: 944, y: 387 },
            { x: 898, y: 514 },
            { x: 968, y: 467 },
        ];

        // Crear y agregar los elementos Item en base a las posiciones
        for (const posicion of posiciones) {
            const item = new Item();
            item.position.set(posicion.x, posicion.y);
            container.addChild(item);
        }

        const text1 = new Text(
            "¡Hola! Soy Pino, vivo en\nEl Molino Fábrica Cultural,\n¡Ayudame a juntar botones\nantes que se acabe el tiempo!"
            , { fontFamily: "Montserrat Bold", fill: 0x4D4D4D, fontSize: 15, lineHeight: 27 });
        text1.position.set(618, 348);
        container.addChild(text1)

        const buttonJugar = new Button_pino("Jugar", "button_bg.png")
        buttonJugar.position.set(740, 520);
        buttonJugar.eventMode = "static";
        buttonJugar.on("pointerup", () => {

            buttonJugar.eventMode = "none";
            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.mask = circlemask;

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { Manager.changeScene(new Scene_level_1()) })
        });

        container.addChild(buttonJugar);

        const text2 = new Text(
            "© 2023 Román Ríos\nCreado con el apoyo de The Rabbit Hole\ny Capital Activa, Municipalidad de Santa Fe"
            , { fontFamily: "Montserrat Bold", fill: 0xFFFFFF, fontSize: 15, lineHeight: 30, align: "center" });
        text2.anchor.x = 0.5;
        text2.position.set(Manager.width / 2, 605);
        text2.eventMode = "static";
        text2.cursor = "pointer";
        text2.on("pointerup", () => {
            window.open("https://romanrios.github.io", "_blank");
        })
            .on("pointerover", () => { text2.scale.set(1.05) })
            .on("pointerout", () => { text2.scale.set(1) })
        container.addChild(text2)

        const circlemask2 = new Graphics();
        circlemask2.position.set(Manager.width / 2, Manager.height / 2);
        circlemask2.beginFill(0xFFFFFF);
        circlemask2.drawCircle(0, 0, 150);
        circlemask2.scale.set(0.05);
        this.addChild(circlemask2);

        this.mask = circlemask2;

        new Tween(circlemask2)
            .to({ scale: { x: 10, y: 10 } }, 600)
            .easing(Easing.Quintic.In)
            .start()
            .onComplete(() => {
                new Tween(container)
                    .to({ y: 0 }, 800)
                    .start()
                    .easing(Easing.Bounce.Out)
                    .onComplete(() => {
                        this.mask = null;
                        this.removeChild(circlemask2);
                        circlemask2.destroy();
                    })
            })


        const black_alpha = new Graphics();
        black_alpha.beginFill(0x000000);
        black_alpha.drawRect(0, 0, Manager.width, Manager.height);
        black_alpha.alpha = 0.4;
        black_alpha.visible = false;
        this.addChild(black_alpha);

        const highScore = new HighScore();
        highScore.position.set(420, 25);
        highScore.visible = false;
        this.addChild(highScore);

        const button_back = new ButtonCircle("button_back.png");
        button_back.eventMode = "static";
        button_back.position.set(1195, 68);
        button_back.scale.set(1.2);
        button_back.visible = false;
        button_back.on("pointerup", () => {
            highScore.visible = false;
            black_alpha.visible = false;
            container.visible = true;
            button_back.visible = false;
        })
        this.addChild(button_back);

        if (title_or_highscore == "highscore") {
            highScore.visible = true;
            container.visible = false;
            button_back.visible = true;
            black_alpha.visible = true;
        }

        const button_ranking = new ButtonCircle("button_ranking.png");
        button_ranking.position.set(1195, 90);
        button_ranking.eventMode = "static";
        button_ranking.on("pointerup", () => {
            highScore.visible = true;
            black_alpha.visible = true;
            container.visible = false;
            button_back.visible = true;
        })
        container.addChild(button_ranking);

        const button_speaker = new ButtonCircle("button_speaker.png");
        button_speaker.scale.set(0.8);
        button_speaker.position.set(960, 60);
        button_speaker.eventMode = "static";

        button_speaker.on("pointerup", () => {
            sound.muteAll();
            Manager.muted = true;
            button_speaker.visible = false;
            button_speaker_off.visible = true;

        })
        container.addChild(button_speaker);

        const button_speaker_off = new ButtonCircle("button_speaker_off.png");
        button_speaker_off.scale.set(0.8);
        button_speaker_off.position.set(960, 60);
        button_speaker_off.eventMode = "static";
        button_speaker_off.visible = false;
        button_speaker_off.on("pointerup", () => {
            Manager.muted = false;
            sound.unmuteAll();
            button_speaker.visible = true;
            button_speaker_off.visible = false;
        })
        container.addChild(button_speaker_off);

        if (Manager.muted) {
            button_speaker.visible = false;
            button_speaker_off.visible = true;
        }


        const button_fullscreen = new ButtonCircle("button_fullscreen.png");
        button_fullscreen.scale.set(0.8);
        button_fullscreen.position.set(1070, 60);
        button_fullscreen.onpointerdown = () => {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        };
        container.addChild(button_fullscreen);



    }

    update(_deltaTime: number, _deltaFrame: number): void {
        // throw new Error("Method not implemented.");
    }
}
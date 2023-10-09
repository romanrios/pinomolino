import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { Button_pino } from "./ButtonText";
import { ItemClock } from "../game/ItemClock";
import { Scene_title } from "../scenes/Scene_title";
import { Input } from "@pixi/ui";
import { agregarPuntaje } from "../utils/firebaseConfig";
import { ButtonCircle } from "./ButtonCircle";
import { Easing, Tween } from "tweedle.js";
import { Sound, sound } from "@pixi/sound";
import { Scene_level_1 } from "../scenes/Scene_level_1";

export class Completed_UI extends Container {
    private input: Input;
    private button_play: Button_pino;
    private score_text: Text;
    button_back: ButtonCircle;
    button_retry: ButtonCircle;

    constructor(score: string) {
        super()

        const black_alpha = new Graphics();
        black_alpha.beginFill(0x000000);
        black_alpha.drawRect(0, 0, Manager.width, Manager.height);
        black_alpha.alpha = 0.5;
        this.addChild(black_alpha);

        const bg = Sprite.from("completed_ui_bg");
        bg.anchor.set(0.5);
        bg.scale.set(0.75);
        bg.position.set(Manager.width / 2, 359);
        this.addChild(bg);

        const text_completado = new Text("COMPLETADO", { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 40, letterSpacing: 2 });
        text_completado.anchor.set(0.5);
        text_completado.position.set(Manager.width / 2, 207);
        this.addChild(text_completado);

        const clock = new ItemClock();
        clock.position.set(Manager.width / 2, 165);
        this.addChild(clock);

        const text_congrat = new Text("¡Felicitaciones!\nTu puntaje es:", { fontFamily: "Montserrat Bold", align: "right", fill: "0x4D4D4D", fontSize: 22, lineHeight: 30 });
        text_congrat.anchor.set(0.5);
        text_congrat.position.set(bg.x - 90, 347);
        this.addChild(text_congrat);

        const UI_number_container = Sprite.from("UI_number_container");
        UI_number_container.position.set(bg.x + 100, 355)
        UI_number_container.anchor.set(0.5);
        this.addChild(UI_number_container);

        this.score_text = new Text(score, { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 50, letterSpacing: 2 });
        this.score_text.anchor.set(0.5);
        this.score_text.position.set(UI_number_container.x + 3, UI_number_container.y - 6);
        this.addChild(this.score_text);


        this.input = new Input({
            placeholder: "Ingresa tu nombre",
            align: "center",
            bg: new Graphics()
                .beginFill(0xFFFFFF)
                .drawRoundedRect(0, 0, 350, 50, 25),
            textStyle: {
                fill: 0x4D4D4D,
                fontSize: 25,
                fontFamily: "Montserrat Bold",
            },
        });


        this.input.position.set(Manager.width / 2 - this.input.width / 2, 450);

        this.input.onChange.connect(
            () => {
                if (this.input.value == "") {
                    this.button_play.alpha = 0.6;
                    this.button_play.eventMode = "none";
                } else {
                    this.button_play.alpha = 1;
                    this.button_play.eventMode = "static";
                }
            }
        )

        this.input.onEnter.connect(() => {
            if (typeof document.activeElement !== "undefined") {
                (document.activeElement as HTMLElement).blur();
            }
        }
        )






        this.addChild(this.input);

        this.button_play = new Button_pino("Enviar", "Button_bg2");
        this.button_play.position.set(735, 566);
        this.button_play.eventMode = "none";
        this.button_play.alpha = 0.8;
        this.button_play.on("pointerup", () => {

            agregarPuntaje(this.input.value, this.score_text.text)

            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.parent.mask = circlemask;

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => {
                    sound.stopAll();
                    Manager.changeScene(new Scene_title("highscore"));

                })






        })
        this.addChild(this.button_play);

        this.button_back = new ButtonCircle("button_back.svg");
        this.button_back.scale.set(0.9);
        this.button_back.eventMode = "static";
        this.button_back.position.set(490, 550);
        this.button_back.on("pointerup", () => {

            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.parent.mask = circlemask;

            Sound.from({
                url: "whoosh.ogg", singleInstance: true, volume: 0.5
            }).play();

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_title("title")) })
        })
        this.addChild(this.button_back);




        this.button_retry = new ButtonCircle("button_retry.svg");
        this.addChild(this.button_retry);
        this.button_retry.scale.set(0.9);
        this.button_retry.eventMode = "static";
        this.button_retry.position.set(590, 565);
        this.button_retry.on("pointerup", () => {

            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.parent.mask = circlemask;

            Sound.from({
                url: "whoosh.ogg", singleInstance: true, volume: 0.5
            }).play();

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_level_1()); })
        })





    }
}
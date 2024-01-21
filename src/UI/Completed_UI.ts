import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { Button_pino } from "./ButtonText";
import { ItemClock } from "../game/ItemClock";
import { Scene_title } from "../scenes/Scene_title";
import { agregarPuntaje } from "../utils/firebaseConfig";
import { ButtonCircle } from "./ButtonCircle";
import { Easing, Tween } from "tweedle.js";
import { Sound, sound } from "@pixi/sound";
import { Scene_level_1 } from "../scenes/Scene_level_1";

const TextInput = require('pixi-text-input')

export class Completed_UI extends Container {

    private input: typeof TextInput;

    private button_send: Button_pino;
    private score_text: Text;
    button_back: ButtonCircle;
    button_retry: ButtonCircle;

    constructor(score: string) {
        super()

        const bg = Sprite.from("completed_ui_bg.png");
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

        const text_congrat = new Text("Felicitaciones!\nTu puntaje es:", { fontFamily: "Montserrat Bold", align: "right", fill: "0x4D4D4D", fontSize: 22, lineHeight: 30 });
        text_congrat.anchor.set(0.5);
        text_congrat.position.set(bg.x - 90, 347);
        this.addChild(text_congrat);

        const UI_number_container = Sprite.from("UI_number_container.png");
        UI_number_container.position.set(bg.x + 100, 355)
        UI_number_container.anchor.set(0.5);
        this.addChild(UI_number_container);

        this.score_text = new Text(score, { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 50, letterSpacing: 2 });
        this.score_text.anchor.set(0.5);
        this.score_text.position.set(UI_number_container.x + 3, UI_number_container.y - 6);
        this.addChild(this.score_text);

        // this.input = new Input({
        //     placeholder: "Ingresa tu nombre",
        //     align: "center",
        //     bg: new Graphics()
        //         .beginFill(0xFFFFFF)
        //         .drawRoundedRect(0, 0, 350, 50, 25),
        //     textStyle: {
        //         fill: 0x4D4D4D,
        //         fontSize: 25,
        //         fontFamily: "Montserrat Bold",
        //     },
        // });


        // this.input.position.set(Manager.width / 2 - this.input.width / 2, 450);

        // this.input.onChange.connect(
        //     () => {
        //         if (this.input.value == "") {
        //             this.button_send.alpha = 0.6;
        //             this.button_send.eventMode = "none";
        //         } else {
        //             this.button_send.alpha = 1;
        //             this.button_send.eventMode = "static";
        //         }
        //     }
        // )

        // this.input.onEnter.connect(() => {
        //     if (typeof document.activeElement !== "undefined") {
        //         (document.activeElement as HTMLElement).blur();
        //     }
        // }
        // )




        // TEXT INPUT
        this.input = new TextInput({
            input: {
                align: 'center',
                fontSize: '25px',
                padding: '12px',
                width: '350px',
                color: '0x4D4D4D',
                fontFamily: "Montserrat Bold",
                textAlign: "center",
            },
            box: {
                default: { fill: 0xFFFFFF, rounded: 25 },
            }
        })

        this.input.maxLength = 18;
        this.input.placeholder = 'Ingresa tu nombre'
        this.input.position.set(Manager.width / 2, 470);
        this.input.pivot.set(this.input.width / 2, this.input.height / 2);
        this.addChild(this.input)

        this.input.eventMode = "static";
        this.input.on("pointertap", () => {
            this.input.focus();
        })

        this.input.on('input', () => {
            if (this.input.text == "") {
                this.button_send.alpha = 0.6;
                this.button_send.eventMode = "none";
            } else {
                this.button_send.alpha = 1;
                this.button_send.eventMode = "static";
            }
        });

        this.addChild(this.input);




        // BUTTON SEND
        this.button_send = new Button_pino("Enviar", "button_bg2.png");
        this.button_send.position.set(735, 566);
        this.button_send.eventMode = "none";
        this.button_send.alpha = 0.8;
        this.button_send.on("pointerup", () => {

            this.button_send.eventMode = "none";

            agregarPuntaje(this.input.text, this.score_text.text);

            // remove html input
            document.body.removeChild(this.input.htmlInput);

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

        this.addChild(this.button_send);




        // BUTTON BACK
        this.button_back = new ButtonCircle("button_back.png");
        this.button_back.scale.set(0.9);
        this.button_back.eventMode = "static";
        this.button_back.position.set(490, 550);
        this.button_back.on("pointerup", () => {

            this.button_back.eventMode = "none";

            // remove html input
            document.body.removeChild(this.input.htmlInput);

            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.parent.mask = circlemask;

            Sound.from({
                url: "whoosh.mp3", singleInstance: true, volume: 0.5
            }).play();

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_title("title")) })
        })
        this.addChild(this.button_back);




        // BUTTON RETRY
        this.button_retry = new ButtonCircle("button_retry.png");
        this.addChild(this.button_retry);
        this.button_retry.scale.set(0.9);
        this.button_retry.eventMode = "static";
        this.button_retry.position.set(590, 565);
        this.button_retry.on("pointerup", () => {

            this.button_retry.eventMode = "none";

            // remove html input
            document.body.removeChild(this.input.htmlInput);

            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.parent.mask = circlemask;

            Sound.from({
                url: "whoosh.mp3", singleInstance: true, volume: 0.5
            }).play();

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_level_1()); })
        })

    }
}
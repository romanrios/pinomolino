import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { Button_pino } from "./Button_pino";
import { ItemClock } from "../game/ItemClock";
import { Scene_title } from "../scenes/Scene_title";
import { Scene_level_1 } from "../scenes/Scene_level_1";

export class Completed_UI extends Container {

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
        bg.position.set(Manager.width / 2, Manager.height / 2 - 20);
        this.addChild(bg);

        const text_completado = new Text("COMPLETADO", { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 40, letterSpacing: 2 });
        text_completado.anchor.set(0.5);
        text_completado.position.set(Manager.width / 2, bg.height - 70);
        this.addChild(text_completado);

        const button_back = new Button_pino("Salir","Button_bg");
        button_back.position.set(540, bg.y + 160);
        button_back.eventMode="static";
        button_back.on("pointerup",()=>{Manager.changeScene(new Scene_title())})
        this.addChild(button_back);

        const button_play = new Button_pino("Jugar","Button_bg2");
        button_play.position.set(735, bg.y + 165);
        button_play.eventMode="static";
        button_play.on("pointerup",()=>{
            Manager.changeScene(new Scene_level_1());
        })
        this.addChild(button_play);

        const clock = new ItemClock();
        clock.position.set(Manager.width / 2, bg.y - 170);
        this.addChild(clock);

        const text_congrat = new Text("¡Felicitaciones!\nTu puntaje es:", { fontFamily: "Montserrat Bold", align: "right", fill: "0x4D4D4D", fontSize: 22,  lineHeight: 30});
        text_congrat.anchor.set(0.5);
        text_congrat.position.set(bg.x-90,bg.y+30);
        this.addChild(text_congrat);

        const UI_number_container = Sprite.from("UI_number_container");
        UI_number_container.position.set(bg.x+100,bg.y+40)
        UI_number_container.anchor.set(0.5);
        this.addChild(UI_number_container);

        const score_text = new Text(score, { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 50, letterSpacing: 2 });
        score_text.anchor.set(0.5);
        score_text.position.set(UI_number_container.x+3,UI_number_container.y-6);
        this.addChild(score_text);




    }
}
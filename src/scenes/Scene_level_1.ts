import { Container, Graphics, Sprite, Text, Texture, TilingSprite, isMobile } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Player_Pino } from "../game/Player_Pino";
import { Platform } from "../game/Platform";
import { checkCollision } from "../game/IHitbox";
import { Easing, Tween } from "tweedle.js";
import { Item } from "../game/Item";
import { Sound, sound } from "@pixi/sound";
import { Button_pino } from "../UI/ButtonText";
import { Scene_title } from "./Scene_title";
import { ItemClock } from "../game/ItemClock";
import { Completed_UI } from "../UI/Completed_UI";
import { TouchControllers } from "../UI/TouchControllers";
import { ButtonCircle } from "../UI/ButtonCircle";

export class Scene_level_1 extends Container implements IScene {

    private playerRobot: Player_Pino;
    private platforms: Platform[] = [];
    private platform1: Platform;
    private platform2: Platform;
    private platform3: Platform;
    private world: Container;
    private background: TilingSprite;
    private table: TilingSprite;
    private items: Item[] = [];
    private score: Text;
    private platform4: Platform;
    private platform5: Platform;
    private cantidadBotones: number = 0;
    private botonesMaximos: number = 10;
    private molino: Sprite;
    private timerCounter: number = 0
    private timerNumber: number = 30;
    private timerText: Text;
    private clocks: ItemClock[] = [];
    private clockIcon: Sprite;
    private gameState: string = "none";
    private button_back: Button_pino;
    private UI_number_container: Sprite;

    constructor() {
        super();

        sound.stopAll();

        this.background = new TilingSprite(Texture.from("bg_molino"), Manager.width, Manager.height);
        this.background.scale.set(1.5);
        this.background.position.set(-100, -400);
        this.addChild(this.background);

        this.table = new TilingSprite(Texture.from("table"), Manager.width, Manager.height);
        this.table.y = 550;
        this.addChild(this.table);

        this.world = new Container()
        this.addChild(this.world)

        const hex_blocks = Sprite.from("hex_blocks");
        hex_blocks.scale.set(1.5);
        hex_blocks.position.set(-398, -17);
        this.world.addChild(hex_blocks);

        const hex_blocks2 = Sprite.from("hex_blocks");
        hex_blocks2.scale.set(1.5);
        hex_blocks2.position.set(2976, -17);
        this.world.addChild(hex_blocks2);

        this.platform1 = new Platform();
        this.platform1.position.set(1900, 300);
        this.platform1.scale.set(0.9);
        this.platforms.push(this.platform1);

        this.platform2 = new Platform();
        this.platform2.position.set(1400, 500);
        this.platform2.scale.set(0.9);
        this.platforms.push(this.platform2);

        this.platform3 = new Platform()
        this.platform3.position.set(600, 400);
        this.platform3.scale.set(0.9);
        this.platforms.push(this.platform3);

        this.platform4 = new Platform()
        this.platform4.position.set(1099, 464);
        this.platform4.scale.x = 0.5;
        this.platform4.visible = false;
        this.platforms.push(this.platform4);

        this.platform5 = new Platform()
        this.platform5.position.set(2528, 535);
        this.platform5.scale.x = 0.9;
        this.platform5.visible = false;
        this.platforms.push(this.platform5);

        const domino = Sprite.from("Domino");
        domino.position.set(2500, 478);
        this.world.addChild(domino);

        const stick = Sprite.from("Stick");
        stick.position.set(1834, 257);
        this.world.addChild(stick);

        this.molino = Sprite.from("Molino");
        this.molino.anchor.set(0.5);
        this.molino.position.set(1840, 200);
        this.world.addChild(this.molino);

        this.world.addChild(...this.platforms)

        this.playerRobot = new Player_Pino();
        this.playerRobot.position.set(417, 620);
        this.playerRobot.scale.set(0.9);
        this.world.addChild(this.playerRobot);

        this.UI_number_container = Sprite.from("UI_number_container");
        this.UI_number_container.x = 1070;
        this.addChild(this.UI_number_container);

        this.score = new Text("0", { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 50, letterSpacing: 2 });
        this.score.position.set(this.UI_number_container.x + 104, this.UI_number_container.y + 82)
        this.score.anchor.set(0.5);
        this.addChild(this.score);

        const casitas = Sprite.from("Casitas");
        casitas.position.set(1088, 430);
        this.world.addChild(casitas);

        this.button_back = new ButtonCircle("button_back.svg");
        this.button_back.eventMode = "static";
        this.button_back.position.set(72, 50);
        this.button_back.on("pointerup", () => {

            const circlemask = new Graphics();
            circlemask.position.set(Manager.width / 2, Manager.height / 2);
            circlemask.beginFill(0x994466);
            circlemask.drawCircle(0, 0, 150);
            circlemask.scale.set(10);
            this.addChild(circlemask);

            this.mask = circlemask;

            Sound.from({
                url: "whoosh.ogg", singleInstance: true, volume: 0.5
            }).play();

            new Tween(circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_title()) })
        })
        this.addChild(this.button_back);

        const circlemask = new Graphics();
        circlemask.position.set(Manager.width / 2, Manager.height / 2);
        circlemask.beginFill(0xFFFFFF);
        circlemask.drawCircle(0, 0, 150);
        circlemask.scale.set(0.05);
        this.addChild(circlemask);

        this.mask = circlemask;

        new Tween(circlemask)
            .to({ scale: { x: 10, y: 10 } }, 600)
            .easing(Easing.Quintic.In)
            .start()
            .onComplete(() => { this.removeChild(circlemask); })

        this.clockIcon = Sprite.from("Clock");
        this.clockIcon.anchor.set(0.5);
        this.clockIcon.scale.set(0.4);
        this.clockIcon.position.set(Manager.width / 2 - 107, 70)
        this.clockIcon.visible = false;
        this.addChild(this.clockIcon);

        this.timerText = new Text("4", { fontFamily: "Montserrat Bold", align: "center", fill: "#ffffff", fontSize: 60, letterSpacing: 2 })
        this.timerText.anchor.set(0.5);
        this.timerText.position.set(Manager.width / 2 + 12, 70);
        this.timerText.visible = false;
        this.addChild(this.timerText);

        this.movementPlatform1()

        new Tween(this.platform2)
            .to({ y: 300 }, 5000)
            .repeat(Infinity)
            .yoyo(true)
            .easing(Easing.Elastic.Out)
            .start();

        new Tween(this.molino)
            .to({ angle: 360 }, 3000)
            .start()
            .repeat(Infinity);

        if (isMobile.any || isMobile.android.device) {
            this.addChild(new TouchControllers(this.playerRobot))
        };

    }



    public update(deltaTime: number, _deltaFrame: number) {

        this.timerCounter += deltaTime;

        if (this.timerCounter > 999) {

            if (this.gameState == "started") {
                this.timerText.text = String(this.secondsToMinutes(this.timerNumber));
                this.timerNumber -= 1;
            } else if (this.gameState == "none") {
                this.timerText.visible = true;
                this.timerText.text = String(Number(this.timerText.text) - 1);
                if (this.timerText.text != "0") {
                    sound.play("Beep", { volume: 0.4 });
                }
                if (this.timerText.text == "0") {
                    this.gameState = "started"
                    sound.play("pino_song", { singleInstance: true, loop: true, volume: 0.5 });
                    this.clockIcon.visible = true;
                }
            }


            this.timerCounter = 0;

            if (this.timerNumber <= 3 && this.timerNumber >= 0) {
                sound.play("Beep", { volume: 0.4 });
            }
        }


        if (this.timerNumber < 0) {
            if (this.gameState != "finished") {
                this.gameState = "finished"
                this.removeChild(this.timerText);
                this.removeChild(this.clockIcon)
                this.removeChild(this.button_back)
                this.removeChild(this.UI_number_container);
                this.removeChild(this.score);
                sound.stopAll()
                sound.play("pinosong_finished", { singleInstance: true, loop: false, volume: 0.6 });
                const completed = new Completed_UI(this.score.text);
                this.addChild(completed);
            }
        }

        this.world.x = -this.playerRobot.x * this.worldTransform.a + Manager.width / 2;
        this.background.tilePosition.x = this.world.x * 0.15;
        this.background.tilePosition.x %= Manager.width;
        this.table.tilePosition.x = this.world.x;

        // Sub-stepping
        if (this.playerRobot.speed.y > 1000) {
            while (deltaTime > 1) {
                deltaTime -= 1;
                this.playerRobot.update(1);
                for (let platform of this.platforms) {
                    const overlap = checkCollision(this.playerRobot, platform);
                    if (overlap != null) {
                        this.playerRobot.separate(overlap, platform.position, platform.speed.x);
                    }
                }
            }
        } else {
            this.playerRobot.update(deltaTime);
            for (let platform of this.platforms) {
                const overlap = checkCollision(this.playerRobot, platform);
                if (overlap != null) {
                    this.playerRobot.separate(overlap, platform.position, platform.speed.x);
                }
            }
        }

        for (let item of this.items) {
            if (checkCollision(this.playerRobot, item) != null && this.gameState != "finished") {
                if (!item.collision) {
                    this.score.text = Number(this.score.text) + 1
                    this.cantidadBotones--;
                    Sound.from({
                        url: `pip${Math.floor(Math.random() * 4) + 1
                            }.ogg`, singleInstance: true
                    }).play();

                    if (Number(this.score.text) > 999) {
                        this.score.scale.set(0.72);
                    }
                    item.collision = true;
                    this.world.removeChild(item)
                    if (this.score.text == "200") {
                    }
                }
            }
        }

        for (let i of this.clocks) {
            if (checkCollision(this.playerRobot, i) != null && this.gameState != "finished") {
                if (!i.collision) {
                    this.timerNumber += 10;
                    this.timerText.text = String(this.secondsToMinutes(this.timerNumber));
                    Sound.from({
                        url: "clock.ogg", singleInstance: true, volume: 0.4
                    }).play();
                }
                i.collision = true;
                this.world.removeChild(i)
            }
        }

        // limit horizontal
        if (this.playerRobot.x > 3000) {
            //limit right
            this.playerRobot.x = 3000;
        } else if (this.playerRobot.x < 312) {
            // limit left
            this.playerRobot.x = 312;
        }
        // limit vertical
        if (this.playerRobot.y > Manager.height - 100) {
            // if (this.playerRobot.canJump == false && this.particle.emit == true) {
            //     this.cartoonSmoke.emit = true
            // }
            this.playerRobot.y = Manager.height - 100;
            this.playerRobot.speed.y = 0;
            this.playerRobot.canJump = true;
            if (this.playerRobot.speed.x !== 0) {
                this.playerRobot.playState("run", false)
            }
            else {
                this.playerRobot.playState("idle", true)
            }
        }

        if (this.cantidadBotones < 1 && this.gameState == "started") {
            this.crearBotones();
            this.timerText.text = String(this.secondsToMinutes(this.timerNumber));
        }

    }
    // **** UPDATE END ****













    private movementPlatform1() {
        new Tween(this.platform1)
            .onUpdate(() => { this.platform1.speed.x = 0 })
            .to({ y: 400 }, 3000)
            .easing(Easing.Elastic.Out)
            .start()
            .onComplete(
                () => {
                    new Tween(this.platform1)
                        .onUpdate(() => { this.platform1.speed.x = 2.8 })
                        .to({ x: this.platform1.x + 500, y: 400 }, 3000)
                        .start()
                        .onComplete(
                            () => {
                                new Tween(this.platform1)
                                    .onUpdate(() => { this.platform1.speed.x = 0 })
                                    .to({ y: 300 }, 3000)
                                    .easing(Easing.Elastic.Out)
                                    .start()
                                    .onComplete(() => {
                                        new Tween(this.platform1)
                                            .onUpdate(() => { this.platform1.speed.x = -2.8 })
                                            .to({ x: this.platform1.x - 500, y: 300 }, 3000)
                                            .start()
                                            .onComplete(this.movementPlatform1.bind(this))
                                    })
                            }
                        )
                }
            )
    }

    private crearBotones() {
        this.items = [];
        let i = 0
        while (i < this.botonesMaximos) {
            const item1 = new Item();
            item1.position.set(Math.random() * 2750 + 280, Math.random() * 430 + 180);
            this.items.push(item1);
            i++;
            this.cantidadBotones++;
        }

        for (let item of this.items) {
            this.world.addChild(item)
        }

        this.botonesMaximos += 10;

        const clock = new ItemClock();
        clock.position.set(Math.random() * 2750 + 280, Math.random() * 430 + 180);
        this.clocks.push(clock);
        this.world.addChild(clock);
    }

    private secondsToMinutes(segundos: number): string {
        const minutos: number = Math.floor(segundos / 60);
        const segundosRestantes: number = segundos % 60;

        // Asegurarse de que tanto los minutos como los segundos tengan dos dígitos
        const minutosFormateados: string = minutos < 10 ? `0${minutos}` : minutos.toString();
        const segundosFormateados: string = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes.toString();

        return `${minutosFormateados}:${segundosFormateados}`;
    }

}

import { Container, Graphics, Sprite, Text, Texture, TilingSprite } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Player_Pino } from "../game/Player_Pino";
import { Platform } from "../game/Platform";
import { checkCollision } from "../game/IHitbox";
import { Easing, Tween } from "tweedle.js";
import { Item } from "../game/Item";
import { Sound, sound } from "@pixi/sound";
import { Button_pino } from "../UI/Button_pino";
import { Scene_title } from "./Scene_title";


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
    private botonesJuntados: Text;
    private platform4: Platform;
    private platform5: Platform;
    private cantidadBotones: number = 0;
    private botonesMaximos: number = 10;
    private textMision: Text;
    private molino: Sprite;

    constructor() {
        super();

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

        this.crearBotones();



        const UI_number_container = Sprite.from("UI_number_container");
        UI_number_container.x = 1070;
        this.addChild(UI_number_container);

        this.botonesJuntados = new Text("0", { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 50, letterSpacing: 2 });
        this.botonesJuntados.position.set(UI_number_container.x + 104, UI_number_container.y + 82)
        this.botonesJuntados.anchor.set(0.5);
        this.addChild(this.botonesJuntados);

        const casitas = Sprite.from("Casitas");
        casitas.position.set(1088, 430);
        this.world.addChild(casitas);

        const button_back = new Button_pino("Salir");
        button_back.eventMode = "static";
        button_back.position.set(90, 45);
        button_back.scale.set(0.9);
        button_back.on("pointerup", () => {

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
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_title()) })
        })
        this.addChild(button_back);



        this.textMision = new Text(`Restantes: ${this.cantidadBotones}`,
            { fontFamily: "Montserrat Bold", fill: 0xFFFFFF, fontSize: 30 });
        this.textMision.anchor.set(0.5);
        this.textMision.position.set(Manager.width / 2, 46);
        this.addChild(this.textMision)


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
            .onComplete(() => { this.removeChild(circlemask); circlemask.destroy })






        // // Movement buttons
        // const buttonLeft = new Button(0xf52261, "Next");
        // buttonLeft.position.set(150, 650);
        // buttonLeft.getChildAt(1).angle = 180
        // buttonLeft.getChildAt(1).position.x -= 2
        // this.addChild(buttonLeft);
        // buttonLeft.on('pointerdown', () => {
        //     this.playerRobot.speed.x = -350;
        //     this.playerRobot.setPlayerScaleX(-1);
        // })
        //     .on('pointerup', () => { this.playerRobot.speed.x = 0 })
        //     .on('pointerout', () => { this.playerRobot.speed.x = 0 })
        //     .on('pointerupoutside', () => { this.playerRobot.speed.x = 0 });

        // const buttonRight: Button = new Button(0xf52261, "Next");
        // buttonRight.position.set(300, 650);
        // this.addChild(buttonRight);
        // buttonRight.on('pointerdown', () => {
        //     this.playerRobot.speed.x = 350;
        //     this.playerRobot.setPlayerScaleX(1);
        // })
        //     .on('pointerup', () => { this.playerRobot.speed.x = 0 })
        //     .on('pointerupoutside', () => { this.playerRobot.speed.x = 0 })
        //     .on('pointerout', () => { this.playerRobot.speed.x = 0 });

        // const buttonJump: Button = new Button(0xf52261, "Next");
        // buttonJump.position.set(1100, 650);
        // buttonJump.getChildAt(1).angle = -90;
        // buttonJump.getChildAt(1).position.y -= 3;
        // this.addChild(buttonJump);
        // buttonJump.on('pointerdown', () => { this.playerRobot.jump() });





        // ****************************
        // Tweedle.JS
        // ****************************      

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

        // ****************************
        // Filters
        // ****************************

        // const myGlow = new GlowFilter({
        //     //color: 0xFFFFFF,
        //     //distance: 20,
        //     alpha: 0.8
        // })
        // this.playerRobot.filters = [myGlow]

    }























    public update(deltaTime: number, _deltaFrame: number) {

        // this.myCRT.time += _deltaFrame;
        // this.myCRT.time %= 20000;
        // this.myCRT.seed = Math.random();
        // this.particle.update(deltaTime / 1000 * 0.5)
        // this.cartoonSmoke.update(deltaTime / 1000 * 0.5)
        this.world.x = -this.playerRobot.x * this.worldTransform.a + Manager.width / 2;
        // this.background.tileScale.x = this.world.scale.x;
        // this.background.tileScale.y = this.world.scale.y;
        this.background.tilePosition.x = this.world.x * 0.15;
        // this.background.tilePosition.x %= 1280       
        this.table.tilePosition.x = this.world.x;

        // Sub-stepping
        if (this.playerRobot.speed.y > 1) {
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
            if (checkCollision(this.playerRobot, item) != null) {
                if (!item.collision) {
                    this.botonesJuntados.text = Number(this.botonesJuntados.text) + 1


                    this.cantidadBotones--;
                    this.textMision.text = `Restantes: ${this.cantidadBotones}`;

                    Sound.from({
                        url: `pip${Math.floor(Math.random() * 4) + 1
                            }.ogg`, singleInstance: true
                    }).play();
                }

                if (Number(this.botonesJuntados.text) > 999) {
                    this.botonesJuntados.scale.set(0.72);
                }

                item.collision = true;
                this.world.removeChild(item)
                item.destroy;
                if (this.botonesJuntados.text == "200") {
                    // alert("NIVEL COMPLETADO")
                }


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

        if (this.cantidadBotones < 1) {
            this.crearBotones();
            this.textMision.text = `Restantes: ${this.cantidadBotones}`;
        }

    }












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
    }





}

import { Container, Sprite, Text, Texture, TilingSprite } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { Player_clase12 } from "../game/Player";
import { Platform } from "../game/Platform";
import { checkCollision } from "../game/IHitbox";
import { Easing, Tween } from "tweedle.js";
import { Item } from "../game/Item";
import { Sound } from "@pixi/sound";



export class Scene_level_1 extends Container implements IScene {

    private playerRobot: Player_clase12;
    private platforms: Platform[];
    private platform1: Platform;
    private platform2: Platform;
    private platform3: Platform;
    private world: Container;
    private background: TilingSprite;
    private table: TilingSprite;
    private items: Item[];
    private UI_number: Text;

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
        hex_blocks.position.set(-170, 200);
        this.world.addChild(hex_blocks);

        this.platforms = [];

        this.platform1 = new Platform();
        this.platform1.position.set(1900, 300);
        this.platform1.scale.set(0.9);
        this.platforms.push(this.platform1);

        this.platform2 = new Platform();
        this.platform2.position.set(1400, 500);
        this.platform2.scale.set(0.9);
        this.platforms.push(this.platform2);

        this.platform3 = new Platform()
        this.platform3.position.set(500, 400);
        this.platform3.scale.set(0.9);
        this.platforms.push(this.platform3);

        this.world.addChild(...this.platforms)

        this.playerRobot = new Player_clase12();
        this.playerRobot.position.set(300, 500);
        this.playerRobot.scale.set(0.9);
        this.world.addChild(this.playerRobot);

        this.items = [];
        let i = 0
        while (i < 50) {
            const item1 = new Item();
            item1.position.set(Math.random() * 2750 + 280, Math.random() * 430 + 180);
            this.items.push(item1);
            i++;
        }

        for (let item of this.items) {
            this.world.addChild(item)
        }

        const UI_number_container = Sprite.from("UI_number_container");
        UI_number_container.x = 1040;
        this.addChild(UI_number_container);

        this.UI_number = new Text("0", { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 55, letterSpacing: 5 });
        this.UI_number.position.set(UI_number_container.x + 113, UI_number_container.y + 93)
        this.UI_number.anchor.set(0.5);
        this.addChild(this.UI_number);


        // Movement buttons
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
                    this.UI_number.text = Number(this.UI_number.text) + 1

                    Sound.from({
                        url: `pip${Math.floor(Math.random() * 4) + 1
                            }.ogg`, singleInstance: false
                    }).play();

                }
                item.collision = true;
                this.world.removeChild(item)
                item.destroy;
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
}

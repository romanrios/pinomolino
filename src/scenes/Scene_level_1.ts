import { Container, Graphics, Sprite, Text, Texture, TilingSprite } from "pixi.js";
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
import { GamepadController } from "../utils/GamepadController";

export class Scene_level_1 extends Container implements IScene {

    private world: Container;
    private player: Player_Pino;
    private background: TilingSprite;
    private table: TilingSprite;
    private platformFloor: Platform;
    private platform1: Platform;
    private platform2: Platform;
    private platform3: Platform;
    private platform4: Platform;
    private platform5: Platform;
    private platforms: Platform[] = [];
    private items: Item[] = [];
    private clocks: ItemClock[] = [];
    private clockIcon: Sprite;
    private score: Text;
    private cantidadBotones: number = 0;
    private botonesMaximos: number = 10;
    private timerCounter: number = 0
    private timerNumber: number = 30;
    private timerText: Text;
    private gameState: string = "none";
    private button_back: Button_pino;
    private UI_number_container: Sprite;
    private platform1speedX: number = 0;
    private molino: Sprite;
    private circlemask: Graphics = new Graphics();
    public static isTransitioning = true;
    private completed: any;

    constructor() {
        super();

        sound.stopAll();

        this.background = new TilingSprite(Texture.from("bg_molino.jpg"), Manager.width, Manager.height);
        this.background.scale.set(1.5);
        this.background.position.set(-100, -400);
        this.addChild(this.background);

        this.table = new TilingSprite(Texture.from("table.png"), Manager.width, Manager.height);
        this.table.y = 550;
        this.addChild(this.table);

        this.world = new Container()
        this.addChild(this.world)

        const hex_blocks = Sprite.from("hex_blocks.png");
        hex_blocks.position.set(-27, 26);
        this.world.addChild(hex_blocks);

        const hex_blocks2 = Sprite.from("hex_blocks.png");
        hex_blocks2.position.set(3010, 26);
        this.world.addChild(hex_blocks2);

        this.platformFloor = new Platform();
        this.platformFloor.position.set(50, 642);
        this.platformFloor.scale.x = 10;
        this.platformFloor.visible = false;
        this.platforms.push(this.platformFloor);

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

        const domino = Sprite.from("domino.png");
        domino.position.set(2500, 478);
        this.world.addChild(domino);

        const stick = Sprite.from("stick.png");
        stick.position.set(1834, 257);
        this.world.addChild(stick);

        this.molino = Sprite.from("molino.png");
        this.molino.anchor.set(0.5);
        this.molino.position.set(1840, 200);
        this.world.addChild(this.molino);

        this.world.addChild(...this.platforms)

        this.player = new Player_Pino();
        this.player.position.set(417, 620);
        this.player.scale.set(0.9);
        this.world.addChild(this.player);

        this.UI_number_container = Sprite.from("UI_number_container.png");
        this.UI_number_container.x = 1070;
        this.addChild(this.UI_number_container);

        this.score = new Text("0", { fontFamily: "Chunq", align: "center", fill: "#ffffff", fontSize: 50, letterSpacing: 2 });
        this.score.position.set(this.UI_number_container.x + 104, this.UI_number_container.y + 82)
        this.score.anchor.set(0.5);
        this.addChild(this.score);

        const casitas = Sprite.from("casitas.png");
        casitas.position.set(1088, 430);
        this.world.addChild(casitas);

        this.button_back = new ButtonCircle("button_back.png");
        this.button_back.eventMode = "static";
        this.button_back.position.set(72, 50);
        this.button_back.on("pointerup", () => { this.goToTitle() })
        this.addChild(this.button_back);

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
                this.mask = null;
                this.removeChild(circlemask2);
                circlemask2.destroy();
                Scene_level_1.isTransitioning = false;
            })

        this.clockIcon = Sprite.from("clock.png");
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

        if (Manager.showTouchControls) {
            this.addChild(new TouchControllers(this.player))
        };

    }



    public update(deltaTime: number, _deltaFrame: number) {

        this.platform1speedX = this.calcularVelocidadX(this.platform1, _deltaFrame);

        this.timerCounter += deltaTime;

        if (this.timerCounter > 999) {

            if (this.gameState == "started") {
                this.timerText.text = String(this.secondsToMinutes(this.timerNumber));
                this.timerNumber -= 1;
            } else if (this.gameState == "none") {
                this.timerText.visible = true;
                this.timerText.text = String(Number(this.timerText.text) - 1);
                if (this.timerText.text != "0") {
                    sound.play("Beep", { volume: 0.4, singleInstance: true });
                }
                if (this.timerText.text == "0") {
                    this.gameState = "started"
                    sound.play("pino_song", { singleInstance: true, loop: true, volume: 0.45 });
                    this.clockIcon.visible = true;
                }
            }


            this.timerCounter = 0;

            if (this.timerNumber <= 3 && this.timerNumber >= 0) {
                sound.play("Beep", { volume: 0.4, singleInstance: true });
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

                const black_alpha = new Graphics();
                black_alpha.beginFill(0x000000);
                black_alpha.drawRect(0, 0, Manager.width, Manager.height);
                black_alpha.alpha = 0;
                this.addChild(black_alpha);
                new Tween(black_alpha)
                    .to({ alpha: 0.5 }, 800)
                    .start()

                this.completed = new Completed_UI(this.score.text);
                this.completed.y = -720;

                this.addChild(this.completed);
                new Tween(this.completed)
                    .to({ y: 0 }, 800)
                    .start()
                    .easing(Easing.Bounce.Out)
            }
        }
        // Define los límites para la cámara
        const minX = -1980; // Límite izquierdo
        const maxX = -50; // Límite derecho (ajusta este valor según el tamaño de tu mundo)

        this.world.x = -this.player.x * this.worldTransform.a + Manager.width / 2;

        this.world.x = Math.max(minX, Math.min(this.world.x, maxX));

        this.background.tilePosition.x = this.world.x * 0.15;
        this.background.tilePosition.x %= Manager.width;
        this.table.tilePosition.x = this.world.x;

        // Sub-stepping
        if (this.player.speed.y > 1000) {
            while (deltaTime > 1) {
                deltaTime -= 1;
                this.player.update(1);
                for (let platform of this.platforms) {
                    const overlap = checkCollision(this.player, platform);
                    if (overlap != null) {
                        this.player.separate(overlap, platform.position, platform.speed.x);
                    }
                }
            }
        } else {
            this.player.update(deltaTime);
            for (let platform of this.platforms) {
                const overlap = checkCollision(this.player, platform);
                if (overlap != null) {
                    this.player.separate(overlap, platform.position, platform.speed.x);
                }
            }
        }

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (checkCollision(this.player, item) && this.gameState != "finished") {
                if (!item.collision) {

                    Sound.from({
                        url: `pip${Math.floor(Math.random() * 4) + 1
                            }.mp3`, singleInstance: true
                    }).play();

                    this.items.splice(i, 1);
                    item.collision = true;


                    new Tween(item)
                        .to({ x: -this.world.x + 1220, y: 70 }, 400)
                        .start()
                        .onComplete(() => {
                            item.tween1.stop();
                            item.tween2.stop();

                            // Remover item del arreglo
                            item.destroy();
                            this.score.text = Number(this.score.text) + 1
                            this.cantidadBotones--;
                            if (Number(this.score.text) > 999) {
                                this.score.scale.set(0.72);
                            }
                        })



                }
            }
        }

        for (let i of this.clocks) {
            if (checkCollision(this.player, i) != null && this.gameState != "finished") {

                if (!i.collision) {

                    Sound.from({
                        url: "clock.mp3", singleInstance: true, volume: 0.4
                    }).play();
                    i.collision = true;

                    this.timerNumber += 10;
                    this.timerText.text = String(this.secondsToMinutes(this.timerNumber));

                    new Tween(i)
                        .to({ x: -this.world.x + 620, y: 70 }, 300)
                        .start()
                        .onComplete(() => {
                            this.world.removeChild(i)
                        })
                }
            }
        }

        // limit horizontal
        if (this.player.x > 3000) {
            //limit right
            this.player.x = 3000;
        } else if (this.player.x < 312) {
            // limit left
            this.player.x = 312;
        }
        // limit vertical
        if (this.player.y > Manager.height - 100) {

            this.player.y = Manager.height - 100;
            // this.player.speed.y = 0;
            this.player.canJump = true;
            if (this.player.speed.x !== 0) {
                this.player.playState("run", false)
            }
            else {
                this.player.playState("idle", true)
            }
        }

        if (this.cantidadBotones < 1 && this.gameState == "started") {
            this.crearBotones();
            this.timerText.text = String(this.secondsToMinutes(this.timerNumber));
        }


        if (GamepadController.isButtonPressed(8)) {
            this.goToTitle();
        }

        if (GamepadController.isButtonPressed(9) && this.gameState == "finished" && !Scene_level_1.isTransitioning) {
            this.completed.goToLevel();
        }




    }
    // **** UPDATE END ****













    private movementPlatform1() {
        new Tween(this.platform1)
            .onUpdate(() => { this.platform1.speed.x = this.platform1speedX })
            .to({ y: 400 }, 3000)
            .easing(Easing.Elastic.Out)
            .start()
            .onComplete(
                () => {
                    new Tween(this.platform1)
                        .onUpdate(() => { this.platform1.speed.x = this.platform1speedX })
                        .to({ x: this.platform1.x + 500, y: 400 }, 3000)
                        .start()
                        .onComplete(
                            () => {
                                new Tween(this.platform1)
                                    .onUpdate(() => { this.platform1.speed.x = this.platform1speedX })
                                    .to({ y: 300 }, 3000)
                                    .easing(Easing.Elastic.Out)
                                    .start()
                                    .onComplete(() => {
                                        new Tween(this.platform1)
                                            .onUpdate(() => { this.platform1.speed.x = this.platform1speedX })
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
            item.collision = false;
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


    private calcularVelocidadX(objeto: any, deltaTime: number): number {
        // Comprobar si el objeto tiene propiedades de posición anteriores almacenadas
        if (typeof objeto.previousX === 'undefined') {
            // Si no hay posiciones anteriores, establecer la posición actual como posición anterior
            objeto.previousX = objeto.x;
            return 0; // No hay velocidad inicial en el primer fotograma
        } else {
            // Calcular la velocidad x usando la diferencia de posiciones y el deltaTime
            const velocidadX = (objeto.x - objeto.previousX) / (deltaTime);

            // Actualizar la posición anterior para el próximo cálculo
            objeto.previousX = objeto.x;

            return velocidadX;
        }
    }

    private goToTitle() {

        if (!Scene_level_1.isTransitioning) {

            Scene_level_1.isTransitioning = true;

            this.circlemask.position.set(Manager.width / 2, Manager.height / 2);
            this.circlemask.beginFill(0x994466);
            this.circlemask.drawCircle(0, 0, 150);
            this.circlemask.scale.set(10);
            this.addChild(this.circlemask);

            this.mask = this.circlemask;

            Sound.from({
                url: "whoosh.mp3", singleInstance: true, volume: 0.5
            }).play();

            new Tween(this.circlemask)
                .to({ scale: { x: 0.05, y: 0.05 } }, 600)
                .easing(Easing.Quintic.Out)
                .start()
                .onComplete(() => { sound.stopAll(); Manager.changeScene(new Scene_title("title")) })
        }
    }

}

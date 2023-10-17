import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "mainScene",
            assets:
            {
                texturePack: "texturePack.json",

                bg_molino: "bg_molino.jpg",
                board: "board.png",
                completed_ui_bg: "completed_ui_bg.png",
                hex_blocks: "hex_blocks.png",
                table: "table.png",
                title: "title.png",

                Chunq: "Chunq.ttf",
                Montserrat: "Montserrat-Bold.ttf",

                pino_song: "pino_song.mp3",
                pip1: "pip1.mp3",
                pip2: "pip2.mp3",
                pip3: "pip3.mp3",
                pip4: "pip4.mp3",
                pinosong_finished: "pinosong_finished.mp3",
                clocksound: "clock.mp3",
                Beep: "beep.mp3",
                whoosh: "whoosh.mp3",
            }
        }
    ]
}
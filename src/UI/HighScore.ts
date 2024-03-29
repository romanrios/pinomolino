import { Container, Text, Sprite } from "pixi.js";
import { getDatabase, ref, orderByChild, onValue, query } from 'firebase/database';
import { Item } from "../game/Item";

export class HighScore extends Container {
  private scoresArray: any;
  private board: Sprite;
  private tablaPuntuaciones: any;


  constructor() {
    super()

    this.board = Sprite.from("board.png");
    this.addChild(this.board);


    const text2 = new Text(
      "[ Ver puntajes anteriores ]"
      , { fontFamily: "Montserrat Bold", fill: 0xFFFFFF, fontSize: 15, lineHeight: 30, align: "center" });
    text2.anchor.x = 0.5;
    text2.position.set(220, 635);
    text2.eventMode = "static";
    text2.cursor = "pointer";
    text2.on("pointerup", () => {
      window.open("https://romanrios.github.io/scores/pinomolino", "_blank");
    })
      .on("pointerover", () => { text2.scale.set(1.05) })
      .on("pointerout", () => { text2.scale.set(1) })
    this.addChild(text2)





    // Obtiene una referencia a la ubicación de los puntajes
    const database = getDatabase();
    const puntajesRef = ref(database, 'puntajes2');

    // Realiza una consulta para obtener los puntajes ordenados por puntaje (en orden descendente)
    const consultaPuntajes = query(puntajesRef, orderByChild('puntaje')); // Obtener los últimos 10 puntajes

    // Escucha cambios en la consulta
    onValue(consultaPuntajes, (snapshot) => {
      // La variable "snapshot" contiene los datos de la consulta
      if (snapshot.exists()) {
        this.scoresArray = [];

        // Itera a través de los registros de puntajes
        snapshot.forEach((childSnapshot) => {
          const puntaje = childSnapshot.val();
          this.scoresArray.push(puntaje);
        });
      }

      this.scoresArray.sort((a: any, b: any) => Number(b.puntaje) - Number(a.puntaje));
      this.scoresArray = this.scoresArray.slice(0, 10);
      // Arreglos para almacenar nombres y puntuaciones

      if (this.tablaPuntuaciones) {
        this.removeChild(this.tablaPuntuaciones);
      }

      this.tablaPuntuaciones = new Container();
      const espaciadoVertical = 39.6;
      const marginTop = 27;

      this.scoresArray.forEach((puntuacion: any, indice: any) => {
        const filaNombres = new Text(
          `${indice + 1}. ${puntuacion.nombre}`, {
          fontFamily: "Montserrat Bold",
          fontSize: 15,
          fill: 0x4d4d4d,
        });
        filaNombres.position.set(-10, indice * espaciadoVertical + marginTop);

        const filaPuntos = new Text(
          `${puntuacion.puntaje}`, {
          fontFamily: "Montserrat Bold",
          fontSize: 15,
          fill: 0x4d4d4d,
        });

        filaPuntos.anchor.x = 1;
        filaPuntos.position.set(250, indice * espaciadoVertical + marginTop)

        this.tablaPuntuaciones.addChild(filaNombres);
        this.tablaPuntuaciones.addChild(filaPuntos);
      });

      this.tablaPuntuaciones.position.set(95, 155);
      this.addChild(this.tablaPuntuaciones);

    });






    // Botones Flotantes
    const posiciones = [
      { x: -25, y: 520 },
      { x: 70, y: 645 },
      { x: 360, y: 70 },
      { x: 470, y: 125 },
      { x: 410, y: 265 },
    ];

    for (const posicion of posiciones) {
      const item = new Item();
      item.position.set(posicion.x, posicion.y);
      this.addChild(item);
    }



  }
}
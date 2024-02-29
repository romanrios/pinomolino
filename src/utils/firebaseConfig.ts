import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from 'firebase/database';




export const firebaseConfig = {
    apiKey: "AIzaSyD66gvyEsRiwPCwB737bRK_iffTuW0vV7Q",
    authDomain: "pinomolino-143dc.firebaseapp.com",
    databaseURL: "https://pinomolino-143dc-default-rtdb.firebaseio.com",
    projectId: "pinomolino-143dc",
    storageBucket: "pinomolino-143dc.appspot.com",
    messagingSenderId: "347684580460",
    appId: "1:347684580460:web:026ac51aecde32040efc49"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);
export const puntajesRef = ref(database, 'puntajes2');

export function agregarPuntaje(nombre: string, puntaje: string) {
    push(puntajesRef, {
        nombre: nombre,
        puntaje: puntaje,
    }
    );
}









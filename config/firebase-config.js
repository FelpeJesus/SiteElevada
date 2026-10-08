import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// =========================================================
// ATENÇÃO: COLE AQUI AS SUAS CREDENCIAIS DO FIREBASE
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyAJR3VDkj8ZmnIbflmNyFP1IKblqgtt4tY",
  authDomain: "grafica-elevada.firebaseapp.com",
  projectId: "grafica-elevada",
  storageBucket: "grafica-elevada.firebasestorage.app",
  messagingSenderId: "106133704009",
  appId: "1:106133704009:web:210bcdaacf424697749e98",
  measurementId: "G-GM4ENPCNN8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


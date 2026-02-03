/**
 * Auto Più S.A.S. - Configurazione Firebase
 *
 * ISTRUZIONI: Sostituire i valori sotto con quelli del proprio progetto Firebase.
 * Li trovi in: Firebase Console > Impostazioni progetto > Le tue app > Config
 */

const firebaseConfig = {
    apiKey: "AIzaSyDF2crOoRepbfu8wXdDeE2iCRSTwZC0JkM",
    authDomain: "autopiusas.firebaseapp.com",
    projectId: "autopiusas",
    storageBucket: "autopiusas.firebasestorage.app",
    messagingSenderId: "252166366215",
    appId: "1:252166366215:web:d12a5cc078196bbd2576a2"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Riferimenti globali usati da main.js e admin.js
const db = firebase.firestore();

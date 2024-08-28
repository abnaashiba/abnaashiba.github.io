import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCG0QlTFqc3UNU2EnbO5YJGaW5AHt8WZBk",
    authDomain: "abnaa-shiba.firebaseapp.com",
    databaseURL: "https://abnaa-shiba-default-rtdb.firebaseio.com",
    projectId: "abnaa-shiba",
    storageBucket: "abnaa-shiba.appspot.com",
    messagingSenderId: "735720885767",
    appId: "1:735720885767:web:3d6ad60fb313f20bdea4a2",
    measurementId: "G-5M2BNQBBGG"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
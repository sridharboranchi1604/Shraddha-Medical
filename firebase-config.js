import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEHWFzjnUgzNBYhuBqx87cgrZH1-y_zeo",
    authDomain: "shraddha-medical-b2ba7.firebaseapp.com",
    projectId: "shraddha-medical-b2ba7",
    storageBucket: "shraddha-medical-b2ba7.firebasestorage.app",
    messagingSenderId: "48368555273",
    appId: "1:48368555273:web:0a6305ea5f83fe8656efd8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
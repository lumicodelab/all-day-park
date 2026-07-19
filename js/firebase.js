import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEhV6ohuijanTkCeUn9taAhS994kzKeYo",
  authDomain: "all-day-park.firebaseapp.com",
  projectId: "all-day-park",
  storageBucket: "all-day-park.firebasestorage.app",
  messagingSenderId: "768106443541",
  appId: "1:768106443541:web:79b0dfd607b13e31396f1c"
};

const app = initializeApp(firebaseConfig);

window.firebaseServices = {
  auth: getAuth(app),
  provider: new GoogleAuthProvider(),
  db: getFirestore(app)
};

console.log("Firebase 연결 완료");
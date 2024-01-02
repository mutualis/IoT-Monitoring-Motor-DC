import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClNzUa4CkBurhrfORVIpBfFEv25c7LaaE",
  authDomain: "pbl2023-fb699.firebaseapp.com",
  databaseURL: "https://pbl2023-fb699-default-rtdb.firebaseio.com",
  projectId: "pbl2023-fb699",
  storageBucket: "pbl2023-fb699.appspot.com",
  messagingSenderId: "1044717689442",
  appId: "1:1044717689442:web:b2e662013f197c5d0a4f3b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

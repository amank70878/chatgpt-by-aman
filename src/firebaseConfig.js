import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6HB6FmWo2BzZcewWbjFKfCO78qyKco6w",
  authDomain: "chatgpt-by-aman.firebaseapp.com",
  projectId: "chatgpt-by-aman",
  storageBucket: "chatgpt-by-aman.appspot.com",
  messagingSenderId: "1081791403190",
  appId: "1:1081791403190:web:d2e495b5cdc22f71b28217",
  measurementId: "G-XSDGNLK0R9",
};

// Initialize Firebase
const firebase__app = initializeApp(firebaseConfig);
const firebase__db = getFirestore(firebase__app);

const firebase__auth = getAuth(firebase__app);
const firebase__provider = new GoogleAuthProvider();
const firebase__storage = getStorage(firebase__app);

export { firebase__db, firebase__auth, firebase__provider, firebase__storage };

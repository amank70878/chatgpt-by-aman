import { signInWithPopup } from "firebase/auth";
import { firebase__auth, firebase__provider } from "../firebaseConfig";

const signInFunc = () => {
  signInWithPopup(firebase__auth, firebase__provider)
    .then(() => window.location.reload())
    .catch((err) => console.warn(err));
};

export default signInFunc;

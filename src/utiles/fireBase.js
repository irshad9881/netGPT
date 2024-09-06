import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBukWgbS8gP1OFTCzF-nK3XmnSpYHJECHs",
  authDomain: "netflix-gpt-b1851.firebaseapp.com",
  projectId: "netflix-gpt-b1851",
  storageBucket: "netflix-gpt-b1851.appspot.com",
  messagingSenderId: "7136311246",
  appId: "1:7136311246:web:f9446f1da21c226d785d9f",
  measurementId: "G-74KK0CPPPH"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnsdFvZkeUY37xayrt9c9xDo2gyIpLWPo",
  authDomain: "mern-blog-60048.firebaseapp.com",
  projectId: "mern-blog-60048",
  storageBucket: "mern-blog-60048.appspot.com",
  messagingSenderId: "809280016078",
  appId: "1:809280016078:web:34a6de4fc6683869b84a9f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();
export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider).then((result) => {
    user = result.user;
  }).catch((err)=>{
    console.log(err)
  })
  return user;
};
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, doc, getDocs, setDoc, query } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUyacAUMc_Hbn3uiC_-yvKDDqWTeXC-PI",
  authDomain: "pantry-tracker-2d0fa.firebaseapp.com",
  projectId: "pantry-tracker-2d0fa",
  storageBucket: "pantry-tracker-2d0fa.appspot.com",
  messagingSenderId: "870815666663",
  appId: "1:870815666663:web:95e11f0bba1adda71c6d42",
  measurementId: "G-WFBKTEP4JV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const auth = getAuth();
export const signIn = async() =>{
  try{
    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if(credential != null && result.user.email != null){
      const token = credential.accessToken;
      const userRef = doc(db, 'users', result.user.email);
      await setDoc(userRef, {email: result.user.email, merge: true});
      return result.user;
    }
    else{
      return null;
    }
  }
  catch(error){
    console.log(error);
    return null;
  };
}

export const logOut = async () =>{
  try{
    await signOut(auth);
  }
  catch(error){
    console.log(error);
  }
}
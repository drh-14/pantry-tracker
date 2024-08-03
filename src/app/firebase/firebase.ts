import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, doc, getDocs, query } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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
export const auth = getAuth(app);

export const signIn = async (email:string, password:string) =>{
  try{
    await signInWithEmailAndPassword(auth, email, password)
  }
  catch(error){
    console.log(error);
  }
}

const signUp = async( email: string, password: string) =>{
  try{
    await createUserWithEmailAndPassword(auth, email, password)
  }
  catch(error){
    console.log(error);
  }
}

const searchItem = async (item:string) =>{

}


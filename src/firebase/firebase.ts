import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.PROJECT_ID}`,
  storageBucket: `${process.env.STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.MESSAGING_SENDER_ID}`,
  appId: `${process.env.APP_ID}`,
  measurementId: `${process.env.MEASUREMENT_ID}`
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
'use client'
import  { ButtonAppBar }  from './components/page'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Stack, Grid } from '@mui/material';
import { db, auth } from './firebase/firebase';
import { collection, query, getDocs, addDoc, setDoc, getDoc, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Box } from '@mui/material';


interface EntryProps{
  item: string;
  quantity: string;
}

const Entry: React.FC<EntryProps> = ({item, quantity}) =>{
  return(
    <div className = 'text-lg flex gap-12 flex-row text-zinc-950 align-center'>
      <h1>{item}</h1>
      <h1>{quantity}</h1>
      <Button variant = 'contained'>Add</Button>
      <Button variant = 'contained'>Remove</Button>
    </div>
  )
}

export default function Home() { 
  const [pantry, setPantry] = useState<any>([]);
  const [user, setUser] = useState<User|null>(null);
  useEffect( () =>{
    onAuthStateChanged(auth, (user) =>{
      setUser(user);
    })
  });
  const userPath = 'users/${user}/items';
  const updatePantry = async () =>{
    const snapshot = query(collection(db, userPath))
    const docs = await getDocs(snapshot);
    const pantryList:Array<any> = [];
    docs.forEach((doc) => {
      const { name, quantity } = doc.data();
      pantryList.push({
        name: name,
        quantity: quantity
      })
      setPantry(pantryList);
    });
  }
  useEffect( () =>{
    updatePantry();

  }, [])
  const addItem = async (item:string) => {
    try{
      const docRef = doc(collection(db, userPath), item);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        const { quantity } = docSnap.data();
        await setDoc(docRef, {quantity: quantity + 1}, {merge: true});
      }
      else{
        await addDoc(collection(db, userPath), {name: item, quantity: 1});
      }
    }
    catch(error){
      console.log(error);
    }
  }
  
  const removeItem = async (item:string) => {
    try{
      const docRef = doc(collection(db, userPath), item);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        const { quantity } = docSnap.data();
        if(quantity === 1){
          await deleteDoc(docRef);
        }
        else{
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true } );
        }
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const router = useRouter();
  const onLogin = () => {
    router.push('/login');
  }
  return (
    <main>
      <ButtonAppBar onLogin = {onLogin} leftItem = 'MyPantry' rightItem = 'Login'></ButtonAppBar>
      <div className = 'flex justify-center items-center flex-col text-black gap-8'>
      <Box className = 'text-black flex justify-center mt-20 text-3xl' >Welcome to MyPantry, a tool that allows you to quickly and easily add, search for, and remove items from your personal pantry.</Box>
      <Box className = 'text-black flex justify-center mt-14 text-3xl'>To get started, please login or create an account!</Box>
      <Button className = 'w-max p-3 mt-12' variant = 'contained' onClick = {onLogin} >Get started</Button>    
      </div>
    </main>
  );
}

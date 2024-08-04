'use client'
import  { ButtonAppBar }  from './components/page'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Stack, Grid } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import AddIcon  from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { db, auth } from './firebase/firebase';
import { collection, query, getDocs, addDoc, setDoc, getDoc, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Box } from '@mui/material';


interface EntryProps{
  id: string;
  item: string;
  quantity: number
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
  const [pantry, setPantry] = useState<{id: string, item: string, quantity: number}[]>([]);
  const [user, setUser] = useState<User|null>(null);
  useEffect( () =>{
    onAuthStateChanged(auth, (user) =>{
      setUser(user);
    })
  });

  const userPath = 'users/darrenh/items';
  const updatePantry = async () =>{
    const snapshot = query(collection(db, userPath))
    const docs = await getDocs(snapshot);
    const pantryList:Array<any> = [];
    docs.forEach((doc) => {
      const { item, quantity } = doc.data();
      pantryList.push({
        id: doc.id,
        item: item,
        quantity: quantity
      })
    });
    setPantry(pantryList);
  }

  useEffect( () =>{
    updatePantry();

  }, [])

  const addItem = async (item:string) => {
    try{
        const q = query(collection(db, userPath), where('item', '==', item));
        const querySnap = await getDocs(q);
        const docSnap = querySnap.docs[0];
        const docRef = docSnap.ref;
        const { quantity } = docSnap.data();
        await setDoc(docRef, {quantity: quantity + 1}, {merge: true});
      await updatePantry();
    }
    catch(error){
      console.log(error);
    }
  }
  
  const removeItem = async (item:string) => {
    try{
      const q = query(collection(db, userPath), where('item', '==', item));
      const querySnap = await getDocs(q);
      const docSnap = querySnap.docs[0];
      const docRef = docSnap.ref;
      const { quantity } = docSnap.data();
      if(quantity === 1){
        await deleteDoc(docRef);
        }
      else{
        await setDoc(docRef, {quantity: quantity - 1});
        }
      
      await updatePantry();
      }
    catch(error){
      console.log(error);
    }
  }

  function getRowId(row: {id: string, item:string, quantity: number}) {
    return row.id;
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
      <DataGrid className = 'w-8/12 m-auto mt-12 text-black' columns = {[{field: 'item', headerName: 'Item', flex:1, width: 150}, {field: 'quantity', headerName: 'Quantity', flex:1, width: 150},
      {field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => <div>
        <AddIcon onClick = { () => addItem(params.row.item)} className= 'mr-4'></AddIcon>
        <RemoveIcon onClick = { () => removeItem(params.row.item)} className = 'mr-4'></RemoveIcon>
        <DeleteIcon></DeleteIcon></div> }]} rows = {pantry.map(({id, item, quantity}:EntryProps) =>({
        id: id,
        item: item,
        quantity: quantity
      }))} getRowId = {getRowId}></DataGrid>
    </main>
  );
}

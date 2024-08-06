'use client'
import  ButtonAppBar   from './components/page'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Modal, Typography } from '@mui/material';
import AddIcon  from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { db, signIn, auth } from './firebase/firebase';
import { collection, query, getDocs, addDoc, setDoc, getDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Box } from '@mui/material';


interface EntryProps{
  id: string;
  item: string;
  quantity: number
}

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <h1>No items</h1>
  </GridOverlay>
);


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

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};


export default function Home() { 
  const [pantry, setPantry] = useState<{id: string, item: string, quantity: number}[]>([]);
  const [filteredPantry, setFilteredPantry] = useState(pantry);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [item, setItem] = useState('');
  const [quantity, setQuantity]= useState<number>(0);
  const [searchItem, setSearchItem] = useState('');
  const [loading, setLoading] = useState(true);
  const updatePantry = async () => {
    const pantryList:Array<{id: string, item: string, quantity: number}> = [];
    if(user){
    const snapshot = collection(db, `users/${user.email}/items`);
    const docs = await getDocs(snapshot);
    docs.forEach((doc) => {
      const { item, quantity } = doc.data();
      pantryList.push({
        id: doc.id,
        item: item,
        quantity: quantity
      });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    const filteredItems = pantry.filter( entry => entry.item.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilteredPantry(filteredItems);
  }

  const addItem = async (item:string) => {
    try{
      if(user){

        const q = query(collection(db, `users/${user.email}/items`), where('item', '==', item));
        const querySnap = await getDocs(q);
        const docSnap = querySnap.docs[0];
        const docRef = docSnap.ref;
        const { quantity } = docSnap.data();
        await setDoc(docRef, {quantity: quantity + 1}, {merge: true});
    }
    updatePantry();
  }
    catch(error){
      console.log(error);
    }
  }

  const initializeItem = async(item: string, quantity: number) =>{
    try{
      if(user){
      const q = query(collection(db, `users/${user.email}/items`), where('item', '==', item))
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty){
        const docSnap = querySnapshot.docs[0];
        const currentQuantity = docSnap.data().quantity;
        await setDoc(docSnap.ref, {quantity: currentQuantity + quantity }, {merge: true})
      }
      else{
        const docRef = doc(collection(db,  `users/${user.email}/items`));
        await setDoc(docRef, {item: item, quantity: quantity, merge: true});
      }
      updatePantry();
      handleClose();
    }
  }
    catch(error){
      console.log(error);
    }
  }

  const removeItem = async (item:string) => {
    try{
      if(user){
      const q = query(collection(db, `users/${user.email}/items`), where('item', '==', item));
      const querySnap = await getDocs(q);
      const docSnap = querySnap.docs[0];
      const docRef = docSnap.ref;
      const { quantity } = docSnap.data();
      if(quantity === 1){
        await deleteDoc(docRef);
        }
      else{
        await setDoc(docRef, {quantity: quantity - 1}, {merge: true});
        }
      
      await updatePantry();
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const deleteItem = async (item:string) =>{
    try{
    if(user){

    const q = query(collection(db, `users/${user.email}/items`), where('item', '==', item));
    const querySnap = await getDocs(q);
    const docSnap = querySnap.docs[0];
    const docRef = docSnap.ref;
    await deleteDoc(docRef);
    updatePantry();
  }
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
    signIn();
  }

  const handleOpen = async () =>{
    setOpen(true);
  };
  
  const handleClose = async () =>{
    setOpen(false);
  };

  useEffect (() =>{
    if (pantry.length === 0) {  
      updatePantry();
    }
  }
), []


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user){
        setUser(user);
      }
      else{
        setUser(null);
        setPantry([]);
        setFilteredPantry([]);
      }
    });
    return () => unsubscribe();
  }, []);

  

  return (
    <main>
      <ButtonAppBar onLogin = {onLogin} leftItem = 'MyPantry' user = {user} rightItem = 'Login'></ButtonAppBar>
      {(user == null) ?
      <div className = 'flex justify-center items-center flex-col text-black gap-8'>
      <Box className = 'text-black flex justify-center mt-20 text-3xl' >Welcome to MyPantry, a tool that allows you to quickly and easily add, search for, and remove items from your personal pantry.</Box>
      <Box className = 'text-black flex justify-center mt-14 text-3xl'>To get started, please login or create an account!</Box>
      <Button className = 'w-max p-3 mt-12' variant = 'contained' onClick = {async () =>{
        const user = await signIn();
        
      }} >Get started</Button>    
      </div>
      :<div className = 'm-auto flex flex-col justify-start gap-6 mt-48'>
      <div className = ' flex justify-items-start w-7/12 m-auto gap-6'>
      <Button onClick = {handleOpen} variant = 'contained' className = 'pl-6 pr-6'>Add Item</Button>
      <Modal
       open={open}
       onClose={handleClose}
       aria-labelledby="Add an item"
       aria-describedby="placeholder"
       ><Box sx ={{
        position: 'absolute',
        left:'50%',
        top: '50%',
        bgcolor: '#2563eb',
        transform: 'translate(-50%, -50%)',
        width: '1200',
        padding: '6'
       }}><Typography component = {'span'}>
        <div className= 'flex flex-col gap-4 p-8'>
        <input className = 'p-4' onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setItem(e.target.value)} placeholder = 'Item'></input>
        <input className = 'p-4' onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))} placeholder = 'Quantity'></input>
        <Button variant = 'contained' onClick = {() => initializeItem(item, quantity)} >Add Item</Button>
        </div>
        </Typography></Box>
        </Modal>
      <input value = {searchItem} className = 'p-4 bg-blue w-5/12 text-black border-2' placeholder = 'Search'
      onChange = {handleChange} ></input>
      </div>
      <DataGrid slots = {{noRowsOverlay: CustomNoRowsOverlay}} className = 'm-auto text-black w-7/12' disableColumnSelector disableColumnMenu columns = {[{field: 'item', headerName: 'Item', flex:1, width: 150}, {field: 'quantity', headerName: 'Quantity', flex:1, width: 150},
      {field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => <div>
        <AddIcon onClick = { () => addItem(params.row.item)} className= 'mr-4'></AddIcon>
        <RemoveIcon onClick = { () => removeItem(params.row.item)} className = 'mr-4'></RemoveIcon>
        <DeleteIcon onClick = { () => deleteItem(params.row.item)}></DeleteIcon></div> }]} rows = {filteredPantry.map(({id, item, quantity}:EntryProps) =>({
        id: id,
        item: item,
        quantity: quantity
      }))} getRowId = {getRowId}></DataGrid>
      </div>}
    </main>
  );
}

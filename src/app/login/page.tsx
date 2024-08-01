'use client'
import  { ButtonAppBar } from '../page';
import {useRouter } from 'next/navigation';
export default function login(){
    const router = useRouter();
    const handleLogin = async () =>{
        router.push('/');
    }
    return(
    <main>
    <ButtonAppBar leftItem = 'Pantry Item Tracker' onLogin = {handleLogin} rightItem = 'Home'></ButtonAppBar>
    </main>
    
    )
}
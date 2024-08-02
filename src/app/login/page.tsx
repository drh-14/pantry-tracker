'use client'
import  { ButtonAppBar, LoginForm } from '../components/page';
import { signIn } from '../firebase/firebase'
import {useRouter } from 'next/navigation';

export default function login(){
    const router = useRouter();
    const handleLogin = async () =>{
        router.push('/');
        
    }
    return(
    <main>
    <ButtonAppBar leftItem = 'MyPantry' onLogin = {handleLogin} rightItem = 'Home'></ButtonAppBar>
    <LoginForm></LoginForm>
    </main>
    
    )
}
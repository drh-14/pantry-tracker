'use client'
import  ButtonAppBar   from './components/page'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box } from '@mui/material';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const onLogin = () => {
    router.push('/login');
  }
  return (
    <main>
      <ButtonAppBar onLogin = {onLogin} leftItem = 'MyPantry' rightItem = 'Login'></ButtonAppBar>
      <Box className = 'text-black flex justify-center mt-20 text-3xl' >Login to access pantry tracking</Box>
    </main>
  );
}

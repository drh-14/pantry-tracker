'use client'
import { Button, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ButtonAppBarProps{
  leftItem: string;
  rightItem: string;
  onLogin: () => void;
}
export const ButtonAppBar:React.FC<ButtonAppBarProps> = ({ leftItem, rightItem, onLogin }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {leftItem}
          </Typography>

          <Button onClick = {onLogin} color="inherit">{rightItem}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default function Home() {
  const router = useRouter();
  const onLogin = () => {
    router.push('/login');
  }
  return (
    <main>
      <ButtonAppBar onLogin = {onLogin} leftItem = 'Pantry Item Tracker' rightItem = 'Login'></ButtonAppBar>
    </main>
  );
}

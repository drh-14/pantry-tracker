import { Button, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import Image from 'next/image';
import  { logOut } from '../firebase/firebase';
import { User } from 'firebase/auth';
export interface ButtonAppBarProps{
    onLogin: () => void;
    user: User | null;
  }

    export const ButtonAppBar:React.FC<ButtonAppBarProps> = ({onLogin, user }) => {
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>MyPantry</Typography>
  
            {user == null?(<Button onClick = {onLogin} color="inherit">Login</Button>)
            :(
              <div className = 'flex relative flex-col w-max invisible hover:visible justify-center items-center'>
                <Image className = 'visible' width ='50' height = '50' src = {user.photoURL + ''} alt = 'Profile'></Image>
                <Button onClick = {logOut} className = 'absolute top-12 w-max' variant = 'contained'>Log Out</Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

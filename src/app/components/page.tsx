import { Button, AppBar, Toolbar, Typography, Box, IconButton, TextField, Avatar, FormControlLabel, Grid, CssBaseline, Checkbox, Link, ThemeProvider, Container, createTheme } from '@mui/material';
import Image from 'next/image';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import defaultTheme from '@mui/material/styles'; 
import { DefaultTheme } from '@mui/private-theming';
import  {logOut } from '../firebase/firebase';
import { User } from 'firebase/auth';
interface ButtonAppBarProps{
    leftItem: string;
    rightItem: React.ReactNode;
    onLogin: () => void;
    user: User | null;
  }
  const ButtonAppBar:React.FC<ButtonAppBarProps> = ({ leftItem, rightItem, onLogin, user }) => {
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
  
export default ButtonAppBar;
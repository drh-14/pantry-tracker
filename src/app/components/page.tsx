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
  
            {(user == null)?<Button onClick = {onLogin} color="inherit">{rightItem}</Button>
            : <div className = 'relative'><div className = 'flex invisible hover:visible flex-col'><Image className = 'visible float-right' width = '50' alt= 'Profile' referrerPolicy="no-referrer" src = {user.photoURL ?? ''}></Image>
            <Button onClick = {logOut} variant = 'contained' className="absolute top-0 right--1 mt-12">Log Out</Button></div></div>}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
  
  function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


export const LoginForm = (handleLogin:any) =>{
    const theme = createTheme();
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography color = 'black' component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography sx={{ color: 'black' }}>Remember me</Typography>}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    );
}

export default ButtonAppBar;
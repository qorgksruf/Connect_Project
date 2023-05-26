import react , { useState , useEffect , useRef } from 'react';
import axios from 'axios';

/* MUI */
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/*
    npm install @mui/icons-material

*/
const theme = createTheme();

export default function Login() {

    const [ login , setLogin ] = useState({});
    let memberId = useRef(null);
    let memberPwd = useRef(null);


    // 로그인 버튼을 눌렀을때 동작하는 이벤트 onSubmit 이벤트
    const handleSubmit = (event) => {
        event.preventDefault();
        // 요소 내 텍스트필드 value 값을 FormData 화
        const data = new FormData(event.currentTarget);

        // 입력된 값 확인용
        console.log({
            memberId: data.get('memberId'),
            memberPwd: data.get('memberPwd'),
        });

        // 입력된 값 서버로 전송
        axios.post("/login" , data ).then ( r => {
            if( r.data ){
                window.location.href="/home"
            }else{
                alert("회원 정보가 일치하지 않습니다.")
            }
        })


    };

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
                <LockOutlinedIcon />
            </Avatar>
                <Typography component="h1" variant="h5">
                    Connect, GruopWare
                </Typography>
            <Box component="form" onSubmit={ handleSubmit } noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="memberId"
                  label="COMPANY ID"
                  name="memberId"
                  ref={ memberId }
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="memberPwd"
                  label="PASSWORD"
                  type="password"
                  id="memberPwd"
                  ref={ memberPwd }
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
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
}
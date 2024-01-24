import React from 'react';
import {Grid, Button, Container, Typography, TextField} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_URL } from "../../config/host-config";
import {TOKEN, USERNAME} from "../../util/login-util";

const Login = () => {

    const redirection = useNavigate();

    // 서버에 로그인 인증 요청 보내기
    const fetchLoginPrecess = async () => {
      const response = await fetch(AUTH_URL + '/signin', {
          method: "POST",
          headers: { 'content-type': 'application/json'},
          body: JSON.stringify({
              email: document.getElementById('email').value,
              password: document.getElementById('password').value
          })
      });

      if (response.status === 400) {
          // 서버에서 온 텍스트 추출
          const text = await response.text();
          alert(text);
          return;
      }

      if(response.status === 200) {
          const {token, userName} = await response.json();
          // console.log(responseData);

          // 클라이언트에서 로그인을 했다는 사실을 알게 해야 함
          // 서버에서 받은 토큰을 브라우저에 저장할 것임
          // 1. 로컬 스토리지 - 데이터를 브라우저가 종료되어도 계속 보관한
          // 2. 세션 스토리지 - 데이터를 브라우저가 종료되는 순간 삭제함
          localStorage.setItem(TOKEN, token);
          localStorage.setItem(USERNAME, userName);

          redirection('/');
      }


    };

    // 로그인 요청 이벤트 핸들러
    const loginHandler = e => {
      e.preventDefault();

      fetchLoginPrecess();
    };

    return (
        <Container component="main" maxWidth="xs" style={{ margin: "200px auto" }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                </Grid>
            </Grid>

            <form noValidate onSubmit={loginHandler}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="email address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="on your password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{background: '#38d9a9'}}
                        >
                            로그인
                        </Button>
                    </Grid>
                    <Grid item>
                        <Link to="/join">
                            회원가입을 통해 서비스를 이용하세요.
                        </Link>
                    </Grid>
                    <Grid container justify="flex-end">
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Login;
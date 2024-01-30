import React, {useEffect, useState} from 'react';
import {AppBar, Toolbar, Grid, Typography} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {getCurrentLoginUser, isLogin} from "../../util/login-util";
import anonymous from '../../assets/img/anonymous.jpeg';
import {AUTH_URL} from "../../config/host-config";

const Header = () => {

    const redirection = useNavigate();

    // 로그인 상태를 나타내는 상태변수
    const [isLoggedIn, setIsLoggedIn] = useState(isLogin);

    // 이미지 URL을 저장할 상태변수
    const [imageUrl, setImageURL] = useState(null);

    const logoutHandler = e => {
        localStorage.clear();
        setImageURL(null);
        redirection('/login');
    };

    useEffect(() => {
        setIsLoggedIn(isLogin());
    }, [isLogin()]);

    // 서버에 프로필사진 요청
    const fetchProfileImage = async () => {
        const url = AUTH_URL + "/load-profile";
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + getCurrentLoginUser().token
            },
        });
        if(response.status === 200) {
            const profileData = await response.blob();

            // blob이미지를 URL로 변환
            const imageUrl = window.URL.createObjectURL(profileData);
            setImageURL(imageUrl);
        } else {
            const errMsg = await response.text();
            alert(errMsg);
            setImageURL(null);
        }

    }

    useEffect(() => {
        isLoggedIn && fetchProfileImage();
    }, [isLoggedIn]);

    const [login, setLogin] = useState(false);

    useEffect(() => {
        setLogin(isLogin());
    }, [login]);

    return (
        <AppBar position="fixed" style={{
            background: '#38d9a9',
            width: '100%'
        }}>
            <Toolbar>
                <Grid justify="space-between" container>
                    <Grid item flex={9}>
                        <div style={
                            {
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }>
                            <Typography variant="h4">
                                <Link to="/">
                                    {
                                        isLogin()
                                            ? getCurrentLoginUser().username + '님'
                                            : '오늘'
                                    }
                                    의 할일
                                </Link>
                            </Typography>
                            <img
                                src={imageUrl || anonymous}
                                alt="프로필 사진"
                                style={{
                                    marginLeft: "20px",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%"
                                }}
                            />
                        </div>
                    </Grid>

                    <Grid item>
                        <div className='btn-group'>
                            {
                                isLogin()
                                    ?
                                    (
                                        <button
                                            className='logout-btn'
                                            onClick={logoutHandler}>로그아웃</button>
                                    )
                                    :
                                    (
                                        <>
                                            <Link to='/login'>로그인</Link>
                                            <Link to='/join'>회원가입</Link>
                                        </>
                                    )
                            }

                        </div>
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
import React, { useEffect } from 'react'
import { removeCookieData } from '../common';
import { COOKIE_KEY } from '../constant';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../reducers/userReducer';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

function LogOut() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        removeCookieData(COOKIE_KEY.TOKEN);
        removeCookieData(COOKIE_KEY.USER);
        dispatch(setUser({}));
        dispatch(setUserToken(""));
        navigate("/");
    });
  return (
   <Login/>
  )
}

export default LogOut

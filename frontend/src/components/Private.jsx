import React, { useEffect } from 'react'
import { getCookieData } from '../common'
import { APP_URL, COOKIE_KEY } from '../constant'
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { Login } from '../pages';
import LogOut from '../pages/LogOut';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setUserToken } from '../reducers/userReducer';
import { AxiosCLI } from '../axios';

function Private() {
  const token = getCookieData(COOKIE_KEY.TOKEN, true);
  console.log('token', token)
  const userData = getCookieData(COOKIE_KEY.USER);
  debugger;
  const dispatch = useDispatch();

  if (!token || token === "" || !userData) {
    return <LogOut />
  } else {
    dispatch(setUser(userData));
    dispatch(setUserToken(token));
  }
  return (
   <Outlet/>
  )
}

export default Private

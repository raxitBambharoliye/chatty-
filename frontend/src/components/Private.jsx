import { getCookieData } from '../common'
import {  COOKIE_KEY } from '../constant'
import { Outlet } from 'react-router-dom';
import LogOut from '../pages/LogOut';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../reducers/userReducer';

function Private() {
  const token = getCookieData(COOKIE_KEY.TOKEN, true);
  const userData = getCookieData(COOKIE_KEY.USER);
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

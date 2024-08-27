import { getCookieData } from '../common'
import { COOKIE_KEY } from '../constant'
import { Outlet } from 'react-router-dom';
import LogOut from '../pages/LogOut';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../reducers/userReducer';
import { useEffect } from 'react';
import { setNotification } from '../reducers/chatReducer';

function Private() {
  const token = getCookieData(COOKIE_KEY.TOKEN, true);
  const userData = getCookieData(COOKIE_KEY.USER);
  console.log('userData From Cookies ', userData)
  const notifications = getCookieData(COOKIE_KEY.NOTIFICATIONS);
  const dispatch = useDispatch();
  console.log("private running:::::")
  useEffect(() => {
    console.log('token', token)
    console.log('userData', userData)
     if(token && userData)  {
      dispatch(setNotification(notifications))
      dispatch(setUser(userData));
      dispatch(setUserToken(token));
    }
  }, [token,userData])
  if (!token || token === "" || !userData) {
    <LogOut />
 }
  return (
    <Outlet />
  )
}

export default Private

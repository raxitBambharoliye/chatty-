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
  console.log('token', token)
  const userData = getCookieData(COOKIE_KEY.USER);
  console.log('userData', userData)
  const notifications = getCookieData(COOKIE_KEY.NOTIFICATIONS);
  console.log('notifications', notifications)
  const dispatch = useDispatch();
  useEffect(() => {
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

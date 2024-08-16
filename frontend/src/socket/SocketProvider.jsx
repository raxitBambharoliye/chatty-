import { createContext, useCallback, useEffect, useState } from "react";
import { getSocket } from ".";
import { APP_URL, COOKIE_KEY, EVENT_NAME } from '../constant/'
import { useDispatch, useSelector } from "react-redux";
import { clearAllCookiesData, removeCookieData, setDataInCookie } from "../common";
import { setUser } from "../reducers/userReducer";
import { changeChangeChatLoader, pushFriend, pushMessage, pushNotification, setFriend, setFriendLoader, setMessage, setNotification, setPopup } from "../reducers/chatReducer";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user)
  const notification = useSelector((state) => state.chat.notification)
  const friends = useSelector((state) => state.chat.friends)


  //Note - Socket Connection Function
  const connectSocket = () => {
    const socketIns = getSocket();
    setSocket(socketIns)
  }
  //NOTE -  event handler 
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(EVENT_NAME.TOKEN_EXPIRE, (data) => {
      console.log('EVENT_NAME.TOKEN_EXPIRE', EVENT_NAME.TOKEN_EXPIRE)
      console.log('data', data)
      clearAllCookiesData();
      dispatch(setPopup({
        message: data.message,
        redirectUrl: APP_URL.FE_LOGOUT,
        button: "LogIn Again",
      }))
    })
    dispatch(setFriendLoader(true));

    socket.emit(EVENT_NAME.ONLINE_USER, { userId: user._id });

    socket.on(EVENT_NAME.ONLINE_USER, (data) => {
      removeCookieData(COOKIE_KEY.ACTIVE_USER_CHAT)
      dispatch(setFriend(data.friends))
      dispatch(setNotification(data.notifications))
      dispatch(setFriendLoader(false));
    })

    socket.on(EVENT_NAME.FOLLOW, (data) => {
      if (data.user) {
        setDataInCookie(data.use);
        dispatch(setUser(data.user));
      }
    })
    socket.on(EVENT_NAME.NOTIFICATION, (data) => {
      dispatch(pushNotification(data.notification))
    })
    socket.on(EVENT_NAME.ACCEPT_FOLLOW_REQUEST, (data) => {
      if (data.newFriend) {
        dispatch(pushFriend(data.newFriend))
      }
    })

    socket.on(EVENT_NAME.MESSAGE, (data) => {
      dispatch(pushMessage(data.newMessage));
    })
    socket.on(EVENT_NAME.CHATS, (data) => {
      dispatch(setMessage(data.chats))
      dispatch(changeChangeChatLoader(false));
    })
    socket.on('connect_error', (error) => {
      if (error.message == "Authentication error") {
        clearAllCookiesData();
        dispatch(setPopup({
          message: "access token expire, please login again",
          redirectUrl: APP_URL.FE_LOGOUT,
          button: "LogIn Again",
        }))
      }
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    }
  }, [socket])
  //NOTE - send request function 
  const sendRequest = useCallback((data) => {
    if (!socket) {
      return;
    }
    socket.emit(data.eventName, data.data)
    console.log(`SENDING EVENT ::: ${data.eventName} ::: DATA ::: ${JSON.stringify(data.data)}`)
  }, [socket])


  //NOTE - CHANGE VALUE IN COOKIE WHEN IT'S CHANGE IN STORE
  useEffect(() => {
    setDataInCookie(COOKIE_KEY.NOTIFICATIONS, notification);
  }, [notification])
  useEffect(() => {
    console.log('friends', friends)
    setDataInCookie(COOKIE_KEY.FRIENDS, friends);
  }, [friends])
  return (
    <SocketContext.Provider value={{ socket, sendRequest, connectSocket }}>

      {children}
    </SocketContext.Provider>
  )
}
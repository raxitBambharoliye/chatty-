import { createContext, useCallback, useEffect, useState } from "react";
import { getSocket } from ".";
import { COOKIE_KEY, EVENT_NAME } from '../constant/'
import { useDispatch, useSelector } from "react-redux";
import { setDataInCookie } from "../common";
import { setUser } from "../reducers/userReducer";
import { pushFriend, pushNotification, setFriend, setNotification } from "../reducers/chatReducer";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.userData.user)
  const notification= useSelector((state)=>state.chat.notification)
  const friends= useSelector((state)=>state.chat.friends)
  const activeUserChat= useSelector((state)=>state.chat.activeUserChat)
  console.log('activeUserChat ::::::::: LLLLLLLLLL', activeUserChat)
  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    const socketIns = getSocket();
    socketIns.emit(EVENT_NAME.ONLINE_USER,{userId:user._id});
    setSocket(socketIns)
  }, [user])
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(EVENT_NAME.FOLLOW, (data) => {
      console.log(data);
      if (data.user) {
        setDataInCookie(data.use);
        dispatch(setUser(data.user));
      }
    })


    socket.on(EVENT_NAME.NOTIFICATION, (data) => {
      dispatch(pushNotification(data.notification))
    })

    socket.on(EVENT_NAME.ACCEPT_FOLLOW_REQUEST, (data) => {
      /* {"newFriend":{"_id":"669de4006bda9f696cc6aae7","userName":"testCheck1","profilePicture":"https://drive.google.com/file/d/1v3pxXcaqbZ7BqG_FQOEpRrxuWIBX8nXT/view?usp=sharing","tagLine":"I am using chatty PIE 😎😎😎"}}*/
      console.log(data);
      if (data.newFriend) {
        dispatch(pushFriend(data.newFriend))
      }
    })
    socket.on(EVENT_NAME.ONLINE_USER,(data)=>{
      console.log("online user data",data)
      dispatch(setFriend(data.friends))
      dispatch(setNotification(data.notifications))
    })
    socket.on(EVENT_NAME.MESSAGE,(data)=>{
      console.log("::::::::::               IIIII",activeUserChat)
      console.log(data);
      if(data.receiverId == activeUserChat._id){
        console.log("set message data ")
      }
    })
    return () => {
      if (socket) {
        socket.disconnect();
      }
    }
  }, [socket])
  const sendRequest = useCallback((data) => {
    if (!socket) {
      return;
    }
    socket.emit(data.eventName, data.data)
    console.log(`SENDING EVENT ::: ${data.eventName} ::: DATA ::: ${JSON.stringify(data.data)}`)
  }, [socket])
//NOTE - CHANGE VALUE IN COOKIE WHEN IT'S CHANGE IN STORE
  useEffect(()=>{
    setDataInCookie(COOKIE_KEY.NOTIFICATIONS,notification);
  },[notification])
  useEffect(()=>{
    setDataInCookie(COOKIE_KEY.FRIENDS,friends);
  },[friends])
  return (
    <SocketContext.Provider value={{ socket, sendRequest }}>
      {children}
    </SocketContext.Provider>
  )
}
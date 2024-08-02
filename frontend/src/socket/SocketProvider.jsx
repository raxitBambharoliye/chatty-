import { createContext, useCallback, useEffect, useState } from "react";
import { getSocket } from ".";
import { EVENT_NAME } from '../constant/'
import { useDispatch, useSelector } from "react-redux";
import { setDataInCookie } from "../common";
import { setUser } from "../reducers/userReducer";
import { pushNotification } from "../reducers/chatReducer";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.userData.user)
  const notification= useSelector((state)=>state.chat.notification)
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

  return (
    <SocketContext.Provider value={{ socket, sendRequest }}>
      {children}
    </SocketContext.Provider>
  )
}
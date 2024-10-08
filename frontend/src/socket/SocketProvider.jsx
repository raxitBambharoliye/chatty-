import { createContext, useCallback, useEffect, useState } from "react";
import { getSocket } from ".";
import { APP_URL, COOKIE_KEY, EVENT_NAME } from '../constant/'
import { useDispatch, useSelector } from "react-redux";
import { clearAllCookiesData, removeCookieData, setDataInCookie } from "../common";
import { setUser } from "../reducers/userReducer";
import { setMutedUser, unMuteUser, addBlockUser, changeChangeChatLoader, changeGroupAdminData, pushFriend, pushMessage, pushNotification, removeFriends, setFriend, setFriendLoader, setMessage, setMessageOrder, setNotification, setPinUser, setPopup, unBlockUser, unPinUser, updateFriends, addUnFollowedUser, setSendedRequest, setOnlineUser, setMaxNumberOfChatPages } from "../reducers/chatReducer";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user)
  const { notification, friends } = useSelector((state) => state.chat)


  //NOTE  - Socket Connection Function
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
      dispatch(setFriend(data.friends));
      dispatch(setNotification(data.notifications));
      dispatch(setOnlineUser(data));
      dispatch(setFriendLoader(false));
    })
    socket.on(EVENT_NAME.FOLLOW, (data) => {
        dispatch(setSendedRequest(data.sendedRequest));
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
      dispatch(setMaxNumberOfChatPages(data.maxNumberOfPage))
    })
    socket.on(EVENT_NAME.EDIT_GROUP_ADMIN, (data) => {
      dispatch(changeGroupAdminData(data))
    })
    socket.on(EVENT_NAME.LEAVE_GROUP, (data) => {
      dispatch(removeFriends(data.leavedGroup));
    })
    socket.on(EVENT_NAME.BLOCK_USER, (data) => {
      dispatch(addBlockUser(data));

    })
    socket.on(EVENT_NAME.UNBLOCK_USER, (data) => {
      dispatch(unBlockUser(data));
    })
    socket.on(EVENT_NAME.MUTE_USER, (data) => {
      dispatch(setMutedUser(data.mutedUser));
    })
    socket.on(EVENT_NAME.UNMUTE_USER, (data) => {
      dispatch(unMuteUser(data.unMutedUser));
    })
    socket.on(EVENT_NAME.PIN_USER, (data) => {
      dispatch(setPinUser(data.pinedUserId));
    })
    socket.on(EVENT_NAME.UNPIN_USER, (data) => {
      dispatch(unPinUser(data.unPinedUserId));
    })
    socket.on(EVENT_NAME.UPDATE_FRIEND, (data) => {
      dispatch(updateFriends(data));
    })
    socket.on(EVENT_NAME.UN_FOLLOW, (data) => {
      dispatch(addUnFollowedUser(data));
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
  const sendRequest = useCallback((data,callback) => {
    if (!socket) {
      return;
    }
    if (callback) {
      socket.emit(data.eventName, data.data,callback)
    } else {
      socket.emit(data.eventName, data.data)
    }
    console.log(`SENDING EVENT ::: ${data.eventName} ::: DATA ::: ${JSON.stringify(data.data)}`)
  }, [socket])


  //NOTE - CHANGE VALUE IN COOKIE WHEN IT'S CHANGE IN STORE
  useEffect(() => {
    setDataInCookie(COOKIE_KEY.NOTIFICATIONS, notification);
  }, [notification])
  useEffect(() => {
    setDataInCookie(COOKIE_KEY.FRIENDS, friends);
  }, [friends])

  return (
    <SocketContext.Provider value={{ socket, sendRequest, connectSocket }}>{children}</SocketContext.Provider>
  )
}
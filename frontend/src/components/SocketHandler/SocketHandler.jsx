import  { useEffect } from 'react'
import { connectSocket, setSocket } from '../../reducers/socketReducer';
import { useDispatch, useSelector } from 'react-redux';
import { EVENT_NAME } from '../../constant';
import { io } from 'socket.io-client';

function SocketHandler({children}) {
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  dispatch(connectSocket());

  // useEffect(() => {
  //   if (!socket) {
  //     return;
  //   }
  //   console.log('socket', socket)

  //   socket.on(EVENT_NAME.FOLLOW, (data) => {
  //     console.log(data)
  //   });

  // },[socket])
  useEffect(()=>{
    const socketConnection = io(import.meta.env.VITE_BASE_URL,{
      auth : {
        token : localStorage.getItem('token')
      },
    })

    socketConnection.on('onlineUser',(data)=>{
      console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocket(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])

  return (
    children
  )
}

export default SocketHandler

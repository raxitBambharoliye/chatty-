import { createContext, useEffect, useState } from "react";
import { getSocket } from ".";

export const SocketContext = createContext();

export const SocketProvider= ({children}) => {
  const [socket,setSocket] = useState(null);
  const [user,setUser]=useState("test")
  useEffect(()=>{
    const socketIns= getSocket();
    setSocket(socketIns)
  },[])
  useEffect(()=>{
    if(!socket){
      return;
    }
    // socket.on('test',(data)=>{
    //   console.log(data)
    // })
    // socket.emit("test",{test:"check test"})
    return()=>{
      if(socket){
        socket.disconnect();
      }
    }
  },[socket])
  return (
    <SocketContext.Provider value={{socket,user}}>
      {children}
    </SocketContext.Provider>
  )
}
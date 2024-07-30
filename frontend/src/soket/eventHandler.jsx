import { io } from "socket.io-client";
import { EVENT_NAME } from "../constant";

const socket = io(import.meta.env.VITE_BASE_URL);
class SocketEventCL { 
    
    SocketConnection() {
       socket.on('connect', () => {
            console.log("teset connection ");
            this.socket.on("test", (data) => {
                console.log(data)
                debugger;
            })
        })
    }
    SendEvent(eventname, data) {
        socket.emit(eventname, data);
    }
}


export const SocketEvent = new SocketEventCL();
/* 
// socket.js
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server endpoint

export default socket;

// useSocket.js
import { useEffect, useState } from 'react';
import socket from './socket';

export function useSocket(eventName, callback) {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on(eventName, callback);
    return () => {
      socket.off(eventName);
    };
  }, [eventName, callback]);

  return data;
}
 */
import { io } from "socket.io-client"

export const getSocket= ()=>{
    const socket= io(import.meta.env.VITE_BASE_URL);
    return socket;
}
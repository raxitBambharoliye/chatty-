import { createSlice } from "@reduxjs/toolkit";
import socketIo from "socket.io-client"

const socketReducer = createSlice({
    name: "socket",
    initialState: { socket:null },
    reducers: {
        setSocket : (state,action)=>{
            state.socket = action.payload
          },
        socketCLI: (state, action) => {
            return state.socket;
        },
        connectSocket: (state, action) => {
            // const socketCli = socketIo(import.meta.env.VITE_BASE_URL);
            // socketCli.on('connect', () => {
            //     console.log("teset connection ");
            //     // dispatch(setSocket(socketCli));
            //     // state.SocketCLI = socketCli;
            // });
        }
    }
})

export const { setSocket, socketCLI,connectSocket } = socketReducer.actions;
export default socketReducer.reducer;
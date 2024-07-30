import {io} from ".."
import { EVENT_NAME } from "../common";
import { eventHandler, sendToSocket } from "../eventHandlers";
import logger from "../utility/logger";

export const socketConnection = async ()=>{
    io.on('connection', (socket) => {
        // sendToSocket(socket,{eventName:EVENT_NAME.FOLLOW,test:"check"})
        logger.info(`Client connected ${socket.id}` );
        eventHandler(socket);
    })
}
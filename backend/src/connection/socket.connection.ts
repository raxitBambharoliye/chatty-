import {io} from ".."
import { EVENT_NAME } from "../common";
import { eventHandler, sendToSocket } from "../eventHandlers";
import logger from "../utility/logger";

export const socketConnection = async ()=>{
    io.on('connection', (socket) => {
        logger.info(`socket connected :: ${socket.id}`);
        logger.info("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE ")
        logger.info("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE ")
        logger.info("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE ")
        // sendToSocket(socket,{eventName:EVENT_NAME.FOLLOW,test:"check"})
        eventHandler(socket);
    })
}

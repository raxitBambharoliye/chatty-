import { AnyExpression } from "mongoose";
import {io} from ".."
import { EVENT_NAME } from "../common";
import { eventHandler, sendToSocket } from "../eventHandlers";
import logger from "../utility/logger";
import { disconnectHandler } from "../controller/chat.controller";

export const socketConnection = async ()=>{
    io.on('connection', (socket:AnyExpression) => {
        logger.info(`socket connected :: ${socket.id}`);
        // sendToSocket(socket,{eventName:EVENT_NAME.FOLLOW,test:"check"})
        eventHandler(socket);
        socket.on("disconnect", async() => {

            if (socket.userId) {
                await disconnectHandler(socket.userId);
            }
        })
    })
}

import  {io}  from '..';
import { EVENT_NAME } from '../common';
import { acceptFollowRequest, chatHandler, followRequest, messageHandler, onlineUser } from "../controller/chat.controller";
import logger from "../utility/logger";

export const eventHandler = (socket:any) => {
    socket.onAny((eventName: String, data: any) => {
        logger.info(`EVENT RECEIVED :: ${eventName} :: ${JSON.stringify(data)} :::::::::::::: `) 
        switch (eventName) {
            case "test":
                logger.info(`testing even received ${JSON.stringify(data)} ` );
                socket.emit("test",{test:"backendTest check"})
                break;
            case EVENT_NAME.FOLLOW:
                followRequest(socket,data)
                break;
            case EVENT_NAME.ONLINE_USER:
                onlineUser(socket,data)
                break;
            case EVENT_NAME.ACCEPT_FOLLOW_REQUEST:
            acceptFollowRequest(socket,data);
            case EVENT_NAME.MESSAGE:
                messageHandler(socket,data);
                break;
            case EVENT_NAME.CHATS:
                chatHandler(socket, data);
                break;
        }
    })
}


export const sendToSocket=async(socketId: any, data: any)=> {
    try {
        console.log('socketId', socketId)
        logger.info(`EVENT RECEIVED :: ${data.eventName} :: ${JSON.stringify(data.data)} :::::::::::::: `)
        await io.to(socketId).emit(data.eventName, data.data);
    } catch (error) {
        logger.error(`SEND DATA ERROR IN sendRToSocket: ${error}`)
        console.log('error', error)
    }
}
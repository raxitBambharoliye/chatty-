import { io } from "..";
import { EVENT_NAME } from "../common";
import {
  acceptFollowRequest,
  addUserInGroupHandler,
  blockUserHandler,
  chatHandler,
  editAdminHandler,
  followRequest,
  joinGroupChatHandler,
  leaveGroupHandler,
  messageHandler,
  muteUserHandler,
  onlineUser,
  pinUserHandler,
  unBlockUserHandler,
  unFollowUserHandler,
  unMuteUserHandler,
  unPinUserHandler,
} from "../controller/chat.controller";
import logger from "../utility/logger";

export const eventHandler = (socket: any) => {
  socket.onAny((eventName: String, data: any,callback?:any) => {
    logger.info(`EVENT RECEIVED :: ${eventName} :: ${JSON.stringify(data)} :::::::::::::: `);
    switch (eventName) {
      case "test":
        logger.info(`testing even received ${JSON.stringify(data)} `);
        socket.emit("test", { test: "backendTest check" });
        break;
      case EVENT_NAME.FOLLOW:
        followRequest(socket, data);
        break;
      case EVENT_NAME.ONLINE_USER:
        onlineUser(socket, data);
        break;
      case EVENT_NAME.ACCEPT_FOLLOW_REQUEST:
        acceptFollowRequest(socket, data);
      case EVENT_NAME.MESSAGE:
        messageHandler(socket, data);
        break;
      case EVENT_NAME.CHATS:
        chatHandler(socket, data);
        break;
      case EVENT_NAME.JOIN_GROUP_CHAT:
        joinGroupChatHandler(socket, data);
        break;
      case EVENT_NAME.EDIT_GROUP_ADMIN:
        editAdminHandler(socket, data,callback);
        break;
      case EVENT_NAME.LEAVE_GROUP:
        leaveGroupHandler(socket, data);
        break;
      case EVENT_NAME.BLOCK_USER:
        blockUserHandler(socket, data);
        break;
      case EVENT_NAME.UNBLOCK_USER:
        unBlockUserHandler(socket, data);
        break;
      case EVENT_NAME.MUTE_USER:
        muteUserHandler(socket, data);
        break;
      case EVENT_NAME.UNMUTE_USER:
        unMuteUserHandler(socket, data);
        break;
      case EVENT_NAME.PIN_USER:
        pinUserHandler(socket, data);
        break;
      case EVENT_NAME.UNPIN_USER:
        unPinUserHandler(socket, data);
        break;
      case EVENT_NAME.ADD_FRIENDS_IN_GROUP:
        addUserInGroupHandler(socket, data,callback);
        break;
      case EVENT_NAME.UN_FOLLOW:
        unFollowUserHandler(socket, data);
        break;
    }
  });
};

export const sendToSocket = async (socketId: any, data: any) => {
  try {
    console.log("socketId", socketId);
    logger.info(`EVENT SENDING :: ${data.eventName} :: ${JSON.stringify(data.data)} :::::::::::::: `);
    await io.to(socketId).emit(data.eventName, data.data);
  } catch (error) {
    logger.error(`SEND DATA ERROR IN sendRToSocket: ${error}`);
    console.log("error", error);
  }
};
export const sendToRoom = async (roomId: any, data: any) => {
  try {
    logger.info(`EVENT SENDING :: ${data.eventName} :: ${JSON.stringify(data.data)} :::::::::::::: `);
    await io.to(roomId).emit(data.eventName, data.data);
  } catch (error) {
    logger.error(`SEND DATA ERROR IN sendToRoom: ${error}`);
    console.log("error", error);
  }

}
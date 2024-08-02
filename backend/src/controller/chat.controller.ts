import { EVENT_NAME, MQ } from "../common";
import { CONFIG, MODEL } from "../constant";
import { sendToSocket } from "../eventHandlers";
import { NotificationIN, UserIN } from "../utility/interfaces";
import logger from "../utility/logger";

export const onlineUser = async (socket: any, data: any) => {
  try {
    const { userId } = data;
    if (!userId) {
      return;
    }
    const user = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userId, {
      isOnLine: true,
      socketId: socket.id,
    });
    if (!user) {
      return;
    }
    socket.userId = user?.id;
  } catch (error) {
    logger.error(`CATCH ERROR IN : onlineUser ::: ${error}`);
    console.log("error", error);
  }
};

export const followRequest = async (socket: any, data: any) => {
  try {
    const sender = await MQ.findById<UserIN>(MODEL.USER_MODEL, data.senderId);
    if (!sender) {
      return false;
    }
    const receiver = await MQ.findById<UserIN>(
      MODEL.USER_MODEL,
      data.receiverId
    );
    if (!receiver) {
      return false;
    }

    const updateSender = await MQ.findByIdAndUpdate<UserIN>(
      MODEL.USER_MODEL,
      sender.id,
      { $push: { sendedRequest: receiver.id } },
      true
    );
    const updateReceiver = await MQ.findByIdAndUpdate<UserIN>(
      MODEL.USER_MODEL,
      receiver.id,
      { $push: { friendRequest: sender.id } },
      true
    );
    if (!updateSender || !updateReceiver) {
      return;
    }

    const notificationInsertData = {
      type: CONFIG.NOTIFICATION_MESSAGE_TYPE.FOLLOW_REQUEST,
      userId: sender.id,
    };
    const notification = await MQ.insertOne<NotificationIN>(
      MODEL.NOTIFICATION_MODEL,
      notificationInsertData
    );
    console.log("notification", notification);
    let sendData: any = {
      eventName: EVENT_NAME.FOLLOW,
      data: {
        user: updateSender,
      },
    };

    console.log("sendData", sendData);
    await sendToSocket(socket.id, sendData);

    if (updateReceiver.socketId) {
      const notificationEventData = {
        eventName: EVENT_NAME.NOTIFICATION,
        data: {
          notification: {
                type: notification?.type,
              view:notification?.view,
            userId: {
              profilePicture: sender.profilePicture || null,
              userName: sender.userName,
            },
          },
        },
      };
      await sendToSocket(updateReceiver.socketId, notificationEventData);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN :: followRequest ${error}`);
    console.log("error", error);
  }
};

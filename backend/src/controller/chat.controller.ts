import { EVENT_NAME, MQ } from "../common";
import { CONFIG, MODEL } from "../constant";
import { sendToSocket } from "../eventHandlers";
import { MessageIN, NotificationIN, UserIN } from "../utility/interfaces";
import logger from "../utility/logger";
import { formatChat } from "../utility/logic";

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

    const notifications = await MQ.findWithPopulate(
      MODEL.NOTIFICATION_MODEL,
      { userId: user.id },
      "senderId",
      "userName profilePicture"
    );
    const userWithFriends = await MQ.findWithPopulate<UserIN[]>(
      MODEL.USER_MODEL,
      { _id: user.id },
      "friends",
      "userName profilePicture tagLine isOnLine "
    );
    if (!userWithFriends) {
      return;
    }

    // delete user.password;
    const onLineUserEventData = {
      eventName: EVENT_NAME.ONLINE_USER,
      data: {
        notifications,
        friends: userWithFriends[0].friends,
      },
    };

    await sendToSocket(socket.id, onLineUserEventData);
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
      userId: receiver.id,
      senderId: sender.id,
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
            view: notification?.view,
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

export const acceptFollowRequest = async (socket: any, data: any) => {
  try {
    const { friendId, notificationId } = data;
    console.log("friendId", friendId);
    const userId = socket.userId;
    console.log("userId", userId);
    if (!friendId || !userId) {
      logger.error(`friendId or userId not found :::: `);
      return false;
    }

    let users = await MQ.findWithPopulate<UserIN[]>(
      MODEL.USER_MODEL,
      { _id: userId },
      "friendRequest",
      "socketId"
    );
    const friend = await MQ.find<UserIN[]>(MODEL.USER_MODEL, { _id: friendId });
    if (!users || users.length < 0 || !friend || friend.length < 0) {
      logger.error(`User data not found :::`);
      return false;
    }
    let user = users[0];
    const checkFriend = user.friendRequest.findIndex(
      (element: any) => element._id == friendId
    );
    if (checkFriend < 0) {
      return false;
    }
    const updatedUser = await MQ.findByIdAndUpdate<UserIN>(
      MODEL.USER_MODEL,
      user.id,
      {
        $push: { friends: friend[0].id },
        $pull: { friendRequest: friend[0].id },
      },
      true
    );
    const updateFriend = await MQ.findByIdAndUpdate<UserIN>(
      MODEL.USER_MODEL,
      friend[0].id,
      { $push: { friends: user.id }, $pull: { sendedRequest: user.id } },
      true
    );
    const updateNotification = await MQ.findByIdAndUpdate<NotificationIN>(
      MODEL.NOTIFICATION_MODEL,
      notificationId,
      { type: CONFIG.NOTIFICATION_MESSAGE_TYPE.FOLLOW_ACCEPTED }
    );

    const acceptEventData = {
      eventName: EVENT_NAME.ACCEPT_FOLLOW_REQUEST,
      data: {
        newFriend: {
          _id: friendId,
          userName: friend[0].userName,
          profilePicture: friend[0].profilePicture,
          tagLine: friend[0].tagLine,
        },
      },
    };
    await sendToSocket(socket.id, acceptEventData);
    const notificationInsertData = {
      type: CONFIG.NOTIFICATION_MESSAGE_TYPE.FOLLOW_ACCEPTED,
      userId: friend[0].id,
      senderId: user.id,
    };
    const notification = await MQ.insertOne<NotificationIN>(
      MODEL.NOTIFICATION_MODEL,
      notificationInsertData
    );
    if (!notification) {
      throw new Error("notification data not added ");
    }

    // add notification
    if (updateFriend && updateFriend.socketId) {
      const sendNotificationData = {
        eventname: EVENT_NAME.NOTIFICATION,
        data: {
          notification: {
            type: notification?.type,
            view: notification?.view,
            userId: {
              profilePicture: user.profilePicture || null,
              userName: user.userName,
            },
          },
        },
      };
      sendToSocket(updateFriend.socketId, sendNotificationData);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN ::: acceptFollowRequest :: ${error}`);
    console.log("error", error);
  }
};

export const disconnectHandler = async (userId: any) => {
  try {
    if (!userId) {
      return;
    }
    const user = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userId, {
      isOnLine: false,
      socketId: null,
    });
    if (!user) {
      return;
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN :: :: disconnectHandler :: ${error}`);
    console.log("error", error);
  }
};


export const messageHandler = async (socket: any, data: any) => {
  try {
    const { receiverId ,message} = data;
    if(!receiverId || !message){
      return false;
    }

    const user=await MQ.findById<UserIN>(MODEL.USER_MODEL,socket.userId);
    console.log('user', user)
    if(!user || !user.friends.includes(receiverId)){
      return false;
    }
    const friend=await MQ.findById<UserIN>(MODEL.USER_MODEL,receiverId);
    console.log('friend', friend)

    if(!friend || !friend.friends.includes(user._id)){
      return false;
    }


    
    const insertMessageData= {
      senderId:socket.userId,
      receiverId,
      message:message
    }
    let messageData= await MQ.insertOne<MessageIN>(MODEL.MESSAGE_MODEL,insertMessageData);
    if(!messageData){
      return false;
    }
    const sendMessageData= {
      eventName:EVENT_NAME.MESSAGE,
      data:{
        newMessage:{
          message,
          createdAt: messageData.createdAt,
          senderId:user.id,
          senderName:user.userName,
          receiverId
        }
      }
    }
    sendToSocket(socket.id,sendMessageData);
    if (friend.socketId) {
      sendToSocket(friend.socketId,sendMessageData)
    }

  } catch (error) {
    logger.error(`CATCH ERROR IN ::: messageHandler:: ${error}`)
    console.log('error', error)
  }
}

export const chatHandler = async (socket: any, data: any) => {
  try {
    const userId = socket.userId;
    if (!userId) {
      return false;
    }
    const receiverId = data.receiverId;
    if (!receiverId) {
      return false;
    }

    const user =await MQ.findById<UserIN>(MODEL.USER_MODEL,userId)
    const receiver = await MQ.findById<UserIN>(MODEL.USER_MODEL, receiverId);
    if (!user || !receiver) {
      return false;
    }

    let chat = await MQ.findWithPagination(MODEL.MESSAGE_MODEL, {
      $or:
      [{ senderId: userId, receiverId: receiverId }, { senderId: receiverId, receiverId: userId }],
    },50,1,{createdAt:1})

    const chatSendData = {
      eventName: EVENT_NAME.CHATS,
      data: {
        chats:chat?chat:[]
      }
    }
    console.log('chatSendData', JSON.stringify(chatSendData))
    await sendToSocket(socket.id, chatSendData);
  } catch (error) {
    logger.error(`CATCH ERROR IN ::: chatHandler:: ${error}`);
    console.log('error', error)
  }
}
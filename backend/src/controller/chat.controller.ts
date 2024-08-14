import { EVENT_NAME, MQ } from "../common";
import { CONFIG, MODEL } from "../constant";
import { sendToRoom, sendToSocket } from "../eventHandlers";
import { GroupIN, MessageIN, NotificationIN, UserIN } from "../utility/interfaces";
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

    const notifications = await MQ.findWithPopulate(
      MODEL.NOTIFICATION_MODEL,
      { userId: user.id },
      "senderId ",
      "userName profilePicture"
    );
    const userWithFriends = await MQ.findWithPopulate<UserIN[]>(
      MODEL.USER_MODEL,
      { _id: user.id },
      "friends groups",
      "userName profilePicture tagLine isOnLine groupName groupProfile type"
    );
    if (!userWithFriends) {
      return;
    }
    // delete user.password;
    console.log('userWithFriends', JSON.stringify(userWithFriends))
    if (userWithFriends[0].groups) {
      userWithFriends[0].groups.forEach((element:any) => {
        socket.join(element.id.toString());
      });
    }
    const onLineUserEventData = {
      eventName: EVENT_NAME.ONLINE_USER,
      data: {
        notifications,
        friends: [...userWithFriends[0].friends,...userWithFriends[0].groups],
      },
    };

    await sendToSocket(socket.id, onLineUserEventData);
  } catch (error){
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
      console.log('updateReceiver.socketId', updateReceiver.socketId)
      const notificationEventData = {
        eventName: EVENT_NAME.NOTIFICATION,
        data: {
          notification: {
            type: notification?.type,
            view: notification?.view,
            senderId: {
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
    const { receiverId ,message,isGroup} = data;
    
    if(!receiverId || !message){
      return false;
    }


    const user=await MQ.findById<UserIN>(MODEL.USER_MODEL,socket.userId);
    console.log('user', user)
    if (isGroup) {
      if(!user || !user.groups.includes(receiverId)){
        return false;
      }
    } else {
      if(!user || !user.friends.includes(receiverId)){
        return false;
      }
  }

    let friend;
    if (!isGroup) {
        friend=await MQ.findById<UserIN>(MODEL.USER_MODEL,receiverId);
        if(!friend || !friend.friends.includes(user._id)){
          return false;
        }
    }
   
    let groupData;
    if (isGroup) {
       groupData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, receiverId);
       console.log('groupData', groupData)
      if (!groupData || !(groupData.groupMembers.includes(user._id))) {
        logger.error(`SENDER WAS NOT FRIENDS `);
        return false;
      }
    }

    
    const insertMessageData= {
      senderId:socket.userId,
      receiverId:isGroup?groupData?.id:receiverId,
      message:message
    }
    let messageData= await MQ.insertOne<MessageIN>(MODEL.MESSAGE_MODEL,insertMessageData);
    console.log('messageData', messageData)
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
          receiverId,
          isGroup,
        }
      }
    }
    if (isGroup) {
      sendToRoom(receiverId, sendMessageData);
    } else {
      sendToSocket(socket.id, sendMessageData);
      if (friend?.socketId) {
        sendToSocket(friend.socketId, sendMessageData)
      }
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

    const user = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId)
    let receiver;
    if (!data.isGroup) {
      receiver = await MQ.findById<UserIN>(MODEL.USER_MODEL, receiverId);
    } else {
      receiver = await MQ.findById<UserIN>(MODEL.GROUP_MODEL, receiverId);
    }
    if (!user || !receiver) {
      return false;
    }
    let query:any = {
      $or:
        [{ senderId: userId, receiverId: receiverId }, { senderId: receiverId, receiverId: userId }],
    };
    if (data.isGroup) {
      query={ receiverId }
    }
    let chat = await MQ.findWithPagination<MessageIN[]>(MODEL.MESSAGE_MODEL,query ,CONFIG.MESSAGE_LOAD_LIMIT,1,{createdAt:-1})
    console.log('chat', chat)
    if (!chat) {
      chat=[]
    }
    const chatSendData = {
      eventName: EVENT_NAME.CHATS,
      data: {
        chats:chat?chat.reverse():[]
      }
    }
    console.log('chatSendData', JSON.stringify(chatSendData))
    await sendToSocket(socket.id, chatSendData);
  } catch (error) {
    logger.error(`CATCH ERROR IN ::: chatHandler:: ${error}`);
    console.log('error', error)
  }
}

export const joinGroupChatHandler = async (socket: any, data: any) => {
  try {
    if (!data.groupId) {
      return false;

    }
    const group = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, data.groupId);
    if (!group) {
      return false;
    }
    socket.join(group.id);
  } catch (error) {
    logger.error(`CATCH ERROR IN : joinGroupChatHandler ${error}`)
    console.log('error', error)
  }
}
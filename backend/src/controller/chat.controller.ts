import { EVENT_NAME, MQ } from "../common";
import { CONFIG, MODEL } from "../constant";
import { eventHandler, sendToRoom, sendToSocket } from "../eventHandlers";
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

    const notifications = await MQ.findWithPopulate(MODEL.NOTIFICATION_MODEL, { userId: user.id }, "senderId ", "userName profilePicture");
    const userWithFriends = await MQ.findWithPopulate<UserIN[]>(MODEL.USER_MODEL, { _id: user.id }, "friends ", "userName profilePicture tagLine isOnLine ");
    const userGroup = await MQ.findWithPopulate<GroupIN[]>(MODEL.GROUP_MODEL, { groupMembers: user.id }, "groupMembers", "profilePicture tagLine userName");
    if (!userWithFriends) {
      return;
    }
    // delete user.password;
    if (userWithFriends[0].groups) {
      userWithFriends[0].groups.forEach((element: any) => {
        if (!user.blockedUserId.includes(element.id)) {
          socket.join(element._id.toString());
        }
      });
    }
    const onLineUserEventData = {
      eventName: EVENT_NAME.ONLINE_USER,
      data: {
        notifications,
        friends: userGroup && userGroup.length > 0 ? [...userWithFriends[0].friends, ...userGroup] : [...userWithFriends[0].friends],
        blockedByUsers: user.blockedByUsers,
        blockedUserId: user.blockedUserId,
        mutedUser: user.mutedUser,
        pinedUsers: user.pinedUsers,
        messageOrder: user.messageOrder,
        user
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
    const receiver = await MQ.findById<UserIN>(MODEL.USER_MODEL, data.receiverId);
    if (!receiver) {
      return false;
    }

    const updateSender = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, sender.id, { $push: { sendedRequest: receiver.id } }, true);
    const updateReceiver = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, receiver.id, { $push: { friendRequest: sender.id } }, true);

    if (!updateSender || !updateReceiver) {
      return;
    }

    const notificationInsertData = {
      type: CONFIG.NOTIFICATION_MESSAGE_TYPE.FOLLOW_REQUEST,
      userId: receiver.id,
      senderId: sender.id,
    };
    const notification = await MQ.insertOne<NotificationIN>(MODEL.NOTIFICATION_MODEL, notificationInsertData);
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
      console.log("updateReceiver.socketId", updateReceiver.socketId);
      const notificationEventData = {
        eventName: EVENT_NAME.NOTIFICATION,
        data: {
          notification: {
            type: notification?.type,
            view: notification?.view,
            senderId: {
              _id:sender._id,
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

    let users = await MQ.findWithPopulate<UserIN[]>(MODEL.USER_MODEL, { _id: userId }, "friendRequest", "socketId");
    const friend = await MQ.find<UserIN[]>(MODEL.USER_MODEL, { _id: friendId });
    if (!users || users.length < 0 || !friend || friend.length < 0) {
      logger.error(`User data not found :::`);
      return false;
    }
    let user = users[0];
    const checkFriend = user.friendRequest.findIndex((element: any) => element._id == friendId);
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
    const updateFriend = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, friend[0].id, { $push: { friends: user.id }, $pull: { sendedRequest: user.id } }, true);
    const updateNotification = await MQ.findByIdAndUpdate<NotificationIN>(MODEL.NOTIFICATION_MODEL, notificationId, { type: CONFIG.NOTIFICATION_MESSAGE_TYPE.FOLLOW_ACCEPTED });

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
    const notification = await MQ.insertOne<NotificationIN>(MODEL.NOTIFICATION_MODEL, notificationInsertData);
    if (!notification) {
      throw new Error("notification data not added ");
    }

    // add notification
    console.log('updateFriend.socketId', updateFriend?.socketId)
    if (updateFriend && updateFriend.socketId) {
      const sendNotificationData = {
        eventName: EVENT_NAME.NOTIFICATION,
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
      const acceptEventData2 = {
        eventName: EVENT_NAME.ACCEPT_FOLLOW_REQUEST,
        data: {
          newFriend: {
            _id: friendId,
            userName: user.userName,
            profilePicture: user.profilePicture,
            tagLine: user.tagLine,
          },
        },
      };
      sendToSocket(updateFriend.socketId, acceptEventData2);

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
    const { receiverId, message, isGroup } = data;

    if (!receiverId || !message) {
      return false;
    }

    const user = await MQ.findById<UserIN>(MODEL.USER_MODEL, socket.userId);
    if (isGroup) {
      if (!user || !user.groups.includes(receiverId)) {
        return false;
      }
    } else {
      if (!user || !user.friends.includes(receiverId)) {
        return false;
      }
    }
    if (user.blockedUserId.includes(receiverId)) {
      logger.error(`messageHandler ::: sender was a blocked receiver`);
      return;
    }
    let friend: any;
    if (!isGroup) {
      friend = await MQ.findById<UserIN>(MODEL.USER_MODEL, receiverId);
      if (friend && friend.blockedByUsers.includes(user.id)) {
        logger.error(`messageHandler ::: sender was a blocked `);
        return;
      }
      if (!friend || !friend.friends.includes(user._id)) {
        return false;
      }
    } else {
      friend = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, receiverId);
      if (!friend || !friend.groupMembers.includes(user._id)) {
        logger.error(`SENDER WAS NOT GroupMember `);
        return false;
      }
    }

    const insertMessageData = {
      senderId: socket.userId,
      receiverId: receiverId,
      message: message,
    };
    let messageData = await MQ.insertOne<MessageIN>(MODEL.MESSAGE_MODEL, insertMessageData);
    if (!messageData) {
      return false;
    }

    //NOTE - update order of message in sender and receiver both
    if (user.pinedUsers.includes(friend.id)) {
      let newPinedUsers = user.pinedUsers;
      newPinedUsers.splice(newPinedUsers.indexOf(friend.id), 1);
      newPinedUsers.unshift(friend.id);
      await MQ.findByIdAndUpdate(MODEL.USER_MODEL, user.id, {
        $set: { pinedUsers: newPinedUsers },
      });
    } else {
      let newMessageOrder1: any = user.messageOrder;
      if (user.messageOrder.includes(friend.id)) {
        newMessageOrder1.splice(newMessageOrder1.indexOf(friend.id), 1);
      }
      newMessageOrder1.unshift(friend.id);
      await MQ.findByIdAndUpdate(MODEL.USER_MODEL, user.id, { $set: { messageOrder: newMessageOrder1 } });
    }
    if (!isGroup) {
      if (friend.pinedUsers.includes(user.id)) {
        let newPinedUsers = friend.pinedUsers;
        newPinedUsers.splice(newPinedUsers.indexOf(user.id), 1);
        newPinedUsers.unshift(user.id);
        await MQ.findByIdAndUpdate(MODEL.USER_MODEL, friend.id, { $set: { pinedUsers: newPinedUsers } });
      } else {
        let newMessageOrder2: any = friend.messageOrder;
        if (friend.messageOrder.includes(user.id)) {
          newMessageOrder2.splice(newMessageOrder2.indexOf(user.id), 1);
        }
        newMessageOrder2.unshift(user.id);
        await MQ.findByIdAndUpdate(MODEL.USER_MODEL, friend.id, { $set: { messageOrder: newMessageOrder2 } });
      }
    }

    //NOTE - update order end

    const sendMessageData = {
      eventName: EVENT_NAME.MESSAGE,
      data: {
        newMessage: {
          message,
          createdAt: messageData.createdAt,
          senderId: user.id,
          senderName: user.userName,
          receiverId,
          isGroup,
        },
      },
    };
    if (isGroup) {
      sendToRoom(receiverId, sendMessageData);
    } else {
      sendToSocket(socket.id, sendMessageData);
      if (friend?.socketId) {
        sendToSocket(friend.socketId, sendMessageData);
      }
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN ::: messageHandler:: ${error}`);
    console.log("error", error);
  }
};

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

    const user = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    let receiver;
    if (!data.isGroup) {
      receiver = await MQ.findById<UserIN>(MODEL.USER_MODEL, receiverId);
    } else {
      receiver = await MQ.findById<UserIN>(MODEL.GROUP_MODEL, receiverId);
    }
    if (!user || !receiver) {
      return false;
    }
    let query: any = {
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    };
    if (data.isGroup) {
      query = { receiverId };
    }
    let chat = await MQ.findWithPagination<MessageIN[]>(MODEL.MESSAGE_MODEL, query, CONFIG.MESSAGE_LOAD_LIMIT, 1, { createdAt: -1 });
    console.log("chat", chat);
    if (!chat) {
      chat = [];
    }
    const chatSendData = {
      eventName: EVENT_NAME.CHATS,
      data: {
        chats: chat ? chat.reverse() : [],
      },
    };
    console.log("chatSendData", JSON.stringify(chatSendData));
    await sendToSocket(socket.id, chatSendData);
  } catch (error) {
    logger.error(`CATCH ERROR IN ::: chatHandler:: ${error}`);
    console.log("error", error);
  }
};

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
    logger.error(`CATCH ERROR IN : joinGroupChatHandler ${error}`);
    console.log("error", error);
  }
};
export const editAdminHandler = async (socket: any, data: any) => {
  try {
    console.log("chcek admin data ::: ");
    console.log(data);
    let { editor, groupId, newAdminList } = data;
    if (!editor || !groupId || !newAdminList) {
      return false;
    }
    const groupData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, groupId);
    if (!groupData) {
      logger.error(`group data not found `);
      return false;
    }
    if (!groupData.admin.includes(editor)) {
      logger.error(`editor is not admin`);
      return false;
    }
    newAdminList.forEach((element: any) => {
      if (!groupData.groupMembers.includes(element)) {
        logger.error(`user ${element} not found in group members`);
        return false;
      }
    });
    newAdminList = newAdminList.filter((value: string, index: number, array: string[]) => array.indexOf(value) === index);

    const newGroupData = await MQ.findByIdAndUpdate<GroupIN>(MODEL.GROUP_MODEL, groupId, { admin: newAdminList }, true);
    console.log("newGroupData", newGroupData);
    const requestData = {
      eventName: EVENT_NAME.EDIT_GROUP_ADMIN,
      data: {
        groupId: newGroupData?.id,
        newAdminList: newAdminList,
      },
    };
    sendToSocket(socket.id, requestData);
  } catch (error) {
    logger.error(`CATCH ERROR IN : editAdminHandler ${error}`);
    console.log("error", error);
  }
};

export const leaveGroupHandler = async (socket: any, data: any) => {
  try {
    console.log("data", data);
    const { groupId, userId } = data;
    if (!groupId || !userId) {
      logger.error(`leaveGroupHandler ::: groupId or userId not found `);
      return;
    }
    const userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      logger.error(`leaveGroupHandler ::: user data not found `);
      return;
    }
    const groupData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, groupId);
    if (!groupData) {
      logger.error(`leaveGroupHandler ::: group data not found `);
      return;
    }
    if (!groupData.groupMembers.includes(userData._id)) {
      logger.error(`leaveGroupHandler :::user is not a group member`);
      return;
    }
    const newGroupMember = groupData.groupMembers.filter((element: any) => element.toString() !== userData.id);
    let query: any = {
      $set: {
        groupMembers: newGroupMember,
      },
    };
    let newAdminList;
    if (groupData.admin.includes(userData._id)) {
      newAdminList = groupData.admin.filter((element: any) => element.toString() != userData.id);
      console.log("newAdminList", newAdminList);
      query.$set.admin = newAdminList;
    }
    const updatedGroupData = await MQ.findByIdAndUpdate<GroupIN>(MODEL.GROUP_MODEL, groupData.id, query, true);

    if (!updatedGroupData) {
      logger.error(`leaveGroupHandler ::: group data not found after update `);
      return;
    }
    socket.leave(groupData._id);
    const responseData = {
      eventName: EVENT_NAME.LEAVE_GROUP,
      data: {
        leavedGroup: updatedGroupData._id,
      },
    };
    sendToSocket(socket.id, responseData);
    const newGroupData = await MQ.findWithPopulate<GroupIN[]>(MODEL.GROUP_MODEL, { _id: groupData.id }, "groupMembers", "profilePicture tagLine userName");
    console.log("newGroupData", newGroupData);
    if (!newGroupData) {
      logger.error(`leaveGroupHandler ::: newGroupData not found `);
      return;
    }
    const roomResponseData = {
      eventName: EVENT_NAME.UPDATE_FRIEND,
      data: {
        id: newGroupData[0].id,
        updateData: {
          groupMembers: newGroupData[0].groupMembers,
        },
      },
    };
    sendToRoom(groupData._id.toString(), roomResponseData);
  } catch (error) {
    logger.error(`CATCH ERROR IN : leaveGroupHandler ${error}`);
    console.log("error", error);
  }
};

export const blockUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, blockUserId, isGroup } = data;
    console.log("data", data);
    if (!userId || !blockUserId) {
      logger.error(`blockUserHandler ::: userId or blockUserId not found `);
      return;
    }
    let userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    console.log("userData", userData);
    if (!userData) {
      logger.error(`blockUserHandler ::: user data not found `);
      return;
    }
    let blockedUserData: any;
    if (isGroup) {
      blockedUserData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, blockUserId);
      if (!blockedUserData) {
        logger.error(`blockUserHandler ::: blocked group data not found `);
        return;
      }
    } else {
      blockedUserData = await MQ.findById<UserIN>(MODEL.USER_MODEL, blockUserId);
      if (!blockedUserData) {
        logger.error(`blockUserHandler ::: blocked user data not found `);
        return;
      }
    }

    console.log("blockedUserData", blockedUserData);
    console.log("!userData.blockedUserId.includes(blockUserId)", !userData.blockedUserId.includes(blockedUserData.id));
    if (!userData.blockedUserId.includes(blockedUserData.id)) {
      userData = await MQ.findByIdAndUpdate(MODEL.USER_MODEL, userData.id, { $push: { blockedUserId: blockedUserData.id } }, true);
      if (!userData) {
        logger.error(`blockUserHandler ::: user data not found after update `);
        return;
      }
    }

    console.log("!isGroup && !blockedUserData.blockedByUsers.includes(userData.id)", !isGroup && !blockedUserData.blockedByUsers.includes(userData.id));
    if (!isGroup && !blockedUserData.blockedByUsers.includes(userData.id)) {
      blockedUserData = await MQ.findByIdAndUpdate(MODEL.USER_MODEL, blockedUserData.id, { $push: { blockedByUsers: userData.id } });
      if (!blockedUserData) {
        logger.error(`blockUserHandler ::: blocked user data not found after update `);
        return;
      }
    }
    const responseData = {
      eventName: EVENT_NAME.BLOCK_USER,
      data: {
        blockedUser: blockUserId,
      },
    };
    sendToSocket(socket.id, responseData);
    if (!isGroup && blockedUserData.socketId) {
      const responseData = {
        eventName: EVENT_NAME.BLOCK_USER,
        data: {
          blockedByUsers: userId,
        },
      };
      sendToSocket(blockedUserData.socketId, responseData);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN : blockUserHandler ${error}`);
    console.log("error", error);
  }
};
export const unBlockUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, blockUserId, isGroup } = data;
    console.log("data", data);
    if (!userId || !blockUserId) {
      logger.error(`unBlockUserHandler ::: userId or blockUserId not found `);
      return;
    }
    let userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    console.log("userData", userData);
    if (!userData) {
      logger.error(`unBlockUserHandler ::: user data not found `);
      return;
    }
    let blockedUserData: any;
    if (isGroup) {
      blockedUserData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, blockUserId);
      if (!blockedUserData) {
        logger.error(`unBlockUserHandler ::: blocked group data not found `);
        return;
      }
    } else {
      blockedUserData = await MQ.findById<UserIN>(MODEL.USER_MODEL, blockUserId);
      if (!blockedUserData) {
        logger.error(`unBlockUserHandler ::: blocked user data not found `);
        return;
      }
    }
    if (userData.blockedUserId.includes(blockedUserData.id)) {
      userData = await MQ.findByIdAndUpdate(MODEL.USER_MODEL, userData.id, { $pull: { blockedUserId: blockedUserData.id } }, true);
      if (!userData) {
        logger.error(`unBlockUserHandler ::: user data not found after update `);
        return;
      }
    }
    if (!isGroup && blockedUserData.blockedByUsers.includes(userData.id)) {
      blockedUserData = await MQ.findByIdAndUpdate(MODEL.USER_MODEL, blockedUserData.id, { $pull: { blockedByUsers: userData.id } });
      if (!blockedUserData) {
        logger.error(`unBlockUserHandler ::: blocked user data not found after update `);
        return;
      }
    }
    const responseData = {
      eventName: EVENT_NAME.UNBLOCK_USER,
      data: {
        blockedUser: blockUserId,
      },
    };
    sendToSocket(socket.id, responseData);
    if (!isGroup && blockedUserData.socketId) {
      const responseData = {
        eventName: EVENT_NAME.UNBLOCK_USER,
        data: {
          blockedByUsers: userId,
        },
      };
      sendToSocket(blockedUserData.socketId, responseData);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN : unBlockUserHandler ${error}`);
    console.log("error", error);
  }
};

export const muteUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, muteUserId, isGroup } = data;
    if (!userId || !muteUserId) {
      logger.error(`muteUserHandler ::: userId or muteUserId not found `);
      return;
    }
    let userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      logger.error(`muteUserHandler ::: user data not found `);
      return;
    }
    if (!isGroup && !userData.friends.includes(muteUserId)) {
      logger.error(`muteUserHandler ::: user is not friend with mute user `);
      return;
    }
    if (isGroup && !userData.groups.includes(muteUserId)) {
      logger.error(`muteUserHandler ::: user is not member of mute group  `);
      return;
    }
    let muteUserData: any;
    if (isGroup) {
      muteUserData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, muteUserId);
    } else {
      muteUserData = await MQ.findById<UserIN>(MODEL.USER_MODEL, muteUserId);
    }
    console.log("muteUserData", muteUserData);
    if (!muteUserData) {
      logger.error(`muteUserHandler ::: mute user data not found `);
      return;
    }
    if (!userData.mutedUser.includes(muteUserData.id)) {
      userData = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userData.id, { $push: { mutedUser: muteUserData.id } });
    }
    const responseData = {
      eventName: EVENT_NAME.MUTE_USER,
      data: {
        mutedUser: muteUserData.id,
      },
    };
    sendToSocket(socket.id, responseData);
    return;
  } catch (error) {
    logger.error(`CATCH ERROR IN : MuteUserHandler ${error}`);
    console.log("error", error);
    return;
  }
};

export const unMuteUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, muteUserId, isGroup } = data;
    if (!userId || !muteUserId) {
      logger.error(`unMuteUserHandler ::: userId or muteUserId not found `);
      return;
    }
    let userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      logger.error(`unMuteUserHandler ::: user data not found `);
      return;
    }
    if (!isGroup && !userData.friends.includes(muteUserId)) {
      logger.error(`unMuteUserHandler ::: user is not friend with mute user `);
      return;
    }
    if (isGroup && !userData.groups.includes(muteUserId)) {
      logger.error(`unMuteUserHandler ::: user is not member of mute group  `);
      return;
    }
    let muteUserData: any;
    if (isGroup) {
      muteUserData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, muteUserId);
    } else {
      muteUserData = await MQ.findById<UserIN>(MODEL.USER_MODEL, muteUserId);
    }
    console.log("muteUserData", muteUserData);
    if (!muteUserData) {
      logger.error(`unMuteUserHandler ::: mute user data not found `);
      return;
    }
    if (userData.mutedUser.includes(muteUserData.id)) {
      userData = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userData.id, { $pull: { mutedUser: muteUserData.id } });
    }
    const responseData = {
      eventName: EVENT_NAME.UNMUTE_USER,
      data: {
        unMutedUser: muteUserData.id,
      },
    };
    sendToSocket(socket.id, responseData);
    return;
  } catch (error) {
    logger.error(`CATCH ERROR IN : unMuteUserHandler ${error}`);
    console.log("error", error);
    return;
  }
};

export const pinUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, pinUserId, isGroup } = data;
    if (!userId || !pinUserId) {
      logger.error(`pinUserHandler ::: userId or pinUserId not found `);
      return;
    }
    let userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      logger.error(`pinUserHandler ::: user data not found `);
      return;
    }
    if (!isGroup && !userData.friends.includes(pinUserId)) {
      logger.error(`pinUserHandler ::: user is not friend with mute user `);
      return;
    }
    if (isGroup && !userData.groups.includes(pinUserId)) {
      logger.error(`pinUserHandler ::: user is not member of mute group  `);
      return;
    }
    let pinUserData: any;
    if (isGroup) {
      pinUserData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, pinUserId);
    } else {
      pinUserData = await MQ.findById<UserIN>(MODEL.USER_MODEL, pinUserId);
    }
    console.log("pinUserData", pinUserData);
    if (!pinUserData) {
      logger.error(`pinUserHandler ::: pin user data not found `);
      return;
    }
    if (!userData.pinedUsers.includes(pinUserData.id)) {
      userData = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userData.id, { $push: { pinedUsers: pinUserData.id }, $pull: { messageOrder: pinUserData.id } });
    }
    const responseData = {
      eventName: EVENT_NAME.PIN_USER,
      data: {
        pinedUserId: pinUserData.id,
      },
    };
    sendToSocket(socket.id, responseData);
    return;
  } catch (error) {
    logger.error(`CATCH ERROR IN : pinUserHandler ${error}`);
    console.log("error", error);
    return;
  }
};

export const unPinUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, pinUserId, isGroup } = data;
    if (!userId || !pinUserId) {
      logger.error(`unPinUserHandler ::: userId or pinUserId not found `);
      return;
    }
    let userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      logger.error(`unPinUserHandler ::: user data not found `);
      return;
    }
    if (!isGroup && !userData.friends.includes(pinUserId)) {
      logger.error(`unPinUserHandler ::: user is not friend with mute user `);
      return;
    }
    if (isGroup && !userData.groups.includes(pinUserId)) {
      logger.error(`unPinUserHandler ::: user is not member of mute group  `);
      return;
    }
    let pinUserData: any;
    if (isGroup) {
      pinUserData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, pinUserId);
    } else {
      pinUserData = await MQ.findById<UserIN>(MODEL.USER_MODEL, pinUserId);
    }
    if (!pinUserData) {
      logger.error(`unPinUserHandler ::: pin user data not found `);
      return;
    }
    if (userData.pinedUsers.includes(pinUserData.id)) {
      userData = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, userData.id, { $pull: { pinedUsers: pinUserData.id }, $push: { messageOrder: { $each: [pinUserData.id], $position: 0 } } });
    }
    const responseData = {
      eventName: EVENT_NAME.UNPIN_USER,
      data: {
        unPinedUserId: pinUserData.id,
      },
    };
    sendToSocket(socket.id, responseData);
    return;
  } catch (error) {
    logger.error(`CATCH ERROR IN : unPinUserHandler ${error}`);
    console.log("error", error);
    return;
  }
};

export const addUserInGroupHandler = async (socket: any, data: any) => {
  try {
    console.log(data);
    const { editor, groupId, newFriendsList } = data;
    if (!editor || !groupId || !newFriendsList || newFriendsList.length <= 0) {
      logger.error(`addUserInGroupHandler ::: editor, groupId or newFriendsList not found or empty `);
      return;
    }
    const editorData = await MQ.findById<UserIN>(MODEL.USER_MODEL, editor);
    console.log("editorData", editorData);
    if (!editorData) {
      logger.error(`addUserInGroupHandler ::: editor data not found `);
      return;
    }
    const groupData = await MQ.findById<GroupIN>(MODEL.GROUP_MODEL, groupId);
    if (!groupData) {
      logger.error(`addUserInGroupHandler ::: group data not found `);
      return;
    }
    if (!groupData.admin.includes(editorData._id)) {
      logger.error(`addUserInGroupHandler :::editor is not an admin `);
      return;
    }
    newFriendsList.forEach(async (friendId: any) => {
      if (!editorData.friends.includes(friendId)) {
        logger.error(`addUserInGroupHandler ::: editor is not a friend with friendId ${friendId}`);
        return;
      }
    });
    const updatedGroupData = await MQ.findByIdAndUpdate<GroupIN>(MODEL.GROUP_MODEL, groupId, { $push: { groupMembers: { $each: newFriendsList } } });
    console.log("updatedGroupData", updatedGroupData);
    if (!updatedGroupData) {
      logger.error(`addUserInGroupHandler ::: failed to add user to group `);
      return;
    }
    const newGroupData = await MQ.findWithPopulate<GroupIN[]>(MODEL.GROUP_MODEL, { _id: groupData.id }, "groupMembers", "profilePicture tagLine userName");
    if (!newGroupData) {
      logger.error(`addUserInGroupHandler:: newGroupData not found `);
      return;
    }
    //NOTE - update new friends data and join the room
    for (var i = 0; i < newFriendsList.length; i++) {
      let newFriendData = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, newFriendsList[i], { $push: { groups: groupData.id } }, true);
      if (newFriendData && newFriendData?.socketId) {
        const sendEventData = {
          eventName: EVENT_NAME.ACCEPT_FOLLOW_REQUEST,
          data: { newFriend: newGroupData[0] },
        };
        sendToSocket(newFriendData.socketId, sendEventData);
      }
    }
    const updateGroupData = {
      eventName: EVENT_NAME.UPDATE_FRIEND,
      data: {
        updateData: {
          groupMembers: newGroupData[0].groupMembers,
        },
        id: updatedGroupData.id,
      },
    };
    sendToRoom(groupData._id.toString(), updateGroupData);
  } catch (error) {
    logger.error(`CATCH ERROR IN : addUserInGroupHandler ${error}`);
    console.log("error", error);
  }
};

export const unFollowUserHandler = async (socket: any, data: any) => {
  try {
    const { userId, friendId } = data;
    if (!userId || !friendId) {
      logger.error(`unFollowUserHandler ::: userId or friendId not found `);
      return;
    }
    const userData = await MQ.findById<UserIN>(MODEL.USER_MODEL, userId);
    if (!userData) {
      logger.error(`unFollowUserHandler ::: user data not found `);
      return;
    }
    if (!userData.friends.includes(friendId)) {
      logger.error(`unFollowUserHandler ::: user is not a friend with friendId ${friendId}`);
      return;
    }
    const friendData = await MQ.findById<UserIN>(MODEL.USER_MODEL, friendId);
    if (!friendData) {
      logger.error(`unFollowUserHandler ::: friend data not found `);
      return;
    }
    // await MQ.findByIdAndUpdate(MODEL.USER_MODEL, userId, { $push: { unFollowedUser: friendData.id } });
    // await MQ.findByIdAndUpdate(MODEL.USER_MODEL, friendData.id, { $push: { unFollowedByUsers: userData.id } });


    await MQ.findByIdAndUpdate(MODEL.USER_MODEL, userId, { $pull: { friends: friendData.id, messageOrder: friendData.id, pinedUsers: friendData.id ,blockedByUsers:friendData.id,blockedUserId:friendData.id} });
    await MQ.findByIdAndUpdate(MODEL.USER_MODEL, friendData.id, { $pull: { friends: userData.id, messageOrder: userData.id, pinedUsers: userData.id,blockedByUsers:userData.id,blockedUserId:userData.id} });

    const responseData = {
      eventName: EVENT_NAME.UN_FOLLOW,
      data: {
        unFollowedUser: friendData.id,
      },
    }
    sendToSocket(socket.id, responseData);
    if (friendData.socketId) {
      const resData = {
        eventName: EVENT_NAME.UN_FOLLOW,
        data: {
          unFollowedUser: userData.id,
        },
      }
      sendToSocket(friendData.socketId, resData)
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN ::: unFollowUserHandler ${error}`);
    console.log("error", error);
  }
};

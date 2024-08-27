import { createSlice } from "@reduxjs/toolkit";
import { getCookieData, setDataInCookie } from "../common";
import { COOKIE_KEY } from "../constant";
import addNotification from "react-push-notification";


const initialState = {
    notification: null,
    friends: null,
    messages: null,
    activeUserChat: null,
    userFriendsData: {
        sendedRequest: [],
        blockedByUsers: [],
        blockedUserId: [],
        mutedUser: [],
        pinedUsers: [],
        messageOrder: [],
    },
    loader: {
        friendsLoader: false,
        chatLoader: false,
        changeChatLoader: false,
        editGroupAdminLoader: false,
    },
    pendingViewIds: [],
    notificationSound: false,
    activeAside: "FRIENDS",
    activeNewChat: false,
    notificationViewPending: false,
    popup: {
        title: null,
        message: null,
        button: null,
        redirectUrl: null,
    }
}


const chatReducer = createSlice({
    name: "chat",
    initialState: initialState,
    reducers: {
        setOnlineUser: setOnlineUserFun,
        setNotification: setNotificationFun,
        pushNotification: pushNotificationFun,
        setFriend: setFriendFun,
        pushFriend: pushFriendFun,
        changeNotificationStatus: changeNotificationStatusFun,
        changeActiveUserChat: changeActiveUserChatFun,
        setMessage: setMessageFun,
        pushMessage: pushMessageFun,
        setFriendLoader: setFriendLoaderFun,
        removeIdFromPendingViews: removeIdFromPendingViewsFun,
        setNotificationSound: setNotificationSoundFun,
        setPaginationMessage: setPaginationMessageFun,
        setChatLoader: setChatLoaderFun,
        changeAsideContent: changeAsideContentFun,
        setPendingNotificationView: setPendingNotificationViewFun,
        changeChangeChatLoader: changeChangeChatLoaderFun,
        setPopup: setPopupFun,
        changeGroupAdminData: changeGroupAdminDataFun,
        changeEditGroupAdminLoader: changeEditGroupAdminLoaderFun,
        removeFriends: removeFriendsFun,
        updateFriends: updateFriendsFun,
        changeActiveNewChat: changeActiveNewChatFunction,
        setMessageOrder: setMessageOrderFunction,
        setPinUser: setPinUserFun,
        unPinUser: unPinUserFun,
        addBlockUser: addBlockUserFun,
        unBlockUser: unBlockUserFun,
        setMutedUser: setMutedUserFun,
        unMuteUser: unMuteUserFun,
        addUnFollowedUser: addUnFollowedUserFun,
        setSendedRequest: setSendedRequestFun
    }
})


function setOnlineUserFun(state, action) {
    console.log('action.payload.user', action.payload.user)
    state.userFriendsData.sendedRequest = action.payload.user.sendedRequest;
    state.userFriendsData.blockedByUsers = action.payload.user.blockedByUsers;
    state.userFriendsData.blockedUserId = action.payload.user.blockedUserId;
    state.userFriendsData.mutedUser = action.payload.user.mutedUser;
    state.userFriendsData.pinedUsers = action.payload.user.pinedUsers;
    state.userFriendsData.messageOrder = action.payload.user.messageOrder;
}

function setNotificationFun(state, action) {
    state.notification = action.payload;
}
function pushNotificationFun(state, action) {
    if (state.activeAside !== 'NOTIFICATION') {
        state.notificationViewPending = true;
    }
    if (state.notification && state.notification.length > 0) {
        state.notification.push(action.payload);
    }
    else {
        state.notification = [action.payload];
    }
}

function setFriendFun(state, action) {
    state.friends = action.payload;
}
function pushFriendFun(state, action) {
    let friends = JSON.parse(JSON.stringify(state.friends));
    if (state.friends && state.friends.length > 0) {
        state.friends.push(action.payload);
        friends.push(action.payload);
    }
    else {
        state.friends = [action.payload];
        friends = [action.payload];
    }
}
function changeNotificationStatusFun(state, action) {
    const { id, status } = action.payload;
    const notification = state.notification;
    const notificationIndex = notification.findIndex((element) => element._id == id);
    if (notificationIndex >= 0) {
        state.notification[notificationIndex].type = status;
    }
}
function changeActiveUserChatFun(state, action) {
    state.activeUserChat = action.payload;
    setDataInCookie(COOKIE_KEY.ACTIVE_USER_CHAT, action.payload)
}
function setMessageFun(state, action) {
    state.messages = action.payload;
}
function pushMessageFun(state, action) {
    const activeUserChat = getCookieData(COOKIE_KEY.ACTIVE_USER_CHAT);
    const userData = getCookieData(COOKIE_KEY.USER)
    if (userData._id !== action.payload.senderId && !userData.mutedUser.includes(action.payload.senderId)) {
        if (action.payload.isGroup && !userData.mutedUser.includes(action.payload.receiverId)) {
            const notificationSound = new Audio('./sound/messageNotification.wav')
            notificationSound.play().catch(error => {
                addNotification({
                    title: 'Message Received',
                    subtitle: `${action.payload.senderName}`,
                    message: `form: ${action.payload.senderName} \n ${action.payload.message}`,
                    theme: 'darkblue',
                    native: true,
                    duration: 4000
                });
            });
        }

    }
    //NOTE -  change message order 
    let messageOrderId = action.payload.receiverId;
    if (action.payload.receiverId === userData._id) {
        messageOrderId = action.payload.senderId
    }
    if (state.userFriendsData.pinedUsers.includes(messageOrderId)) {
        state.userFriendsData.pinedUsers.splice(state.userFriendsData.pinedUsers.indexOf(messageOrderId), 1);
        state.userFriendsData.pinedUsers.unshift(messageOrderId);
    } else {
        if (state.userFriendsData.messageOrder.includes(messageOrderId)) {
            state.userFriendsData.messageOrder.splice(state.userFriendsData.messageOrder.indexOf(messageOrderId), 1);
            state.userFriendsData.messageOrder = [messageOrderId, ...state.userFriendsData.messageOrder];
        } else {
            state.userFriendsData.messageOrder = [messageOrderId, ...state.userFriendsData.messageOrder];
        }
    }
    state.activeNewChat = false

    if (!activeUserChat || (activeUserChat && action.payload.senderId != activeUserChat._id && action.payload.senderId != userData._id)) {
        if (action.payload.isGroup) {
            state.pendingViewIds.push(action.payload.receiverId);
        } else {
            state.pendingViewIds.push(action.payload.senderId);
        }
    }
    if (activeUserChat && !(action.payload.receiverId == activeUserChat._id || (action.payload.receiverId == userData._id && action.payload.senderId == activeUserChat._id))) {
        return;
    }
    if (state.messages && state.messages.length > 0) {
        state.messages.push(action.payload);
    } else {
        state.messages = [action.payload];
    }

}

function setFriendLoaderFun(state, action) {
    state.loader.friendsLoader = action.payload
}
function removeIdFromPendingViewsFun(state, action) {
    if (state.pendingViewIds.includes(action.payload)) {
        state.pendingViewIds.splice(state.pendingViewIds.indexOf(action.payload), 1);
    }
}

function setNotificationSoundFun(state, action) {
    state.notificationSound = action.payload;
}
function setPaginationMessageFun(state, action) {
    if (action.payload.length > 0) {
        state.messages = action.payload.concat(state.messages);
    }
}
function setChatLoaderFun(state, action) {
    state.loader.chatLoader = action.payload;
}

function changeAsideContentFun(state, action) {
    state.activeAside = action.payload;
}
function setPendingNotificationViewFun(state, action) {
    state.notificationViewPending = action.payload;
}
function changeChangeChatLoaderFun(state, action) {
    state.changeChatLoader = action.payload
}

function setPopupFun(state, action) {
    state.popup = action.payload;
}
function changeGroupAdminDataFun(state, action) {
    const friends = JSON.parse(JSON.stringify(state.friends));
    const index = friends.findIndex((element) => element._id == action.payload.groupId);
    if (index >= 0) {
        state.friends[index].admin = action.payload.newAdminList;
        const activeChat = JSON.parse(JSON.stringify(state.activeUserChat));
        if (activeChat._id == action.payload.groupId) {
            state.activeUserChat.admin = action.payload.newAdminList;
        }
    }
    state.loader.editGroupAdminLoader = false;
}
function changeEditGroupAdminLoaderFun(state, action) {
    state.action = action.payload
}
function removeFriendsFun(state, action) {
    state.friends = state.friends.filter((element) => element._id != action.payload);
    const activeChat = JSON.parse(JSON.stringify(state.activeUserChat));
    if (activeChat._id == action.payload) {
        state.activeUserChat = null;
    }
}
function updateFriendsFun(state, action) {
    const index = state.friends.findIndex((element) => element._id == action.payload.id);
    console.log('index', index)
    if (index > -1) {
        state.friends[index] = { ...state.friends[index], ...action.payload.updateData };
        const activeUserChat = JSON.parse(JSON.stringify(state.activeUserChat));
        if (activeUserChat && activeUserChat._id == action.payload.id) {
            state.activeUserChat = { ...state.activeUserChat, ...action.payload.updateData }
        }
    }
}
function changeActiveNewChatFunction(state, action) {
    state.activeNewChat = action.payload
}
function setMessageOrderFunction(state, action) {
    console.log('action :::: set message order set check ', action)
    state.userFriendsData.messageOrder = action.payload
}
function setPinUserFun(state, action) {
    if (state.userFriendsData.pinedUsers && state.userFriendsData.pinedUsers.length > 0) {
        state.userFriendsData.pinedUsers.push(action.payload)
    } else {
        if (typeof action.payload === 'string') {

            state.userFriendsData.pinedUsers = [action.payload];
        } else {
            state.userFriendsData.pinedUsers = action.payload
        }
    }
}
function unPinUserFun(state, action) {
    state.userFriendsData.pinedUsers = state.userFriendsData.pinedUsers.filter((element) => element != action.payload);
    if (state.userFriendsData.messageOrder.includes(action.payload)) {
        state.userFriendsData.messageOrder.splice(state.userFriendsData.messageOrder.indexOf(action.payload), 1);
    }
    state.userFriendsData.messageOrder.unshift(action.payload);
}
function addBlockUserFun(state, action) {
    if (action.payload.blockedByUsers) {
        state.userFriendsData.blockedByUsers.push(action.payload.blockedByUsers)
    }
    if (action.payload.blockedUser) {
        state.userFriendsData.blockedUserId.push(action.payload.blockedUser)
    }
}

function unBlockUserFun(state, action) {
    if (action.payload.blockedByUsers) {
        state.userFriendsData.blockedByUsers = state.userFriendsData.blockedByUsers.filter((element) => element != action.payload.blockedByUsers);
    }
    if (action.payload.blockedUser) {
        state.userFriendsData.blockedUserId = state.userFriendsData.blockedUserId.filter((element) => element != action.payload.blockedUser);
    }
}
function setMutedUserFun(state, action) {
    if (state.userFriendsData.mutedUser && state.userFriendsData.mutedUser.length > 0) {
        state.userFriendsData.mutedUser.push(action.payload)
    } else {
        if (typeof action.payload === 'string') {
            state.userFriendsData.mutedUser = [action.payload];
        } else {
            state.userFriendsData.mutedUser = action.payload;
        }
    }
}
function unMuteUserFun(state, action) {
    state.userFriendsData.mutedUser = state.userFriendsData.mutedUser.filter((element) => element != action.payload);
}
function addUnFollowedUserFun(state, action) {
    state.friends = state.friends.filter((element) => element._id != action.payload.unFollowedUser)
    state.userFriendsData.messageOrder = state.userFriendsData.messageOrder.filter((element) => element._id != action.payload.unFollowedUser)
    state.userFriendsData.blockedUserId = state.userFriendsData.blockedUserId.filter((element) => element._id != action.payload.unFollowedUser)
    state.userFriendsData.mutedUser = state.userFriendsData.mutedUser.filter((element) => element._id != action.payload.unFollowedUser)
    state.userFriendsData.pinedUsers = state.userFriendsData.pinedUsers.filter((element) => element._id != action.payload.unFollowedUser)
    if (state.activeUserChat && state.activeUserChat._id == action.payload.unFollowedUser) {
        state.activeUserChat = null;
    }
}
function setSendedRequestFun(state, action) {
    if (state.userFriendsData.sendedRequest && state.userFriendsData.sendedRequest.length > 0) {
        state.userFriendsData.sendedRequest.push(action.payload)
    } else {
        if (typeof action.payload === 'string') {
            state.userFriendsData.sendedRequest = [action.payload];
        } else {
            state.userFriendsData.sendedRequest = action.payload;
        }
    }
}
export const {
    setNotification,
    pushNotification,
    setFriend,
    pushFriend,
    changeNotificationStatus,
    changeActiveUserChat,
    setMessage,
    pushMessage,
    setFriendLoader,
    removeIdFromPendingViews,
    setNotificationSound,
    setPaginationMessage,
    setChatLoader,
    changeAsideContent,
    setPendingNotificationView,
    changeChangeChatLoader,
    setPopup,
    changeGroupAdminData,
    changeEditGroupAdminLoader,
    removeFriends,
    updateFriends,
    changeActiveNewChat,
    setMessageOrder,
    setPinUser,
    unPinUser,
    addBlockUser,
    unBlockUser,
    setMutedUser,
    unMuteUser,
    addUnFollowedUser,
    setSendedRequest,
    setOnlineUser
} = chatReducer.actions;
export default chatReducer.reducer;
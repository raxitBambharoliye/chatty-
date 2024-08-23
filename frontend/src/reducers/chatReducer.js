import { createSlice } from "@reduxjs/toolkit";
import { getCookieData, setDataInCookie } from "../common";
import { COOKIE_KEY } from "../constant";
import addNotification from "react-push-notification";


const initialState = {
    notification: null,
    friends: null,
    messages: null,
    activeUserChat: null,
    loader: {
        friendsLoader: false,
        chatLoader: false,
        changeChatLoader: false,
        editGroupAdminLoader: false,
    },
    pendingViewIds: [],
    notificationSound: false,
    activeAside: "FRIENDS",
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
        updateFriends: updateFriendsFun
    }
})
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
    if (state.friends && state.friends.length > 0) {
        state.friends.push(action.payload);
    }
    else {
        state.friends = [action.payload];
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
    updateFriends
} = chatReducer.actions;
export default chatReducer.reducer;
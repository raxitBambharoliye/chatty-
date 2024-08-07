import { createSlice } from "@reduxjs/toolkit";
import { getCookieData, setDataInCookie } from "../common";
import { COOKIE_KEY } from "../constant";
import addNotification from "react-push-notification";
import { formatChat } from "../utility/logic/formatMessage";


const initialState = {
    notification: null,
    friends: null,
    messages: null,
    activeUserChat: null,    
    loader:{
        friendsLoader: false ,
        chatLoader:false
    },
    pendingViewIds: [],
    notificationSound: false
}


const chatReducer = createSlice({
    name: "chat",
    initialState:initialState,
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
        setChatLoader: setChatLoaderFun
    }
})
function setNotificationFun(state, action) {
    state.notification = action.payload;
}
function pushNotificationFun(state, action) {
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

    const formattedMessage = formatChat(action.payload)
    state.messages = formattedMessage;
}
function pushMessageFun(state, action) {
    const activeUserChat = getCookieData(COOKIE_KEY.ACTIVE_USER_CHAT);
    const userData = getCookieData(COOKIE_KEY.USER)

    if (userData._id !== action.payload.senderId) {
        const notificationSound = new Audio('./sound/m2.mp3')
        notificationSound.play().catch(error => {
            console.log('action.payload', action.payload)
            addNotification({
                title: 'Message Received',
                subtitle: `${action.payload.senderName}`,
                message: `form: ${action.payload.senderName} \n ${action.payload.message}`,
                theme: 'darkblue',
                native: true,
                duration: 4000
            });
        });;
    }

    if (!activeUserChat || (activeUserChat && action.payload.senderId != activeUserChat._id && action.payload.senderId != userData._id)) {
        state.pendingViewIds.push(action.payload.senderId);
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
        const newChatArray = formatChat(action.payload.concat(state.messages))
        state.messages = newChatArray;
    }
}
function setChatLoaderFun(state, action) {
    state.loader.chatLoader = action.payload;
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
    setChatLoader
} = chatReducer.actions;
export default chatReducer.reducer;
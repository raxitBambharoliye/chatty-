import { createSlice } from "@reduxjs/toolkit";
import { getCookieData, setDataInCookie } from "../common";
import { COOKIE_KEY } from "../constant";



const chatReducer = createSlice({
    name: "chat",
    initialState: { notification: null, friends: null, messages: null, activeUserChat: null,loader:{friendsLoader:false} },
    reducers: {
        setNotification: setNotificationFun,
        pushNotification: pushNotificationFun,
        setFriend: setFriendFun,
        pushFriend: pushFriendFun,
        changeNotificationStatus: changeNotificationStatusFun,
        changeActiveUserChat: changeActiveUserChatFun,
        setMessage: setMessageFun,
        pushMessage: pushMessageFun,
        setFriendLoader:setFriendLoaderFun
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
    setDataInCookie(COOKIE_KEY.ACTIVE_USER_CHAT,action.payload)
}
function setMessageFun(state, action) {
    state.messages = action.payload;
}
function pushMessageFun(state, action) {
    const activeUserChat = getCookieData(COOKIE_KEY.ACTIVE_USER_CHAT);
    const userData = getCookieData(COOKIE_KEY.USER)
    console.log('state.activeUserChat', activeUserChat)
    if (!(action.payload.receiverId == activeUserChat._id || (action.payload.receiverId==userData._id && action.payload.senderId == activeUserChat._id))) {
        return;
    }
    if (state.messages && state.messages.length > 0) {

        state.messages.push(action.payload);
    } else {
        state.messages = [action.payload];
    }

}

function setFriendLoaderFun(state, action) {
    state.loader.friendsLoader= action.payload
}
export const { setNotification, pushNotification, setFriend, pushFriend, changeNotificationStatus, changeActiveUserChat, setMessage, pushMessage ,setFriendLoader} = chatReducer.actions;
export default chatReducer.reducer;
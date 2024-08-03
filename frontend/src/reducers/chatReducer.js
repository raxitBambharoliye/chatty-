import { createSlice } from "@reduxjs/toolkit";



const chatReducer = createSlice({
    name: "chat",
    initialState: { notification: null, friends: null, messages: null },
    reducers: {
        setNotification: setNotificationFun,
        pushNotification: pushNotificationFun,
        setFriend: setFriendFun,
        pushFriend: pushFriendFun,
        changeNotificationStatus: changeNotificationStatusFun
    }
})
function setNotificationFun (state, action){
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
    state.friends= action.payload;
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
export const { setNotification ,pushNotification,setFriend,pushFriend,changeNotificationStatus} = chatReducer.actions;
export default chatReducer.reducer;
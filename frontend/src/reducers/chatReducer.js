import { createSlice } from "@reduxjs/toolkit";



const chatReducer = createSlice({
    name: "chat",
    initialState: { notification: null, friends: null, messages: null },
    reducers: {
        setNotification: setNotificationFun,
        pushNotification: pushNotificationFun
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

export const { setNotification ,pushNotification} = chatReducer.actions;
export default chatReducer.reducer;
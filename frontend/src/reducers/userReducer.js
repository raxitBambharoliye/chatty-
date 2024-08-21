import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
    name: "user",
    initialState: { user: {}, token: "", socket: null },
    reducers: {
        setUser: setUserFunction,
        getUser: getUserUserFunction,
        getUserToken: getUserTokenFunction,
        setUserToken: setUserTokenFunction,
        setSocket: setSocketFunction,
        addBlockUser: addBlockUserFunction,
        setBlockedByUsers: setBlockedByUsersFunction,
        setBlockedUserId: setBlockedUserIdFunction,
        unBlockUser:unBlockUserFunction
    }
})


function setUserFunction(state, action) {
    state.user = action.payload;
}
function getUserUserFunction(state, action) {
    return state;
}
function getUserTokenFunction(state, action) {
    return state.token;
}
function setUserTokenFunction(state, action) {
    state.token = action.payload;
}

function setSocketFunction(state, action) {
    state.socket = action.payload;
}
function addBlockUserFunction(state, action) {
    console.log('action', action)

    if (action.payload.blockedByUser) {
        console.log('state.user', JSON.parse(JSON.stringify(state.user)))
        state.user.blockedByUser.push(action.payload.blockedByUser)
    }
    if (action.payload.blockedUser) {
        console.log('state.user', JSON.parse(JSON.stringify(state.user)))

        state.user.blockedUserId.push(action.payload.blockedUser)
    }
}

function unBlockUserFunction(state, action) {
    if (action.payload.blockedByUser) {
        state.user.blockedByUser.filter((element) => element != action.payload.blockedByUser);
    }
    if (action.payload.blockedUser) {
        state.user.blockedUserId=state.user.blockedUserId.filter((element) => element != action.payload.blockedUser);
    }
}
function setBlockedByUsersFunction(state, action) {
    state.user.blockedByUsers = action.payload;
}
function setBlockedUserIdFunction(state, action) {
    state.user.blockedUserId = action.payload;
}
export const { setUser, getUser, getUserToken, setUserToken, setSocket, addBlockUser ,setBlockedByUsers , setBlockedUserId,unBlockUser} = userReducer.actions;
export default userReducer.reducer;
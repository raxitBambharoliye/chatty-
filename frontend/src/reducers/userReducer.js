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
        unBlockUser: unBlockUserFunction,
        setMutedUser: setMutedUserFunction,
        unMuteUser: unMuteUserFunction,
        setPinUser: setPinUserFunction,
        unPinUser: unPinUserFunction,
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
    if (action.payload.blockedByUsers) {
        state.user.blockedByUsers.push(action.payload.blockedByUsers)
    }
    if (action.payload.blockedUser) {
        state.user.blockedUserId.push(action.payload.blockedUser)
    }
}

function unBlockUserFunction(state, action) {
    if (action.payload.blockedByUsers) {
        state.user.blockedByUsers = state.user.blockedByUsers.filter((element) => element != action.payload.blockedByUsers);
    }
    if (action.payload.blockedUser) {
        state.user.blockedUserId = state.user.blockedUserId.filter((element) => element != action.payload.blockedUser);
    }
}
function setBlockedByUsersFunction(state, action) {
    state.user.blockedByUsers = action.payload;
}
function setBlockedUserIdFunction(state, action) {
    state.user.blockedUserId = action.payload;
}
function setMutedUserFunction(state, action) {
    console.log('action setMutedUserFunction', action)
    if (state.user.mutedUser && state.user.mutedUser.length > 0) {
        state.user.mutedUser.push(action.payload)
    } else {
        if (typeof action.payload === 'string') { 
            state.user.mutedUser = [action.payload];
        } else {
            state.user.mutedUser = action.payload;
        }
    }
}
function unMuteUserFunction(state, action) {
    state.user.mutedUser = state.user.mutedUser.filter((element) => element != action.payload);
}
function setPinUserFunction(state, action) {
    if (state.user.pinedUsers && state.user.pinedUsers.length > 0) {
        state.user.pinedUsers.push(action.payload)
    } else {
        if (typeof action.payload === 'string') { 

            state.user.pinedUsers = [action.payload];
        } else {
            state.user.pinedUsers = action.payload            
        }
    }
}
function unPinUserFunction(state, action) {
    state.user.pinedUsers = state.user.pinedUsers.filter((element) => element != action.payload);
}
export const {
    setUser,
    getUser,
    getUserToken,
    setUserToken,
    setSocket,
    addBlockUser,
    setBlockedByUsers,
    setBlockedUserId,
    unBlockUser,
    setMutedUser,
    unMuteUser,
    setPinUser,
    unPinUser
} = userReducer.actions;
export default userReducer.reducer;
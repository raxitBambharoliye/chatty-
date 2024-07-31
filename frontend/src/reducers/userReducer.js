import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
    name: "user",
    initialState:{user:{},token:"",socket:null},
    reducers:{
        setUser: setUserFunction,
        getUser: getUserUserFunction,
        getUserToken:getUserTokenFunction,
        setUserToken: setUserTokenFunction,
        setSocket:setSocketFunction
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

export const { setUser, getUser,getUserToken,setUserToken,setSocket } = userReducer.actions;
export default  userReducer.reducer;
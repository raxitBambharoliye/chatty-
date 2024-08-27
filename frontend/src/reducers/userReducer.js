import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
    name: "user",
    initialState: { user: {}, token: "", socket: null },
    reducers: {
        setUser: setUserFunction,
        setUserToken: setUserTokenFunction,
    }
})


function setUserFunction(state, action) {
    state.user = action.payload;
}
function setUserTokenFunction(state, action) {
    state.token = action.payload;
}



export const {
    setUser,
    setUserToken,
} = userReducer.actions;
export default userReducer.reducer;
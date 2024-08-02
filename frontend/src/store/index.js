import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userReducer'
import chatReducer from "../reducers/chatReducer";

const store = configureStore({
    reducer: combineReducers({ userData: userReducer, chat: chatReducer })
});

export default store;
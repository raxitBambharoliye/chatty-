import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userReducer'

const store = configureStore({ reducer: { userData: userReducer }});

export default store;
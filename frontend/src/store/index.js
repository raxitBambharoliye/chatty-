import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userReducer'

const store = configureStore({
    reducer:combineReducers({userData:userReducer})
})

export default store;
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userReducer'
import socketReducer from "../reducers/socketReducer";

const store = configureStore({
    reducer: combineReducers({ userData: userReducer, socket: socketReducer }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['socket/setSocket'],
          ignoredPaths: ['socket.instance'],
        },
      }),
    
})

export default store;
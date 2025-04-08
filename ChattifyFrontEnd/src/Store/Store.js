import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

import AuthReducer from '../Slices/AuthSlice';
import ChatReducer from '../Slices/ChatSlice';

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  Auth: AuthReducer,
  Chat: ChatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;

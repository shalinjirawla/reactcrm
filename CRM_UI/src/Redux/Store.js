import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserDataSlice from "./Features/UserDataSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from 'redux-persist/lib/storage';
import { setupListeners } from '@reduxjs/toolkit/query'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  userData: UserDataSlice,
});

const persisredReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisredReducer,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})

setupListeners(store.dispatch);
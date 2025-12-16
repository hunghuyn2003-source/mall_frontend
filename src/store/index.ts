import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./AuthSlide";
import storeSlice from "./StoreSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // localStorage

// 1️⃣ Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  store: storeSlice,
});

// 2️⃣ Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "store"], // chỉ persist user + activeStore
};

// 3️⃣ Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5️⃣ Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 6️⃣ Persistor
export const persistor = persistStore(store);

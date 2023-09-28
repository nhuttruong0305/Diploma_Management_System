import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit'
import authReducer from './authSlice';
import diplomaTypeReducer from './diplomaSlice';
import diplomaNameReducer from './diplomaNameSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['diplomaType', 'diplomaName']
}

const rootReducer =  combineReducers({
    auth: authReducer,
    diplomaType: diplomaTypeReducer,
    diplomaName: diplomaNameReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

export let persistor = persistStore(store);
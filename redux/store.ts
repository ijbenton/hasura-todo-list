import {
  combineReducers,
  configureStore,
  createSerializableStateInvariantMiddleware
} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { api } from '../graphql/api';
import authSlice from './slices/authSlice';
import todosSlice from './slices/todosSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [api.reducerPath]
};

const rootReducer = combineReducers({
  auth: authSlice,
  todos: todosSlice,
  [api.reducerPath]: api.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const serializableMiddleware = createSerializableStateInvariantMiddleware({
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
});

const middlewares = [thunk, serializableMiddleware, api.middleware];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: middlewares
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

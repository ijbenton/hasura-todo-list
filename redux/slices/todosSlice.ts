import { createSlice } from '@reduxjs/toolkit';

import { api } from '../../graphql/generated/graphql';
import { RootState } from '../state';
import { TodosState } from '../state/TodosState';
import authSlice, { logout } from './authSlice';

const initialState: TodosState = {
  myTodos: undefined
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  extraReducers(builder) {
    builder.addCase(logout, () => initialState);
    builder.addMatcher(
      api.endpoints.GetMyTodos.matchFulfilled,
      (state, action) => {
        state.myTodos = action.payload.todos;
      }
    );
    builder.addMatcher(
      api.endpoints.UpdateTodo.matchFulfilled,
      (state, action) => {
        if (state.myTodos?.length) {
          const foundIndex = state.myTodos.findIndex(
            (i) => i?.id === action.meta.arg.originalArgs.id
          );
          if (state.myTodos[foundIndex]) {
            state.myTodos[foundIndex].is_completed =
              action.meta.arg.originalArgs.is_completed;
          }
        }
      }
    );
    builder.addMatcher(
      api.endpoints.CreatePersonalTodo.matchFulfilled,
      (state, action) => {
        if (state.myTodos?.length && action.payload.insert_todos_one) {
          state.myTodos.push({ ...action.payload.insert_todos_one });
        }
      }
    );
  },
  reducers: {
    setMyTodos: (state, action) => {
      state.myTodos = action.payload;
    }
  }
});

export const { setMyTodos } = todosSlice.actions;

export const selectMyTodos = (state: RootState) => state.todos.myTodos;

export default todosSlice.reducer;

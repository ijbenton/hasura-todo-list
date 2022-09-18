import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import omit from 'lodash.omit';

import { api } from '../../graphql/generated/graphql';
import { DeletableTodo } from '../../model/DeletableTodo';
import { RootState } from '../state';
import { TodosState } from '../state/TodosState';
import { logout } from './authSlice';

const initialState: TodosState = {
  myTodos: {}
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  extraReducers(builder) {
    builder.addCase(logout, () => initialState);
    builder.addMatcher(
      api.endpoints.GetMyTodos.matchFulfilled,
      (state, action) => {
        action.payload.todos.forEach((todo) => {
          if (!state.myTodos) {
            state.myTodos = {};
          }
          if (todo) {
            state.myTodos[todo.id] = {
              ...todo,
              deletion_status: undefined
            };
          }
        });
      }
    );
    builder.addMatcher(
      api.endpoints.UpdateTodo.matchFulfilled,
      (state, action) => {
        if (!state.myTodos) {
          state.myTodos = {};
        }
        if (state.myTodos[action.meta.arg.originalArgs.id]) {
          state.myTodos[action.meta.arg.originalArgs.id].is_completed =
            action.meta.arg.originalArgs.is_completed;
        }
      }
    );
    builder.addMatcher(
      api.endpoints.CreatePersonalTodo.matchFulfilled,
      (state, action) => {
        if (!state.myTodos) {
          state.myTodos = {};
        }
        state.myTodos[action.payload.insert_todos_one?.id as number] = {
          ...action.payload.insert_todos_one,
          deletion_status: undefined
        } as DeletableTodo;
      }
    );
    builder.addMatcher(
      api.endpoints.DeleteTodo.matchRejected,
      (state, action) => {
        if (!state.myTodos) {
          state.myTodos = {};
        }

        if (state.myTodos[action.meta.arg.originalArgs?.id as number]) {
          state.myTodos[
            action.meta.arg.originalArgs?.id as number
          ].deletion_status = 'failed';
        }
      }
    );
    builder.addMatcher(
      api.endpoints.DeleteTodo.matchPending,
      (state, action) => {
        if (!state.myTodos) {
          state.myTodos = {};
        }

        if (state.myTodos[action.meta.arg.originalArgs?.id as number]) {
          state.myTodos[
            action.meta.arg.originalArgs?.id as number
          ].deletion_status = 'pending';
        }
      }
    );
  },
  reducers: {
    removeTodo: (state, action: PayloadAction<number>) => {
      if (!state.myTodos) {
        state.myTodos = {};
      }
      if (state.myTodos[action.payload]) {
        state.myTodos = omit(state.myTodos, action.payload);
      }
    }
  }
});

export const { removeTodo } = todosSlice.actions;

export const selectMyTodos = (state: RootState) => state.todos.myTodos;

export default todosSlice.reducer;

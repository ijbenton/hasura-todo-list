import { AuthState } from './AuthState';
import { TodosState } from './TodosState';

export type RootState = {
  auth: AuthState;
  todos: TodosState;
};

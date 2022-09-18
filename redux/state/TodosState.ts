import { DeletableTodo } from '../../model/DeletableTodo';

export interface TodosState {
  myTodos?: Record<string, DeletableTodo> | undefined;
}

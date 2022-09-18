import { Todos_Select_Column } from '../../graphql/generated/graphql';
import { Todo } from '../../model/Todo';

export interface TodosState {
  myTodos?: Todo[];
  // | null
  // | undefined
}

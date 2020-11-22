import { init } from 'immersed-react';

export type Todo = {
  id: string,
  name: string,
  completed: boolean,
}
export type FilterType = 'All' | 'Active' | 'Completed';
export type TodoState = {
  todos: Todo[],
  editing?: string,
  filter: FilterType
}

const initialState: TodoState = {
  todos:[],
  filter: 'All',
}

const { useSelector, update, addListener, removeListener, enableDevTool } = init<TodoState>(initialState);
enableDevTool();
export { useSelector, update, addListener, removeListener };
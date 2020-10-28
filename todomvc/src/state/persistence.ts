import { addListener, TodoState, update } from './index';

addListener<TodoState>((s) => s, (state: TodoState) => {
  localStorage.setItem('todoState', JSON.stringify(state));
});
const existingState = localStorage.getItem('todoState');
if (existingState) {
  const currState = JSON.parse(existingState);
  update((s) => {
    return currState;
  });
}
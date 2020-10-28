import React, { useRef } from 'react';
import { Item } from './item';
import { useSelector, update, TodoState, Todo, FilterType } from '../state';
import { createSelector } from 'reselect';
const visbleTodoSelector = createSelector<TodoState, Todo[], FilterType, Todo[]>((s) => s.todos, (s) => s.filter, (todos, filter) => {
  if (filter === 'All') {
    return todos;
  } 
  const wantsCompleted = (filter === 'Completed');
  return todos.filter(t => t.completed === wantsCompleted);
});

export function List() {
  const visibleTodos = useSelector(visbleTodoSelector);  
  const areAllCompleted = useSelector(s => s.todos.every(t => t.completed));
  const ref = useRef<HTMLInputElement>(null);
  const completeAll = () => update((s) => {
    s.todos.forEach(t => t.completed = !areAllCompleted);
  });

  return (
    <section className="main">
      <input ref={ ref } id="toggle-all" className="toggle-all" type="checkbox" checked={areAllCompleted} onChange={completeAll}/>
      <label htmlFor="toggle-all"/>

      <ul className="todo-list">
        {visibleTodos.map(todo => (
          <Item key={todo.id} id={todo.id} />
        ))}
      </ul>
    </section>
  );
}

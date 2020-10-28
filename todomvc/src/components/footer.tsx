import React from 'react';
import { FilterType, update, useSelector } from '../state';

export function Footer() {
  const completedCount = useSelector(s => s.todos.filter(t => t.completed).length);
  const totalCount = useSelector(s => s.todos.length);
  const itemsLeft = totalCount - completedCount;
  const filter = useSelector(state => state.filter);
  const clearCompleted = () => update((s) => {
    s.todos = s.todos.filter(t => !t.completed);
  });
  const setFilter = (f: FilterType) => update((s) => {
    s.filter = f
  });
  
  const itemText = itemsLeft === 1 ? 'item' : 'items';
  const filters: FilterType[] = ['All', 'Completed', 'Active'];

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{itemsLeft}</strong>
        <span> {itemText} left</span>
      </span>
      <ul className="filters">
        {filters.map(f => (
          <li key={f}>
            <a href={`#${f}`}
              className={ 'toggle ' + (f === filter ? 'selected' : '' )}
              onClick={() => setFilter(f) }
            >
              {f}
            </a>
          </li>
        ))}
      </ul>
      {!!completedCount && (
        <button className="clear-completed" onClick={clearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}

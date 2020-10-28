import React, { useState } from 'react';
import { TodoState, update, useSelector } from '../state';


export function Item({ id }: { id: string }) {
  const findTodo = (s: TodoState) => s.todos.find(t => t.id === id);
  const todo = useSelector(s => s.todos.find(t => t.id === id));
  const editing = useSelector(s => s.editing === id);
  const [name, setName] = useState(todo?.name || '');
  const handleEdit = () => update((s) => {
    s.editing = id;
  });

  const handleCompleted = () => {
    update((s) => {
      const t = findTodo(s);
      if (t) {
        t.completed = !t.completed;
      } 
    });
  };

  const stopEditing = () => {
    if (name === '') {
      handleRemove();
    }
    update(s => {
      delete s.editing
      const t = findTodo(s);
      if (t) {
        t.name = name?.trim();
      }     
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setName(todo?.name || '');
      update(s => {
        delete s.editing
      });
    }
    if (e.key === 'Enter') {
      stopEditing();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(s => {
      setName(e.target.value);
    });
  }

  const handleRemove = () => {
    update(s => {
      s.todos = s.todos.filter(t => t.id !== id)
    });
  }
  
  const cns: string[] = [];
  if (todo?.completed) {
    cns.push('completed');
  }
  if (editing) {
    cns.push('editing');
  }

  return (
    <li className={ cns.join(' ') } data-testid="todo-item">
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo?.completed} onChange={handleCompleted} />
        <label onDoubleClick={handleEdit} data-testid="todo-name">
          {todo?.name}
        </label>
        <button className="destroy" onClick={handleRemove} data-testid="todo-remove" />
      </div>
      {editing && (
        <input autoFocus className="edit" value={name} onChange={handleChange} onKeyUp={handleKeyUp} onBlur={stopEditing} />
      )}
    </li>
  );
}

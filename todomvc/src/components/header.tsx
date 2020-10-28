import React, { useState } from 'react';
import { update } from '../state';

export function Header() {
  const [name, setName] = useState('');

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) return;
    update(s => void s.todos.push({
      id: `${Math.random()}`,
      name: trimmed,
      completed: false,
    }));
    setName('');
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        autoFocus
        className="new-todo"
        placeholder="What needs to be done?"
        value={name}
        onKeyUp={ handleKeyUp }
        onChange={ handleChange }
        data-testid="todo-create"
      />
    </header>
  );
}

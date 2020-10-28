import React from 'react';

export function Copyright() {
  return (
    <footer className="info">
      <p data-testid="instruction">Double-click to edit a todo</p>
      <p>
        Created by <a href="http://github.com/itaylor/">itaylor</a>
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  );
}

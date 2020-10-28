import React from 'react';
import { useSelector } from '../state';
import '../state/persistence';
import '../state/routing';
import { Header } from './header';
import { List } from './list';
import { Footer } from './footer';
import { Copyright } from './copyright';

export function App() {
  const todos = useSelector(state => state.todos);
  return (
    <div id="app">
      <section className="todoapp">
        <Header />
        {!!todos.length && <List />}
        {!!todos.length && <Footer />}
      </section>
      <Copyright />
    </div>
  );
}


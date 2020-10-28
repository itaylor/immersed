import React from 'react';
import { render } from 'react-dom';
import { App } from './components/app';
import 'todomvc-app-css/index.css';
render(<App />, document.getElementsByTagName('app-root')[0]);

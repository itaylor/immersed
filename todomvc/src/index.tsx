import React from 'react';
import { createRoot } from 'react-dom';
import { App } from './components/app';
import 'todomvc-app-css/index.css';
const root = createRoot(document.getElementsByTagName('app-root')[0]);
root.render(<React.StrictMode><App/></React.StrictMode>);

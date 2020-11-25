# Immersed
[Immer](https://immerjs.github.io/immer/docs/introduction) based application state management

## Goals:
* Designed for typescript.  Use values from your application state safely without casting or `any`.
* Easy to use.  Very little configuration or setup needed.
* Good tooling support.  Supports using Redux devtool to see updates to the state.
* Automatic dependency upgrades and releases.  Always up to date with the latest versions of dependencies.

## immersed vs redux
Both of these are patterns to achieve mostly the same goal, to provide a structure to manage the state of your application in a way that is understandable and observable.  Redux separates the intent to modify the state (actions) from the updating of the state (reducers).  In `immersed`, there are no actions, action creators, or reducers.  Instead, you use `update` to modify the current state and produce the next state.

## Example usage with vanilla Create React App

Setup:
```sh
npx create-react-app cra --template typescript
cd cra
npm install --save immersed-react
```

Create a new file `src/State.ts`.  In this file we'll declare the type of our application state, and initialize `immersed` with an initial state.
```ts
import { init } from 'immersed-react';
export type MyState = {
  clickCount: number,
}
const initialState: MyState = {
  clickCount: 0,
}
const { useSelector, update, addListener, removeListener, enableDevTool } = init<MyState>(initialState);
enableDevTool(); // comment this out if you don't want to use the Redux dev tool.
export { useSelector, update, addListener, removeListener };
```

In the `src/App.tsx` file, import `useSelector` and `update` from `src/State.ts`
```ts
import { useSelector, update } from './State';
```
At the top of the `App` function, add your `useSelector` call.  We'll pass it a selector that returns the `clickCount` from the state store.
```ts
const clickCount = useSelector(s => s.clickCount);
```

Below, just before the the `</header>` element, add a button that displays the click count and increments the clickCount.
```tsx
<button onClick={() => update((s) => {
  s.clickCount++;
})}>
  Clicked {clickCount} times
</button>
```

The entire `App.tsx` should look like this:
```tsx
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useSelector, update } from './State';

function App() {
  const clickCount = useSelector(s => s.clickCount);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => update((s) => {
          s.clickCount++;
        })}>
          Clicked {clickCount} times
        </button>
      </header>
    </div>
  );
}
export default App;
```

Now run:
```bash
npm start
```
Create react app will start up, and you'll have a button beneath the Learn react link that you can click to update. 

This small example is not any better than using the `useState` hook, since there's only one place in the code that reads and updates the state.  However, unlike with `useState` this pattern can used from anywhere with the application, React component or otherwise to safely share that piece of state, and whenever the `clickCount` property is changed via a call to `update` any/all components that use `useSelector` will rerender with the new value.

## Beyond just updating React Components
Immersed is not tied to React.  You can use `update` and `addListener` from anywhere.

### addListener
This function allows you to listen for changes to the state via a selector function (first arg).  Any time an `update` causes the state selected by the selector function value to change, the activation function is called with the value from the selector.

Some quick ideas for what you might do:
* Add a listener that persists the entire state to localStorage on every change:
```tsx 
import { addListener } from 'src/State';

// The selector function looks at the value of clickCount.  
// The activation function is called with the value of clickCount, whenever clickCount changes.
// This function sets the clickCount value into localStorage.
addListener(s => s.clickCount, clickCount => localStorage.setItem('clickCount', clickCount));
```
* Add a listener that sends the clickCount to a server when it changes:
```tsx
import { addListener } from 'src/State';

// The selector function looks at the value of clickCount.  
// The activation function is called with the value of clickCount, whenever clickCount changes.
// This function posts to a /clickCount endpoint with the value.
addListener(
  s => s.clickCount, 
  async (clickCount) => {
    await fetch('/clickCount', { method: 'POST', body: { clickCount } });
  }
);
```
import { Recipe } from './index';

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
} 

export default function devTool<S>(update: (recipe: Recipe<S>, fromDevTool: boolean) => any, state: S, options?: any):
 ((state: S) => void )| undefined
{
  const defaultOptions = {
    trace: true,
    features: {
      pause: false, // start/pause recording of dispatched actions
      lock: false, // lock/unlock dispatching actions and side effects    
      persist: true, // persist states on page reloading
      export: false, // export history of actions in a file
      import: false, // import history of actions from a file
      jump: true, // jump back and forth (time travelling)
      skip: false, // skip (cancel) actions
      reorder: false, // drag and drop actions in the history list 
      dispatch: false, // dispatch custom actions or action creators
      test: false // generate tests for the selected actions
    }    
  };
  const dt = window?.__REDUX_DEVTOOLS_EXTENSION__?.connect(options || defaultOptions);
  if (!dt) {
    return;
  }
  dt.init(state);
  dt.subscribe((message: any) => {
    console.log('message', message);
    if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {
      setStateFromDevTool(JSON.parse(message.state));
    }
  });
  function setStateFromDevTool(state: S) {
    update(() => state, true);
  }
  function stateHandler(state: S) {
    dt.send(getFunctionNameFromStackTrace(4), state);
  }
  return stateHandler;
}

function getFunctionNameFromStackTrace(numFramesUp = 1) {
  const stackArr = new Error().stack?.split('\n');
  if (stackArr) {
    if (stackArr?.length > numFramesUp) {
      const matched = stackArr[numFramesUp].trim().match(/at (.*?) /)?.[1];
      if (matched) {
        return matched;
      }
    }
  }
  return 'unknown';
}
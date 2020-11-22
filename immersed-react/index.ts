import { init as immersedInit, ImmersedAPI, SelectorFn, Recipe } from 'immersed';
import { useState, useEffect } from 'react';
import devtool from './devtool';

type ImmersedReactAPI<S> = ImmersedAPI<S> & {
  useSelector: <X> (selector: SelectorFn<S, X>) => X;
  enableDevTool: () => boolean;
}

export function init<S>(initialState: S): ImmersedReactAPI<S> {
  const api = immersedInit<S>(initialState);
  const { addListener, removeListener, update, getState } = api;

  function useSelector<X>(selector: SelectorFn<S, X>) {
    const selectorVal = selector(getState());
    const [state, setState] = useState(selectorVal);
    useEffect(() => {
      const id = addListener<X>(selector, setState);
      return () => {
        removeListener(id);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return state;
  }
  let isDevToolUpdate = false;

  function enableDevTool(): boolean {
    const dt = devtool(updateFromDevTool, getState());
    if (!dt) return false;
    addListener((s: S) => s, (state: S) => {
      if (!isDevToolUpdate) {
        dt(state);
      }
    });
    function updateFromDevTool(recipe: Recipe<S>) {
      isDevToolUpdate = true;
      const s = update(recipe);
      isDevToolUpdate = false;
      return s;
    }
    return true;
  }
  
  const reactApi: ImmersedReactAPI<S> = {
    ...api,
    useSelector,
    enableDevTool
  }
  return reactApi;
}

export default init;
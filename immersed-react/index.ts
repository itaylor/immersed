import { init as immersedInit, ImmersedAPI, SelectorFn, Recipe  } from 'immersed';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import devtool from './devtool.js';

type ImmersedReactAPI<S> = ImmersedAPI<S> & {
  useSelector: <X> (selector: SelectorFn<S, X>) => X;
  enableDevTool: () => boolean;
}

export function init<S>(initialState: S): ImmersedReactAPI<S> {
  const api = immersedInit<S>(initialState);
  const { addListener, removeListener, update, getState } = api;

  const subscribe = (onStoreChange: () => void) => {
    const id = addListener((s: S) => s, () => onStoreChange());
    return () => removeListener(id);
  };

  function useSelector<X>(selector: SelectorFn<S, X>) {
    return useSyncExternalStoreWithSelector<S, X>(
      subscribe,
      getState,
      getState,
      selector
    );
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
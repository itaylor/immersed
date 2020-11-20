import { produce as immerProduce } from 'immer';
import React, { useState, useEffect } from 'react'; 
import devtool from './devtool';

export type SelectorFn<S, X> = (state: S) => X;
export type ActivationFn<X> = (selectedState: X) => unknown;
type SelectorActivator<S, X> = {
  selectorFn: SelectorFn<S, X>;
  id: number;
  activationFn: ActivationFn<X>;
};
export type Recipe<S> = (state: S) => S | void

export function init<S>(initialState: S) {
  let current: S = initialState;
  let currentId = 0;
  let selectors: SelectorActivator<S, any>[] = [];
  let devTool: ((state: S) => void) | undefined;

  function addListener<X>(
    selectorFn: SelectorFn<S, X>,
    activationFn: ActivationFn<X>
  ) {
    console.log("addListener", selectors.length);
    const id = currentId++;
    selectors.push({ selectorFn, id, activationFn });
    return id;
  }
  function removeListener(id: number) {
    console.log("removeListener", id, selectors.length);
    selectors = selectors.filter((s) => s.id !== id);
  }
  function useSelector<X>(selector: SelectorFn<S, X>) {
    const selectorVal = selector(current);
    const [state, setState] = useState(selectorVal);
    useEffect(() => {
      const id = addListener<X>(selector, setState);
      return () => {
        removeListener(id);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return state;
  }
  function update(recipe: Recipe<S>, fromDevTool=false): void {
    const last = current;
    const next = immerProduce(current, recipe);
    if (next === last) return // nothing to do
    
    current = next as S;
    if (devTool && !fromDevTool) {
      devTool(current);
    }
    selectors.forEach((s) => {
      const oldSelector = s.selectorFn(last);
      const newSelector = s.selectorFn(current);
      if (process.env.NODE_ENV === "development") {
        const newSelectorAgain = s.selectorFn(current);
        if (newSelectorAgain !== newSelector) {
          throw new Error(
            `Bad selector function.  This function produces different output with the same input. Consider memoizing its results if it is doing computation.  Function text: ${s.selectorFn.toString()}`
          );
        }
      }
      if (oldSelector !== newSelector) {
        s.activationFn(newSelector);
      }
    });
  };
  const api = 
  {
    getState() {
      return current;
    },
    update,
    addListener,
    removeListener,    
    useSelector,
    enableDevTool: () => {
      devTool = devtool<S>(update, initialState)
    },
  };
  return api; 
}

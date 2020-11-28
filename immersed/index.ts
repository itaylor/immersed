import { produce as immerProduce } from 'immer';

export type SelectorFn<S, X> = (state: S) => X;
export type ActivationFn<X> = (selectedState: X, prevSelectedState?: X) => unknown;
type SelectorActivator<S, X> = {
  selectorFn: SelectorFn<S, X>;
  id: number;
  activationFn: ActivationFn<X>;
};
export type Recipe<S> = (state: S) => S | void
export type ImmersedAPI<S> = {
  addListener: <X>(selectorFn: SelectorFn<S,X>, activationFn: ActivationFn<X>) => number;
  removeListener: (id: number) => void;
  update: (recipe: Recipe<S>) => void;
  getState: () => S;
}

export function init<S>(initialState: S): ImmersedAPI<S> {
  let current: S = initialState;
  let currentId = 0;
  let selectors: SelectorActivator<S, any>[] = [];
  let devTool: ((state: S) => void) | undefined;

  function addListener<X>(
    selectorFn: SelectorFn<S, X>,
    activationFn: ActivationFn<X>
  ) {
    const id = currentId++;
    selectors.push({ selectorFn, id, activationFn });
    return id;
  }
  function removeListener(id: number) {
    selectors = selectors.filter((s) => s.id !== id);
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
      const oldSelectorValue = s.selectorFn(last);
      const newSelectorValue = s.selectorFn(current);
      if (process.env.NODE_ENV === "development") {
        const newSelectorValueAgain = s.selectorFn(current);
        if (newSelectorValueAgain !== newSelectorValue) {
          throw new Error(
            `Bad selector function.  This function produces different output with the same input. Consider memoizing its results if it is doing computation.  Function text: ${s.selectorFn.toString()}`
          );
        }
      }
      if (newSelectorValue !== oldSelectorValue) {
        s.activationFn(newSelectorValue, oldSelectorValue);
      }
    });
  };
  function getState(): S {
    return current;
  }
  const api = 
  {
    getState,
    update,
    addListener,
    removeListener,    
  };
  return api; 
}

export default init;
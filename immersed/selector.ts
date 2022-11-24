export function createSelector<Q extends ParamsArray,
    P extends SelectorArray<Q>,
    C extends (...args: [...ExtractReturnType<Q, P>]) => any>
    (selectors: [...P], combiner: C) {    
    let lastSelected: ExtractReturnType<Q, P>;
    let lastCombined: ReturnType<C>;    
    return function selector(...args: LongestTuple<ExtractParameters<P>>): ReturnType<C> {
        const curr = selectors.map(s => s(...args as [...Q])) as [...ExtractReturnType<Q, P>];
        
        if (same(lastSelected as any[], curr)) {
            return lastCombined;
        }
        lastCombined = combiner(...curr);
        lastSelected = curr; 
        return lastCombined;
    }
}

function same(arr1?: unknown[], arr2?: unknown[]) {
    if (!arr1 || !arr2) {
        return arr1 === arr2;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i =0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

type Selector<T extends ParamsArray> = (...args: [...T]) => any;
export type SelectorArray<T extends ParamsArray> = ReadonlyArray<Selector<T>>;
type ParamsArray = ReadonlyArray<any>;

export type ExtractReturnType<P extends ParamsArray, T extends readonly Selector<P>[]> = {
    [index in keyof T]: T[index] extends T[number] ? ReturnType<T[index]> : never
}
type AnyFunction = (...args: any[]) => any;

export type ExtractParameters<T extends readonly AnyFunction[]> = {
    [index in keyof T]: T[index] extends T[number] ? Parameters<T[index]> : never    
}

export type LongestTuple<T extends readonly unknown[][]> = T extends [
    infer U extends unknown[]
  ]
    ? U
    : T extends [infer U, ...infer R extends unknown[][]]
    ? MostProperties<U, LongestTuple<R>>
    : never
  
type MostProperties<T, U> = keyof U extends keyof T ? T : U

import init from './index.js';
import 'mocha-ui-jest';
import { verify } from 'crypto';

describe('API shape', () => {
    test('init function and API shape',  () => {
        const store = init<{foo: string, bar: number}>({ foo: 'yep', bar: 0 });
        expect(store.update).toBeDefined();
        expect(store.addListener).toBeDefined();
        expect(store.removeListener).toBeDefined();
        expect(store.createStateSelector).toBeDefined();
        expect(store.getState).toBeDefined();
    });
    describe('update, getState', () => {
        test('update with recipe', () => {
            const store = init<{foo: string, bar: number}>({ foo: 'yep', bar: 0 });
            store.update(s => { s.foo = 'nope' });
            expect(store.getState().foo).toBe('nope');
        });
        test('update with new object', () => {
            const store = init<{foo: string, bar: number}>({ foo: 'yep', bar: 0 });
            store.update(_ => ({ foo: 'maybe', bar: 1 }));
            expect(store.getState()).toEqual({
                foo: 'maybe',
                bar: 1,
            });
        });
    });
    describe('addListener/removeListener', () => {
        test('listeners', () => {
            const store = init<{foo: string, bar: number}>({ foo: 'yep', bar: 0 });
            let callcounter = 0;
            const l = store.addListener((s) => s.foo, (foo, prevFoo) => {
                if (callcounter === 0) {
                    expect(prevFoo).toBe('yep');
                    expect(foo).toBe('nope');    
                } else if (callcounter === 1) {
                    expect(prevFoo).toBe('nope');
                    expect(foo).toBe('maybe');
                } else {
                    throw new Error('Should not be called more than twice');
                }
                callcounter++;
            });
            store.update(s => { s.foo = 'nope' });
            store.update(s => { s.foo = 'maybe' });
            expect(callcounter).toBe(2);
            store.removeListener(l);
            store.update(s => { s.foo = 'never' });
            expect(callcounter).toBe(2);
        });
    });
    describe('createStateSelector', () => {
        test('=== returns from selectors prevent combiner from rerunning', () => {
            type ReallyNestedObj = {
                reallyNested: boolean
            };
            type NestedStore = {
                foo: string,
                bar: number, 
                very: {
                    nested: {
                        thing: {
                            here: {
                                arr: ReallyNestedObj[]
                            }
                        }
                    }
                }
            }
            const initialState = {
                foo: 'yep',
                bar: 0,
                very: {
                    nested: { 
                        thing: {
                            here: {
                                arr: [{
                                    reallyNested: true
                                }]
                            }
                        }
                    }
                }
            };
            const store = init<NestedStore>(initialState);

            let combinerCallCount = 0;
            const sel = store.createStateSelector([
                s => s.very.nested.thing.here.arr[0].reallyNested,
                s => s.bar,
            ], (reallyNested, bar) => {
                combinerCallCount++;
                return {
                    reallyNested,
                    bar,
                };
            });
            const result1 = sel(initialState);
            expect(result1.reallyNested).toBe(true);
            expect(result1.bar).toBe(0);
            expect(combinerCallCount).toBe(1);
            const result2 = sel({...initialState, foo: 'something'});
            expect(result1).toBe(result2);
            expect(combinerCallCount).toBe(1);
            const result3 = sel(initialState);
            expect(result3).toBe(result3);
            expect(combinerCallCount).toBe(1);

            const differentState = {
                foo: 'nope',
                bar: 100,
                very: {
                    nested: { 
                        thing: {
                            here: {
                                arr: [{
                                    reallyNested: false
                                }]
                            }
                        }
                    }
                }
            };
            const result4 = sel(differentState);
            expect(result4).not.toBe(result1);
            expect(combinerCallCount).toBe(2);
        });
        test('addListener using selector from createStateSelector', () => {
            const store = init<{foo: string, bar: number}>({ foo: 'yep', bar: 0 });
            const sel = store.createStateSelector([s => s.foo], foo => ({ result: `nice ${foo}` }));
            let activiationCount = 0;
            let curr: { result: string } | undefined;
            store.addListener(sel, (_curr, _prev) => {
               activiationCount++; 
               curr = _curr;
            });
            store.update(s => { s.foo = 'test' });
            expect(activiationCount).toBe(1);
            expect(curr?.result).toBe('nice test');
            const lastResult = curr;
            store.update(s => { s.bar = 10 } );
            expect(activiationCount).toBe(1);
            expect(curr).toBe(lastResult);
            store.update(s => { s.bar = 1000 });
            expect(activiationCount).toBe(1);
            expect(curr).toBe(lastResult);
            store.update(s => { s.foo = 'tie'});
            expect(activiationCount).toBe(2);
            expect(curr).toEqual({ result: 'nice tie' });
        })
    });
});

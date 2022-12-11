import init from './index.js';
import 'mocha-ui-jest';

describe('Immersed-react API shape', () => {
    test('init function and API shape',  () => {
        const store = init<{foo: string, bar: number}>({ foo: 'yep', bar: 0 });
        expect(store.update).toBeDefined();
        expect(store.addListener).toBeDefined();
        expect(store.removeListener).toBeDefined();
        expect(store.createStateSelector).toBeDefined();
        expect(store.getState).toBeDefined();
        expect(store.enableDevTool).toBeDefined();
        expect(store.useSelector).toBeDefined();
    });
});

import { callbacksMiddleware, controlledModeMiddleware } from '../middlewares';
import { createStore } from '../store';

jest.mock('../middlewares');
const callbackMiddlewareMock = jest.mocked(callbacksMiddleware);
const controlledModelMiddlewareMock = jest.mocked(controlledModeMiddleware);

describe('store', () => {
  beforeEach(() => {
    callbackMiddlewareMock.mockReturnValue([]);
    controlledModelMiddlewareMock.mockImplementation((_, validated) => validated);
  });

  describe('getState', () => {
    it('returns initial state after creation', () => {
      const initialState = {};

      const store = createStore(initialState, {});
      const result = store.getState();

      expect(result).toEqual(initialState);
    });

    it('ignores uncommitted changes', () => {
      const initialState = { a: 1 };

      const store = createStore(initialState, {});
      store.addUpdate(() => ({ a: 2 }));
      const result = store.getState();

      expect(result).toEqual(initialState);
    });

    it('ignores roll backed changes', () => {
      const initialState = { a: 1 };

      const store = createStore(initialState, {});
      store.addUpdate(() => ({ a: 2 }));
      store.rollbackUpdates();
      const result = store.getState();

      expect(result).toEqual(initialState);
    });
  });

  describe('commitUpdates', () => {
    it('calls validation pipe with updated state', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      const validator = jest.fn().mockImplementation((state) => state);

      const store = createStore(initialState, {}, [validator]);
      store.addUpdate(() => updatedState);
      store.commitUpdates();

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator).toHaveBeenCalledWith(updatedState);
    });

    it('calls callbacks from callback middleware', () => {
      const callbacks = [jest.fn(), jest.fn(), jest.fn()];
      callbackMiddlewareMock.mockReturnValue(callbacks);

      const store = createStore({}, {});
      store.addUpdate(() => ({}));
      store.commitUpdates();

      callbacks.forEach((callback) => { expect(callback).toHaveBeenCalledTimes(1); });
    });

    it('collects callbacks between current and validated states', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      const validatedState = { a: 3 };
      const validator = jest.fn().mockReturnValue(validatedState);
      const stateConfig = {};

      const store = createStore(initialState, stateConfig, [validator]);
      store.addUpdate(() => updatedState);
      store.commitUpdates();

      expect(callbackMiddlewareMock).toHaveBeenCalledWith(
        initialState,
        validatedState,
        stateConfig,
      );
    });

    it('compares previous and validated states', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      const validatedState = { a: 3 };
      const validator = jest.fn().mockReturnValue(validatedState);
      const stateConfig = {};

      const store = createStore(initialState, stateConfig, [validator]);
      store.addUpdate(() => updatedState);
      store.commitUpdates();

      expect(controlledModelMiddlewareMock).toHaveBeenCalledWith(
        initialState,
        validatedState,
        stateConfig,
      );
    });

    it('updates state if it has changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };

      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      store.commitUpdates();
      const result = store.getState();

      expect(result).toEqual(updatedState);
    });

    it('doesnt update state if it has not changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      controlledModelMiddlewareMock.mockImplementation((current) => current);

      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      store.commitUpdates();
      const result = store.getState();

      expect(result).toEqual(initialState);
    });

    it('emits updated state if it has changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };

      let result;
      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      const unsubscribe = store.subscribe((state) => {
        result = state;
        unsubscribe();
      });
      store.commitUpdates();

      expect(result).toEqual(updatedState);
    });

    it('emits updated state if validated state has changes', () => {
      const initialState = { a: 1 };
      const validatedState = { a: 2 };
      const validator = jest.fn().mockReturnValue(validatedState);

      let result;
      const store = createStore(initialState, {}, [validator]);
      store.addUpdate(() => initialState);
      const unsubscribe = store.subscribe((state) => {
        result = state;
        unsubscribe();
      });
      store.commitUpdates();

      expect(result).toEqual(validatedState);
    });

    it('doesnt emit updated state if it has not changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      controlledModelMiddlewareMock.mockImplementation((current) => current);

      let result;
      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      const unsubscribe = store.subscribe((state) => {
        result = state;
        unsubscribe();
      });
      store.commitUpdates();

      expect(result).toBeUndefined();
    });
  });

  describe('commitPropsUpdates', () => {
    it('calls validation pipe with updated state', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      const validator = jest.fn().mockImplementation((state) => state);

      const store = createStore(initialState, {}, [validator]);
      store.addUpdate(() => updatedState);
      store.commitPropsUpdates();

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator).toHaveBeenCalledWith(updatedState);
    });

    it('calls callbacks from callback middleware', () => {
      const callbacks = [jest.fn(), jest.fn(), jest.fn()];
      callbackMiddlewareMock.mockReturnValue(callbacks);

      const store = createStore({}, {});
      store.addUpdate(() => ({}));
      store.commitPropsUpdates();

      callbacks.forEach((callback) => { expect(callback).toHaveBeenCalledTimes(1); });
    });

    it('collects callbacks between updated and validated states', () => {
      const updatedState = { a: 2 };
      const validatedState = { a: 3 };
      const validator = jest.fn().mockReturnValue(validatedState);
      const stateConfig = {};

      const store = createStore({ a: 1 }, stateConfig, [validator]);
      store.addUpdate(() => updatedState);
      store.commitPropsUpdates();

      expect(callbackMiddlewareMock).toHaveBeenCalledWith(
        updatedState,
        validatedState,
        stateConfig,
      );
    });

    it('compares updated and validated states', () => {
      const updatedState = { a: 2 };
      const validatedState = { a: 3 };
      const validator = jest.fn().mockReturnValue(validatedState);
      const stateConfig = {};

      const store = createStore({ a: 1 }, stateConfig, [validator]);
      store.addUpdate(() => updatedState);
      store.commitPropsUpdates();

      expect(controlledModelMiddlewareMock).toHaveBeenCalledWith(
        updatedState,
        validatedState,
        stateConfig,
      );
    });

    it('always applies added updates', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      controlledModelMiddlewareMock.mockImplementation((current) => current);

      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      store.commitPropsUpdates();
      const result = store.getState();

      expect(result).toEqual(updatedState);
    });

    it('rollbacks only validation pipe changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };
      const validatedState = { a: 3 };
      const validator = jest.fn().mockReturnValue(validatedState);
      controlledModelMiddlewareMock.mockImplementation((current) => current);

      const store = createStore(initialState, {}, [validator]);
      store.addUpdate(() => updatedState);
      store.commitPropsUpdates();
      const result = store.getState();

      expect(result).toEqual(updatedState);
    });

    it('emit state if state has changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 2 };

      let result;
      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      const unsubscribe = store.subscribe((state) => {
        result = state;
        unsubscribe();
      });
      store.commitPropsUpdates();

      expect(result).toEqual(updatedState);
    });

    it('emit state if validated state has changes', () => {
      const initialState = { a: 1 };
      const validatedState = { a: 2 };
      const validator = jest.fn().mockReturnValue(validatedState);

      let result;
      const store = createStore(initialState, {}, [validator]);
      store.addUpdate(() => initialState);
      const unsubscribe = store.subscribe((state) => {
        result = state;
        unsubscribe();
      });
      store.commitPropsUpdates();

      expect(result).toEqual(validatedState);
    });

    it('doesnt emit state if state has not changes', () => {
      const initialState = { a: 1 };
      const updatedState = { a: 1 };
      controlledModelMiddlewareMock.mockImplementation((current) => current);

      let result;
      const store = createStore(initialState, {});
      store.addUpdate(() => updatedState);
      const unsubscribe = store.subscribe((state) => {
        result = state;
        unsubscribe();
      });
      store.commitPropsUpdates();

      expect(result).toBeUndefined();
    });
  });
});

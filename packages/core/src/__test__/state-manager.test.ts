import { callbacksMiddleware, controlledModeMiddleware } from '../middlewares';
import { createReducer } from '../reducer';
import { createStateManager } from '../state-manager';
import { pipe } from '../utils';

jest.mock('../utils');
jest.mock('../reducer');
jest.mock('../middlewares');

const stateMock = {
  addUpdate: jest.fn(),
  commitUpdates: jest.fn(),
  rollbackUpdates: jest.fn(),
  getCurrent: jest.fn().mockReturnValue({}),
  triggerRender: jest.fn(),
  subscribeForRender: jest.fn(),
};
const stateProp = 'propA';

const createReducerMock = jest.mocked(createReducer);
const secondCreateReducerMock = jest.fn();
const reducerMock = jest.fn();

const pipeMock = jest.mocked(pipe);
const validatorMock = jest.fn();

const callbacksMiddlewareMock = jest.mocked(callbacksMiddleware);
const controlledMiddlewareMock = jest.mocked(controlledModeMiddleware);

describe('StateManager', () => {
  beforeEach(() => {
    createReducerMock.mockReturnValue(secondCreateReducerMock);
    secondCreateReducerMock.mockReturnValue(reducerMock);
    pipeMock.mockReturnValue(validatorMock);
    validatorMock.mockReturnValue({});
    callbacksMiddlewareMock.mockReturnValue([]);
    controlledMiddlewareMock.mockReturnValue([{}, false]);
  });

  afterAll(() => { jest.clearAllMocks(); });

  describe('commitUpdates', () => {
    it('calls state base method', () => {
      const [manager] = createStateManager(stateMock, {}, {});
      manager.commitUpdates();

      expect(stateMock.commitUpdates).toHaveBeenCalledTimes(1);
    });

    it('calls validator', () => {
      const expectedToValidateState = {};
      stateMock.getCurrent.mockReturnValue(expectedToValidateState);

      const [manager] = createStateManager(stateMock, {}, {});
      manager.commitUpdates();

      expect(validatorMock).toHaveBeenCalledTimes(1);
      expect(validatorMock).toHaveBeenCalledWith(expectedToValidateState);
    });

    it('calls all needed callbacks', () => {
      const neededCallbacks = [jest.fn(), jest.fn(), jest.fn()];
      callbacksMiddlewareMock.mockReturnValue(neededCallbacks);

      const [manager] = createStateManager(stateMock, {}, {});
      manager.commitUpdates();

      neededCallbacks.forEach((callbackMock) => {
        expect(callbackMock).toHaveBeenCalledTimes(1);
      });
    });

    it('calls state commitUpdates again and updates state model'
      + ' if model has changes after middleware', () => {
      const expectedStateValue = {};
      controlledMiddlewareMock.mockImplementation(() => {
        stateMock.commitUpdates.mockReset();
        return [expectedStateValue, true];
      });

      const [manager] = createStateManager(stateMock, {}, {});
      manager.commitUpdates();

      expect(stateMock.commitUpdates).toHaveBeenCalledTimes(1);
      expect(stateMock.addUpdate).toHaveBeenCalledTimes(1);
      expect(stateMock.addUpdate).toHaveBeenCalledWith(expectedStateValue);
    });

    it('doesn\'t call state\'s commitUpdates again and doesn\'t update state\'s model'
      + ' if model hasn\'t changes after middleware', () => {
      controlledMiddlewareMock.mockImplementation(() => {
        stateMock.commitUpdates.mockReset();
        return [{}, false];
      });

      const [manager] = createStateManager(stateMock, {}, {});
      manager.commitUpdates();

      expect(stateMock.commitUpdates).not.toHaveBeenCalled();
      expect(stateMock.addUpdate).not.toHaveBeenCalled();
    });

    it('always call state\'s triggerRender independent of the model changes', () => {
      const expectedStateCurrent = {};
      const possibleHasChanges = [true, false];
      stateMock.getCurrent.mockReturnValue(expectedStateCurrent);

      const [manager] = createStateManager(stateMock, {}, {});

      possibleHasChanges.forEach((hasChanges) => {
        controlledMiddlewareMock.mockReturnValue([{}, hasChanges]);
        manager.commitUpdates();

        expect(stateMock.triggerRender).toHaveBeenCalledTimes(1);
        expect(stateMock.triggerRender).toHaveBeenCalledWith(expectedStateCurrent);
        stateMock.triggerRender.mockReset();
      });
    });
  });

  describe('addUpdate', () => {
    it('calls state\'s base method', () => {
      const expectedUpdate = {};
      const [manager] = createStateManager(stateMock, {}, {});
      manager.addUpdate(expectedUpdate);

      expect(stateMock.addUpdate).toHaveBeenCalledTimes(1);
      expect(stateMock.addUpdate).toBeCalledWith(expectedUpdate);
    });
  });

  describe('rollbackUpdates', () => {
    it('calls state\'s base method', () => {
      const [manager] = createStateManager(stateMock, {}, {});
      manager.rollbackUpdates();

      expect(stateMock.rollbackUpdates).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Dispatcher', () => {
  beforeEach(() => {
    createReducerMock.mockReturnValue(secondCreateReducerMock);
    secondCreateReducerMock.mockReturnValue(reducerMock);
    pipeMock.mockReturnValue(validatorMock);
    validatorMock.mockReturnValue({});
    callbacksMiddlewareMock.mockReturnValue([]);
    controlledMiddlewareMock.mockReturnValue([{}, false]);
  });

  afterAll(() => { jest.clearAllMocks(); });

  it('calls reducer', () => {
    const expectedState = {};
    const expectedValue = {};
    stateMock.getCurrent.mockReturnValue(expectedState);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, expectedValue);

    expect(reducerMock).toHaveBeenCalledTimes(1);
    expect(reducerMock).toHaveBeenCalledWith(expectedState, stateProp, expectedValue);
  });

  it('calls validator', () => {
    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    expect(validatorMock).toHaveBeenCalledTimes(1);
  });

  it('dont mutate existing state value with reducer', () => {
    const expectedModel = { [stateProp]: 2 };
    reducerMock.mockReturnValue(expectedModel);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    expect(validatorMock).toHaveBeenCalledWith(expectedModel);
  });

  it('applies reducer model changes to validator', () => {
    const expectedState = { [stateProp]: 2 };
    reducerMock.mockReturnValue(expectedState);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    const [[result]] = validatorMock.mock.calls;
    expect(result).toStrictEqual(expectedState);
  });

  it('correctly merge reducer model changes and applies it to validator', () => {
    const testStateValueMock = {
      propA: 0,
      probB: 0,
    };
    const reducerChanges = { propA: 2 };
    const expectedState = {
      ...testStateValueMock,
      ...reducerChanges,
    };
    reducerMock.mockReturnValue(reducerChanges);
    stateMock.getCurrent.mockReturnValue(testStateValueMock);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    expect(validatorMock).toHaveBeenCalledWith(expectedState);
  });

  it('calls all needed callbacks', () => {
    const neededCallbacks = [jest.fn(), jest.fn(), jest.fn()];
    callbacksMiddlewareMock.mockReturnValue(neededCallbacks);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    neededCallbacks.forEach((callbackMock) => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls state\'s commitUpdates and updates state\'s model if model has changes after middleware', () => {
    controlledMiddlewareMock.mockReturnValue([{}, true]);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    expect(stateMock.commitUpdates).toHaveBeenCalledTimes(1);
    expect(stateMock.addUpdate).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t call state\'s commitUpdates and doesn\'t update state\'s model '
    + 'if model has changes after middleware', () => {
    controlledMiddlewareMock.mockReturnValue([{}, false]);

    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );
    dispatcher.dispatch(stateProp, {});

    expect(stateMock.commitUpdates).not.toHaveBeenCalled();
    expect(stateMock.addUpdate).not.toHaveBeenCalled();
  });

  it('calls state\'s triggerRender only if model has changes after middleware', () => {
    const [, dispatcher] = createStateManager(
      stateMock,
      {},
      { [stateProp]: jest.fn() },
    );

    controlledMiddlewareMock.mockReturnValue([{}, false]);
    dispatcher.dispatch(stateProp, {});

    expect(stateMock.triggerRender).not.toHaveBeenCalled();

    controlledMiddlewareMock.mockReturnValue([{}, true]);
    dispatcher.dispatch(stateProp, {});

    expect(stateMock.triggerRender).toHaveBeenCalledTimes(1);
  });
});

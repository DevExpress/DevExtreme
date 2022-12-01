import { DISPOSE } from '../utils';
import { createViewModelValue } from '../view-model';
import { createViewModelManager } from '../view-model-manager';

jest.mock('../view-model');

const createViewModelMock = jest.mocked(createViewModelValue);
const viewModelMock = {
  subscribe: jest.fn(),
  getValue: jest.fn(),
  [DISPOSE]: jest.fn(),
};

const stateMock = {
  addUpdate: jest.fn(),
  commitUpdates: jest.fn(),
  rollbackUpdates: jest.fn(),
  getCurrent: jest.fn().mockReturnValue({}),
  triggerRender: jest.fn(),
  subscribeForRender: jest.fn(),
};
const stateValueMock = {};

describe('Core: Component: ViewManager', () => {
  beforeEach(() => {
    stateMock.getCurrent.mockReturnValue(stateValueMock);
  });

  afterAll(() => jest.resetAllMocks());

  it('adds new view model', () => {
    const expectedViewModel = {
      ...viewModelMock,
    };
    const viewModelKey = 'viewModelA';
    createViewModelMock.mockReturnValue(expectedViewModel);

    const manager = createViewModelManager(stateMock);
    manager.add({
      [viewModelKey]: jest.fn(),
    });
    const viewModels = manager.get();

    expect(viewModels[viewModelKey]).toBe(expectedViewModel);
  });

  it('uses the createViewModel func for adding new view models', () => {
    const manager = createViewModelManager(stateMock);
    manager.add({
      A: jest.fn(),
      B: jest.fn(),
    });

    expect(createViewModelMock).toHaveBeenCalledTimes(2);
    expect(createViewModelMock)
      .toHaveBeenNthCalledWith(1, stateValueMock, stateMock.subscribeForRender, expect.anything());
    expect(createViewModelMock)
      .toHaveBeenNthCalledWith(2, stateValueMock, stateMock.subscribeForRender, expect.anything());
  });

  it('skips undefined selectors on the adding new view models', () => {
    const expectedViewModelKeys = ['B'];

    const manager = createViewModelManager(stateMock);
    manager.add({
      A: undefined,
      B: jest.fn(),
    });
    const viewModels = manager.get();

    expect(createViewModelMock).toHaveBeenCalledTimes(1);
    expect(Object.keys(viewModels)).toEqual(expectedViewModelKeys);
  });

  it('throws error if adds view model with same key twice', () => {
    createViewModelMock.mockReturnValue(viewModelMock);

    const manager = createViewModelManager(stateMock);
    const addViewModel = () => {
      manager.add({
        A: jest.fn(),
      });
    };

    addViewModel();

    expect(addViewModel).toThrow();
  });

  it('deletes view models', () => {
    const manager = createViewModelManager(stateMock);
    manager.add({
      A: jest.fn(),
      B: jest.fn(),
      C: jest.fn(),
      D: jest.fn(),
    });
    manager.remove('A', 'C');
    const viewModels = manager.get();

    expect(Object.keys(viewModels)).toEqual(['B', 'D']);
  });

  it('calls view model\'s dispose when deleting it', () => {
    const disposeA = jest.fn();
    const selectorA = jest.fn();
    const disposeC = jest.fn();
    const selectorC = jest.fn();

    createViewModelMock.mockImplementation((_, __, selector) => {
      switch (true) {
        case selector === selectorA:
          return { ...viewModelMock, [DISPOSE]: disposeA };
        case selector === selectorC:
          return { ...viewModelMock, [DISPOSE]: disposeC };
        default:
          return { ...viewModelMock };
      }
    });

    const manager = createViewModelManager(stateMock);
    manager.add({
      A: selectorA,
      B: jest.fn(),
      C: selectorC,
      D: jest.fn(),
    });
    manager.remove('A', 'C');

    expect(disposeA).toHaveBeenCalledTimes(1);
    expect(disposeC).toHaveBeenCalledTimes(1);
  });

  it('does nothing on delete if view model with passed key doesn\'t exist', () => {
    const manager = createViewModelManager(stateMock);
    manager.add({
      A: jest.fn(),
      B: jest.fn(),
    });
    manager.remove('C');
    const viewModels = manager.get();

    expect(Object.keys(viewModels)).toEqual(['A', 'B']);
  });

  it('calls each view model\'s dispose on dispose', () => {
    const disposeA = jest.fn();
    const selectorA = jest.fn();
    const disposeB = jest.fn();
    const selectorB = jest.fn();

    createViewModelMock.mockImplementation((_, __, selector) => {
      switch (true) {
        case selector === selectorA:
          return { ...viewModelMock, [DISPOSE]: disposeA };
        case selector === selectorB:
          return { ...viewModelMock, [DISPOSE]: disposeB };
        default:
          return { ...viewModelMock };
      }
    });

    const manager = createViewModelManager(stateMock);
    manager.add({
      A: selectorA,
      B: selectorB,
    });
    manager[DISPOSE]();

    expect(disposeA).toHaveBeenCalledTimes(1);
    expect(disposeB).toHaveBeenCalledTimes(1);
  });
});

import { createCore } from '../create-core';
import { createState } from '../state';
import { createStateManager } from '../state-manager';
import { DISPOSE } from '../utils';
import { createViewModelManager } from '../view-model-manager';

jest.mock('../state');
jest.mock('../state-manager');
jest.mock('../view-model-manager');

const createStateMock = jest.mocked(createState);
const createStateManagerMock = jest.mocked(createStateManager);
const createViewModelManagerMock = jest.mocked(createViewModelManager);

describe('Core: Component', () => {
  const stateMock = { model: {}, dictionary: {} };

  beforeEach(() => {
    createStateManagerMock.mockReturnValue([{
      addUpdate: jest.fn(),
      rollbackUpdates: jest.fn(),
      commitUpdates: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    }, {
      dispatch: jest.fn(),
    }]);
    createViewModelManagerMock.mockReturnValue({
      add: jest.fn(),
      remove: jest.fn(),
      get: jest.fn(),
      [DISPOSE]: jest.fn(),
    });
  });

  afterAll(() => { jest.resetAllMocks(); });

  it('creates state', () => {
    createCore()(stateMock, {}, {});
    expect(createStateMock).toHaveBeenCalledTimes(1);
  });

  it('creates state manager', () => {
    createCore()(stateMock, {}, {});
    expect(createStateManagerMock).toHaveBeenCalledTimes(1);
  });

  it('creates view model manager', () => {
    createCore()(stateMock, {}, {});
    expect(createViewModelManagerMock).toHaveBeenCalledTimes(1);
  });
});

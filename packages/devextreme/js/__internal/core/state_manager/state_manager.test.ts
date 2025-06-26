/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { DIContext } from '../di';
import type { TrackedState } from '../reactive/development';
import { state } from '../reactive/development';
import { setupStateManager } from './setup_state_manager';
import type { StateManager } from './types';

describe('StateManager', () => {
  const originalEnv = { ...process.env };

  beforeAll(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Component state tracking', () => {
    let diContext: DIContext;
    let testComponentStateTracker: StateManager;
    let initialPagerConfig: { infinityScrollingEnabled: boolean };
    let nonReactiveProperty: { text: string };
    let NoSignForIncludingItByStateManager: new () => {
      someField: TrackedState<boolean>;
    };
    let DataController: new () => {
      pagesCount: TrackedState<number>;
      pagerConfig: TrackedState<{ infinityScrollingEnabled: boolean }>;
      nonReactiveProperty: { text: string };
    };
    let ColumnsController: new () => {
      columnsCount: TrackedState<number>;
      text: TrackedState<string>;
      nonReactiveProperty: { text: string };
    };
    let ignoredInstance: InstanceType<typeof NoSignForIncludingItByStateManager>;
    let columnsControllerInstance: InstanceType<typeof ColumnsController>;
    let dataControllerInstance: InstanceType<typeof DataController>;

    const updatedPagerConfig = { infinityScrollingEnabled: false };

    beforeAll(() => {
      diContext = new DIContext();

      const stateManager = setupStateManager({
        diContext,
        componentName: 'TestComponent',
        logLevel: 'error',
      });

      if (!stateManager) {
        throw Error('StateManager not initialized');
      }

      testComponentStateTracker = stateManager;

      initialPagerConfig = {
        infinityScrollingEnabled: true,
      };

      nonReactiveProperty = {
        text: 'non-reactive property',
      };

      NoSignForIncludingItByStateManager = class {
        someField = state(true);
      };

      DataController = class {
        pagesCount = state(10);

        pagerConfig = state(initialPagerConfig);

        nonReactiveProperty = nonReactiveProperty;
      };

      ColumnsController = class {
        columnsCount = state(5);

        text = state('initial');

        nonReactiveProperty = nonReactiveProperty;
      };

      ignoredInstance = new NoSignForIncludingItByStateManager();
      columnsControllerInstance = new ColumnsController();
      dataControllerInstance = new DataController();

      diContext.registerInstance(ColumnsController, columnsControllerInstance);
      diContext.registerInstance(DataController, dataControllerInstance);
      diContext.registerInstance(NoSignForIncludingItByStateManager, ignoredInstance);
    });

    it('should ignore non-controllers', () => {
      expect(testComponentStateTracker.getComponentState()).not.toMatchObject({
        NoSignForIncludingItByStateManagerController: expect.anything(),
      });
    });

    it('should get component state after controllers registration', () => {
      expect(testComponentStateTracker.getComponentState().ColumnsController).toEqual({
        columnsCount: 5,
        text: 'initial',
      });

      expect(testComponentStateTracker.getComponentState().DataController).toEqual({
        pagesCount: 10,
        pagerConfig: initialPagerConfig,
      });
    });

    it('should get deep copies of state values', () => {
      expect(testComponentStateTracker.getComponentState().DataController.pagerConfig)
        .not.toBe(initialPagerConfig);
    });

    it('should preserve original controller state values after state tracker initialization', () => {
      expect(columnsControllerInstance.columnsCount.unreactive_get()).toBe(5);
      expect(columnsControllerInstance.text.unreactive_get()).toBe('initial');
      expect(dataControllerInstance.pagesCount.unreactive_get()).toBe(10);
      expect(dataControllerInstance.pagerConfig.unreactive_get())
        .toBe(initialPagerConfig);
      expect(dataControllerInstance.nonReactiveProperty).toEqual(nonReactiveProperty);
    });

    it('should track controllers state updates', () => {
      columnsControllerInstance.columnsCount.update(10);
      dataControllerInstance.pagesCount.update(15);
      dataControllerInstance.pagerConfig.update(updatedPagerConfig);

      expect(testComponentStateTracker.getComponentState().ColumnsController).toEqual({
        columnsCount: 10,
        text: 'initial',
      });

      expect(testComponentStateTracker.getComponentState().DataController).toEqual({
        pagesCount: 15,
        pagerConfig: updatedPagerConfig,
      });
    });

    it('should preserve original controller state values after tracking controllers state updates', () => {
      expect(testComponentStateTracker.getComponentState().DataController.pagerConfig)
        .not.toBe(updatedPagerConfig);
      expect(columnsControllerInstance.text.unreactive_get()).toBe('initial');
      expect(columnsControllerInstance.columnsCount.unreactive_get()).toBe(10);
      expect(dataControllerInstance.pagesCount.unreactive_get()).toBe(15);
      expect(dataControllerInstance.pagerConfig.unreactive_get())
        .toBe(updatedPagerConfig);
      expect(dataControllerInstance.nonReactiveProperty).toEqual(nonReactiveProperty);
    });
  });

  it('Should allow garbage collection of controllers when a component is destroyed', async () => {
    let diContext: DIContext | null = new DIContext();

    const testComponentStateTracker = setupStateManager({
      diContext,
      componentName: 'TestComponent',
      logLevel: 'error',
    });

    if (!testComponentStateTracker) {
      throw Error('StateManager not initialized');
    }

    class TestController {
      testValue = state(42);
    }

    let controllerInstance: TestController | null = new TestController();
    const controllerInstanceWeakRef = new WeakRef(controllerInstance);

    diContext.registerInstance(TestController, controllerInstance);

    controllerInstance = null;
    diContext = null;

    if (global.gc) {
      for (let i = 0; i < 2; i += 1) {
        global.gc();
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return, no-restricted-globals
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    const isGarbageCollected = controllerInstanceWeakRef.deref() === undefined;

    expect(isGarbageCollected).toBe(true);
  });
});

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
import type { Signal } from '@ts/core/state_manager/index';
import { signal } from '@ts/core/state_manager/index';

import { DIContext } from '../di';
import { setupStateManager } from './setup_state_manager';
import type { StateManager } from './types';

const waitGarbageCollection = async (): Promise<void> => {
  if (global.gc) {
    for (let i = 0; i < 2; i += 1) {
      global.gc();
      // eslint-disable-next-line @stylistic/max-len
      // eslint-disable-next-line no-await-in-loop, no-promise-executor-return, no-restricted-globals
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
};

type TrackedSignal<T> = Signal<T>;

describe('StateManager', () => {
  const originalEnv = { ...process.env };

  beforeAll(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Component signal tracking', () => {
    let diContext: DIContext;
    let testComponentStateTracker: StateManager;
    let initialPagerConfig: { infinityScrollingEnabled: boolean };
    let nonPreactSignalProperty: { text: string };
    let NoSignForIncludingItByStateManager: new () => {
      someField: TrackedSignal<boolean>;
    };
    let DataController: new () => {
      pagesCount: TrackedSignal<number>;
      pagerConfig: TrackedSignal<{ infinityScrollingEnabled: boolean }>;
      nonPreactSignalProperty: { text: string };
    };
    let ColumnsController: new () => {
      columnsCount: TrackedSignal<number>;
      text: TrackedSignal<string>;
      nonPreactSignalProperty: { text: string };
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

      nonPreactSignalProperty = {
        text: 'non-preact-signal-property',
      };

      NoSignForIncludingItByStateManager = class {
        someField = signal(true);
      };

      DataController = class {
        pagesCount = signal(10);

        pagerConfig = signal(initialPagerConfig);

        nonPreactSignalProperty = nonPreactSignalProperty;
      };

      ColumnsController = class {
        columnsCount = signal(5);

        text = signal('initial');

        nonPreactSignalProperty = nonPreactSignalProperty;
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

    it('should get component signal after controllers registration', () => {
      expect(testComponentStateTracker.getComponentState().ColumnsController).toEqual({
        columnsCount: 5,
        text: 'initial',
      });

      expect(testComponentStateTracker.getComponentState().DataController).toEqual({
        pagesCount: 10,
        pagerConfig: initialPagerConfig,
      });
    });

    it('should get deep copies of signal values', () => {
      expect(testComponentStateTracker.getComponentState().DataController.pagerConfig)
        .not.toBe(initialPagerConfig);
    });

    it('should preserve original controller signal values after signal tracker initialization', () => {
      expect(columnsControllerInstance.columnsCount.peek()).toBe(5);
      expect(columnsControllerInstance.text.peek()).toBe('initial');
      expect(dataControllerInstance.pagesCount.peek()).toBe(10);
      expect(dataControllerInstance.pagerConfig.peek())
        .toBe(initialPagerConfig);
      expect(dataControllerInstance.nonPreactSignalProperty).toEqual(nonPreactSignalProperty);
    });

    it('should track controllers signal updates', () => {
      columnsControllerInstance.columnsCount.value = 10;
      dataControllerInstance.pagesCount.value = 15;
      dataControllerInstance.pagerConfig.value = updatedPagerConfig;

      expect(testComponentStateTracker.getComponentState().ColumnsController).toEqual({
        columnsCount: 10,
        text: 'initial',
      });

      expect(testComponentStateTracker.getComponentState().DataController).toEqual({
        pagesCount: 15,
        pagerConfig: updatedPagerConfig,
      });
    });

    it('should preserve original controller signal values after tracking controllers signal updates', () => {
      expect(testComponentStateTracker.getComponentState().DataController.pagerConfig)
        .not.toBe(updatedPagerConfig);
      expect(columnsControllerInstance.text.peek()).toBe('initial');
      expect(columnsControllerInstance.columnsCount.peek()).toBe(10);
      expect(dataControllerInstance.pagesCount.peek()).toBe(15);
      expect(dataControllerInstance.pagerConfig.peek())
        .toBe(updatedPagerConfig);
      expect(dataControllerInstance.nonPreactSignalProperty).toEqual(nonPreactSignalProperty);
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
      testValue = signal(42);
    }

    let controllerInstance: TestController | null = new TestController();
    const controllerInstanceWeakRef = new WeakRef(controllerInstance);

    diContext.registerInstance(TestController, controllerInstance);

    controllerInstance = null;
    diContext = null;

    await waitGarbageCollection();

    const isGarbageCollected = controllerInstanceWeakRef.deref() === undefined;

    expect(isGarbageCollected).toBe(true);
  });

  it('Should allow garbage collection of tracked controllers properties when they are destroyed', async () => {
    const diContext: DIContext | null = new DIContext();

    const testComponentStateTracker = setupStateManager({
      diContext,
      componentName: 'TestComponent',
      logLevel: 'error',
    });

    if (!testComponentStateTracker) {
      throw Error('StateManager not initialized');
    }

    class TestController {
      testValue: Signal<number> | null = signal(42);
    }

    const controllerInstance: TestController | null = new TestController();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const controllerInstanceTestValuePropertyWeakRef = new WeakRef(controllerInstance.testValue!);

    diContext.registerInstance(TestController, controllerInstance);

    controllerInstance.testValue = null;

    await waitGarbageCollection();

    const isGarbageCollected = controllerInstanceTestValuePropertyWeakRef.deref() === undefined;

    expect(isGarbageCollected).toBe(true);
  });
});

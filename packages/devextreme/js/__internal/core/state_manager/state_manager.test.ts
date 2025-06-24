/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { DIContext } from '../di';
import { setupStateManager } from './setup_state_manager';

const state = (value: any) => value;

describe('StateManager', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('Tracks a component state', () => {
    const diContext = new DIContext();

    const testComponentStateTracker = setupStateManager({
      diContext,
      componentName: 'TestComponent',
      logLevel: 'error',
    });

    if (!testComponentStateTracker) {
      throw Error('StateManager not initialized');
    }

    const initialPagerConfig = {
      infinityScrollingEnabled: true,
    };

    const nonReactiveProperty = {
      text: 'non-reactive property',
    };

    class NoSignForIncludingItByStateManager {
      someField = state(true);
    }

    class DataController {
      pagesCount = state(10);

      pagerConfig = state(initialPagerConfig);

      nonReactiveProperty = nonReactiveProperty;
    }

    class ColumnsController {
      columnsCount = state(5);

      text = state('initial');

      nonReactiveProperty = nonReactiveProperty;
    }

    const ignoredInstance = new NoSignForIncludingItByStateManager();
    const columnsControllerInstance = new ColumnsController();
    const dataControllerInstance = new DataController();

    diContext.registerInstance(ColumnsController, columnsControllerInstance);
    diContext.registerInstance(DataController, dataControllerInstance);
    diContext.registerInstance(NoSignForIncludingItByStateManager, ignoredInstance);

    expect(testComponentStateTracker.getComponentState()).not.toMatchObject({
      NoSignForIncludingItByStateManagerController: expect.anything(),
    });

    expect(testComponentStateTracker.getComponentState().ColumnsController).toEqual({
      columnsCount: 5,
      text: 'initial',
    });

    expect(testComponentStateTracker.getComponentState().DataController).toEqual({
      pagesCount: 10,
      pagerConfig: initialPagerConfig,
    });

    expect(testComponentStateTracker.getComponentState().DataController.pagerConfig)
      .not.toBe(initialPagerConfig);

    expect(columnsControllerInstance.columnsCount.unreactive_get()).toBe(5);
    expect(columnsControllerInstance.text.unreactive_get()).toBe('initial');
    expect(dataControllerInstance.pagesCount.unreactive_get()).toBe(10);
    expect(dataControllerInstance.pagerConfig.unreactive_get())
      .toBe(initialPagerConfig);
    expect(dataControllerInstance.nonReactiveProperty).toEqual(nonReactiveProperty);

    const updatedPagerConfig = { infinityScrollingEnabled: false };

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

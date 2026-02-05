/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import { createPromise } from '@ts/core/utils/promise';

import type { Column } from '../columns_controller/types';
import { defaultSetFieldValue, PendingPromises } from './utils';

describe('defaultSetFieldValue', () => {
  it('should set value to dataField', () => {
    const newData = {};
    const value = 'some_value';

    const column = {
      dataField: 'some_field',
    } as Column;

    defaultSetFieldValue.call(column, newData, value, {});

    expect(newData).toEqual({ some_field: 'some_value' });
  });
  describe('when column does not have dataField', () => {
    it('should not set change data', () => {
      const newData = {};
      const value = 'some_value';

      const column = {} as Column;

      defaultSetFieldValue.call(column, newData, value, {});

      expect(newData).toEqual({});
    });
  });
});

describe('PendingPromises', () => {
  it('should wait for all added promises', async () => {
    jest.useFakeTimers();
    const promises = new PendingPromises();

    const p1 = createPromise<void>();
    const p2 = createPromise<void>();
    const p3 = createPromise<void>();

    promises.add(p1.promise);
    promises.add(p2.promise);
    promises.add(p3.promise);

    const overallPromise = promises.waitForAll();

    let flag = false;

    overallPromise.then(() => {
      flag = true;
    });

    p1.resolve();
    await jest.runAllTimersAsync();
    expect(flag).toBe(false);

    p2.resolve();
    await jest.runAllTimersAsync();
    expect(flag).toBe(false);

    p3.resolve();
    await jest.runAllTimersAsync();
    expect(flag).toBe(true);
  });
});

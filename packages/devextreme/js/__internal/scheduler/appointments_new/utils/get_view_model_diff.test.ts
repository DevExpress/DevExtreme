import {
  describe, expect, it,
} from '@jest/globals';
import type { SafeAppointment } from '@ts/scheduler/types';

import type { AppointmentDataSource } from '../../view_model/m_appointment_data_source';
import type { AppointmentItemViewModel } from '../../view_model/types';
import { getViewModelDiff } from './get_view_model_diff';

type ItemData = Record<string, unknown>;

const createMockDataSource = (
  updatedAppointment: ItemData | null = null,
  updatedKeys: { key: string; value: unknown }[] = [],
): AppointmentDataSource => ({
  getUpdatedAppointment: () => updatedAppointment,
  getUpdatedAppointmentKeys: () => updatedKeys,
} as unknown as AppointmentDataSource);

const defaultDataSource = createMockDataSource();

const makeItem = (
  itemData: SafeAppointment,
  overrides: Partial<AppointmentItemViewModel> = {},
): AppointmentItemViewModel => ({
  itemData,
  allDay: false,
  groupIndex: 0,
  sortedIndex: 0,
  direction: 'vertical',
  skipResizing: false,
  level: 0,
  maxLevel: 0,
  empty: false,
  left: 0,
  top: 0,
  height: 100,
  width: 200,
  reduced: undefined,
  partIndex: 0,
  partTotalCount: 1,
  rowIndex: 0,
  columnIndex: 0,
  info: {
    sourceAppointment: { startDate: new Date(), endDate: new Date() },
    appointment: { startDate: new Date(), endDate: new Date() },
  },
  ...overrides,
} as AppointmentItemViewModel);

const getOperations = (items: ReturnType<typeof getViewModelDiff>): string => items
  .map((item) => {
    if (item.needToAdd) return '+';
    if (item.needToRemove) return '-';
    if (item.needToResize) return 'r';
    return '=';
  })
  .join('');

describe('getViewModelDiff', () => {
  it('should return empty array for both empty inputs', () => {
    expect(getViewModelDiff([], [], defaultDataSource)).toEqual([]);
  });

  it('should mark no changes for identical items', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const data3: ItemData = {};
    const a = [makeItem(data1), makeItem(data2), makeItem(data3)];
    const b = [makeItem(data1), makeItem(data2), makeItem(data3)];

    const diff = getViewModelDiff(a, b, defaultDataSource);

    expect(getOperations(diff)).toBe('===');
    expect(diff).toEqual([{ item: b[0] }, { item: b[1] }, { item: b[2] }]);
  });

  it('should mark all as needToAdd when old list is empty', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const b = [makeItem(data1), makeItem(data2)];

    const diff = getViewModelDiff([], b, defaultDataSource);

    expect(getOperations(diff)).toBe('++');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: b[1], needToAdd: true },
    ]);
  });

  it('should mark all as needToRemove when new list is empty', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const a = [makeItem(data1), makeItem(data2)];

    const diff = getViewModelDiff(a, [], defaultDataSource);

    expect(getOperations(diff)).toBe('--');
    expect(diff).toEqual([
      { item: a[0], needToRemove: true },
      { item: a[1], needToRemove: true },
    ]);
  });

  it('should mark remove and add for one item replacement (different itemData)', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const data3: ItemData = {};
    const data4: ItemData = {};
    const a = [makeItem(data1), makeItem(data2), makeItem(data4)];
    const b = [makeItem(data1), makeItem(data3), makeItem(data4)];

    const diff = getViewModelDiff(a, b, defaultDataSource);

    expect(getOperations(diff)).toBe('=+-=');
    expect(diff).toEqual([
      { item: b[0] },
      { item: b[1], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: b[2] },
    ]);
  });

  it('should mark remove and add for same itemData with changed non-dimension properties', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const data4: ItemData = {};
    const a = [makeItem(data1), makeItem(data2), makeItem(data4)];
    const b = [makeItem(data1), makeItem(data2, { rowIndex: 1 }), makeItem(data4)];

    const diff = getViewModelDiff(a, b, defaultDataSource);

    expect(getOperations(diff)).toBe('=+-=');
    expect(diff).toEqual([
      { item: b[0] },
      { item: b[1], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: b[2] },
    ]);
  });

  it('should choose optimum operations for reordering', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const data3: ItemData = {};
    const data4: ItemData = {};
    const a = [makeItem(data1), makeItem(data2), makeItem(data3), makeItem(data4)];
    const b = [makeItem(data4), makeItem(data1), makeItem(data2), makeItem(data3)];

    const diff = getViewModelDiff(a, b, defaultDataSource);

    expect(getOperations(diff)).toBe('+===-');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: b[1] },
      { item: b[2] },
      { item: b[3] },
      { item: a[3], needToRemove: true },
    ]);
  });

  it('should choose optimum operations for reordering, insertion, and removal', () => {
    const data1: ItemData = {};
    const data2: ItemData = {};
    const data3: ItemData = {};
    const data4: ItemData = {};
    const data5: ItemData = {};
    const a = [makeItem(data1), makeItem(data2), makeItem(data3), makeItem(data4)];
    const b = [makeItem(data4), makeItem(data1), makeItem(data5), makeItem(data3)];

    const diff = getViewModelDiff(a, b, defaultDataSource);

    expect(getOperations(diff)).toBe('+=+-=-');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: b[1] },
      { item: b[2], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: b[3] },
      { item: a[3], needToRemove: true },
    ]);
  });

  it('should use the new item (from new list) in no-change cases', () => {
    const data1: ItemData = { myId: 0 };
    const data2: ItemData = { myId: 1 };
    const data3: ItemData = { myId: 2 };
    const data4: ItemData = { myId: 3 };
    const data5: ItemData = { myId: 4 };
    const a = [makeItem(data1), makeItem(data2), makeItem(data3), makeItem(data4)];
    // bItem1 uses the same data2 ref as a[1] but with a different sortedIndex,
    // which is not part of the comparison object — items are still considered equal.
    const bItem1 = makeItem(data2, { sortedIndex: 99 });
    const b = [makeItem(data4), bItem1, makeItem(data5), makeItem(data3)];

    const diff = getViewModelDiff(a, b, defaultDataSource);

    expect(getOperations(diff)).toBe('+-=+=-');
    expect(diff[2]).toEqual({ item: bItem1 });
  });

  describe('needToResize', () => {
    it('should mark needToResize when only dimensions change for the same item', () => {
      const data1: ItemData = {};
      const a = [makeItem(data1, {
        left: 0, top: 0, height: 100, width: 200,
      })];
      const b = [makeItem(data1, {
        left: 10, top: 20, height: 50, width: 150,
      })];

      const diff = getViewModelDiff(a, b, defaultDataSource);

      expect(getOperations(diff)).toBe('r');
      expect(diff).toEqual([{ item: b[0], needToResize: true }]);
    });

    it('should mix needToResize with other operations', () => {
      const data1: ItemData = {};
      const data2: ItemData = {};
      const data3: ItemData = {};
      const a = [makeItem(data1), makeItem(data2), makeItem(data3)];
      const b = [
        makeItem(data1),
        makeItem(data2, { left: 50, top: 50 }),
        makeItem(data3),
      ];

      const diff = getViewModelDiff(a, b, defaultDataSource);

      expect(getOperations(diff)).toBe('=r=');
      expect(diff).toEqual([
        { item: b[0] },
        { item: b[1], needToResize: true },
        { item: b[2] },
      ]);
    });
  });

  describe('updatedAppointment', () => {
    it('should treat item as changed when itemData matches getUpdatedAppointment reference', () => {
      const data1: ItemData = {};
      const a = [makeItem(data1)];
      const b = [makeItem(data1)];
      const dataSource = createMockDataSource(data1);

      const diff = getViewModelDiff(a, b, dataSource);

      expect(getOperations(diff)).toBe('+-');
      expect(diff).toEqual([
        { item: b[0], needToAdd: true },
        { item: a[0], needToRemove: true },
      ]);
    });

    it('should treat item as changed when its data matches an updatedAppointmentKey', () => {
      const data1: ItemData = { id: 1 };
      const a = [makeItem(data1)];
      const b = [makeItem(data1)];
      const dataSource = createMockDataSource(null, [{ key: 'id', value: 1 }]);

      const diff = getViewModelDiff(a, b, dataSource);

      expect(getOperations(diff)).toBe('+-');
    });

    it('should not affect items whose data has not changed', () => {
      const data1: ItemData = { id: 1 };
      const data2: ItemData = { id: 2 };
      const updatedData: ItemData = { id: 3 };
      const a = [makeItem(data1), makeItem(data2)];
      const b = [makeItem(data1), makeItem(data2)];
      const dataSource = createMockDataSource(updatedData);

      const diff = getViewModelDiff(a, b, dataSource);

      expect(getOperations(diff)).toBe('==');
    });
  });
});

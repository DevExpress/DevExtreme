import { describe, expect, it } from '@jest/globals';
import { hierarchicalRoomsConfigMock } from '@ts/scheduler/__mock__/resource_manager.mock';

import type { ResourceConfig } from '../../../utils/loader/types';
import { ResourceManager } from '../../../utils/resource_manager/resource_manager';
import type { MinimalAppointmentEntity } from '../../types';
import { splitByGroupIndex } from './split_by_group_index';

const items = [
  { itemData: { roomId: 1, kind: 1 } as unknown as MinimalAppointmentEntity['itemData'] },
  { itemData: { roomId: 1, kind: [1, 2] } as unknown as MinimalAppointmentEntity['itemData'] },
  { itemData: { roomId: 1, kind: [1, 2, 3] } as unknown as MinimalAppointmentEntity['itemData'] },
] as any[];
const getFilterOptions = async (configs: ResourceConfig[]) => {
  const resourceManager = new ResourceManager(configs);
  await resourceManager.loadGroupResources(configs.map((item) => item.fieldExpr) as string[]);
  return { resourceManager };
};

describe('splitByGroupIndex', () => {
  it('should add groupIndex for no grouping', async () => {
    const options = await getFilterOptions([]);
    expect(splitByGroupIndex(items, options)).toEqual([
      { ...items[0], groupIndex: 0 },
      { ...items[1], groupIndex: 0 },
      { ...items[2], groupIndex: 0 },
    ]);
  });

  it('should add groupIndex for one group with one option', async () => {
    const options = await getFilterOptions([
      { dataSource: [{ id: 1 }], fieldExpr: 'roomId' },
    ]);
    expect(splitByGroupIndex(items, options)).toEqual([
      { ...items[0], groupIndex: 0 },
      { ...items[1], groupIndex: 0 },
      { ...items[2], groupIndex: 0 },
    ]);
  });

  it('should set correct groupIndex for one group', async () => {
    const options = await getFilterOptions([{
      dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }],
      fieldExpr: 'roomId',
    }]);
    expect(splitByGroupIndex(items, options)).toEqual([
      { ...items[0], groupIndex: 1 },
      { ...items[1], groupIndex: 1 },
      { ...items[2], groupIndex: 1 },
    ]);
  });

  it('should set correct groupIndex for multiple groups', async () => {
    const options = await getFilterOptions([{
      dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }],
      fieldExpr: 'roomId',
    }, {
      allowMultiple: true,
      dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
      fieldExpr: 'kind',
    }]);
    expect(splitByGroupIndex(items, options)).toEqual([
      { ...items[0], groupIndex: 3 },
      { ...items[1], groupIndex: 3 },
      { ...items[1], groupIndex: 4 },
      { ...items[2], groupIndex: 3 },
      { ...items[2], groupIndex: 4 },
      { ...items[2], groupIndex: 5 },
    ]);
  });

  describe('hierarchical resource', () => {
    // Leaf group order: 11 → 0, 12 → 1, 21 → 2, solo → 3
    const asItem = (roomId: unknown): MinimalAppointmentEntity => ({
      itemData: { roomId } as unknown as MinimalAppointmentEntity['itemData'],
    } as MinimalAppointmentEntity);

    it('should set groupIndex of the appointment leaf', async () => {
      const options = await getFilterOptions([{ ...hierarchicalRoomsConfigMock }]);
      const item = asItem(21);

      expect(splitByGroupIndex([item], options)).toEqual([{ ...item, groupIndex: 2 }]);
    });

    it('should drop an appointment that matches no leaf', async () => {
      const options = await getFilterOptions([{ ...hierarchicalRoomsConfigMock }]);

      expect(splitByGroupIndex([asItem('board')], options)).toEqual([]);
    });

    it('should split an allowMultiple appointment across its leaf bands', async () => {
      const options = await getFilterOptions([{
        ...hierarchicalRoomsConfigMock,
        allowMultiple: true,
      }]);
      const item = asItem(['board', 12, 'solo']);

      expect(splitByGroupIndex([item], options)).toEqual([
        { ...item, groupIndex: 1 },
        { ...item, groupIndex: 3 },
      ]);
    });
  });
});

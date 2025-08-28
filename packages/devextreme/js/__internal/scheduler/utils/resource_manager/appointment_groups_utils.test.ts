import {
  describe, expect, it,
} from '@jest/globals';
import {
  complexIdResourceMock,
  getResourceManagerMock, resourceIndexesMock, resourceItemsByIdMock,
} from '@ts/scheduler/__mock__/resource_manager.mock';

import {
  getAppointmentGroupIndex,
  getAppointmentGroupValues,
  getAppointmentResources,
  getRawAppointmentGroupValues, getResourceItemById,
  getSafeGroupValues,
  groupAppointmentsByGroupLeafs,
  setAppointmentGroupValues,
} from './appointment_groups_utils';

describe('appointment groups utils', () => {
  describe('getResourceItemById', () => {
    it('should return resource item by id', () => {
      const manager = getResourceManagerMock();

      expect(
        getResourceItemById(manager.resourceById.assigneeId, 1),
      ).toEqual(manager.resourceById.assigneeId.items[0]);
    });

    it('should return undefined for unreached item', () => {
      const manager = getResourceManagerMock(complexIdResourceMock);

      expect(
        getResourceItemById(manager.resources[0], { _value: 'guid-2' }),
      ).toEqual(manager.resources[0].items[1]);
    });

    it('should return resource item by complex id', () => {
      const manager = getResourceManagerMock();

      expect(
        getResourceItemById(manager.resourceById.assigneeId, 10),
      ).toEqual(undefined);
    });
  });

  describe('getAppointmentGroupValues', () => {
    it('should return appointment group array values', () => {
      const manager = getResourceManagerMock();

      expect(
        getAppointmentGroupValues({
          assigneeId: [1, 2],
          roomId: 3,
          nested: { priorityId: 1 },
        } as any, manager.resources),
      ).toEqual({
        assigneeId: [1, 2],
        roomId: [3],
        'nested.priorityId': [1],
      });
    });
  });

  describe('getRawAppointmentGroupValues', () => {
    it('should return appointment group initial values', () => {
      const manager = getResourceManagerMock();

      expect(
        getRawAppointmentGroupValues({
          assigneeId: [1, 2],
          roomId: 3,
          nested: { priorityId: 1 },
        } as any, manager.resources),
      ).toEqual({
        assigneeId: [1, 2],
        roomId: 3,
        'nested.priorityId': 1,
      });
    });
  });

  describe('getSafeGroupValues', () => {
    it('should return appointment group array values', () => {
      expect(
        getSafeGroupValues({
          assigneeId: [1, 2],
          roomId: 3,
          'nested.priorityId': 1,
        }),
      ).toEqual({
        assigneeId: [1, 2],
        roomId: [3],
        'nested.priorityId': [1],
      });
    });
  });

  describe('getAppointmentResources', () => {
    it('should return appointment resource texts in order as in appointment', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(resourceIndexesMock);

      expect(
        getAppointmentResources({
          assigneeId: [4, 1, 2],
          roomId: [2],
          'nested.priorityId': [1],
        }, manager.resourceById),
      ).toEqual([
        { label: 'Assignee', values: ['Sandra Johnson', 'Samantha Bright', 'John Heart'] },
        { label: 'Room', values: ['Room 3'] },
        { label: 'Priority', values: ['Low Priority'] },
      ]);
    });

    it('label can be undefined if not specified', async () => {
      const manager = getResourceManagerMock([
        {
          field: 'roomId',
          dataSource: resourceItemsByIdMock.roomId,
          allowMultiple: true,
        },
      ]);
      await manager.loadGroupResources(resourceIndexesMock);

      expect(
        getAppointmentResources({ roomId: [2, 0] }, manager.resourceById),
      ).toEqual([{ label: undefined, values: ['Room 3', 'Room 1'] }]);
    });

    it('should return appointment resource texts with complex ids', async () => {
      const manager = getResourceManagerMock(complexIdResourceMock);
      await manager.loadGroupResources(['ownerId']);

      expect(
        getAppointmentResources({
          ownerId: [{ _value: 'guid-2' }, { _value: 'guid-3' }, { _value: 'guid-1' }],
        }, manager.resourceById),
      ).toEqual([
        { label: undefined, values: ['two', 'three', 'one'] },
      ]);
    });
  });

  describe('setAppointmentGroupValues', () => {
    it('should set nothing', () => {
      const appointment = { something: 1 };
      const manager = getResourceManagerMock();
      setAppointmentGroupValues(appointment, manager.resourceById, undefined);

      expect(appointment).toEqual(appointment);
    });

    it('should set appointment group values', () => {
      const appointment = {};
      const manager = getResourceManagerMock();
      setAppointmentGroupValues(appointment, manager.resourceById, {
        assigneeId: 1,
        roomId: 2,
        'nested.priorityId': 1,
      });

      expect(appointment).toEqual({
        assigneeId: [1],
        roomId: 2,
        nested: { priorityId: 1 },
      });
    });
  });

  describe('getAppointmentGroupIndex', () => {
    it('should return appointment group indexes', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(resourceIndexesMock);

      expect(
        getAppointmentGroupIndex({
          assigneeId: [1, 2],
          roomId: [2],
          'nested.priorityId': [1],
        }, manager.groupsLeafs),
      ).toEqual([2, 5]);
    });
  });

  describe('groupAppointmentsByGroupLeafs', () => {
    it('should return appointment grouped by leafs (rare appointments)', async () => {
      const appointments: any = [
        { assigneeId: [1], nested: { priorityId: 1 } },
      ];
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['assigneeId', 'nested.priorityId']);

      expect(
        groupAppointmentsByGroupLeafs(
          manager.resourceById,
          manager.groupsLeafs,
          appointments,
        ),
      ).toEqual([
        [appointments[0]],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ]);
    });

    it('should return appointment grouped by leafs', async () => {
      const appointments: any = [
        { assigneeId: [1, 2], nested: { priorityId: 1 } },
        { assigneeId: [2], nested: { priorityId: 1 } },
        { assigneeId: [3, 4], nested: { priorityId: 2 } },
      ];
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['assigneeId', 'nested.priorityId']);

      expect(
        groupAppointmentsByGroupLeafs(
          manager.resourceById,
          manager.groupsLeafs,
          appointments,
        ),
      ).toEqual([
        [appointments[0]],
        [],
        [appointments[0], appointments[1]],
        [],
        [],
        [appointments[2]],
        [],
        [appointments[2]],
      ]);
    });

    it('should return appointments for no grouping', () => {
      const appointments: any = [
        { assigneeId: [1, 2], nested: { priorityId: 1 } },
        { assigneeId: [2], nested: { priorityId: 1 } },
        { assigneeId: [3, 4], nested: { priorityId: 2 } },
      ];
      const manager = getResourceManagerMock();

      expect(
        groupAppointmentsByGroupLeafs(
          manager.resourceById,
          manager.groupsLeafs,
          appointments,
        ),
      ).toEqual([appointments]);
    });
  });
});

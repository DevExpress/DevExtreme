import {
  describe, expect, it,
} from '@jest/globals';
import {
  getResourceManagerMock,
  resourceIndexesMock,
  resourceItemsByIdMock,
} from '@ts/scheduler/__mock__/resourceManager.mock';

import { getAppointmentColor, getPaintedResource } from './appointment_color_utils';

describe('appointment color utils', () => {
  describe('getPaintedResources', () => {
    it('should return useColorAsDefault resource', () => {
      const manager = getResourceManagerMock();
      manager.resources[1].useColorAsDefault = true;

      expect(
        getPaintedResource(manager.resources, resourceIndexesMock),
      ).toEqual(manager.resources[1]);
    });

    it('should return last resource', () => {
      const manager = getResourceManagerMock();

      expect(
        getPaintedResource(manager.resources, resourceIndexesMock),
      ).toEqual(manager.resources[2]);
    });

    it('should return last resource filtered by groups', () => {
      const manager = getResourceManagerMock();

      expect(
        getPaintedResource(
          manager.resources,
          [resourceIndexesMock[0], resourceIndexesMock[1]],
        ),
      ).toEqual(manager.resources[1]);
    });
  });

  describe('getAppointmentColor', () => {
    it('should return color of resource by groupIndex', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['roomId', 'nested.priorityId']);

      expect(
        await getAppointmentColor(manager.resources, manager.groupsLeafs, {
          itemData: { roomId: [0, 1], nested: { priorityId: 1 } } as any,
          groupIndex: 3,
        }),
      ).toEqual(resourceItemsByIdMock.roomId[1].color);
    });

    it('should return color of default resource', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['roomId', 'nested.priorityId']);
      manager.resources[1].useColorAsDefault = true;

      expect(
        await getAppointmentColor(manager.resources, manager.groupsLeafs, {
          itemData: { assigneeId: 1, roomId: [0, 1], nested: { priorityId: 1 } } as any,
          groupIndex: 0,
        }),
      ).toEqual(resourceItemsByIdMock.assigneeId[0].mainColor);
    });

    it('should return undefined for not available resources', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['roomId', 'nested.priorityId']);

      expect(
        await getAppointmentColor(manager.resources, manager.groupsLeafs, {
          itemData: { assigneeId: 1 } as any,
          groupIndex: 0,
        }),
      ).toEqual(undefined);
    });
  });
});

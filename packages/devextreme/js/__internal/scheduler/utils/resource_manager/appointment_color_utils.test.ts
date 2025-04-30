import {
  describe, expect, it,
} from '@jest/globals';
import { getResourceManagerMock, resourceIndexesMock } from '@ts/scheduler/__mock__/resourceManager.mock';

import { getPaintedResource } from './appointment_color_utils';

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
});

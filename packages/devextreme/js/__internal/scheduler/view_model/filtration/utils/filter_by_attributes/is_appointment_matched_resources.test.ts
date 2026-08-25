import {
  describe, expect, it,
} from '@jest/globals';
import { hierarchicalRoomsConfigMock } from '@ts/scheduler/__mock__/resource_manager.mock';

import { ResourceLoader } from '../../../../utils/loader/resource_loader';
import {
  isAppointmentMatchedResources,
} from './is_appointment_matched_resources';

const assignee = new ResourceLoader({
  fieldExpr: 'assigneeId',
  allowMultiple: true,
  dataSource: [{ id: 2 }],
});

describe('isAppointmentMatchedResources', () => {
  it('should compare appointment with zero resources', async () => {
    await assignee.load();
    expect(isAppointmentMatchedResources(
      { some: [2, 6] } as any,
      [],
    )).toBe(true);
  });

  it('should compare appointment with one of the values in multi-resource', async () => {
    await assignee.load();
    expect(isAppointmentMatchedResources(
      { [assignee.resourceIndex]: [2, 6] } as any,
      [assignee],
    )).toBe(true);
  });

  it('should compare appointment without correct values in multi-resource', async () => {
    await assignee.load();
    expect(isAppointmentMatchedResources(
      { [assignee.resourceIndex]: [4, 6] } as any,
      [assignee],
    )).toBe(false);
  });

  it('should compare appointment with correct value', async () => {
    await assignee.load();
    expect(isAppointmentMatchedResources(
      { [assignee.resourceIndex]: 2 } as any,
      [assignee],
    )).toBe(true);
  });

  it('should compare appointment without correct value', async () => {
    await assignee.load();
    expect(isAppointmentMatchedResources(
      { [assignee.resourceIndex]: 6 } as any,
      [assignee],
    )).toBe(false);
  });

  it('should compare appointment without value', async () => {
    await assignee.load();
    expect(isAppointmentMatchedResources(
      {} as any,
      [assignee],
    )).toBe(false);
  });

  describe('hierarchical resource', () => {
    const loadRoom = async (allowMultiple = false): Promise<ResourceLoader> => {
      const room = new ResourceLoader({ ...hierarchicalRoomsConfigMock, allowMultiple });
      await room.load();

      return room;
    };

    it('should match a leaf id', async () => {
      expect(isAppointmentMatchedResources(
        { roomId: 21 } as any,
        [await loadRoom()],
      )).toBe(true);
    });

    it('should not match a parent id', async () => {
      expect(isAppointmentMatchedResources(
        { roomId: 'board' } as any,
        [await loadRoom()],
      )).toBe(false);
    });

    it('should match an allowMultiple appointment by any of its leaf ids', async () => {
      expect(isAppointmentMatchedResources(
        { roomId: ['board', 21] } as any,
        [await loadRoom(true)],
      )).toBe(true);
    });

    it('should not match an allowMultiple appointment bound to parent ids only', async () => {
      expect(isAppointmentMatchedResources(
        { roomId: ['board', 'open'] } as any,
        [await loadRoom(true)],
      )).toBe(false);
    });
  });
});

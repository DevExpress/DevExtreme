import {
  describe, expect, it,
} from '@jest/globals';

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
});

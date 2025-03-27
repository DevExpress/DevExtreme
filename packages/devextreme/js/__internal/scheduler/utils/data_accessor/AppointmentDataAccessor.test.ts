import { describe, expect, it } from '@jest/globals';
import { AppointmentDataAccessor } from '@ts/scheduler/utils';

describe('AppointmentDataAccessor', () => {
  it('should get custom property', () => {
    const dataAccessor = new AppointmentDataAccessor({ propExpr: 'prop' } as any, false);

    expect(dataAccessor.get('prop', { prop: 1 })).toBe(1);
  });
  it('should set custom property', () => {
    const dataAccessor = new AppointmentDataAccessor({ propExpr: 'prop' } as any, false);
    const obj = { prop: 1 };

    dataAccessor.set('prop', obj, 2);
    expect(obj.prop).toBe(2);
  });
  it('should get custom property by alias', () => {
    const dataAccessor = new AppointmentDataAccessor({ propExpr: 'alias' } as any, false);

    expect(dataAccessor.get('prop', { alias: 1 })).toBe(1);
  });
  it('should set custom property by alias', () => {
    const dataAccessor = new AppointmentDataAccessor({ propExpr: 'alias' } as any, false);
    const obj = { alias: 1 };

    dataAccessor.set('prop', obj, 2);
    expect(obj.alias).toBe(2);
  });
  it('should get serialized date property', () => {
    const dataAccessor = new AppointmentDataAccessor({ startDateExpr: 'startDate' } as any, true);

    expect(dataAccessor.get('startDate', { startDate: '2025/04/29' })).toEqual(new Date(2025, 3, 29));
  });
  it('should set serialized date as number', () => {
    const dataAccessor = new AppointmentDataAccessor({ startDateExpr: 'startDate' } as any, true, 'number');
    const obj = { startDate: '2025-04-30T15:00:00.000Z' };

    dataAccessor.set('startDate', obj, new Date('2025-05-30T15:00:00.000Z'));
    expect(obj.startDate).toBe(1748617200000);
  });
  it('should set serialized date as in initial object', () => {
    const dataAccessor = new AppointmentDataAccessor({ startDateExpr: 'startDate' } as any, true);
    const obj = { startDate: '2025/04/29' };

    dataAccessor.set('startDate', obj, new Date('2025-05-30T15:00:00.000Z'));
    expect(obj.startDate).toBe('2025/05/30');
  });
});

import {
  describe, expect, it,
} from '@jest/globals';

import { getAppointmentResourceAccessor, getResourceIndex } from './appointment_resource_data_accessor';

describe('appointment resource data accessor', () => {
  describe('getResourceIndex', () => {
    it('should return resource index', () => {
      expect(getResourceIndex({ fieldExpr: 'roomId' })).toBe('roomId');
      expect(getResourceIndex({ field: 'roomId' })).toBe('roomId');
      expect(getResourceIndex({})).toBe('');
    });
  });

  describe('getAppointmentResourceAccessor', () => {
    const accessor = getAppointmentResourceAccessor({ fieldExpr: 'roomId' });

    it('should get single ids', () => {
      expect(accessor.idsGetter({ roomId: 1 })).toEqual([1]);
    });

    it('should get multiple ids', () => {
      expect(accessor.idsGetter({ roomId: [1, 2] })).toEqual([1, 2]);
    });

    it('should set ids', () => {
      const obj = { roomId: 1 };
      accessor.idsSetter(obj, [1, 2]);
      expect(obj).toEqual({ roomId: [1, 2] });
    });
  });
});

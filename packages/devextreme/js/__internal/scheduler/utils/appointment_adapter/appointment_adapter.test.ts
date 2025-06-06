import {
  describe, expect, it,
} from '@jest/globals';
import { mockFieldExpressions } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';

import { TimeZoneCalculator } from '../../r1/timezone_calculator';
import { AppointmentDataAccessor } from '../data_accessor/appointment_data_accessor';
import { AppointmentAdapter } from './appointment_adapter';

const mockCalculator = new TimeZoneCalculator({
  getClientOffset: (): number => new Date().getTimezoneOffset() * 60000,
  tryGetCommonOffset: (): number => 15,
  tryGetAppointmentOffset: (): number => 7.5,
});
const mockAppointmentDataAccessor = new AppointmentDataAccessor(mockFieldExpressions, true, 'yyyy/MM/dd HH:mm:ss');

describe('AppointmentAdapter', () => {
  describe('duration', () => {
    it('should return duration between startDate and endDate', () => {
      const now = Date.now();
      const adapter = new AppointmentAdapter({
        startDate: now,
        endDate: now + 3600000,
      } as any, mockAppointmentDataAccessor);

      expect(adapter.duration).toBe(3600000);
    });

    it('should return 0 if endDate unavailable', () => {
      const adapter = new AppointmentAdapter({
        startDate: new Date(),
      }, mockAppointmentDataAccessor);

      expect(adapter.duration).toBe(0);
    });
  });

  describe('isRecurrent', () => {
    it('should return true if recurrence rule is correct', () => {
      const adapter = new AppointmentAdapter({
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,SA',
      } as any, mockAppointmentDataAccessor);

      expect(adapter.isRecurrent).toBe(true);
    });

    it('should return false if recurrence rule is incorrect', () => {
      const adapter = new AppointmentAdapter({
        recurrenceRule: 'Broken',
      } as any, mockAppointmentDataAccessor);

      expect(adapter.isRecurrent).toBe(false);
    });

    it('should return true if recurrence rule is not defined', () => {
      const adapter = new AppointmentAdapter({} as any, mockAppointmentDataAccessor);

      expect(adapter.isRecurrent).toBe(false);
    });
  });

  describe('clone', () => {
    it('should clone appointment', () => {
      const appointment = {} as any;
      const adapter = new AppointmentAdapter(appointment, mockAppointmentDataAccessor);
      const nextAdapter = adapter.clone();
      nextAdapter.allDay = true;
      nextAdapter.text = 'Text';

      expect(appointment).toBe(appointment);
      expect(nextAdapter.source).toEqual({
        allDay: true,
        text: 'Text',
      });
    });
  });

  describe('serialize', () => {
    it('should serialize appointment dates', () => {
      const appointment = {
        startDate: new Date(2000, 0, 5).getTime(),
        endDate: new Date(2000, 0, 7).getTime(),
      } as any;
      const adapter = new AppointmentAdapter(appointment, mockAppointmentDataAccessor);
      adapter.serialize();

      expect(adapter.source).toEqual({
        startDate: '2000/01/05 00:00:00',
        endDate: '2000/01/07 00:00:00',
      });
      expect(appointment).toBe(adapter.source);
    });
  });

  describe('getCalculatedDates', () => {
    it('should return calculate dates', () => {
      const appointment = {
        startDate: '2000/01/05 12:00:00',
        endDate: '2000/01/07 09:00:00',
      } as any;
      const adapter = new AppointmentAdapter(appointment, mockAppointmentDataAccessor);

      expect(adapter.getCalculatedDates(mockCalculator, 'toGrid')).toEqual({
        startDate: new Date('2000-01-06T00:00:00.000Z'),
        endDate: new Date('2000-01-07T21:00:00.000Z'),
      });
    });
  });

  describe('calculateDates', () => {
    it('should calculate dates', () => {
      const appointment = {
        startDate: '2000/01/05 12:00:00',
        endDate: '2000/01/07 09:00:00',
      } as any;
      const adapter = new AppointmentAdapter(appointment, mockAppointmentDataAccessor);
      adapter.calculateDates(mockCalculator, 'toGrid');

      expect(adapter.source).toEqual({
        startDate: '2000/01/06 01:00:00',
        endDate: '2000/01/07 22:00:00',
      });
      expect(appointment).toBe(adapter.source);
    });
  });
});

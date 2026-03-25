import {
  afterAll, describe, expect, it, jest,
} from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';
import { mockTimeZoneCalculator } from '@ts/scheduler/__mock__/timezone_calculator.mock';

import {
  getAriaDescription, getAriaLabel, getReducedIconTooltip,
} from './text_utils';

const getAppointmentResourcesValues = jest.fn();
const options = {
  dataAccessors: mockAppointmentDataAccessor,
  timeZoneCalculator: mockTimeZoneCalculator,
  getResourceManager: () => ({
    getAppointmentResourcesValues,
  }),
} as any;

describe('Appointment text utils', () => {
  describe('getAriaLabel', () => {
    it('should return text for all day appointment', () => {
      expect(getAriaLabel({
        ...options,
        data: {
          allDay: true,
          text: 'Appointment name',
          startDate: Date.UTC(2025, 2, 10, 10),
          endDate: Date.UTC(2025, 2, 10, 10, 30),
        },
      })).toBe('Appointment name: March 10, 2025, All day');
    });

    it('should return text for one day appointment', () => {
      expect(getAriaLabel({
        ...options,
        data: {
          text: 'Appointment name',
          startDate: Date.UTC(2025, 2, 10, 10),
          endDate: Date.UTC(2025, 2, 10, 10, 30),
          partIndex: 0,
          partTotalCount: 0,
        },
      })).toBe('Appointment name: March 10, 2025, 10:00 AM - 10:30 AM');
    });

    it('should return text for a part of long appointment', () => {
      expect(getAriaLabel({
        ...options,
        data: {
          text: 'Appointment name',
          startDate: Date.UTC(2025, 2, 10, 10),
          endDate: Date.UTC(2025, 2, 11, 10, 30),
        },
        partIndex: 0,
        partTotalCount: 2,
      })).toBe('Appointment name: March 10, 2025, 10:00 AM - March 11, 2025, 10:30 AM (1/2)');
    });
  });

  describe('getReducedIconTooltip', () => {
    it('should return text with end date', () => {
      expect(getReducedIconTooltip({
        ...options,
        data: {
          text: 'Appointment name',
          startDate: Date.UTC(2025, 2, 10, 10),
          endDate: Date.UTC(2025, 2, 11, 10, 30),
        },
      })).toBe('End Date: March 11, 2025');
    });
  });

  describe('getAriaDescription', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return text with one resource', async () => {
      getAppointmentResourcesValues.mockReturnValue(Promise.resolve([
        { label: 'Assignee', values: ['Samantha Bright'] },
      ]));
      expect(await getAriaDescription({
        ...options,
        groupTexts: [],
      })).toContain('Assignee: Samantha Bright');
    });

    it('should return text with multiple resources', async () => {
      getAppointmentResourcesValues.mockReturnValue(Promise.resolve([
        { label: 'Assignee', values: ['Samantha Bright', 'John Heart'] },
        { label: 'Room', values: ['Room 1'] },
      ]));
      expect(await getAriaDescription({
        ...options,
        groupTexts: [],
      })).toContain('Assignee: Samantha Bright, John Heart; Room: Room 1');
    });

    it('should return text with group', async () => {
      getAppointmentResourcesValues.mockReturnValue([]);
      expect(await getAriaDescription({
        ...options,
        groupIndex: 0,
        groupTexts: ['Samantha Bright'],
      })).toContain('Group: Samantha Bright');
    });

    it('should return text with multiple groups and resources', async () => {
      getAppointmentResourcesValues.mockReturnValue(Promise.resolve([
        { label: 'Assignee', values: ['Samantha Bright'] },
        { label: 'Room', values: ['Room 1', 'Room 2'] },
      ]));
      expect(await getAriaDescription({
        ...options,
        groupIndex: 1,
        groupTexts: ['Samantha Bright', 'Room 1'],
      })).toContain('Group: Samantha Bright, Room 1; Assignee: Samantha Bright; Room: Room 1, Room 2');
    });
  });
});

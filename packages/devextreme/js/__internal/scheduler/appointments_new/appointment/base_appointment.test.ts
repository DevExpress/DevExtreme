import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { createBaseAppointment, getBaseAppointmentViewProperties as getProperties } from '../__mock__/base_appointment_view';
import { APPOINTMENT_CLASSES, APPOINTMENT_TYPE_CLASSES } from '../const';

const defaultAppointmentData = {
  title: 'Test appointment',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

describe('BaseAppointment', () => {
  beforeEach(() => {
    fx.off = true;

    const $container = $('<div>')
      .addClass('container')
      .appendTo(document.body);

    $('<div>')
      .addClass('root')
      .appendTo($container);
  });

  afterEach(() => {
    $('.container').remove();
    fx.off = false;
    jest.useRealTimers();
  });

  describe('Classes', () => {
    it('should have container class', async () => {
      const instance = await createBaseAppointment(
        getProperties(defaultAppointmentData),
      );

      expect(instance.$element().hasClass(APPOINTMENT_CLASSES.CONTAINER)).toBe(true);
    });

    it.each([
      true, false,
    ])('should have correct class for isRecurring = %o', async (isRecurring) => {
      const instance = await createBaseAppointment(
        getProperties({
          ...defaultAppointmentData,
          recurrenceRule: isRecurring ? 'FREQ=DAILY;COUNT=5' : undefined,
        }),
      );

      expect(
        instance.$element().hasClass(APPOINTMENT_TYPE_CLASSES.RECURRING),
      ).toBe(isRecurring);
    });

    it.each([
      true, false,
    ])('should have correct class for allDay = %o', async (allDay) => {
      const instance = await createBaseAppointment(
        getProperties({
          ...defaultAppointmentData,
          allDay,
        }),
      );

      expect(
        instance.$element().hasClass(APPOINTMENT_TYPE_CLASSES.ALL_DAY),
      ).toBe(allDay);
    });
  });

  describe('Aria', () => {
    it('should have role button', async () => {
      const instance = await createBaseAppointment(
        getProperties(defaultAppointmentData),
      );

      expect(instance.$element().attr('role')).toBe('button');
    });
  });
});

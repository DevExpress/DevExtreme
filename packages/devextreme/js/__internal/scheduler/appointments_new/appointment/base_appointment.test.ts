import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { ResourceConfig } from '@ts/scheduler/utils/loader/types';
import type { AppointmentItemViewModel } from '@ts/scheduler/view_model/types';

import fx from '../../../common/core/animation/fx';
import { getMockedBaseAppointmentProperties, mockGridViewModel } from '../__mock__/appointment_properties';
import { APPOINTMENT_CLASSES, APPOINTMENT_TYPE_CLASSES } from '../const';
import type { BaseAppointmentProperties } from './base_appointment';
import { BaseAppointment } from './base_appointment';

const getBaseAppointmentProperties = (options: {
  appointmentData: SafeAppointment;
  partialViewModel?: Partial<AppointmentItemViewModel>;
  resources?: ResourceConfig[]
}): BaseAppointmentProperties => {
  const viewModel = mockGridViewModel(options.appointmentData, options.partialViewModel);
  const result = getMockedBaseAppointmentProperties({ ...options, viewModel });

  return {
    ...result,
    viewModel: result.viewModel,
  };
};

const createBaseAppointment = async (
  properties: BaseAppointmentProperties,
): Promise<BaseAppointment> => {
  const $element = $('.root');

  // @ts-expect-error
  const instance = new BaseAppointment($element, properties);

  // Await for resources
  await new Promise(process.nextTick);

  return instance;
};

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
        getBaseAppointmentProperties({
          appointmentData: defaultAppointmentData,
        }),
      );

      expect(instance.$element().hasClass(APPOINTMENT_CLASSES.CONTAINER)).toBe(true);
    });

    it.each([
      true, false,
    ])('should have correct class for viewModel.isRecurring = %o', async (isRecurring) => {
      const instance = await createBaseAppointment(
        getBaseAppointmentProperties({
          appointmentData: {
            ...defaultAppointmentData,
            recurrenceRule: isRecurring ? 'FREQ=DAILY;COUNT=5' : undefined,
          },
        }),
      );

      expect(
        instance.$element().hasClass(APPOINTMENT_TYPE_CLASSES.RECURRING),
      ).toBe(isRecurring);
    });

    it.each([
      true, false,
    ])('should have correct class for viewModel.allDay = %o', async (allDay) => {
      const instance = await createBaseAppointment(
        getBaseAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, allDay },
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
        getBaseAppointmentProperties({
          appointmentData: defaultAppointmentData,
        }),
      );

      expect(instance.$element().attr('role')).toBe('button');
    });
  });
});

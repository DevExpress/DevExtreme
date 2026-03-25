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
import type { GridAppointmentProperties } from './grid_appointment';
import { GridAppointment } from './grid_appointment';

const getGridAppointmentProperties = (options: {
  appointmentData: SafeAppointment;
  partialViewModel?: Partial<AppointmentItemViewModel>;
  resources?: ResourceConfig[]
}): GridAppointmentProperties => {
  const viewModel = mockGridViewModel(options.appointmentData, options.partialViewModel);
  const result = getMockedBaseAppointmentProperties({ ...options, viewModel });

  return {
    ...result,
    viewModel: result.viewModel as AppointmentItemViewModel,
  };
};

const createGridAppointment = async (
  properties: GridAppointmentProperties,
): Promise<GridAppointment> => {
  const $element = $('.root');

  // @ts-expect-error
  const instance = new GridAppointment($element, properties);

  // Await for resources
  await new Promise(process.nextTick);

  return instance;
};

const defaultAppointmentData = {
  title: 'Test appointment',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

describe('GridAppointment', () => {
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
    document.body.innerHTML = '';
    fx.off = false;
    jest.useRealTimers();
  });

  describe('Classes', () => {
    it('should have container class', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: defaultAppointmentData,
        }),
      );

      expect(instance.$element().hasClass(APPOINTMENT_CLASSES.CONTAINER)).toBe(true);
    });

    it.each([
      true, false,
    ])('should have correct empty class for viewModel.empty = %o', async (empty) => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: defaultAppointmentData,
          partialViewModel: { empty },
        }),
      );

      expect(instance.$element().hasClass(APPOINTMENT_TYPE_CLASSES.EMPTY)).toBe(empty);
    });
  });

  describe('Title', () => {
    it('should have correct title text', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, text: 'Test title' },
        }),
      );

      const $title = instance.$element().find(`.${APPOINTMENT_CLASSES.TITLE}`);

      expect($title.text()).toBe('Test title');
    });

    it('should have emptry title text if appointment has no text', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, text: undefined },
        }),
      );

      const $title = instance.$element().find(`.${APPOINTMENT_CLASSES.TITLE}`);
      expect($title.text()).toBe('(No subject)');
    });
  });

  describe('Date text', () => {
    it('should have correct date text', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: {
            ...defaultAppointmentData,
            startDate: new Date(2024, 0, 1, 9, 0),
            endDate: new Date(2024, 0, 1, 10, 0),
          },
        }),
      );

      const $date = instance.$element().find(`.${APPOINTMENT_CLASSES.DATE}`);

      expect($date.text()).toBe('9:00 AM - 10:00 AM');
    });
  });

  describe('Geometry', () => {
    it('should apply viewModel geometry on init', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: defaultAppointmentData,
          partialViewModel: {
            top: 10, left: 15, width: 100, height: 50,
          },
        }),
      );

      const $element = instance.$element();

      expect($element.css('top')).toBe('10px');
      expect($element.css('left')).toBe('15px');
      expect($element.css('width')).toBe('100px');
      expect($element.css('height')).toBe('50px');
    });

    it('should apply new viewModel geometry when resize() is called', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: defaultAppointmentData,
          partialViewModel: {
            top: 10, left: 15, width: 100, height: 50,
          },
        }),
      );

      instance.option('viewModel', {
        ...instance.option().viewModel,
        top: 20,
        left: 25,
        width: 150,
        height: 70,
      });

      instance.resize();

      const $element = instance.$element();

      expect($element.css('top')).toBe('20px');
      expect($element.css('left')).toBe('25px');
      expect($element.css('width')).toBe('150px');
      expect($element.css('height')).toBe('70px');
    });
  });

  describe('Recurrence', () => {
    it.each([
      true, false,
    ])('should have correct recurrence icon visibility for isRecurring = %o', async (isRecurring) => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: {
            ...defaultAppointmentData,
            recurrenceRule: isRecurring ? 'FREQ=DAILY' : undefined,
          },
        }),
      );

      const $icon = instance.$element().find(`.${APPOINTMENT_CLASSES.RECURRENCE_ICON}`);

      expect($icon.length).toBe(isRecurring ? 1 : 0);
    });
  });

  describe('All day', () => {
    it.each([
      true, false,
    ])('should have correct all day text visibility for allDay = %o', async (isAllDay) => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, allDay: isAllDay },
        }),
      );

      const $allDayText = instance.$element().find(`.${APPOINTMENT_CLASSES.ALL_DAY_TEXT}`);

      expect($allDayText.length).toBe(isAllDay ? 1 : 0);
    });
  });

  describe('Resources', () => {
    it('should correct background-color when resource has color', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: {
            ...defaultAppointmentData,
            roomId: 1,
          },
          resources: [
            {
              fieldExpr: 'roomId',
              dataSource: [{ id: 1, text: 'Room 1', color: 'red' }],
            },
          ],
        }),
      );

      expect(instance.$element().css('backgroundColor')).toBe('red');
    });

    it('should not have background-color css when no resource', async () => {
      const instance = await createGridAppointment(
        getGridAppointmentProperties({
          appointmentData: defaultAppointmentData,
        }),
      );

      expect(instance.$element().css('backgroundColor')).toBe('');
    });
  });
});

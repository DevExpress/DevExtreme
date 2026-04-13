import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { SafeAppointment } from '@ts/scheduler/types';

import fx from '../../../common/core/animation/fx';
import { getBaseAppointmentViewProperties } from '../__mock__/appointment_properties';
import { APPOINTMENT_CLASSES, APPOINTMENT_TYPE_CLASSES } from '../const';
import type { GridAppointmentViewProperties } from './grid_appointment';
import { GridAppointmentView } from './grid_appointment';

const getProperties = (
  appointmentData: SafeAppointment,
): GridAppointmentViewProperties => {
  const baseProperties = getBaseAppointmentViewProperties(appointmentData);

  return {
    ...baseProperties,
    geometry: {
      top: 0, left: 0, width: 0, height: 0,
    },
    modifiers: {
      empty: false,
    },
  };
};

const createGridAppointment = async (
  properties: GridAppointmentViewProperties,
): Promise<GridAppointmentView> => {
  const $element = $('.root');

  // @ts-expect-error
  const instance = new GridAppointmentView($element, properties);

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
        getProperties(defaultAppointmentData),
      );

      expect(instance.$element().hasClass(APPOINTMENT_CLASSES.CONTAINER)).toBe(true);
    });

    it.each([
      true, false,
    ])('should have correct empty class for modifiers.empty = %o', async (empty) => {
      const instance = await createGridAppointment({
        ...getProperties(defaultAppointmentData),
        modifiers: { empty },
      });

      expect(instance.$element().hasClass(APPOINTMENT_TYPE_CLASSES.EMPTY)).toBe(empty);
    });
  });

  describe('Title', () => {
    it.each([
      { text: 'Test title', expected: 'Test title' },
      { text: undefined, expected: '(No subject)' },
      { text: '', expected: '(No subject)' },
    ])('should have correct title text for appointment text = %o', async ({ text, expected }) => {
      const instance = await createGridAppointment(
        getProperties({
          ...defaultAppointmentData,
          text,
        }),
      );

      const $title = instance.$element().find(`.${APPOINTMENT_CLASSES.TITLE}`);

      expect($title.text()).toBe(expected);
    });
  });

  describe('Date text', () => {
    it('should have correct date text', async () => {
      const instance = await createGridAppointment(
        getProperties({
          ...defaultAppointmentData,
          startDate: new Date(2024, 0, 1, 9, 0),
          endDate: new Date(2024, 0, 1, 10, 0),
        }),
      );

      const $date = instance.$element().find(`.${APPOINTMENT_CLASSES.DATE}`);

      expect($date.text()).toBe('9:00 AM - 10:00 AM');
    });
  });

  describe('Geometry', () => {
    it('should apply geometry on init', async () => {
      const instance = await createGridAppointment({
        ...getProperties(defaultAppointmentData),
        geometry: {
          top: 10, left: 15, width: 100, height: 50,
        },
      });

      const $element = instance.$element();

      expect($element.css('top')).toBe('10px');
      expect($element.css('left')).toBe('15px');
      expect($element.css('width')).toBe('100px');
      expect($element.css('height')).toBe('50px');
    });

    it('should apply new geometry when resize() is called', async () => {
      const instance = await createGridAppointment({
        ...getProperties(defaultAppointmentData),
        geometry: {
          top: 10, left: 15, width: 100, height: 50,
        },
      });

      instance.option('geometry', {
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
        getProperties({
          ...defaultAppointmentData,
          recurrenceRule: isRecurring ? 'FREQ=DAILY' : undefined,
        }),
      );

      const $icon = instance.$element().find(`.${APPOINTMENT_CLASSES.RECURRENCE_ICON}`);

      expect($icon.length).toBe(isRecurring ? 1 : 0);
    });
  });

  describe('All day', () => {
    it.each([
      true, false,
    ])('should have correct all day text visibility for allDay = %o', async (allDay) => {
      const instance = await createGridAppointment(
        getProperties({
          ...defaultAppointmentData,
          allDay,
        }),
      );

      const $allDayText = instance.$element().find(`.${APPOINTMENT_CLASSES.ALL_DAY_TEXT}`);

      expect($allDayText.length).toBe(allDay ? 1 : 0);
    });
  });

  describe('Resources', () => {
    it('should apply resource color', async () => {
      const instance = await createGridAppointment({
        ...getProperties(defaultAppointmentData),
        getResourceColor: () => Promise.resolve('red'),
      });

      expect(instance.$element().css('backgroundColor')).toBe('red');
    });

    it('should not have background-color css when no resource', async () => {
      const instance = await createGridAppointment({
        ...getProperties(defaultAppointmentData),
        getResourceColor: () => Promise.resolve(undefined),
      });

      expect(instance.$element().css('backgroundColor')).toBe('');
    });
  });
});

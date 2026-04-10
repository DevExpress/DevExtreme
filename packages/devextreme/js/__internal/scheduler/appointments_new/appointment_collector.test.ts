import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';

import fx from '../../../common/core/animation/fx';
import type { SafeAppointment, TargetedAppointment } from '../types';
import type { AppointmentCollectorProperties } from './appointment_collector';
import { AppointmentCollector } from './appointment_collector';
import { APPOINTMENT_COLLECTOR_CLASSES } from './const';

const getProperties = (
  appointmentsData: SafeAppointment[],
): AppointmentCollectorProperties => {
  const targetedAppointmentData: TargetedAppointment = {
    ...appointmentsData[0],
    displayStartDate: appointmentsData[0].startDate as Date,
    displayEndDate: appointmentsData[0].endDate as Date,
  };

  return {
    appointmentsData,
    isCompact: false,
    geometry: {
      height: 30,
      width: 30,
      top: 0,
      left: 0,
    },
    targetedAppointmentData,
    appointmentCollectorTemplate: new EmptyTemplate(),
  };
};

const createAppointmentCollector = (
  properties: AppointmentCollectorProperties,
): AppointmentCollector => {
  const $element = $('.root');

  // @ts-expect-error
  return new AppointmentCollector($element, properties);
};

const defaultAppointmentData = {
  title: 'Test appointment',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

describe('AppointmentCollector', () => {
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
    it('should have correct container class', () => {
      const instance = createAppointmentCollector(
        getProperties([defaultAppointmentData]),
      );

      expect(instance.$element().hasClass('dx-scheduler-appointment-collector')).toBe(true);
      expect(instance.$element().hasClass('dx-button')).toBe(true);
    });

    it('should have correct content class', () => {
      const instance = createAppointmentCollector(
        getProperties([defaultAppointmentData]),
      );
      const $buttonContent = instance.$element().find('.dx-button-content');

      expect($buttonContent.hasClass(APPOINTMENT_COLLECTOR_CLASSES.CONTENT)).toBe(true);
    });

    it.each([
      true, false,
    ])('should have correct compact class for isCompact = %o', (isCompact) => {
      const instance = createAppointmentCollector({
        ...getProperties([defaultAppointmentData]),
        isCompact,
      });

      expect(instance.$element().hasClass(APPOINTMENT_COLLECTOR_CLASSES.COMPACT)).toBe(isCompact);
    });
  });

  describe('Aria', () => {
    it('should have correct aria-roledescription when appointment is in the same date', () => {
      const instance = createAppointmentCollector(
        getProperties([{
          text: 'test',
          startDate: new Date(2024, 0, 1, 9, 0),
          endDate: new Date(2024, 0, 1, 10, 0),
        }]),
      );

      expect(instance.$element().attr('aria-roledescription')).toBe('January 1, 2024');
    });

    it('should have correct aria-roledescription when appointment is in different dates', () => {
      const instance = createAppointmentCollector(
        getProperties([{
          text: 'test',
          startDate: new Date(2024, 0, 1, 9, 0),
          endDate: new Date(2024, 0, 2, 10, 0),
        }]),
      );

      expect(instance.$element().attr('aria-roledescription')).toBe('January 1, 2024 - January 2, 2024');
    });
  });

  describe('Geometry', () => {
    it('should have correct top and left on init', () => {
      const instance = createAppointmentCollector({
        ...getProperties([defaultAppointmentData]),
        geometry: {
          top: 100,
          left: 200,
          height: 30,
          width: 40,
        },
      });

      expect(instance.$element().css('top')).toBe('100px');
      expect(instance.$element().css('left')).toBe('200px');
      expect(instance.$element().css('height')).toBe('30px');
      expect(instance.$element().css('width')).toBe('40px');
    });

    it('should have correct top and left after geometry is updated and resize is called', () => {
      const instance = createAppointmentCollector({
        ...getProperties([defaultAppointmentData]),
        geometry: {
          top: 100,
          left: 200,
          height: 30,
          width: 40,
        },
      });

      instance.option('geometry', {
        height: 30,
        width: 40,
        top: 150,
        left: 250,
      });
      instance.resize();

      expect(instance.$element().css('top')).toBe('150px');
      expect(instance.$element().css('left')).toBe('250px');
      expect(instance.$element().css('height')).toBe('30px');
      expect(instance.$element().css('width')).toBe('40px');
    });
  });

  describe('Text', () => {
    it.each([
      { isCompact: true, expectedText: '1' },
      { isCompact: false, expectedText: '1 more' },
    ])('should have correct text for single appointment and isCompact = %o', ({ isCompact, expectedText }) => {
      const instance = createAppointmentCollector({
        ...getProperties([defaultAppointmentData]),
        isCompact,
      });
      const $buttonContent = instance.$element().find('.dx-button-content');

      expect($buttonContent.text()).toBe(expectedText);
    });

    it('should have correct text for two appointments and isCompact = true', () => {
      const instance = createAppointmentCollector({
        ...getProperties([
          { ...defaultAppointmentData }, { ...defaultAppointmentData },
        ]),
        isCompact: true,
      });
      const $buttonContent = instance.$element().find('.dx-button-content');

      expect($buttonContent.text()).toBe('2');
    });
  });
});

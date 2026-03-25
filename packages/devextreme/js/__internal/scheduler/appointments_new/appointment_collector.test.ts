import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { mockAppointmentDataAccessor } from '../__mock__/appointment_data_accessor.mock';
import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import type { SafeAppointment } from '../types';
import type { ResourceConfig } from '../utils/loader/types';
import type { AppointmentCollectorViewModel } from '../view_model/types';
import { mockAppointmentCollectorViewModel } from './appointment/utils.test';
import type { AppointmentCollectorProperties } from './appointment_collector';
import { AppointmentCollector } from './appointment_collector';
import { APPOINTMENT_COLLECTOR_CLASSES } from './const';
import { getTargetedAppointment } from './utils/get_targeted_appointment';

const getAppointmentCollectorProperties = (options: {
  appointmentData: SafeAppointment,
  partialViewModel?: Partial<AppointmentCollectorViewModel>,
  resources?: ResourceConfig[]
}): AppointmentCollectorProperties => {
  const viewModel = mockAppointmentCollectorViewModel(
    options.appointmentData,
    options.partialViewModel,
  );
  const resourceManager = getResourceManagerMock(options.resources ?? []);
  const dataAccessor = mockAppointmentDataAccessor;
  const targetedAppointmentData = getTargetedAppointment(
    viewModel.items[0],
    dataAccessor,
    resourceManager,
  );

  return {
    viewModel,
    targetedAppointmentData,
    appointmentCollectorTemplate: 'appointmentCollector',
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
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
      });
      const instance = createAppointmentCollector(properties);

      expect(instance.$element().hasClass('dx-scheduler-appointment-collector')).toBe(true);
      expect(instance.$element().hasClass('dx-button')).toBe(true);
    });

    it('should have correct content class', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
      });
      const instance = createAppointmentCollector(properties);
      const $buttonContent = instance.$element().find('.dx-button-content');

      expect($buttonContent.hasClass(APPOINTMENT_COLLECTOR_CLASSES.CONTENT)).toBe(true);
    });

    it.each([
      true, false,
    ])('should have correct compact class for viewModel.isCompact = %o', (isCompact) => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
        partialViewModel: { isCompact },
      });
      const instance = createAppointmentCollector(properties);

      expect(instance.$element().hasClass(APPOINTMENT_COLLECTOR_CLASSES.COMPACT)).toBe(isCompact);
    });
  });

  describe('Aria', () => {
    it('should have correct aria-roledescription when appointment is in the same date', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: {
          text: 'test',
          startDate: new Date(2024, 0, 1, 9, 0),
          endDate: new Date(2024, 0, 1, 10, 0),
        },
      });
      const instance = createAppointmentCollector(properties);

      expect(instance.$element().attr('aria-roledescription')).toBe('January 1, 2024');
    });

    it('should have correct aria-roledescription when appointment is in different dates', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: {
          text: 'test',
          startDate: new Date(2024, 0, 1, 9, 0),
          endDate: new Date(2024, 0, 2, 10, 0),
        },
      });
      const instance = createAppointmentCollector(properties);

      expect(instance.$element().attr('aria-roledescription')).toBe('January 1, 2024 - January 2, 2024');
    });
  });

  describe('Resize', () => {
    it('should have correct top and left on init', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
        partialViewModel: {
          top: 100, left: 200, height: 30, width: 40,
        },
      });
      const instance = createAppointmentCollector(properties);

      expect(instance.$element().css('top')).toBe('100px');
      expect(instance.$element().css('left')).toBe('200px');
      expect(instance.$element().css('height')).toBe('30px');
      expect(instance.$element().css('width')).toBe('40px');
    });

    it('should have correct top and left after view model is updated and resize is called', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
        partialViewModel: { top: 100, left: 200 },
      });
      const instance = createAppointmentCollector(properties);

      instance.option('viewModel', {
        ...properties.viewModel,
        top: 150,
        left: 250,
      });
      instance.resize();

      expect(instance.$element().css('top')).toBe('150px');
      expect(instance.$element().css('left')).toBe('250px');
    });
  });

  describe('Text', () => {
    it('should have correct text according to items length when viewModel.isCompact is true', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
        partialViewModel: { isCompact: true },
      });
      const instance = createAppointmentCollector(properties);
      const $buttonContent = instance.$element().find('.dx-button-content');

      expect($buttonContent.text()).toBe('1');
    });

    it('should have correct text according to items length when viewModel.isCompact is false', () => {
      const properties = getAppointmentCollectorProperties({
        appointmentData: defaultAppointmentData,
        partialViewModel: { isCompact: false },
      });
      const instance = createAppointmentCollector(properties);
      const $buttonContent = instance.$element().find('.dx-button-content');

      expect($buttonContent.text()).toBe('1 more');
    });
  });
});

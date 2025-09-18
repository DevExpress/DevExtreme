import {
  describe, expect, it, jest,
} from '@jest/globals';
import { logger } from '@ts/core/utils/m_console';

import { AppointmentForm } from './m_form';
import { AppointmentForm as AppointmentLegacyForm } from './m_legacy_form';

jest.spyOn(logger, 'warn').mockImplementation(() => {});

const createMockComponent = <T>(
  element: any,
  Class: new (...args: any[]) => T,
  options: any): T => {
  const instance = new Class(element, options);

  if ((instance as any).option) {
    jest.spyOn(instance as any, 'option');
  }
  if ((instance as any).getEditor) {
    jest.spyOn(instance as any, 'getEditor');
  }
  if ((instance as any).itemOption) {
    jest.spyOn(instance as any, 'itemOption');
  }

  return instance;
};

const schedulerMock = {
  getEditingConfig: jest.fn().mockReturnValue({}),
  getDataAccessors: jest.fn().mockReturnValue({ get: jest.fn(), expr: {} }),
  // @ts-expect-error should be fixed in the future
  createComponent: jest.fn().mockImplementation(createMockComponent) as any,
  createResourceEditorModel: jest.fn().mockReturnValue([]),
  getFirstDayOfWeek: jest.fn(),
  getTimeZoneCalculator: jest.fn(),
} as any;

describe('AppointmentLegacyForm', () => {
  it('should be defined', () => {
    const form = new AppointmentLegacyForm(schedulerMock);

    expect(form).toBeDefined();
  });

  it('should be created', () => {
    const form = new AppointmentLegacyForm(schedulerMock);
    const trigger = jest.fn();
    const noop = jest.fn();

    form.create(trigger, noop, {});

    expect(form).toBeDefined();
  });

  it('should provide form property', () => {
    const form = new AppointmentLegacyForm(schedulerMock);
    const trigger = jest.fn();
    const noop = jest.fn();

    form.create(trigger, noop, {});

    expect(form.form.element()).toBeDefined();
  });
});

describe('AppointmentForm', () => {
  it('should be defined', () => {
    const form = new AppointmentForm(schedulerMock);

    expect(form).toBeDefined();
  });

  it('should be defined', () => {
    const form = new AppointmentForm(schedulerMock);
    const trigger = jest.fn();
    const noop = jest.fn();

    form.create(trigger, noop, {});

    expect(form).toBeDefined();
  });

  it('should provide form property', () => {
    const form = new AppointmentForm(schedulerMock);
    const trigger = jest.fn();
    const noop = jest.fn();

    form.create(trigger, noop, {});

    expect(form.form.element()).toBeDefined();
  });
});

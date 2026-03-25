import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { mockAppointmentDataAccessor } from '../__mock__/appointment_data_accessor.mock';
import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import {
  mockAgendaViewModel,
  mockAppointmentCollectorViewModel,
  mockGridViewModel,
} from './__mock__/appointment_properties';
import type { AppointmentsProperties } from './appointments';
import { Appointments } from './appointments';
import {
  APPOINTMENT_CLASSES,
  APPOINTMENT_COLLECTOR_CLASSES,
  APPOINTMENTS_CONTAINER_CLASS,
} from './const';

const mockAppointmentDataSource = (): AppointmentDataSource => ({
  getUpdatedAppointment: () => null,
  getUpdatedAppointmentKeys: () => [],
} as unknown as AppointmentDataSource);

const getAppointmentsProperties = (
  options: Partial<AppointmentsProperties> = {},
): AppointmentsProperties => ({
  getAppointmentDataSource: mockAppointmentDataSource,
  getResourceManager: () => getResourceManagerMock([]),
  getDataAccessor: () => mockAppointmentDataAccessor,
  ...options,
} as AppointmentsProperties);

const createAppointments = (
  properties?: AppointmentsProperties,
): Appointments => {
  const $element = $('.root');

  // @ts-expect-error
  return new Appointments($element, properties);
};

const defaultAppointmentData = {
  text: 'Test appointment',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

describe('Appointments', () => {
  beforeEach(() => {
    fx.off = true;

    const $container = $('<div>')
      .addClass('container')
      .appendTo(document.body);

    $('<div>')
      .addClass('root')
      .appendTo($container);

    $('<div>')
      .addClass('allday-container')
      .appendTo($container);
  });

  afterEach(() => {
    $('.container').remove();
    fx.off = false;
    jest.useRealTimers();
  });

  describe('Classes', () => {
    it('should have correct container class', () => {
      const instance = createAppointments(getAppointmentsProperties());

      expect(instance.$element().hasClass(APPOINTMENTS_CONTAINER_CLASS)).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should render view model with grid appointments', () => {
      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should render view model with agenda appointments', () => {
      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [
        mockAgendaViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should render view model with appointment collectors', () => {
      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_COLLECTOR_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should rerender all appointments when view model is completely changed', () => {
      const data1 = { ...defaultAppointmentData };
      const data2 = { ...defaultAppointmentData, text: 'Appointment 2' };

      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [
        mockGridViewModel(data1, { sortedIndex: 0 }),
        mockGridViewModel(data2, { sortedIndex: 1 }),
      ]);

      const elementsBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(elementsBefore.length).toBe(2);

      const data3 = { ...defaultAppointmentData, text: 'Appointment 3' };
      const data4 = { ...defaultAppointmentData, text: 'Appointment 4' };
      instance.option('viewModel', [
        mockGridViewModel(data3, { sortedIndex: 0 }),
        mockGridViewModel(data4, { sortedIndex: 1 }),
      ]);

      const elementsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(elementsAfter.length).toBe(2);
      expect(elementsAfter[0]).not.toBe(elementsBefore[0]);
      expect(elementsAfter[1]).not.toBe(elementsBefore[1]);
    });

    it('should render allDay appointment to the allDay container', () => {
      const allDayData = { ...defaultAppointmentData, allDay: true };
      const $allDayContainer = $('.allday-container');

      const instance = createAppointments(getAppointmentsProperties({ $allDayContainer }));
      instance.option('viewModel', [
        mockGridViewModel(allDayData, { sortedIndex: 0, allDay: true }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
      expect($allDayContainer.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });
  });

  describe('Partial rendering', () => {
    it('should render only changed appointments if appointment is added', () => {
      const data1 = { ...defaultAppointmentData };
      const data2 = { ...defaultAppointmentData, text: 'Appointment 2' };
      const item1 = mockGridViewModel(data1, { sortedIndex: 0 });
      const item2 = mockGridViewModel(data2, { sortedIndex: 1 });

      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [item1, item2]);

      const appointmentsBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsBefore.length).toBe(2);

      const data3 = { ...defaultAppointmentData, text: 'Appointment 3' };
      const item3 = mockGridViewModel(data3, { sortedIndex: 2 });
      instance.option('viewModel', [item1, item2, item3]);

      const appointmentsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsAfter.length).toBe(3);
      expect(appointmentsAfter[0]).toBe(appointmentsBefore[0]);
      expect(appointmentsAfter[1]).toBe(appointmentsBefore[1]);
    });

    it('should render only changed appointments if appointment is removed', () => {
      const data1 = { ...defaultAppointmentData };
      const data2 = { ...defaultAppointmentData, text: 'Appointment 2' };
      const data3 = { ...defaultAppointmentData, text: 'Appointment 3' };
      const item1 = mockGridViewModel(data1, { sortedIndex: 0 });
      const item2 = mockGridViewModel(data2, { sortedIndex: 1 });
      const item3 = mockGridViewModel(data3, { sortedIndex: 2 });

      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [item1, item2, item3]);

      const appointmentsBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsBefore.length).toBe(3);

      instance.option('viewModel', [item1, item3]);

      const appointmentsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsAfter.length).toBe(2);
      expect(appointmentsAfter[0]).toBe(appointmentsBefore[0]);
      expect(appointmentsAfter[1]).toBe(appointmentsBefore[2]);
    });

    it('should rerender one appointment when its view model changed', () => {
      const data1 = { ...defaultAppointmentData };
      const data2 = { ...defaultAppointmentData, text: 'Appointment 2' };
      const item1 = mockGridViewModel(data1, { sortedIndex: 0 });
      const item2 = mockGridViewModel(data2, { sortedIndex: 1 });

      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [item1, item2]);

      const appointmentsBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsBefore.length).toBe(2);

      const item2Changed = mockGridViewModel(data2, { sortedIndex: 1, groupIndex: 1 });
      instance.option('viewModel', [item1, item2Changed]);

      const appointmentsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsAfter.length).toBe(2);
      expect(appointmentsAfter[0]).toBe(appointmentsBefore[0]);
      expect(appointmentsAfter[1]).not.toBe(appointmentsBefore[1]);
    });

    it('should rerender several appointments when their view models changed', () => {
      const data0 = { ...defaultAppointmentData };
      const data1 = { ...defaultAppointmentData, text: 'Appointment 1' };
      const data2 = { ...defaultAppointmentData, text: 'Appointment 2' };
      const item0 = mockGridViewModel(data0, { sortedIndex: 0 });
      const item1 = mockGridViewModel(data1, { sortedIndex: 1 });
      const item2 = mockGridViewModel(data2, { sortedIndex: 2 });

      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [item0, item1, item2]);

      const appointmentsBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsBefore.length).toBe(3);

      const item1Changed = mockGridViewModel(data1, { sortedIndex: 1, groupIndex: 1 });
      const item2Changed = mockGridViewModel(data2, { sortedIndex: 2, groupIndex: 1 });
      instance.option('viewModel', [item0, item1Changed, item2Changed]);

      const appointmentsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsAfter.length).toBe(3);
      expect(appointmentsAfter[0]).toBe(appointmentsBefore[0]);
      expect(appointmentsAfter[1]).not.toBe(appointmentsBefore[1]);
      expect(appointmentsAfter[2]).not.toBe(appointmentsBefore[2]);
    });

    it('should resize appointment if its size changed', () => {
      const data = { ...defaultAppointmentData };
      const item = mockGridViewModel(data, {
        sortedIndex: 0, top: 10, left: 10, height: 50, width: 100,
      });

      const instance = createAppointments(getAppointmentsProperties());
      instance.option('viewModel', [item]);

      const elementBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).get(0);
      expect($(elementBefore).css('top')).toBe('10px');

      const itemResized = mockGridViewModel(data, {
        sortedIndex: 0, top: 20, left: 20, height: 50, width: 100,
      });
      instance.option('viewModel', [itemResized]);

      const elementAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).get(0);
      expect(elementAfter).toBe(elementBefore);
      expect($(elementAfter).css('top')).toBe('20px');
      expect($(elementAfter).css('left')).toBe('20px');
    });
  });

  describe('onAppointmentRendered', () => {
    it('should be called with correct arguments when grid appointment is rendered', async () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments(getAppointmentsProperties({ onAppointmentRendered }));
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      await new Promise(process.nextTick);

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
      expect(onAppointmentRendered).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: defaultAppointmentData,
          targetedAppointmentData: expect.objectContaining({
            text: defaultAppointmentData.text,
          }),
        }),
      );
    });

    it('should be called with correct arguments when agenda appointment is rendered', async () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments(getAppointmentsProperties({ onAppointmentRendered }));
      instance.option('viewModel', [
        mockAgendaViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      await new Promise(process.nextTick);

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
      expect(onAppointmentRendered).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: defaultAppointmentData,
          targetedAppointmentData: expect.objectContaining({
            text: defaultAppointmentData.text,
          }),
        }),
      );
    });

    it('should not be called when appointment collector is rendered', async () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments(getAppointmentsProperties({ onAppointmentRendered }));
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      await new Promise(process.nextTick);

      expect(onAppointmentRendered).not.toHaveBeenCalled();
    });

    it('should be called several times when several appointments are rendered', async () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments(getAppointmentsProperties({ onAppointmentRendered }));
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, text: 'Appointment 1' }, { sortedIndex: 0 }),
        mockGridViewModel({ ...defaultAppointmentData, text: 'Appointment 2' }, { sortedIndex: 1 }),
      ]);

      await new Promise(process.nextTick);

      expect(onAppointmentRendered).toHaveBeenCalledTimes(2);
      expect(onAppointmentRendered).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 1',
          }),
        }),
      );
      expect(onAppointmentRendered).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 2',
          }),
        }),
      );
    });
  });
});

import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { mockAppointmentDataAccessor } from '../__mock__/appointment_data_accessor.mock';
import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import type { ResourceConfig } from '../utils/loader/types';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import {
  mockAgendaViewModel,
  mockAppointmentCollectorViewModel,
  mockGridViewModel,
} from './__mock__/appointment_view_model';
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

const getProperties = (options: {
  resources?: ResourceConfig[];
} = {}): AppointmentsProperties => ({
  getAppointmentDataSource: mockAppointmentDataSource,
  getResourceManager: () => getResourceManagerMock(options.resources ?? []),
  getDataAccessor: () => mockAppointmentDataAccessor,
  currentView: 'week',
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
      const instance = createAppointments(getProperties());

      expect(instance.$element().hasClass(APPOINTMENTS_CONTAINER_CLASS)).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should render view model with grid appointments', () => {
      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should render view model with agenda appointments', () => {
      const instance = createAppointments({
        ...getProperties(),
        currentView: 'agenda',
      });
      instance.option('viewModel', [
        mockAgendaViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should render view model with appointment collectors', () => {
      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_COLLECTOR_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should rerender all appointments when view model is completely changed', () => {
      const data1 = { ...defaultAppointmentData };
      const data2 = { ...defaultAppointmentData, text: 'Appointment 2' };

      const instance = createAppointments(getProperties());
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
      const $allDayContainer = $('.allday-container');

      const instance = createAppointments({
        ...getProperties(),
        $allDayContainer,
      });
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
      expect($allDayContainer.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should not render allDay agenda appointment to the allDay container', () => {
      const $allDayContainer = $('.allday-container');

      const instance = createAppointments({
        ...getProperties(),
        $allDayContainer,
        currentView: 'agenda',
      });
      instance.option('viewModel', [
        mockAgendaViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
      expect($allDayContainer.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
    });

    it('should clean all day container when switching from grid view to agenda view', () => {
      const $allDayContainer = $('.allday-container');

      const instance = createAppointments({
        ...getProperties(),
        currentView: 'week',
        $allDayContainer,
      });
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect($allDayContainer.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);

      instance.option('currentView', 'agenda');
      instance.option('viewModel', [
        mockAgendaViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect($allDayContainer.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it.each([
      'appointmentTemplate',
      'appointmentCollectorTemplate',
    ])('should rerender appointments if %s is changed', (optionName) => {
      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const elementsBefore = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(elementsBefore.length).toBe(1);

      instance.option(optionName, () => {});

      const elementsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(elementsAfter.length).toBe(1);
      expect(elementsAfter[0]).not.toBe(elementsBefore[0]);
    });
  });

  describe('Partial rendering', () => {
    it('should render only changed view items on add', () => {
      const dataA = { ...defaultAppointmentData };
      const dataB = { ...defaultAppointmentData, text: 'Appointment B' };

      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, { sortedIndex: 1 }),
      ]);

      const viewItemA = instance.getViewItemBySortedIndex(0);
      const viewItemB = instance.getViewItemBySortedIndex(1);

      const elementA = viewItemA?.$element().get(0);
      const elementB = viewItemB?.$element().get(0);

      const dataNEW = { ...defaultAppointmentData, text: 'Appointment NEW' };
      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataNEW, { sortedIndex: 1 }),
        mockGridViewModel(dataB, { sortedIndex: 2 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(3);
      expect(instance.getViewItemBySortedIndex(0)).toBe(viewItemA);
      expect(instance.getViewItemBySortedIndex(2)).toBe(viewItemB);
      expect(instance.getViewItemBySortedIndex(0)?.$element().get(0)).toBe(elementA);
      expect(instance.getViewItemBySortedIndex(2)?.$element().get(0)).toBe(elementB);
    });

    it('should render only changed view items on remove', () => {
      const dataA = { ...defaultAppointmentData };
      const dataB = { ...defaultAppointmentData, text: 'Appointment B' };
      const dataC = { ...defaultAppointmentData, text: 'Appointment C' };

      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, { sortedIndex: 1 }),
        mockGridViewModel(dataC, { sortedIndex: 2 }),
      ]);

      const viewItemA = instance.getViewItemBySortedIndex(0);
      const viewItemC = instance.getViewItemBySortedIndex(2);
      const elementA = viewItemA?.$element().get(0);
      const elementC = viewItemC?.$element().get(0);

      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataC, { sortedIndex: 1 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(2);
      expect(instance.getViewItemBySortedIndex(0)).toBe(viewItemA);
      expect(instance.getViewItemBySortedIndex(1)).toBe(viewItemC);
      expect(instance.getViewItemBySortedIndex(0)?.$element().get(0)).toBe(elementA);
      expect(instance.getViewItemBySortedIndex(1)?.$element().get(0)).toBe(elementC);
    });

    it('should render only changed view items on update', () => {
      const dataA = { ...defaultAppointmentData };
      const dataB = { ...defaultAppointmentData, text: 'Appointment B' };
      const dataC = { ...defaultAppointmentData, text: 'Appointment C' };

      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, { sortedIndex: 1 }),
        mockGridViewModel(dataC, { sortedIndex: 2 }),
      ]);

      const viewItemA = instance.getViewItemBySortedIndex(0);
      const viewItemB = instance.getViewItemBySortedIndex(1);
      const viewItemC = instance.getViewItemBySortedIndex(2);

      const elementA = viewItemA?.$element().get(0);
      const elementB = viewItemB?.$element().get(0);
      const elementC = viewItemC?.$element().get(0);

      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, { sortedIndex: 1, groupIndex: 1 }),
        mockGridViewModel(dataC, { sortedIndex: 2 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(3);

      expect(instance.getViewItemBySortedIndex(0)).toBe(viewItemA);
      expect(instance.getViewItemBySortedIndex(1)).not.toBe(viewItemB);
      expect(instance.getViewItemBySortedIndex(2)).toBe(viewItemC);

      expect(instance.getViewItemBySortedIndex(0)?.$element().get(0)).toBe(elementA);
      expect(instance.getViewItemBySortedIndex(1)?.$element().get(0)).not.toBe(elementB);
      expect(instance.getViewItemBySortedIndex(2)?.$element().get(0)).toBe(elementC);
    });

    it('should rerender several view items on several items update', () => {
      const dataA = { ...defaultAppointmentData };
      const dataB = { ...defaultAppointmentData, text: 'Appointment 1' };
      const dataC = { ...defaultAppointmentData, text: 'Appointment 2' };

      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, { sortedIndex: 1 }),
        mockGridViewModel(dataC, { sortedIndex: 2 }),
      ]);

      const viewItem0 = instance.getViewItemBySortedIndex(0);
      const viewItem1 = instance.getViewItemBySortedIndex(1);
      const viewItem2 = instance.getViewItemBySortedIndex(2);

      const element0 = viewItem0?.$element().get(0);
      const element1 = viewItem1?.$element().get(0);
      const element2 = viewItem2?.$element().get(0);

      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, { sortedIndex: 1, groupIndex: 1 }),
        mockGridViewModel(dataC, { sortedIndex: 2, groupIndex: 1 }),
      ]);

      const appointmentsAfter = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).toArray();
      expect(appointmentsAfter.length).toBe(3);

      expect(instance.getViewItemBySortedIndex(0)).toBe(viewItem0);
      expect(instance.getViewItemBySortedIndex(1)).not.toBe(viewItem1);
      expect(instance.getViewItemBySortedIndex(2)).not.toBe(viewItem2);

      expect(instance.getViewItemBySortedIndex(0)?.$element().get(0)).toBe(element0);
      expect(instance.getViewItemBySortedIndex(1)?.$element().get(0)).not.toBe(element1);
      expect(instance.getViewItemBySortedIndex(2)?.$element().get(0)).not.toBe(element2);
    });

    it('should only resize view item if its size changed', () => {
      const dataA = { ...defaultAppointmentData };
      const dataB = { ...defaultAppointmentData, text: 'Appointment B' };
      const dataC = { ...defaultAppointmentData, text: 'Appointment C' };

      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, {
          sortedIndex: 1, top: 10, left: 10, height: 50, width: 100,
        }),
        mockGridViewModel(dataC, { sortedIndex: 2 }),
      ]);

      const viewItemA = instance.getViewItemBySortedIndex(0);
      const viewItemB = instance.getViewItemBySortedIndex(1);
      const viewItemC = instance.getViewItemBySortedIndex(2);

      const elementA = viewItemA?.$element().get(0);
      const elementB = viewItemB?.$element().get(0);
      const elementC = viewItemC?.$element().get(0);

      instance.option('viewModel', [
        mockGridViewModel(dataA, { sortedIndex: 0 }),
        mockGridViewModel(dataB, {
          sortedIndex: 1, top: 20, left: 20, height: 60, width: 110,
        }),
        mockGridViewModel(dataC, { sortedIndex: 2 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(3);

      expect(instance.getViewItemBySortedIndex(0)).toBe(viewItemA);
      expect(instance.getViewItemBySortedIndex(1)).toBe(viewItemB);
      expect(instance.getViewItemBySortedIndex(2)).toBe(viewItemC);

      expect(instance.getViewItemBySortedIndex(0)?.$element().get(0)).toBe(elementA);
      expect(instance.getViewItemBySortedIndex(1)?.$element().get(0)).toBe(elementB);
      expect(instance.getViewItemBySortedIndex(2)?.$element().get(0)).toBe(elementC);

      expect($(elementB).css('top')).toBe('20px');
      expect($(elementB).css('left')).toBe('20px');
      expect($(elementB).css('height')).toBe('60px');
      expect($(elementB).css('width')).toBe('110px');
    });
  });

  describe('Resources', () => {
    it('should apply resource color', async () => {
      const instance = createAppointments({
        ...getProperties({
          resources: [{
            fieldExpr: 'roomId',
            dataSource: [{ text: 'Room 1', id: 1, color: 'red' }],
          }],
        }),
      });
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, roomId: 1 }, { sortedIndex: 0 }),
      ]);

      await new Promise(process.nextTick);

      const $appointment = instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).first();
      expect($appointment.css('backgroundColor')).toBe('red');
    });
  });

  describe('onAppointmentRendered', () => {
    it('should be called with correct arguments when grid appointment is rendered', () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentRendered,
      });
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

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

    it('should be called with correct arguments when agenda appointment is rendered', () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentRendered,
      });
      instance.option('viewModel', [
        mockAgendaViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

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

    it('should not be called when appointment collector is rendered', () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentRendered,
      });
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      expect(onAppointmentRendered).not.toHaveBeenCalled();
    });

    it('should be called several times when several appointments are rendered', () => {
      const onAppointmentRendered = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentRendered,
      });
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, text: 'Appointment 1' }, { sortedIndex: 0 }),
        mockGridViewModel({ ...defaultAppointmentData, text: 'Appointment 2' }, { sortedIndex: 1 }),
      ]);

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

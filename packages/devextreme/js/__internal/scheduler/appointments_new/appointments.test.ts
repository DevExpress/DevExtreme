import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { fireEvent } from '@testing-library/dom';

import { mockAppointmentDataAccessor } from '../__mock__/appointment_data_accessor.mock';
import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import type { ResourceConfig } from '../utils/loader/types';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import type { AppointmentCollectorViewModel, AppointmentItemViewModel, SortedEntity } from '../view_model/types';
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
  currentView: 'week',
  tabIndex: 0,
  viewModel: [],
  items: [],
  $allDayContainer: $('<div>'),
  appointmentTemplate: 'appointment',
  appointmentCollectorTemplate: 'appointmentCollector',

  onAppointmentRendered: (): void => {},
  onAppointmentClick: (): void => {},
  onAppointmentDblClick: (): void => {},

  getStartViewDate: () => new Date(2024, 0, 1),
  getSortedItems: () => [],
  isVirtualScrolling: () => false,
  scrollTo: (): void => {},

  getAppointmentDataSource: mockAppointmentDataSource,
  getResourceManager: () => getResourceManagerMock(options.resources ?? []),
  getDataAccessor: () => mockAppointmentDataAccessor,

  showAppointmentTooltip: (): void => {},
  showEditAppointmentPopup: (): void => {},
  allowDelete: false,
  onDeleteKeyPress: (): void => {},
});

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

const dblClick = (element: HTMLElement): void => {
  element.click();
  element.click();
  fireEvent(element, new Event('dxdblclick', { bubbles: true }));
};

describe('Appointments', () => {
  beforeEach(() => {
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
      const instance = createAppointments(getProperties());
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
      expect(instance.option().$allDayContainer?.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
    });

    it('should not render allDay agenda appointment to the allDay container', () => {
      const instance = createAppointments({
        ...getProperties(),
        currentView: 'agenda',
      });
      instance.option('viewModel', [
        mockAgendaViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect(instance.$element().find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);
      expect(instance.option().$allDayContainer?.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
    });

    it('should clean all day container when switching from grid view to agenda view', () => {
      const instance = createAppointments({
        ...getProperties(),
        currentView: 'week',
      });
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect(instance.option().$allDayContainer?.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(1);

      instance.option('currentView', 'agenda');
      instance.option('viewModel', [
        mockAgendaViewModel({ ...defaultAppointmentData, allDay: true }, { sortedIndex: 0 }),
      ]);

      expect(instance.option().$allDayContainer?.find(`.${APPOINTMENT_CLASSES.CONTAINER}`).length).toBe(0);
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

  describe('Options', () => {
    describe('tabIndex', () => {
      it('should pass tabIndex change to view items', () => {
        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ]);

        instance.option('tabIndex', 2);

        expect(instance.getViewItemByIndex(0)?.$element().attr('tabindex')).toBe('2');
        expect(instance.getViewItemByIndex(1)?.$element().attr('tabindex')).toBe('-1');
        expect(instance.getViewItemByIndex(2)?.$element().attr('tabindex')).toBe('-1');
      });

      it('should keep only focused appointment tabbable on tabIndex change', () => {
        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ]);

        (instance.getViewItemByIndex(1)?.$element().get(0) as HTMLElement).click();

        instance.option('tabIndex', 2);

        expect(instance.getViewItemByIndex(0)?.$element().attr('tabindex')).toBe('-1');
        expect(instance.getViewItemByIndex(1)?.$element().attr('tabindex')).toBe('2');
        expect(instance.getViewItemByIndex(2)?.$element().attr('tabindex')).toBe('-1');
      });

      it('should not rerender view items on tabIndex change', () => {
        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ]);

        const element0 = instance.getViewItemByIndex(0)?.$element().get(0);
        const element1 = instance.getViewItemByIndex(1)?.$element().get(0);

        instance.option('tabIndex', 2);

        expect(instance.getViewItemByIndex(0)?.$element().get(0)).toBe(element0);
        expect(instance.getViewItemByIndex(1)?.$element().get(0)).toBe(element1);
      });

      it('should have first appointment have correct index after tabIndex changed from -1 to 0', () => {
        const instance = createAppointments({
          ...getProperties(),
          tabIndex: -1,
        });
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ]);

        instance.option('tabIndex', 0);

        expect(instance.getViewItemByIndex(0)?.$element().attr('tabindex')).toBe('0');
        expect(instance.getViewItemByIndex(1)?.$element().attr('tabindex')).toBe('-1');
      });
    });
  });

  describe('Focus and keyboard navigation', () => {
    describe('Basic navigation', () => {
      it('should set tabindex=0 on first appointment and tabindex=-1 on others after render', () => {
        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ]);

        expect(instance.getViewItemByIndex(0)?.$element().attr('tabindex')).toBe('0');
        expect(instance.getViewItemByIndex(1)?.$element().attr('tabindex')).toBe('-1');
        expect(instance.getViewItemByIndex(2)?.$element().attr('tabindex')).toBe('-1');
      });

      it('should restore tabindex=0 on first appointment and tabindex=-1 on others after rerender', () => {
        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ]);

        instance.option('appointmentTemplate', () => {});

        expect(instance.getViewItemByIndex(0)?.$element().attr('tabindex')).toBe('0');
        expect(instance.getViewItemByIndex(1)?.$element().attr('tabindex')).toBe('-1');
        expect(instance.getViewItemByIndex(2)?.$element().attr('tabindex')).toBe('-1');
      });
    });

    describe.each([
      'appointment',
      'appointmentCollector',
    ])('Basic navigation for %s', (type) => {
      const createItem = (
        data: typeof defaultAppointmentData,
        overrides: { sortedIndex: number },
      ): AppointmentItemViewModel | AppointmentCollectorViewModel => (
        type === 'appointmentCollector'
          ? mockAppointmentCollectorViewModel(data, overrides)
          : mockGridViewModel(data, overrides)
      );

      it('should move focus to next view item on Tab', () => {
        const viewModel = [
          createItem({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          createItem({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          createItem({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        const viewItem1 = instance.getViewItemBySortedIndex(1);

        (viewItem0?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem0?.$element().get(0) as HTMLElement, { key: 'Tab' });

        expect(viewItem0?.$element().attr('tabindex')).toBe('-1');
        expect(viewItem1?.$element().attr('tabindex')).toBe('0');
        expect(document.activeElement).toBe(viewItem1?.$element().get(0) as HTMLElement);
      });

      it('should move focus to previous view item on Shift+Tab', () => {
        const viewModel = [
          createItem({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          createItem({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          createItem({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        const viewItem1 = instance.getViewItemBySortedIndex(1);

        (viewItem1?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem1?.$element().get(0) as HTMLElement, { key: 'Tab', shiftKey: true });

        expect(viewItem0?.$element().attr('tabindex')).toBe('0');
        expect(viewItem1?.$element().attr('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(viewItem0?.$element().get(0) as HTMLElement);
      });

      it('should focus view item on click', () => {
        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          createItem(defaultAppointmentData, { sortedIndex: 0 }),
        ]);

        const viewItem = instance.getViewItemBySortedIndex(0);
        const element = viewItem?.$element().get(0) as HTMLElement;
        element.click();

        expect(element.getAttribute('tabindex')).toBe('0');
        expect(element.classList.contains('dx-state-focused')).toBe(true);
        expect(document.activeElement).toBe(element);
      });

      it('should reset focused state when focus moves outside the container', () => {
        const externalButton = $('<button>').prependTo($('.container')).get(0) as HTMLElement;

        const instance = createAppointments(getProperties());
        instance.option('viewModel', [
          createItem({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          createItem({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ]);

        (instance.getViewItemBySortedIndex(1)?.$element().get(0) as HTMLElement).click();

        externalButton.focus();

        expect(instance.getViewItemByIndex(0)?.$element().attr('tabindex')).toBe('0');
        expect(instance.getViewItemByIndex(1)?.$element().attr('tabindex')).toBe('-1');
      });
    });

    describe('Virtual scrolling navigation', () => {
      const makeSortedEntity = (
        sortedIndex: number,
        startDate: Date = new Date(2024, 0, 1, 9, 0),
      ): SortedEntity => ({
        sortedIndex,
        allDay: false,
        itemData: {},
        source: {
          startDate: startDate.getTime(),
          endDate: startDate.getTime() + 3600000,
        },
      } as unknown as SortedEntity);

      it('should call scrollTo on Tab when virtual scrolling is enabled', () => {
        const scrollTo = jest.fn();

        const instance = createAppointments({
          ...getProperties(),
          isVirtualScrolling: () => true,
          scrollTo,
          getSortedItems: () => [
            makeSortedEntity(0), makeSortedEntity(1), makeSortedEntity(1),
          ],
        });
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ]);

        const viewItem1 = instance.getViewItemBySortedIndex(0);
        (viewItem1?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem1?.$element().get(0) as HTMLElement, { key: 'Tab' });

        expect(scrollTo).toHaveBeenCalled();
      });

      it('should focus next appointment directly if it is already rendered', () => {
        const instance = createAppointments({
          ...getProperties(),
          isVirtualScrolling: () => true,
          getSortedItems: () => [
            makeSortedEntity(0), makeSortedEntity(1), makeSortedEntity(2),
          ],
        });
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ]);

        const viewItem1 = instance.getViewItemBySortedIndex(1);
        const viewItem2 = instance.getViewItemBySortedIndex(2);

        (viewItem1?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem1?.$element().get(0) as HTMLElement, { key: 'Tab' });

        expect(document.activeElement).toBe(viewItem2?.$element().get(0));
      });

      it('should restore focus to target appointment after it scrolls into view', () => {
        const item0 = mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 });
        const item1 = mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 });
        const item2 = mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 });

        const instance = createAppointments({
          ...getProperties(),
          isVirtualScrolling: () => true,
          getSortedItems: () => [
            makeSortedEntity(0), makeSortedEntity(1), makeSortedEntity(2),
          ],
        });

        // item2 is outside the viewport — not in the initial viewModel
        instance.option('viewModel', [item0, item1]);

        const viewItem1 = instance.getViewItemBySortedIndex(1);
        (viewItem1?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem1?.$element().get(0) as HTMLElement, { key: 'Tab' });

        // item2 is not rendered yet, so focus cannot move yet
        expect(instance.getViewItemBySortedIndex(2)).toBeUndefined();

        // viewModel updates as item2 scrolls into view
        instance.option('viewModel', [item0, item1, item2]);

        const $viewItem2 = instance.getViewItemBySortedIndex(2)?.$element();

        expect(document.activeElement).toBe($viewItem2?.get(0));
        expect($viewItem2?.attr('tabindex')).toBe('0');
      });

      it('should pass appointment start date to scrollTo when it is after the start view date', () => {
        const scrollTo = jest.fn();
        const startViewDate = new Date(2024, 0, 1);
        const appointmentStartDate = new Date(2024, 0, 5, 9, 0);

        const instance = createAppointments({
          ...getProperties(),
          isVirtualScrolling: () => true,
          scrollTo,
          getStartViewDate: () => startViewDate,
          getSortedItems: () => [
            makeSortedEntity(0), makeSortedEntity(1, appointmentStartDate),
          ],
        });
        instance.option('viewModel', [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ]);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        (viewItem0?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem0?.$element().get(0) as HTMLElement, { key: 'Tab' });

        expect(scrollTo).toHaveBeenCalledWith(appointmentStartDate, expect.anything());
      });

      it('should clamp scrollTo date to start view date when appointment starts before it', () => {
        const scrollTo = jest.fn();
        const startViewDate = new Date(2024, 0, 1);
        const appointmentStartDate = new Date(2023, 11, 31, 9, 0);

        const viewModel = [mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 })];
        const sortedEntities = [makeSortedEntity(0), makeSortedEntity(1, appointmentStartDate)];

        const instance = createAppointments({
          ...getProperties(),
          isVirtualScrolling: () => true,
          scrollTo,
          getStartViewDate: () => startViewDate,
          getSortedItems: () => sortedEntities,
        });
        instance.option('viewModel', viewModel);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        (viewItem0?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem0?.$element().get(0) as HTMLElement, { key: 'Tab' });

        expect(scrollTo).toHaveBeenCalledWith(startViewDate, expect.anything());
      });
    });

    describe('Navigation after partial render', () => {
      const pressTab = (): void => {
        const activeElement = document.activeElement as HTMLElement;
        fireEvent.keyDown(activeElement, { key: 'Tab' });
      };

      it('should navigate to the last appointment correctly after an appointment is added', () => {
        const dataA = { ...defaultAppointmentData };
        const dataB = { ...defaultAppointmentData, text: 'Appointment B' };
        const dataC = { ...defaultAppointmentData, text: 'Appointment C' };

        let viewModel = [
          mockGridViewModel(dataA, { sortedIndex: 0 }),
          mockGridViewModel(dataB, { sortedIndex: 1 }),
          mockGridViewModel(dataC, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const dataNEW = { ...defaultAppointmentData, text: 'Appointment NEW' };
        viewModel = [
          mockGridViewModel(dataA, { sortedIndex: 0 }),
          mockGridViewModel(dataB, { sortedIndex: 1 }),
          mockGridViewModel(dataNEW, { sortedIndex: 2 }),
          mockGridViewModel(dataC, { sortedIndex: 3 }),
        ];
        instance.option('viewModel', viewModel);

        (instance.getViewItemBySortedIndex(0)?.$element().get(0) as HTMLElement).click();
        pressTab();
        pressTab();
        pressTab();

        const lastViewItem = instance.getViewItemBySortedIndex(3);
        expect(document.activeElement).toBe(lastViewItem?.$element().get(0));
        expect(lastViewItem?.$element().attr('tabindex')).toBe('0');
      });

      it('should navigate to the last appointment correctly after an appointment is removed', () => {
        const dataA = { ...defaultAppointmentData };
        const dataB = { ...defaultAppointmentData, text: 'Appointment B' };
        const dataC = { ...defaultAppointmentData, text: 'Appointment C' };

        let viewModel = [
          mockGridViewModel(dataA, { sortedIndex: 0 }),
          mockGridViewModel(dataB, { sortedIndex: 1 }),
          mockGridViewModel(dataC, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        viewModel = [
          mockGridViewModel(dataA, { sortedIndex: 0 }),
          mockGridViewModel(dataC, { sortedIndex: 1 }),
        ];

        instance.option('viewModel', viewModel);

        (instance.getViewItemBySortedIndex(0)?.$element().get(0) as HTMLElement).click();
        pressTab();

        const lastViewItem = instance.getViewItemBySortedIndex(1);
        expect(document.activeElement).toBe(lastViewItem?.$element().get(0));
        expect(lastViewItem?.$element().attr('tabindex')).toBe('0');
      });

      it('should navigate to the last appointment correctly after an appointment is updated', () => {
        const dataA = { ...defaultAppointmentData };
        const dataB = { ...defaultAppointmentData, text: 'Appointment B' };
        const dataC = { ...defaultAppointmentData, text: 'Appointment C' };

        let viewModel = [
          mockGridViewModel(dataA, { sortedIndex: 0 }),
          mockGridViewModel(dataB, { sortedIndex: 1 }),
          mockGridViewModel(dataC, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        viewModel = [
          mockGridViewModel(dataA, { sortedIndex: 0 }),
          mockGridViewModel(dataB, { sortedIndex: 1, groupIndex: 1 }),
          mockGridViewModel(dataC, { sortedIndex: 2 }),
        ];

        instance.option('viewModel', viewModel);

        (instance.getViewItemBySortedIndex(0)?.$element().get(0) as HTMLElement).click();
        pressTab();
        pressTab();

        const lastViewItem = instance.getViewItemBySortedIndex(2);
        expect(document.activeElement).toBe(lastViewItem?.$element().get(0));
        expect(lastViewItem?.$element().attr('tabindex')).toBe('0');
      });
    });

    describe('Home/End navigation', () => {
      it('should move focus to first appointment on Home key', () => {
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        const viewItem2 = instance.getViewItemBySortedIndex(2);

        (viewItem2?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem2?.$element().get(0) as HTMLElement, { key: 'Home' });

        expect(viewItem0?.$element().attr('tabindex')).toBe('0');
        expect(viewItem2?.$element().attr('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(viewItem0?.$element().get(0));
      });

      it('should prevent default browser behavior on Home key', () => {
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem1 = instance.getViewItemBySortedIndex(1);
        (viewItem1?.$element().get(0) as HTMLElement).click();

        const wasDefaultPrevented = !fireEvent.keyDown(
          viewItem1?.$element().get(0) as HTMLElement,
          { key: 'Home' },
        );

        expect(wasDefaultPrevented).toBe(true);
      });

      it('should prevent default browser behavior on End key', () => {
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        (viewItem0?.$element().get(0) as HTMLElement).click();

        const wasDefaultPrevented = !fireEvent.keyDown(
          viewItem0?.$element().get(0) as HTMLElement,
          { key: 'End' },
        );

        expect(wasDefaultPrevented).toBe(true);
      });

      it('should prevent default browser behavior on Enter key', () => {
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();

        const wasDefaultPrevented = !fireEvent.keyDown(
          viewItem?.$element().get(0) as HTMLElement,
          { key: 'Enter' },
        );

        expect(wasDefaultPrevented).toBe(true);
      });

      it('should prevent default browser behavior on Space key', () => {
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();

        const wasDefaultPrevented = !fireEvent.keyDown(
          viewItem?.$element().get(0) as HTMLElement,
          { key: ' ' },
        );

        expect(wasDefaultPrevented).toBe(true);
      });

      it('should move focus to last appointment on End key', () => {
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 2 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem0 = instance.getViewItemBySortedIndex(0);
        const viewItem2 = instance.getViewItemBySortedIndex(2);

        (viewItem0?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem0?.$element().get(0) as HTMLElement, { key: 'End' });

        expect(viewItem2?.$element().attr('tabindex')).toBe('0');
        expect(viewItem0?.$element().attr('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(viewItem2?.$element().get(0));
      });
    });

    describe('Keyboard actions', () => {
      it('should call onDeleteKeyPress when Delete is pressed and allowDelete is true', () => {
        const onDeleteKeyPress = jest.fn();
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 1 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          allowDelete: true,
          onDeleteKeyPress,
          getSortedItems: () => [{
            sortedIndex: 0,
            itemData: defaultAppointmentData,
            source: { startDate: 0 },
          }] as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: 'Delete' });

        expect(onDeleteKeyPress).toHaveBeenCalledTimes(1);
        expect(onDeleteKeyPress).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: defaultAppointmentData }),
        );
      });

      it('should not call onDeleteKeyPress when Delete is pressed and allowDelete is false', () => {
        const onDeleteKeyPress = jest.fn();
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          allowDelete: false,
          onDeleteKeyPress,
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: 'Delete' });

        expect(onDeleteKeyPress).not.toHaveBeenCalled();
      });

      it('should not call onDeleteKeyPress when Delete is pressed on appointment collector', () => {
        const onDeleteKeyPress = jest.fn();
        const viewModel = [
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          allowDelete: true,
          onDeleteKeyPress,
          getSortedItems: () => viewModel as unknown as SortedEntity[],
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: 'Delete' });

        expect(onDeleteKeyPress).not.toHaveBeenCalled();
      });

      it('should show appointment popup when Enter is pressed', () => {
        const showEditAppointmentPopup = jest.fn();
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          showEditAppointmentPopup,
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: 'Enter' });

        expect(showEditAppointmentPopup).toHaveBeenCalledTimes(1);
        expect(showEditAppointmentPopup).toHaveBeenCalledWith(
          defaultAppointmentData,
          expect.objectContaining({ ...defaultAppointmentData }),
        );
      });

      it('should call onAppointmentDblClick when Enter is pressed', () => {
        const onAppointmentDblClick = jest.fn();
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          onAppointmentDblClick,
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: 'Enter' });

        expect(onAppointmentDblClick).toHaveBeenCalledTimes(1);
        expect(onAppointmentDblClick).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: defaultAppointmentData }),
        );
      });

      it('should show appointment popup when Space is pressed', () => {
        const showEditAppointmentPopup = jest.fn();
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          showEditAppointmentPopup,
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: ' ' });

        expect(showEditAppointmentPopup).toHaveBeenCalledTimes(1);
        expect(showEditAppointmentPopup).toHaveBeenCalledWith(
          defaultAppointmentData,
          expect.objectContaining({ ...defaultAppointmentData }),
        );
      });

      it('should call onAppointmentDblClick when Space is pressed', () => {
        const onAppointmentDblClick = jest.fn();
        const viewModel = [
          mockGridViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          onAppointmentDblClick,
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        (viewItem?.$element().get(0) as HTMLElement).click();
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: ' ' });

        expect(onAppointmentDblClick).toHaveBeenCalledTimes(1);
        expect(onAppointmentDblClick).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: defaultAppointmentData }),
        );
      });

      it('should show tooltip when Enter is pressed on appointment collector', () => {
        const showAppointmentTooltip = jest.fn();
        const showEditAppointmentPopup = jest.fn();
        const viewModel = [
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          showAppointmentTooltip,
          showEditAppointmentPopup,
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: 'Enter' });

        expect(showAppointmentTooltip).toHaveBeenCalledTimes(1);
        expect(showEditAppointmentPopup).not.toHaveBeenCalled();
      });

      it('should show tooltip when Space is pressed on appointment collector', () => {
        const showAppointmentTooltip = jest.fn();
        const showEditAppointmentPopup = jest.fn();
        const viewModel = [
          mockAppointmentCollectorViewModel({ ...defaultAppointmentData }, { sortedIndex: 0 }),
        ];

        const instance = createAppointments({
          ...getProperties(),
          showAppointmentTooltip,
          showEditAppointmentPopup,
        });
        instance.option('viewModel', viewModel);

        const viewItem = instance.getViewItemBySortedIndex(0);
        fireEvent.keyDown(viewItem?.$element().get(0) as HTMLElement, { key: ' ' });

        expect(showAppointmentTooltip).toHaveBeenCalledTimes(1);
        expect(showEditAppointmentPopup).not.toHaveBeenCalled();
      });
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

      const element = instance.getViewItemBySortedIndex(0)?.$element().get(0);

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
      expect(onAppointmentRendered).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentElement: element,
          appointmentData: defaultAppointmentData,
          targetedAppointmentData: expect.objectContaining({
            ...defaultAppointmentData,
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

      const element = instance.getViewItemBySortedIndex(0)?.$element().get(0);

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
      expect(onAppointmentRendered).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentElement: element,
          appointmentData: defaultAppointmentData,
          targetedAppointmentData: expect.objectContaining({
            ...defaultAppointmentData,
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

  describe('onAppointmentClick', () => {
    it('should not call onAppointmentClick on collector click', () => {
      const onAppointmentClick = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentClick,
      });
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      element.click();

      expect(onAppointmentClick).not.toHaveBeenCalled();
    });

    it('should prevent tooltip showing when onAppointmentClick callback sets e.cancel = true', () => {
      const onAppointmentClick = jest.fn((e) => { (e as any).cancel = true; });
      const showAppointmentTooltip = jest.fn();

      const instance = createAppointments({
        ...getProperties(),
        onAppointmentClick,
        showAppointmentTooltip,
      });
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      element.click();
      jest.runAllTimers();

      expect(onAppointmentClick).toHaveBeenCalledTimes(1);
      expect(showAppointmentTooltip).not.toHaveBeenCalled();
    });

    it('should show tooltip correctly when two appointments are clicked one after another quickly', () => {
      const showAppointmentTooltip = jest.fn();

      const instance = createAppointments({
        ...getProperties(),
        showAppointmentTooltip,
      });
      instance.option('viewModel', [
        mockGridViewModel({ ...defaultAppointmentData, text: 'Appointment 1' }, { sortedIndex: 0 }),
        mockGridViewModel({ ...defaultAppointmentData, text: 'Appointment 2' }, { sortedIndex: 1 }),
      ]);

      const viewItem1 = instance.getViewItemBySortedIndex(0);
      const element1 = viewItem1?.$element().get(0) as HTMLElement;

      const viewItem2 = instance.getViewItemBySortedIndex(1);
      const element2 = viewItem2?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      element1.click();
      element2.click();
      jest.runAllTimers();

      expect(showAppointmentTooltip).toHaveBeenCalledTimes(1);
      expect(showAppointmentTooltip).toHaveBeenCalledWith(
        $(element2),
        [
          expect.objectContaining({
            appointment: expect.objectContaining({ text: 'Appointment 2' }),
          }),
        ],
      );
    });
  });

  describe('onAppointmentDblClick', () => {
    it('should call onAppointmentDblClick on appointment double click', () => {
      const onAppointmentDblClick = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentDblClick,
      });
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      dblClick(element);
      jest.runAllTimers();

      expect(onAppointmentDblClick).toHaveBeenCalledTimes(1);
      expect(onAppointmentDblClick).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentElement: element,
          appointmentData: defaultAppointmentData,
          targetedAppointmentData: expect.objectContaining({
            ...defaultAppointmentData,
          }),
          event: expect.objectContaining({ type: 'dxdblclick' }),
        }),
      );
    });

    it('should not call onAppointmentDblClick on collector double click', () => {
      const onAppointmentDblClick = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        onAppointmentDblClick,
      });
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      dblClick(element);
      jest.runAllTimers();

      expect(onAppointmentDblClick).not.toHaveBeenCalled();
    });

    it('should show appointment popup on appointment double click', () => {
      const showEditAppointmentPopup = jest.fn();
      const showAppointmentTooltip = jest.fn();

      const instance = createAppointments({
        ...getProperties(),
        showEditAppointmentPopup,
        showAppointmentTooltip,
      });
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      dblClick(element);
      jest.runAllTimers();

      expect(showEditAppointmentPopup).toHaveBeenCalledTimes(1);
      expect(showEditAppointmentPopup).toHaveBeenCalledWith(
        defaultAppointmentData,
        expect.objectContaining({
          ...defaultAppointmentData,
        }),
      );
      expect(showAppointmentTooltip).not.toHaveBeenCalled();
    });

    it('should not show appointment popup on collector double click', () => {
      const showEditAppointmentPopup = jest.fn();
      const instance = createAppointments({
        ...getProperties(),
        showEditAppointmentPopup,
      });
      instance.option('viewModel', [
        mockAppointmentCollectorViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      dblClick(element);
      jest.runAllTimers();

      expect(showEditAppointmentPopup).not.toHaveBeenCalled();
    });

    it('should not show tooltip or appointment popup if onAppointmentDblClick sets e.cancel', () => {
      const onAppointmentDblClick = jest.fn((e) => { (e as any).cancel = true; });
      const showEditAppointmentPopup = jest.fn();
      const showAppointmentTooltip = jest.fn();

      const instance = createAppointments({
        ...getProperties(),
        onAppointmentDblClick,
        showEditAppointmentPopup,
        showAppointmentTooltip,
      });
      instance.option('viewModel', [
        mockGridViewModel(defaultAppointmentData, { sortedIndex: 0 }),
      ]);

      const viewItem = instance.getViewItemBySortedIndex(0);
      const element = viewItem?.$element().get(0) as HTMLElement;

      jest.useFakeTimers();
      dblClick(element);
      jest.runAllTimers();

      expect(onAppointmentDblClick).toHaveBeenCalledTimes(1);
      expect(showEditAppointmentPopup).not.toHaveBeenCalled();
      expect(showAppointmentTooltip).not.toHaveBeenCalled();
    });
  });
});

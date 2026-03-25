import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { ResourceConfig } from '@ts/scheduler/utils/loader/types';
import type { AppointmentAgendaViewModel } from '@ts/scheduler/view_model/types';

import fx from '../../../common/core/animation/fx';
import { getMockedBaseAppointmentProperties, mockAgendaViewModel } from '../__mock__/appointment_properties';
import { AGENDA_APPOINTMENT_CLASSES, APPOINTMENT_CLASSES } from '../const';
import type { AgendaAppointmentProperties } from './agenda_appointment';
import { AgendaAppointment } from './agenda_appointment';

const getAgendaAppointmentProperties = (options: {
  appointmentData: SafeAppointment;
  partialViewModel?: Partial<AppointmentAgendaViewModel>;
  resources?: ResourceConfig[]
}): AgendaAppointmentProperties => {
  const viewModel = mockAgendaViewModel(options.appointmentData, options.partialViewModel);
  const result = getMockedBaseAppointmentProperties({ ...options, viewModel });

  return {
    ...result,
    viewModel: result.viewModel as AppointmentAgendaViewModel,
  };
};

const createAgendaAppointment = async (
  properties: AgendaAppointmentProperties,
): Promise<AgendaAppointment> => {
  const $element = $('.root');

  // @ts-expect-error
  const instance = new AgendaAppointment($element, properties);

  // Await for resources
  await new Promise(process.nextTick);

  return instance;
};

const defaultAppointmentData = {
  text: 'Test appointment',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

describe('AgendaAppointment', () => {
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
    it.each([
      true, false,
    ])('should have correct class for viewModel.lastInGroup = %o', async (isLastInGroup) => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData: defaultAppointmentData,
          partialViewModel: { isLastInGroup },
        }),
      );

      expect(
        instance.$element().hasClass(AGENDA_APPOINTMENT_CLASSES.LAST_IN_DATE),
      ).toBe(isLastInGroup);
    });
  });

  describe('Title', () => {
    it('should have correct title text', async () => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, text: 'Test title' },
        }),
      );

      const $title = instance.$element().find(`.${APPOINTMENT_CLASSES.TITLE}`);

      expect($title.text()).toBe('Test title');
    });

    it('should have emptry title text if appointment has no text', async () => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, text: undefined },
        }),
      );

      const $title = instance.$element().find(`.${APPOINTMENT_CLASSES.TITLE}`);
      expect($title.text()).toBe('(No subject)');
    });
  });

  describe('Date text', () => {
    it('should have correct date text', async () => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
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

  describe('Recurrence', () => {
    it.each([
      true, false,
    ])('should have correct recurrence icon visibility for isRecurring = %o', async (isRecurring) => {
      const appointmentData = isRecurring
        ? { ...defaultAppointmentData, recurrenceRule: 'FREQ=DAILY' }
        : defaultAppointmentData;

      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData,
        }),
      );

      const $icon = instance.$element().find(`.${APPOINTMENT_CLASSES.RECURRENCE_ICON}`);

      expect($icon.length).toBe(isRecurring ? 1 : 0);
    });
  });

  describe('All Day', () => {
    it.each([
      true, false,
    ])('should have correct all day text visibility for allDay = %o', async (isAllDay) => {
      const appointmentData = { ...defaultAppointmentData, allDay: isAllDay };

      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData,
        }),
      );

      const $allDayText = instance.$element().find(`.${APPOINTMENT_CLASSES.ALL_DAY_TEXT}`);

      expect($allDayText.length).toBe(isAllDay ? 1 : 0);
    });
  });

  describe('Resources', () => {
    it('should have marker with color from resource', async () => {
      const resourceColor = 'rgb(255, 0, 0)';
      const resources = [
        {
          field: 'roomId',
          dataSource: [{ id: 1, text: 'Room 1', color: resourceColor }],
        },
      ];

      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, roomId: 1 },
          resources,
        }),
      );

      const $marker = instance.$element().find(`.${AGENDA_APPOINTMENT_CLASSES.MARKER}`);

      expect($marker.css('backgroundColor')).toBe(resourceColor);
    });

    it('should render resource list', async () => {
      const resources = [
        {
          label: 'roomId',
          fieldExpr: 'roomId',
          dataSource: [{ id: 1, text: 'Room 1' }],
        },
        {
          label: 'ownerId',
          fieldExpr: 'ownerId',
          dataSource: [{ id: 2, text: 'Owner 1' }],
        },
      ];

      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData: { ...defaultAppointmentData, roomId: 1, ownerId: 2 },
          resources,
        }),
      );

      const $resourceItems = instance.$element().find(`.${AGENDA_APPOINTMENT_CLASSES.RESOURCE_ITEM}`);

      expect($resourceItems.length).toBe(2);
      expect($resourceItems.eq(0).text()).toBe('roomId:Room 1');
      expect($resourceItems.eq(1).text()).toBe('ownerId:Owner 1');
    });

    it('should not render resource list if there are no resources', async () => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          appointmentData: defaultAppointmentData,
        }),
      );

      const $resourceItems = instance.$element().find(`.${AGENDA_APPOINTMENT_CLASSES.RESOURCE_ITEM}`);

      expect($resourceItems.length).toBe(0);
    });
  });
});

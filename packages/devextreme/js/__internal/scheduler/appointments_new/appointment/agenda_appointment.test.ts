import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentResource } from '@ts/scheduler/utils/resource_manager/appointment_groups_utils';

import fx from '../../../common/core/animation/fx';
import { getBaseAppointmentProperties } from '../__mock__/appointment_properties';
import { AGENDA_APPOINTMENT_CLASSES, APPOINTMENT_CLASSES } from '../const';
import type { AgendaAppointmentProperties } from './agenda_appointment';
import { AgendaAppointment } from './agenda_appointment';

const getAgendaAppointmentProperties = (
  appointmentData: SafeAppointment,
  targetedAppointmentData?: TargetedAppointment,
): AgendaAppointmentProperties => {
  const baseProperties = getBaseAppointmentProperties(
    appointmentData,
    targetedAppointmentData,
  );

  return {
    ...baseProperties,
    modifiers: {
      isLastInGroup: false,
    },
    geometry: {
      height: 50,
      width: '100%',
    },
    getResourcesValues: (): Promise<AppointmentResource[]> => Promise.resolve([]),
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
    ])('should have correct class for modifiers.lastInGroup = %o', async (isLastInGroup) => {
      const instance = await createAgendaAppointment({
        ...getAgendaAppointmentProperties(defaultAppointmentData),
        modifiers: { isLastInGroup },
      });

      expect(
        instance.$element().hasClass(AGENDA_APPOINTMENT_CLASSES.LAST_IN_DATE),
      ).toBe(isLastInGroup);
    });
  });

  describe('Title', () => {
    it.each([
      { text: 'Test title', expected: 'Test title' },
      { text: undefined, expected: '(No subject)' },
      { text: '', expected: '(No subject)' },
    ])('should have correct title text for appointment text = %o', async ({ text, expected }) => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          ...defaultAppointmentData, text,
        }),
      );

      const $title = instance.$element().find(`.${APPOINTMENT_CLASSES.TITLE}`);
      expect($title.text()).toBe(expected);
    });
  });

  describe('Date text', () => {
    it('should have correct date text', async () => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          ...defaultAppointmentData,
          startDate: new Date(2024, 0, 1, 9, 0),
          endDate: new Date(2024, 0, 1, 10, 0),
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
        getAgendaAppointmentProperties(appointmentData),
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
        getAgendaAppointmentProperties(appointmentData),
      );

      const $allDayText = instance.$element().find(`.${APPOINTMENT_CLASSES.ALL_DAY_TEXT}`);

      expect($allDayText.length).toBe(isAllDay ? 1 : 0);
    });
  });

  describe('Resources', () => {
    it('should apply resource color', async () => {
      const resourceColor = 'rgb(255, 0, 0)';

      const instance = await createAgendaAppointment({
        ...getAgendaAppointmentProperties(defaultAppointmentData),
        getResourceColor: () => Promise.resolve(resourceColor),
      });

      const $marker = instance.$element().find(`.${AGENDA_APPOINTMENT_CLASSES.MARKER}`);

      expect($marker.css('backgroundColor')).toBe(resourceColor);
    });

    it('should render resource list', async () => {
      const instance = await createAgendaAppointment({
        ...getAgendaAppointmentProperties(defaultAppointmentData),
        getResourcesValues: () => {
          const resourceValues: AppointmentResource[] = [
            { label: 'roomId', values: ['Room 1'] },
            { label: 'ownerId', values: ['Owner 1'] },
          ];

          return Promise.resolve(resourceValues);
        },
      });

      const $resourceItems = instance.$element().find(`.${AGENDA_APPOINTMENT_CLASSES.RESOURCE_ITEM}`);

      expect($resourceItems.length).toBe(2);
      expect($resourceItems.eq(0).text()).toBe('roomId:Room 1');
      expect($resourceItems.eq(1).text()).toBe('ownerId:Owner 1');
    });

    it('should not render resource list if there are no resources', async () => {
      const instance = await createAgendaAppointment({
        ...getAgendaAppointmentProperties(defaultAppointmentData),
        getResourcesValues: () => Promise.resolve([]),
      });

      const $resourceItems = instance.$element().find(`.${AGENDA_APPOINTMENT_CLASSES.RESOURCE_ITEM}`);

      expect($resourceItems.length).toBe(0);
    });
  });

  describe('Geometry', () => {
    it('should have correct height and width', async () => {
      const instance = await createAgendaAppointment(
        getAgendaAppointmentProperties({
          ...defaultAppointmentData,
          geometry: {
            height: 60,
            width: '80%',
          },
        }),
      );

      expect(instance.$element().css('height')).toBe('60px');
      expect(instance.$element().css('width')).toBe('80%');
    });
  });
});

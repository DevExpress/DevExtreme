import messageLocalization from '@js/common/core/localization/message';

export const ALL_DAY_TEXT = ` ${messageLocalization.format('dxScheduler-allDay')}: `;
export const RECURRING_LABEL = messageLocalization.format('dxScheduler-appointmentAriaLabel-recurring');

export const APPOINTMENTS_CONTAINER_CLASS = 'dx-scheduler-scrollable-appointments';

export const APPOINTMENT_COLLECTOR_CLASSES = {
  CONTAINER: 'dx-scheduler-appointment-collector',
  COMPACT: 'dx-scheduler-appointment-collector-compact',
  CONTENT: 'dx-scheduler-appointment-collector-content',
};

export const APPOINTMENT_TYPE_CLASSES = {
  EMPTY: 'dx-scheduler-appointment-empty',
  ALL_DAY: 'dx-scheduler-all-day-appointment',
  RECURRING: 'dx-scheduler-appointment-recurrence',
};

export const APPOINTMENT_CLASSES = {
  CONTAINER: 'dx-scheduler-appointment',
  CONTENT: 'dx-scheduler-appointment-content',
  ARIA_DESCRIPTION: 'dx-scheduler-appointment-aria-description',
  STRIP: 'dx-scheduler-appointment-strip',
  TITLE: 'dx-scheduler-appointment-title',
  RECURRENCE_ICON: 'dx-scheduler-appointment-recurrence-icon',
  DETAILS: 'dx-scheduler-appointment-content-details',
  DATE: 'dx-scheduler-appointment-content-date',
  ALL_DAY_TEXT: 'dx-scheduler-appointment-content-allday',
};

export const AGENDA_APPOINTMENT_CLASSES = {
  LEFT_LAYOUT: 'dx-scheduler-agenda-appointment-left-layout',
  RIGHT_LAYOUT: 'dx-scheduler-agenda-appointment-right-layout',
  LAST_IN_DATE: 'dx-scheduler-last-in-date-agenda-appointment',
  MARKER: 'dx-scheduler-agenda-appointment-marker',
  RESOURCE_LIST: 'dx-scheduler-appointment-resource-list',
  RESOURCE_ITEM: 'dx-scheduler-appointment-resource-item',
  RESOURCE_ITEM_VALUE: 'dx-scheduler-appointment-resource-item-value',
};

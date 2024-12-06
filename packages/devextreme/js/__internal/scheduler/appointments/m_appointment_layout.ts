import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';

import { APPOINTMENT_CONTENT_CLASSES } from '../m_classes';

const allDayText = ` ${messageLocalization.format('dxScheduler-allDay')}: `;
const recurringText = messageLocalization.format('dxScheduler-appointmentAriaLabel-recurring');

export const createAppointmentLayout = (formatText, config) => {
  const result = $((domAdapter as any).createDocumentFragment());

  $('<div>')
    .text(formatText.text)
    .addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE)
    .appendTo(result);

  if (config.html) {
    result.html(config.html);
  }

  const $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(result);

  $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo($contentDetails);

  config.isRecurrence
        && $('<span>')
          .addClass(`${APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON} dx-icon-repeat`)
          .attr('aria-label', recurringText)
          .attr('role', 'img')
          .appendTo(result);

  config.isAllDay
        && $('<div>')
          .text(allDayText)
          .addClass(APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT)
          .prependTo($contentDetails);

  return result;
};

export const createAgendaAppointmentLayout = (formatText, config) => {
  const result = $((domAdapter as any).createDocumentFragment());

  const leftLayoutContainer = $('<div>')
    .addClass('dx-scheduler-agenda-appointment-left-layout')
    .appendTo(result);

  const rightLayoutContainer = $('<div>')
    .addClass('dx-scheduler-agenda-appointment-right-layout')
    .appendTo(result);

  // eslint-disable-next-line no-unused-vars
  const marker = $('<div>')
    .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER)
    .appendTo(leftLayoutContainer);

  config.isRecurrence
        && $('<span>').addClass(`${APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON} dx-icon-repeat`).attr('aria-label', recurringText)
          .appendTo(marker);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const text = $('<div>')
    .addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE)
    .text(formatText.text)
    .appendTo(rightLayoutContainer);

  const additionalContainer = $('<div>')
    .addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS)
    .appendTo(rightLayoutContainer);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const date = $('<div>')
    .addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE)
    .text(formatText.formatDate)
    .appendTo(additionalContainer);

  if (config.isAllDay) {
    $('<div>')
      .text(allDayText)
      .addClass(APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT)
      .prependTo(additionalContainer);
  }

  return result;
};

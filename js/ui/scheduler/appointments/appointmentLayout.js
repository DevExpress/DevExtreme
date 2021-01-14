import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import messageLocalization from '../../../localization/message';
import { isPlainObject } from '../../../core/utils/type';
import { APPOINTMENT_CONTENT_CLASSES } from '../constants';

const allDayText = ' ' + messageLocalization.format('dxScheduler-allDay') + ': ';

export const createAppointmentLayout = (formatText, rawAppointment) => {
    const result = $(domAdapter.createDocumentFragment());

    $('<div>')
        .text(formatText.text)
        .addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE)
        .appendTo(result);

    if(isPlainObject(rawAppointment)) {
        if(rawAppointment.html) {
            result.html(rawAppointment.html);
        }
    }

    const $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(result);

    $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo($contentDetails);

    rawAppointment.recurrenceRule &&
        $('<span>').addClass(APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON + ' dx-icon-repeat').appendTo(result);

    rawAppointment.allDay &&
        $('<div>')
            .text(allDayText)
            .addClass(APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT)
            .prependTo($contentDetails);

    return result;
};

export const createAgendaAppointmentLayout = (formatText, rawAppointment) => {
    const result = $(domAdapter.createDocumentFragment());

    $('<div>')
        .text(formatText.text)
        .addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE)
        .appendTo(result);

    if(isPlainObject(rawAppointment)) {
        if(rawAppointment.html) {
            result.html(rawAppointment.html);
        }
    }

    const $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(result);

    $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo($contentDetails);

    rawAppointment.recurrenceRule &&
        $('<span>').addClass(APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON + ' dx-icon-repeat').appendTo(result);

    rawAppointment.allDay &&
        $('<div>')
            .text(allDayText)
            .addClass(APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT)
            .prependTo($contentDetails);

    return result;
};

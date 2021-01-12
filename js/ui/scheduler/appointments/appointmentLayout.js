import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import messageLocalization from '../../../localization/message';
import { isPlainObject } from '../../../core/utils/type';

const APPOINTMENT_CONTENT_DETAILS_CLASS = 'dx-scheduler-appointment-content-details';
const RECURRING_ICON_CLASS = 'dx-scheduler-appointment-recurrence-icon';
const APPOINTMENT_TITLE_CLASS = 'dx-scheduler-appointment-title';
const APPOINTMENT_DATE_CLASS = 'dx-scheduler-appointment-content-date';
const ALL_DAY_CONTENT_CLASS = 'dx-scheduler-appointment-content-allday';

export const createAppointmentLayout = (formatText, data) => {
    const result = $(domAdapter.createDocumentFragment());

    $('<div>')
        .text(formatText.text)
        .addClass(APPOINTMENT_TITLE_CLASS)
        .appendTo(result);

    if(isPlainObject(data)) {
        if(data.html) {
            result.html(data.html);
        }
    }

    const $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_DETAILS_CLASS);

    $('<div>').addClass(APPOINTMENT_DATE_CLASS).text(formatText.formatDate).appendTo($contentDetails);

    $contentDetails.appendTo(result);

    if(data.recurrenceRule) {
        $('<span>').addClass(RECURRING_ICON_CLASS + ' dx-icon-repeat').appendTo(result);
    }

    if(data.allDay) {
        $('<div>')
            .text(' ' + messageLocalization.format('dxScheduler-allDay') + ': ')
            .addClass(ALL_DAY_CONTENT_CLASS)
            .prependTo($contentDetails);
    }

    return result;
};

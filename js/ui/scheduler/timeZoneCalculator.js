import { isDefined } from '../../core/utils/type';
import timeZoneUtils from './utils.timeZone';
import dateUtils from '../../core/utils/date';

const toMs = dateUtils.dateToMilliseconds;

class TimeZoneOffsets {
    constructor(client, common, appointment) {
        this.client = client;
        this.common = common;
        this.appointment = appointment;
    }
}

export const PathTimeZoneConversion = {
    fromSourceToAppointment: 'toAppointment',
    fromAppointmentToSource: 'fromAppointment',

    fromSourceToGrid: 'toGrid',
    fromGridToSource: 'fromGrid',
};

export class TimeZoneCalculator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    createDate(sourceDate, info) {
        const date = new Date(sourceDate);

        switch(info.path) {
            case PathTimeZoneConversion.fromSourceToAppointment:
                return this._getConvertedDate(date, info.appointmentTimeZone, true);
            case PathTimeZoneConversion.fromAppointmentToSource:
                return this._getConvertedDate(date, info.appointmentTimeZone, true, true);
            case PathTimeZoneConversion.fromSourceToGrid:
                return this._getConvertedDate(date, info.appointmentTimeZone, false);
            case PathTimeZoneConversion.fromGridToSource:
                return this._getConvertedDate(date, info.appointmentTimeZone, false, true);
        }
        throw new Error('not specified pathTimeZoneConversion');
    }

    _useAppointmentTimeZone(appointmentTimezone, useAppointmentTimeZone) {
        return useAppointmentTimeZone && !!appointmentTimezone;
    }

    _getConvertedDate(date, appointmentTimezone, useAppointmentTimeZone, isBack) {
        const newDate = new Date(date.getTime());
        const offsets = this._getComplexOffsets(newDate, appointmentTimezone);

        if(this._useAppointmentTimeZone(appointmentTimezone, useAppointmentTimeZone)) {
            return this._getConvertedDateByOffsets(date, offsets.client, offsets.appointment, isBack);
        }

        return this._getConvertedDateByOffsets(date, offsets.client, offsets.common, isBack);
    }

    _getConvertedDateByOffsets(date, clientOffset, targetOffset, isBack) {
        const operation = isBack ? -1 : 1;
        const utcTime = date.getTime() - clientOffset * toMs('hour');

        return new Date(utcTime + operation * targetOffset * toMs('hour'));
    }

    _getComplexOffsets(date, appointmentTimezone) {
        const clientTimezoneOffset = -this.scheduler.fire('getClientTimezoneOffset', date) / toMs('hour');
        let commonTimezoneOffset = this.scheduler._getTimezoneOffsetByOption(date);
        let appointmentTimezoneOffset = timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date);

        if(typeof appointmentTimezoneOffset !== 'number') {
            appointmentTimezoneOffset = clientTimezoneOffset;
        }

        if(!isDefined(commonTimezoneOffset)) {
            commonTimezoneOffset = clientTimezoneOffset;
        }

        return new TimeZoneOffsets(
            clientTimezoneOffset,
            commonTimezoneOffset,
            appointmentTimezoneOffset
        );
    }
}

import { isDefined } from '../../core/utils/type';
import timeZoneUtils from './utils.timeZone';
import dateUtils from '../../core/utils/date';

const MINUTES_IN_HOUR = 60;
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

    _isNeedConvertToCommonTimeZone(appointmentTimezone, skipConvert) {
        if(!skipConvert || skipConvert && !appointmentTimezone) { // TODO may be !skipConvert || !appointmentTimezone
            return true;
        }
        return false;
    }

    _getConvertedDate(date, appointmentTimezone, skipCommonTimezone, isBack) {
        let result = new Date(date.getTime());

        const startYearDate = new Date((new Date(date.getTime())).setMonth(0, 0));
        const dateMinusHour = new Date((new Date(date.getTime())).setHours(date.getHours() - 1, 0, 0));

        const startYearOffsets = this._getComplexOffsets(startYearDate, appointmentTimezone);
        const dateMinusHourOffsets = this._getComplexOffsets(dateMinusHour, appointmentTimezone);

        const offsets = this._getComplexOffsets(result, appointmentTimezone);
        result = this._getConvertedToAppointmentTimeZone(result, offsets, isBack, startYearOffsets, dateMinusHourOffsets);

        if(this._isNeedConvertToCommonTimeZone(appointmentTimezone, skipCommonTimezone)) {
            result = this._getConvertedToCommonTimeZone(result, offsets, isBack, startYearOffsets, dateMinusHourOffsets);
        }

        return result;
    }

    _getDelta(startYearOffset, dateMinusHourOffsets, currentOffset) {
        if(dateMinusHourOffsets === currentOffset) {
            return startYearOffset - currentOffset;
        }
        return 0;
    }

    _getConvertedToAppointmentTimeZone(date, offsets, back, startYearOffsets, dateMinusHourOffsets) {
        const timezonesIsIdentical = offsets.client === offsets.appointment;
        const delta = timezonesIsIdentical ? 0 : this._getDelta(startYearOffsets.appointment, dateMinusHourOffsets.appointment, offsets.appointment);

        const operation = back ? -1 : 1;
        const dateInUTC = date.getTime() - operation * offsets.client * toMs('hour');
        const result = new Date(dateInUTC + operation * (offsets.appointment + delta) * toMs('hour'));

        return result;
    }

    _getConvertedToCommonTimeZone(date, offsets, back, startYearOffsets, dateMinusHourOffsets) {
        const operation = back ? -1 : 1;

        const timezonesIsIdentical = offsets.client === offsets.common;
        const delta = timezonesIsIdentical ? 0 : this._getDelta(startYearOffsets.common, dateMinusHourOffsets.common, offsets.common);

        const offset = offsets.common - offsets.appointment + delta;
        const hoursOffset = (offset < 0 ? -1 : 1) * Math.floor(Math.abs(offset));
        const minutesOffset = offset % 1;

        date.setHours(date.getHours() + operation * hoursOffset);
        date.setMinutes(date.getMinutes() + operation * minutesOffset * MINUTES_IN_HOUR);

        return date;
    }

    _getComplexOffsets(date, appointmentTimezone) {
        const clientTimezoneOffset = -this.scheduler.fire('getClientTimezoneOffset', date) / toMs('hour'); // TODO
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

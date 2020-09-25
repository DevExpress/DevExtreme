import timeZoneUtils from './utils.timeZone';
import timeZoneDataUtils from './timezones/utils.timezones_data';
import { isDefined } from '../../core/utils/type';

export const getTimeZones = (date) => {
    if(!isDefined(date)) {
        date = new Date();
    }

    const dateInUTC = timeZoneUtils.createUTCDateWithLocalOffset(date);
    return timeZoneDataUtils.getDisplayedTimeZones(dateInUTC.getTime());
};

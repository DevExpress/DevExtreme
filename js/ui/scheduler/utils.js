import timeZoneUtils from './utils.timeZone';
import timeZoneDataUtils from './timezones/utils.timezones_data';

const getTimeZones = (date = new Date()) => {
    const dateInUTC = timeZoneUtils.createUTCDate(date);
    return timeZoneDataUtils.getDisplayedTimeZones(dateInUTC.getTime());
};

export { getTimeZones };

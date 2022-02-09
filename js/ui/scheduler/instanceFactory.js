import { isDefined } from '../../core/utils/type';
import { TimeZoneCalculator } from '../../renovation/ui/scheduler/timeZoneCalculator/utils';
import timeZoneUtils from './utils.timeZone';

const Names = {
    timeZoneCalculator: 'timeZoneCalculator',
};

const factoryInstances = { };

let tailIndex = -1;
export const generateKey = (key) => {
    return isDefined(key)
        ? key
        : ++tailIndex;
};

export const createFactoryInstances = (options) => {
    const key = generateKey(options.key);

    createTimeZoneCalculator(key, options.timeZone);

    return key;
};

export const createInstance = (name, key, callback) => {
    if(!isDefined(factoryInstances[name])) {
        factoryInstances[name] = { };
    }

    const result = callback();

    factoryInstances[name][key] = result;

    return result;
};

const getInstance = (name, key) => {
    return factoryInstances[name]
        ? factoryInstances[name][key]
        : undefined;
};

const removeInstance = (name, key) => {
    let instance = getInstance(name, key);
    if(instance) {
        instance = null;
    }
};

const createTimeZoneCalculator = (key, currentTimeZone) => {
    return createInstance(Names.timeZoneCalculator, key, () => {
        return new TimeZoneCalculator({
            getClientOffset: date => timeZoneUtils.getClientTimezoneOffset(date),
            getCommonOffset: (date, timeZone) => timeZoneUtils.calculateTimezoneByValue(timeZone || currentTimeZone, date),
            getAppointmentOffset: (date, appointmentTimezone) => timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date)
        });
    });
};

export const disposeFactoryInstances = (key) => {
    Object.getOwnPropertyNames(Names).forEach((name) => {
        removeInstance(name, key);
    });
};

export const getTimeZoneCalculator = (key) => getInstance(Names.timeZoneCalculator, key);

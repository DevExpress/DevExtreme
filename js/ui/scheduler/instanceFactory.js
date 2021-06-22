import { isDefined } from '../../core/utils/type';
import { ResourceManager } from './resources/resourceManager';
import { AppointmentDataProvider } from './appointments/DataProvider/appointmentDataProvider';
import { TimeZoneCalculator } from './timeZoneCalculator';
import timeZoneUtils from './utils.timeZone';

const Names = {
    timeZoneCalculator: 'timeZoneCalculator',
    resourceManager: 'resourceManager',
    appointmentDataProvider: 'appointmentDataProvider'
};

const factoryInstances = { };

let tailIndex = -1;
export const createFactoryInstances = (options) => {
    const key = isDefined(options.key)
        ? options.key
        : ++tailIndex;

    const timeZoneCalculator = createTimeZoneCalculator(key, options.timeZone);
    const resourceManager = createResourceManager(key, options.resources);
    createAppointmentDataProvider(key, {
        ...options,
        timeZoneCalculator,
        resourceManager
    });

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
    if(getInstance(name, key)) {
        factoryInstances[name][key] = undefined;
    }
};

const createResourceManager = (key, resources) => {
    return createInstance(Names.resourceManager, key, () => {
        const resourceManager = getInstance(Names.resourceManager, key);

        if(isDefined(resourceManager)) {
            resourceManager.setResources(resources);
            return resourceManager;
        }

        return new ResourceManager(resources);
    });
};

const createAppointmentDataProvider = (key, options) => {
    return createInstance(Names.appointmentDataProvider, key, () => {
        return new AppointmentDataProvider({
            ...options,
            key
        });
    });
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

export const getResourceManager = (key) => getInstance(Names.resourceManager, key);
export const getAppointmentDataProvider = (key = 0) => getInstance(Names.appointmentDataProvider, key);
export const getTimeZoneCalculator = (key) => getInstance(Names.timeZoneCalculator, key);

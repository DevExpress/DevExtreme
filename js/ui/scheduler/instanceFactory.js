import { isDefined } from '../../core/utils/type';
import { AppointmentDataProvider } from './appointments/DataProvider/appointmentDataProvider';
import { ModelProvider } from './modelProvider';
import { TimeZoneCalculator } from './timeZoneCalculator';
import timeZoneUtils from './utils.timeZone';

const Names = {
    timeZoneCalculator: 'timeZoneCalculator',
    appointmentDataProvider: 'appointmentDataProvider',
    model: 'model',
    modelProvider: 'modelProvider'
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

    createModelProvider(key, options.model);
    const timeZoneCalculator = createTimeZoneCalculator(key, options.timeZone);
    createAppointmentDataProvider(key, {
        ...options,
        timeZoneCalculator,
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
        factoryInstances[name] = null;
    }
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

export const createModelProvider = (key, model) => {
    return createInstance(
        Names.modelProvider,
        key,
        () => {
            const modelProvider = getInstance(Names.modelProvider, key);
            return isDefined(modelProvider)
                ? modelProvider
                : new ModelProvider(model);
        }
    );
};


export const disposeFactoryInstances = (key) => {
    Object.getOwnPropertyNames(Names).forEach((name) => {
        removeInstance(name, key);
    });
};

export const getAppointmentDataProvider = (key = 0) => getInstance(Names.appointmentDataProvider, key);
export const getTimeZoneCalculator = (key) => getInstance(Names.timeZoneCalculator, key);
export const getModelProvider = (key) => getInstance(Names.modelProvider, key);

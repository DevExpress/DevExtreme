import { isDefined } from '../../core/utils/type';
import { ResourceManager } from './resources/resourceManager';
import { AppointmentDataProvider } from './appointments/DataProvider/appointmentDataProvider';

const Names = {
    resourceManager: 'resourceManager',
    appointmentDataProvider: 'appointmentDataProvider',
    timeZoneCalculator: 'timeZoneCalculator'
};

const factoryInstances = { };

let tailIndex = -1;
export const createFactoryInstances = (options) => {
    const key = isDefined(options.key)
        ? options.key
        : ++tailIndex;

    createResourceManager(key, options.resources);
    createAppointmentDataProvider(key, options);

    return key;
};

const createInstance = (name, key, callback) => {
    if(!isDefined(factoryInstances[name])) {
        factoryInstances[name] = { };
    }
    factoryInstances[name][key] = callback();
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
    createInstance(Names.resourceManager, key, () => {
        const resourceManager = getInstance(Names.resourceManager, key);

        if(isDefined(resourceManager)) {
            resourceManager.setResources(resources);
            return resourceManager;
        }

        return new ResourceManager(resources);
    });
};

const createAppointmentDataProvider = (key, options) => {
    createInstance(Names.appointmentDataProvider, key, () => {
        return new AppointmentDataProvider({
            ...options,
            key
        });
    });
};

export const disposeFactoryInstances = (key) => {
    Object.getOwnPropertyNames(Names).forEach((name) => {
        removeInstance(name, key);
    });
};

export const getResourceManager = (key) => getInstance(Names.resourceManager, key);
export const removeResourceManager = (key) => removeInstance(Names.resourceManager, key);

export const getAppointmentDataProvider = (key = 0) => getInstance(Names.appointmentDataProvider, key);
export const removeAppointmentDataProvider = (key) => removeInstance(Names.appointmentDataProvider, key);

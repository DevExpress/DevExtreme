import { isDefined } from '../../core/utils/type';
import { createResourceManager, removeResourceManager } from './resources/resourceManager';
import { createAppointmentDataProvider, removeAppointmentDataProvider } from './appointments/DataProvider/appointmentDataProvider';

let tailIndex = -1;
export const createFactoryInstances = (options) => {
    const key = isDefined(options.key)
        ? options.key
        : ++tailIndex;

    createResourceManager(key, options.resources);
    createAppointmentDataProvider(key, options);

    return key;
};

export const disposeFactoryInstances = (key) => {
    removeResourceManager(key);
    removeAppointmentDataProvider(key);
};

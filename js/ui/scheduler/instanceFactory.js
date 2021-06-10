import { createResourceManager, removeResourceManager } from './resources/resourceManager';
import { createAppointmentDataProvider, removeAppointmentDataProvider } from './appointments/DataProvider/appointmentDataProvider';

let tailIndex = -1;
export const createFactoryInstances = (options) => {
    ++tailIndex;

    createResourceManager(tailIndex, options.resources);
    createAppointmentDataProvider(tailIndex, options);

    return tailIndex;
};

export const disposeFactoryInstances = (key) => {
    removeResourceManager(key);
    removeAppointmentDataProvider(key);
};

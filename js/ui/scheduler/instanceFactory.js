import { createResourceManager } from './resources/resourceManager';
import { createAppointmentDataProvider } from './appointments/DataProvider/appointmentDataProvider';

export const createInstances = (options) => {
    createResourceManager(options.resources);
    createAppointmentDataProvider(options);
};

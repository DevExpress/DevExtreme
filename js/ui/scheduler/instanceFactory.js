import ResourceManager from './resources/resourceManager';
import WorkspaceHelper from './workspaces/workspaceHelper';
import AppointmentDataProvider from './appointments/DataProvider/appointmentDataProvider';

class InstanceFactory {
    create(options) {
        const { resources } = options;
        this.resourceManager = new ResourceManager(resources);
        this.workspaceHelper = new WorkspaceHelper();

        this.appointmentDataProvider = new AppointmentDataProvider(
            options.scheduler,
            options.dataSource,
            options.appointmentDataAccessors
        );

        this.scheduler = options.scheduler;
    }
}

const instanceFactory = new InstanceFactory();

export const getInstanceFactory = () => instanceFactory;
export const getResourceManager = () => instanceFactory.resourceManager;
export const getWorkspaceHelper = () => instanceFactory.workspaceHelper;
export const getAppointmentDataProvider = () => instanceFactory.appointmentDataProvider;

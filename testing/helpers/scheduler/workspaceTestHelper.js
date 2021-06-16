import { createFactoryInstances } from 'ui/scheduler/instanceFactory';
import { getResourceManager, ResourceManager } from 'ui/scheduler/resources/resourceManager';
import { getAppointmentDataProvider } from 'ui/scheduler/appointments/DataProvider/appointmentDataProvider';

export const getObserver = (key) => {
    return {
        fire: (command) => {
            switch(command) {
                case 'getResourceManager':
                    return getResourceManager(key);
                case 'getAppointmentDataProvider':
                    return getAppointmentDataProvider(key);
                default:
                    break;
            }
        },
        key
    };
};

export const initFactoryInstance = (resourceGetter) => {
    const key = createFactoryInstances({
        scheduler: {
            isVirtualScrolling: () => false
        }
    });

    getResourceManager(key).createResourcesTree = (groups) => {
        return new ResourceManager({}).createResourcesTree(groups);
    };

    getResourceManager(key).getResourceTreeLeaves = (tree, appointmentResources) => {
        const resources = typeof resourceGetter === 'function'
            ? resourceGetter()
            : resourceGetter;
        const resultResources = resources || [{ field: 'one', dataSource: [{ id: 1 }, { id: 2 }] }];
        return new ResourceManager(resultResources).getResourceTreeLeaves(tree, appointmentResources);
    };

    return getObserver(key);
};

export const stubInvokeMethod = function(instance, options) {
    options = options || {};
    sinon.stub(instance, 'invoke', function() {
        const subscribe = arguments[0];
        if(subscribe === 'getTimezone') {
            return options.tz || 3;
        }
        if(subscribe === 'getTimezoneOffset') {
            return -180 * 60000;
        }
        if(subscribe === 'getDaylightOffset') {
            const startDate = arguments[1];
            const endDate = arguments[2];

            return startDate.getTimezoneOffset() - endDate.getTimezoneOffset();
        }
        if(subscribe === 'convertDateByTimezone') {
            let date = new Date(arguments[1]);

            const tz = options.tz;

            if(tz) {
                const tzOffset = new Date().getTimezoneOffset() * 60000;
                const dateInUTC = date.getTime() + tzOffset;

                date = new Date(dateInUTC + (tz * 3600000));
            }

            return date;
        }
        if(subscribe === 'getResourceManager') {
            return getResourceManager(options.key || 0);
        }
        if(subscribe === 'getAppointmentDataProvider') {
            return getAppointmentDataProvider(options.key || 0);
        }
    });
};

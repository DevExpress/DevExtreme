import { ResourceManager } from 'ui/scheduler/resources/resourceManager';
import { getInstanceFactory, getResourceManager } from 'ui/scheduler/instanceFactory';

export const initFactoryInstance = (resourceGetter) => {
    getInstanceFactory().create({
        scheduler: {
            isVirtualScrolling: () => false
        }
    });

    getResourceManager().createResourcesTree = (groups) => {
        return new ResourceManager({}).createResourcesTree(groups);
    };

    getResourceManager().getResourceTreeLeaves = (tree, appointmentResources) => {
        const resources = typeof resourceGetter === 'function'
            ? resourceGetter()
            : resourceGetter;
        const resultResources = resources || [{ field: 'one', dataSource: [{ id: 1 }, { id: 2 }] }];
        return new ResourceManager(resultResources).getResourceTreeLeaves(tree, appointmentResources);
    };
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
    });
};

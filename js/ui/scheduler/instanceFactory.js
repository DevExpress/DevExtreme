import { ResourceManager } from './resources/resourceManager';

class InstanceFactory {
    create(options) {
        const { resources } = options;
        this.resourceManager = new ResourceManager(resources);
        this.scheduler = options.scheduler;
    }
}

const instanceFactory = new InstanceFactory();
export function getInstanceFactory() {
    return instanceFactory;
}

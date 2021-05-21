import { ResourceManager } from './resources/resourceManager';
import { WorkspaceHelper } from './workspaces/workspaceHelper';

class InstanceFactory {
    create(options) {
        const { resources } = options;
        this.resourceManager = new ResourceManager(resources);
        this.workspaceHelper = new WorkspaceHelper();
        this.scheduler = options.scheduler;
    }
}

const instanceFactory = new InstanceFactory();
export function getInstanceFactory() {
    return instanceFactory;
}

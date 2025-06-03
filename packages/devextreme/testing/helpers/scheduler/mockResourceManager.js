import { ResourceManager } from '__internal/scheduler/utils/resource_manager/resource_manager';
import { ResourceLoader } from '__internal/scheduler/utils/loader/resource_loader';

export const getEmptyResourceManager = () => new ResourceManager([]);

export async function getWorkspaceResourceConfig(resources = []) {
    const manager = new ResourceManager(resources);
    const groups = resources.map((item) => item.fieldExpr);

    await manager.loadGroupResources(groups);

    return {
        getResourceManager: () => manager,
        groups: manager.groupResources(),
    };
}

export async function applyWorkspaceGroups(instance, resources = []) {
    const { getResourceManager, groups } = await getWorkspaceResourceConfig(resources);

    instance.option('getResourceManager', getResourceManager);
    instance.option('groups', groups);
}

export async function getLoadedResources(resources = []) {
    const resourceLoaders = resources.map((item) => new ResourceLoader(item));
    await Promise.all(resourceLoaders.map((item) => item.load()));
    return resourceLoaders;
}

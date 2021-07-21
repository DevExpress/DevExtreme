import { getGroupCount } from './resources/utils';
import { getResourceManager } from './instanceFactory';

export class ModelProvider {
    constructor(model) {
        this.model = model;
    }

    get key() { return this.model.key; }
    get resourceManager() { return getResourceManager(this.key); }
    get loadedResources() { return this.resourceManager.loadedResources; }

    _isHorizontalGroupedWorkSpace() {
        return !!this.loadedResources.length && this.model['groupOrientation'] === 'horizontal';
    }

    isGroupedByDate() {
        return this.model['groupByDate']
            && this._isHorizontalGroupedWorkSpace()
            && getGroupCount(this.loadedResources) > 0;
    }
}

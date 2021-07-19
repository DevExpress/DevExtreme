import { getGroupCount } from './resources/utils';

export class ModelProvider {
    constructor(options) {
        this.options = options;
    }

    get model() { return this.options.model; }
    get resourceManager() { return this.options.resourceManager; }
    get loadedResources() { return this.options.resourceManager.loadedResources; }

    _isHorizontalGroupedWorkSpace() {
        return !!this.loadedResources.length && this.model['groupOrientation'] === 'horizontal';
    }

    isGroupedByDate() { // TODO move to the ModelProvider
        return this.model['groupByDate']
            && this._isHorizontalGroupedWorkSpace()
            && getGroupCount(this.loadedResources) > 0;
    }
}

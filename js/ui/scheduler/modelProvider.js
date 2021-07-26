import { getGroupCount } from './resources/utils';
import { getResourceManager } from './instanceFactory';
import { each } from '../../core/utils/iterator';
import { isObject } from '../../core/utils/type';

const VIEW_TYPES = [
    'day', 'week', 'workWeek',
    'month', 'timelineDay', 'timelineWeek',
    'timelineWorkWeek', 'timelineMonth', 'agenda'
];

export class ModelProvider {
    constructor(model) {
        this.model = model;
        this.currentView = null;
    }

    get key() { return this.model.key; }
    get resourceManager() { return getResourceManager(this.key); }
    get loadedResources() { return this.resourceManager.loadedResources; }

    get startDayHour() { return this.model['startDayHour']; }
    get endDayHour() { return this.model['endDayHour']; }
    get adaptivityEnabled() { return this.model['adaptivityEnabled']; }
    get rtlEnabled() { return this.model['rtlEnabled']; }
    get maxAppointmentsPerCell() {
        return this.getCurrentViewOption('maxAppointmentsPerCell');
    }
    get currentViewOptions() { return this.currentView; }
    get currentViewType() {
        return isObject(this.currentView)
            ? this.currentView.type
            : this.currentView;
    }

    supportAllDayResizing() {
        return this.currentViewType !== 'day' || this.currentView.intervalCount > 1;
    }

    updateCurrentView() {
        const views = this.model['views'];
        const currentView = this.model['currentView'];

        this.currentView = null;

        each(views, (_, view) => {
            const names = isObject(view)
                ? [view.name, view.type]
                : [view];
            if(names.includes(currentView)) {
                this.currentView = view;
                return false;
            }
        });

        if(!this.currentView) {
            if(VIEW_TYPES.includes(currentView)) {
                this.currentView = currentView;
            } else {
                this.currentView = views[0];
            }
        }
    }

    isGroupedByDate() {
        return this.model['groupByDate']
            && this._isHorizontalGroupedWorkSpace()
            && getGroupCount(this.loadedResources) > 0;
    }

    _isHorizontalGroupedWorkSpace() {
        return !!this.loadedResources.length && this.model['groupOrientation'] === 'horizontal';
    }

    getCurrentViewOption(optionName) {
        if(this.currentView && this.currentView[optionName] !== undefined) {
            return this.currentView[optionName];
        }

        return this.model[optionName];
    }
}

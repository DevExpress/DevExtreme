import { wrapToArray } from '../../../core/utils/array';
import { when, Deferred } from '../../../core/utils/deferred';
import { getFieldExpr, getDisplayExpr, getValueExpr, getWrappedDataSource } from './utils';

class PromiseItem {
    constructor(rawAppointment, promise) {
        this.rawAppointment = rawAppointment;
        this.promise = promise;
    }
}

export class AgendaResourceProcessor {
    get resourceDeclarations() {
        return this._resourceDeclarations;
    }

    set resourceDeclarations(value) {
        this._resourceDeclarations = value;

        this.isLoaded = false;
        this.isLoading = false;

        this.resourceMap.clear();
        this.appointmentPromiseQueue = [];
    }

    constructor() {
        this._resourceDeclarations = [];
        this.isLoaded = false;
        this.isLoading = false;

        this.resourceMap = new Map();
        this.appointmentPromiseQueue = [];
    }

    _pushAllResources() {
        this.appointmentPromiseQueue.forEach(({ promise, rawAppointment }) => {
            const result = [];

            this.resourceMap.forEach((resource, fieldName) => {
                const item = {
                    label: resource.label,
                    values: []
                };

                if(fieldName in rawAppointment) {
                    wrapToArray(rawAppointment[fieldName])
                        .forEach(value => item.values.push(resource.map.get(value)));
                }

                if(item.values.length) {
                    result.push(item);
                }
            });

            promise.resolve(result);
        });
        this.appointmentPromiseQueue = [];
    }

    _onPullResource(fieldName, valueName, displayName, label, items) {
        const map = new Map();
        items.forEach(item => map.set(item[valueName], item[displayName]));

        this.resourceMap.set(fieldName, { label, map });
    }

    _hasResourceDeclarations(resources) {
        if(resources.length === 0) {
            this.appointmentPromiseQueue.forEach(({ promise }) => promise.resolve([]));
            this.appointmentPromiseQueue = [];

            return false;
        }

        return true;
    }

    _tryPullResources(resources, resultAsync) {
        if(!this.isLoading) {
            this.isLoading = true;
            const promises = [];

            resources.forEach(resource => {
                const promise = new Deferred()
                    .done(items => this._onPullResource(
                        getFieldExpr(resource),
                        getValueExpr(resource),
                        getDisplayExpr(resource),
                        resource.label,
                        items)
                    );

                promises.push(promise);

                const dataSource = getWrappedDataSource(resource.dataSource);
                if(dataSource.isLoaded()) {
                    promise.resolve(dataSource.items());
                } else {
                    dataSource
                        .load()
                        .done(list => promise.resolve(list))
                        .fail(() => promise.reject());
                }
            });

            when.apply(null, promises)
                .done(() => {
                    this.isLoaded = true;
                    this.isLoading = false;

                    this._pushAllResources();
                }).fail(() => resultAsync.reject());
        }
    }

    initializeState(resourceDeclarations = []) {
        this.resourceDeclarations = resourceDeclarations;
    }

    createListAsync(rawAppointment) {
        const resultAsync = new Deferred();
        this.appointmentPromiseQueue.push(new PromiseItem(rawAppointment, resultAsync));

        if(this._hasResourceDeclarations(this.resourceDeclarations)) {
            if(this.isLoaded) {
                this._pushAllResources();
            } else {
                this._tryPullResources(this.resourceDeclarations, resultAsync);
            }
        }

        return resultAsync.promise();
    }
}

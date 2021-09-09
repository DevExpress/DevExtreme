import { wrapToArray } from '../../../core/utils/array';
import { isDefined } from '../../../core/utils/type';
// import { each } from '../../../core/utils/iterator';
import { compileGetter, compileSetter } from '../../../core/utils/data';
import { when, Deferred } from '../../../core/utils/deferred';

import { AgendaResourceProcessor } from './agendaResourceProcessor';
import {
    getCellGroups,
    getDisplayExpr,
    getFieldExpr,
    getValueExpr,
    getWrappedDataSource,
    getResourceColor,
    filterResources,
    getPaintedResources,
} from './utils';

export class ResourceManager {
    constructor(resources) {
        this.loadedResources = [];
        this.resourceLoaderMap = new Map();
        this._dataAccessors = {
            getter: {},
            setter: {}
        };
        this.agendaProcessor = new AgendaResourceProcessor();

        this.setResources(resources);
    }

    getDataAccessors(fieldName, type) {
        // let result = null;

        const actions = this._dataAccessors[type];
        return actions[fieldName];

        // each(this._dataAccessors[type], function(accessorName, accessors) {
        //     if(fieldName === accessorName) {
        //         result = accessors;
        //         return false;
        //     }
        // });

        // return result;
    }

    setResources(resources = []) {
        this._resources = resources;
        this.resourceLoaderMap = new Map();


        this._dataAccessors = {
            getter: {},
            setter: {}
        };

        resources.forEach(resource => {
            const field = getFieldExpr(resource);

            this._dataAccessors.getter[field] = compileGetter(field);
            this._dataAccessors.setter[field] = compileSetter(field);
        });

        this.agendaProcessor.initializeState(resources);
    }

    getResources() {
        return this._resources || [];
    }

    isLoaded() {
        return isDefined(this.loadedResources);
    }

    _mapResourceData(resource, data) {
        const valueGetter = compileGetter(getValueExpr(resource));
        const displayGetter = compileGetter(getDisplayExpr(resource));

        return data.map(item => {
            const result = {
                id: valueGetter(item),
                text: displayGetter(item),
            };

            if(item.color) { // TODO for passed tests
                result.color = item.color;
            }

            return result;
        });
    }

    loadResources(groups) {
        const result = new Deferred();
        const deferreds = [];
        const newGroups = groups || [];

        filterResources(this.getResources(), newGroups)
            .forEach(resource => {
                const deferred = new Deferred();
                const name = getFieldExpr(resource);
                deferreds.push(deferred);

                const dataSourcePromise = getWrappedDataSource(resource.dataSource).load();
                this.resourceLoaderMap.set(name, dataSourcePromise);

                dataSourcePromise
                    .done(data => {
                        const items = this._mapResourceData(resource, data);

                        deferred.resolve({ name, items, data });
                    })
                    .fail(() => deferred.reject());
            });

        if(!deferreds.length) {
            this.loadedResources = [];
            return result.resolve([]);
        }

        when.apply(null, deferreds).done((...resources) => {
            const hasEmpty = resources.some(r => r.items.length === 0);

            this.loadedResources = hasEmpty ? [] : resources;

            result.resolve(this.loadedResources);
        }).fail(() => result.reject());

        return result.promise();
    }

    _createPlainResourcesByAppointmentAsync(rawAppointment) {
        return this.agendaProcessor.createListAsync(rawAppointment);
    }

    getAppointmentColor({ groupIndex, itemData, groups }) {
        const paintedResources = getPaintedResources(this.getResources(), groups);

        if(paintedResources) {
            const field = getFieldExpr(paintedResources);

            const cellGroups = getCellGroups(groupIndex, this.loadedResources);
            const resourceValues = wrapToArray(this.getDataAccessors(field, 'getter')(itemData));

            let groupId = resourceValues[0];

            for(let i = 0; i < cellGroups.length; i++) {
                if(cellGroups[i].name === field) {
                    groupId = cellGroups[i].id;
                    break;
                }
            }

            return getResourceColor(this.getResources(), this.resourceLoaderMap, field, groupId);
        }

        return new Deferred().resolve().promise();
    }
}

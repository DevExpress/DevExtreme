import ajaxUtils from '../../core/utils/ajax';
import Store from '../abstract_store';
import ArrayStore from '../array_store';
import { each, map } from '../../core/utils/iterator';
import CustomStore from '../custom_store';
import { extend } from '../../core/utils/extend';
import { isPlainObject } from '../../core/utils/type';
import { normalizeSortingInfo } from '../utils';

export const CANCELED_TOKEN = 'canceled';

export const isPending = deferred => deferred.state() === 'pending';

export const normalizeStoreLoadOptionAccessorArguments = (originalArguments) => {
    switch(originalArguments.length) {
        case 0:
            return undefined;
        case 1:
            return originalArguments[0];
    }
    return [].slice.call(originalArguments);
};

const mapGroup = (group, level, mapper) => map(group, item => {
    const { items, ...restItem } = item;
    return {
        ...restItem,
        items: mapRecursive(item.items, level - 1, mapper)
    };
});

const mapRecursive = (items, level, mapper) => {
    if(!Array.isArray(items)) return items;
    return level ? mapGroup(items, level, mapper) : map(items, mapper);
};

export const mapDataRespectingGrouping = (items, mapper, groupInfo) => {
    const level = groupInfo ? normalizeSortingInfo(groupInfo).length : 0;

    return mapRecursive(items, level, mapper);
};

export const normalizeLoadResult = (data, extra) => {
    if(data?.data) {
        extra = data;
        data = data.data;
    }

    if(!Array.isArray(data)) {
        data = [data];
    }

    return {
        data,
        extra
    };
};

const createCustomStoreFromLoadFunc = (options) => {
    const storeConfig = {};

    each(['useDefaultSearch', 'key', 'load', 'loadMode', 'cacheRawData', 'byKey', 'lookup', 'totalCount', 'insert', 'update', 'remove'], function() {
        storeConfig[this] = options[this];
        delete options[this];
    });

    return new CustomStore(storeConfig);
};

const createStoreFromConfig = (storeConfig) => {
    const alias = storeConfig.type;

    delete storeConfig.type;

    return Store.create(alias, storeConfig);
};

const createCustomStoreFromUrl = (url, normalizationOptions) =>
    new CustomStore({
        load: () => ajaxUtils.sendRequest({ url, dataType: 'json' }),
        loadMode: normalizationOptions?.fromUrlLoadMode
    });

export const normalizeDataSourceOptions = (options, normalizationOptions) => {
    let store;

    if(typeof options === 'string') {
        options = {
            paginate: false,
            store: createCustomStoreFromUrl(options, normalizationOptions)
        };
    }

    if(options === undefined) {
        options = [];
    }

    if(Array.isArray(options) || options instanceof Store) {
        options = { store: options };
    } else {
        options = extend({}, options);
    }

    if(options.store === undefined) {
        options.store = [];
    }

    store = options.store;

    if('load' in options) {
        store = createCustomStoreFromLoadFunc(options);
    } else if(Array.isArray(store)) {
        store = new ArrayStore(store);
    } else if(isPlainObject(store)) {
        store = createStoreFromConfig(extend({}, store));
    }

    options.store = store;

    return options;
};

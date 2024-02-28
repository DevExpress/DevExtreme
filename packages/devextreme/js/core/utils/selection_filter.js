import { getKeyHash, equalByValue } from './common';
import { isString, isObject } from './type';
import { compileGetter } from './data';

export const SelectionFilterCreator = function(selectedItemKeys, isSelectAll) {

    this.getLocalFilter = function(keyGetter, equalKeys, equalByReference, keyExpr) {
        equalKeys = equalKeys === undefined ? equalByValue : equalKeys;
        return functionFilter.bind(this, equalKeys, keyGetter, equalByReference, keyExpr);
    };

    this.getExpr = function(keyExpr) {
        if(!keyExpr) {
            return;
        }

        let filterExpr;

        selectedItemKeys.forEach(function(key, index) {
            filterExpr = filterExpr || [];

            let filterExprPart;

            if(index > 0) {
                filterExpr.push(isSelectAll ? 'and' : 'or');
            }

            if(isString(keyExpr)) {
                filterExprPart = getFilterForPlainKey(keyExpr, key);
            } else {
                filterExprPart = getFilterForCompositeKey(keyExpr, key);
            }

            filterExpr.push(filterExprPart);
        });

        if(filterExpr && filterExpr.length === 1) {
            filterExpr = filterExpr[0];
        }

        return filterExpr;
    };

    this.getCombinedFilter = function(keyExpr, dataSourceFilter, forceCombinedFilter = false) {
        const filterExpr = this.getExpr(keyExpr);
        let combinedFilter = filterExpr;

        if((forceCombinedFilter || isSelectAll) && dataSourceFilter) {
            if(filterExpr) {
                combinedFilter = [];
                combinedFilter.push(filterExpr);
                combinedFilter.push(dataSourceFilter);
            } else {
                combinedFilter = dataSourceFilter;
            }
        }

        return combinedFilter;
    };

    let selectedItemKeyHashesMap;

    const getSelectedItemKeyHashesMap = function(keyOf, keyExpr) {
        if(!selectedItemKeyHashesMap) {
            selectedItemKeyHashesMap = {};
            const normalizedKeys = normalizeKeys(selectedItemKeys, keyOf, keyExpr);
            for(let i = 0; i < normalizedKeys.length; i++) {
                selectedItemKeyHashesMap[getKeyHash(normalizedKeys[i])] = true;
            }
        }
        return selectedItemKeyHashesMap;
    };

    const normalizeKeys = function(keys, keyOf, keyExpr) {
        return Array.isArray(keyExpr) ? keys.map(key => keyOf(key)) : keys;
    };

    function functionFilter(equalKeys, keyOf, equalByReference, keyExpr, item) {
        const key = keyOf(item);
        let keyHash;
        let i;

        if(!equalByReference) {
            keyHash = getKeyHash(key);
            if(!isObject(keyHash)) {
                const selectedKeyHashesMap = getSelectedItemKeyHashesMap(keyOf, keyExpr);
                if(selectedKeyHashesMap[keyHash]) {
                    return !isSelectAll;
                }
                return !!isSelectAll;
            }
        }

        for(i = 0; i < selectedItemKeys.length; i++) {
            if(equalKeys(selectedItemKeys[i], key)) {
                return !isSelectAll;
            }
        }
        return !!isSelectAll;
    }

    function getFilterForPlainKey(keyExpr, keyValue) {
        if(keyValue === undefined) {
            return;
        }
        return [keyExpr, isSelectAll ? '<>' : '=', keyValue];
    }

    function getFilterForCompositeKey(keyExpr, itemKeyValue) {
        const filterExpr = [];

        for(let i = 0, length = keyExpr.length; i < length; i++) {
            const currentKeyExpr = keyExpr[i];
            const keyValueGetter = compileGetter(currentKeyExpr);
            const currentKeyValue = itemKeyValue && keyValueGetter(itemKeyValue);
            const filterExprPart = getFilterForPlainKey(currentKeyExpr, currentKeyValue);

            if(!filterExprPart) {
                break;
            }

            if(i > 0) {
                filterExpr.push(isSelectAll ? 'or' : 'and');
            }

            filterExpr.push(filterExprPart);
        }

        return filterExpr;
    }
};

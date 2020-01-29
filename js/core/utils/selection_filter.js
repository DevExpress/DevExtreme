const getKeyHash = require('./common').getKeyHash;
const equalByValue = require('./common').equalByValue;
const typeUtils = require('./type');

const SelectionFilterCreator = function(selectedItemKeys, isSelectAll) {

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

            if(typeUtils.isString(keyExpr)) {
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

    this.getCombinedFilter = function(keyExpr, dataSourceFilter) {
        const filterExpr = this.getExpr(keyExpr);
        let combinedFilter = filterExpr;

        if(isSelectAll && dataSourceFilter) {
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

    const getSelectedItemKeyHashesMap = function(selectedItemKeys) {
        if(!selectedItemKeyHashesMap) {
            selectedItemKeyHashesMap = {};
            for(let i = 0; i < selectedItemKeys.length; i++) {
                selectedItemKeyHashesMap[getKeyHash(selectedItemKeys[i])] = true;
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
            if(!typeUtils.isObject(keyHash)) {
                const selectedKeyHashesMap = getSelectedItemKeyHashesMap(normalizeKeys(selectedItemKeys, keyOf, keyExpr));
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
            const currentKeyValue = itemKeyValue && itemKeyValue[currentKeyExpr];
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

exports.SelectionFilterCreator = SelectionFilterCreator;

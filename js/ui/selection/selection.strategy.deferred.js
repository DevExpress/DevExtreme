const typeUtils = require('../../core/utils/type');
const SelectionStrategy = require('./selection.strategy');
const errors = require('../widget/ui.errors');
const dataQuery = require('../../data/query');
const Deferred = require('../../core/utils/deferred').Deferred;

module.exports = SelectionStrategy.inherit({

    getSelectedItems: function() {
        return this._loadFilteredData(this.options.selectionFilter);
    },

    getSelectedItemKeys: function() {
        const d = new Deferred();
        const that = this;
        const key = this.options.key();
        const select = typeUtils.isString(key) ? [key] : key;

        this._loadFilteredData(this.options.selectionFilter, null, select).done(function(items) {
            const keys = items.map(function(item) {
                return that.options.keyOf(item);
            });

            d.resolve(keys);
        }).fail(d.reject);

        return d.promise();
    },

    selectedItemKeys: function(keys, preserve, isDeselect, isSelectAll) {
        if(isSelectAll) {
            const filter = this.options.filter();
            const needResetSelectionFilter = !filter || JSON.stringify(filter) === JSON.stringify(this.options.selectionFilter) && isDeselect;

            if(needResetSelectionFilter) {
                this._setOption('selectionFilter', isDeselect ? [] : null);
            } else {
                this._addSelectionFilter(isDeselect, filter, isSelectAll);
            }

        } else {
            if(!preserve) {
                this._setOption('selectionFilter', []);
            }

            for(let i = 0; i < keys.length; i++) {
                if(isDeselect) {
                    this.removeSelectedItem(keys[i]);
                } else {
                    this.addSelectedItem(keys[i]);
                }
            }
        }

        this.onSelectionChanged();

        return new Deferred().resolve();
    },

    setSelectedItems: function(keys) {
        this._setOption('selectionFilter', null);
        for(let i = 0; i < keys.length; i++) {
            this.addSelectedItem(keys[i]);
        }
    },

    isItemDataSelected: function(itemData) {
        return this.isItemKeySelected(itemData);
    },

    isItemKeySelected: function(itemData) {
        const selectionFilter = this.options.selectionFilter;

        if(!selectionFilter) {
            return true;
        }

        return !!dataQuery([itemData]).filter(selectionFilter).toArray().length;
    },

    _getKeyExpr: function() {
        const keyField = this.options.key();
        if(Array.isArray(keyField) && keyField.length === 1) {
            return keyField[0];
        }
        return keyField;
    },

    _normalizeKey: function(key) {
        const keyExpr = this.options.key();
        if(Array.isArray(keyExpr) && keyExpr.length === 1) {
            return key[keyExpr[0]];
        }
        return key;
    },

    _getFilterByKey: function(key) {
        const keyField = this._getKeyExpr();
        let filter = [keyField, '=', this._normalizeKey(key)];

        if(Array.isArray(keyField)) {
            filter = [];
            for(let i = 0; i < keyField.length; i++) {
                filter.push([keyField[i], '=', key[keyField[i]]]);
                if(i !== keyField.length - 1) {
                    filter.push('and');
                }
            }
        }

        return filter;
    },

    addSelectedItem: function(key) {
        const filter = this._getFilterByKey(key);

        this._addSelectionFilter(false, filter);
    },

    removeSelectedItem: function(key) {
        const filter = this._getFilterByKey(key);

        this._addSelectionFilter(true, filter);
    },

    validate: function() {
        const key = this.options.key;

        if(key && key() === undefined) {
            throw errors.Error('E1042', 'Deferred selection');
        }
    },

    _findSubFilter: function(selectionFilter, filter) {
        if(!selectionFilter) return -1;
        const filterString = JSON.stringify(filter);

        for(let index = 0; index < selectionFilter.length; index++) {
            const subFilter = selectionFilter[index];
            if(subFilter && JSON.stringify(subFilter) === filterString) {
                return index;
            }
        }

        return -1;
    },

    _isLastSubFilter: function(selectionFilter, filter) {
        if(selectionFilter && filter) {
            return this._findSubFilter(selectionFilter, filter) === selectionFilter.length - 1 || this._findSubFilter([selectionFilter], filter) === 0;
        }
        return false;
    },

    _addFilterOperator: function(selectionFilter, filterOperator) {
        if(selectionFilter.length > 1 && typeUtils.isString(selectionFilter[1]) && selectionFilter[1] !== filterOperator) {
            selectionFilter = [selectionFilter];
        }
        if(selectionFilter.length) {
            selectionFilter.push(filterOperator);
        }
        return selectionFilter;
    },

    _denormalizeFilter: function(filter) {
        if(filter && typeUtils.isString(filter[0])) {
            filter = [filter];
        }
        return filter;
    },

    _addSelectionFilter: function(isDeselect, filter, isSelectAll) {
        const that = this;
        const currentFilter = isDeselect ? ['!', filter] : filter;
        const currentOperation = isDeselect ? 'and' : 'or';
        let needAddFilter = true;
        let selectionFilter = that.options.selectionFilter || [];

        selectionFilter = that._denormalizeFilter(selectionFilter);

        if(selectionFilter && selectionFilter.length) {
            that._removeSameFilter(selectionFilter, filter, isDeselect, isSelectAll);
            const filterIndex = that._removeSameFilter(selectionFilter, filter, !isDeselect);
            const isKeyOperatorsAfterRemoved = this._isKeyFilter(filter) && this._hasKeyFiltersOnlyStartingFromIndex(selectionFilter, filterIndex);

            needAddFilter = filter.length && !isKeyOperatorsAfterRemoved;

            if(needAddFilter) {
                selectionFilter = that._addFilterOperator(selectionFilter, currentOperation);
            }
        }

        if(needAddFilter) {
            selectionFilter.push(currentFilter);
        }

        selectionFilter = that._normalizeFilter(selectionFilter);

        that._setOption('selectionFilter', !isDeselect && !selectionFilter.length ? null : selectionFilter);
    },

    _normalizeFilter: function(filter) {
        if(filter && filter.length === 1) {
            filter = filter[0];
        }
        return filter;
    },

    _removeFilterByIndex: function(filter, filterIndex, isSelectAll) {
        const operation = filter[1];

        if(filterIndex > 0) {
            filter.splice(filterIndex - 1, 2);
        } else {
            filter.splice(filterIndex, 2);
        }

        if(isSelectAll && operation === 'and') {
            filter.splice(0, filter.length);
        }
    },
    _isSimpleKeyFilter: function(filter, key) {
        return filter.length === 3 && filter[0] === key && filter[1] === '=';
    },
    _isKeyFilter: function(filter) {
        if(filter.length === 2 && filter[0] === '!') {
            return this._isKeyFilter(filter[1]);
        }
        const keyField = this._getKeyExpr();

        if(Array.isArray(keyField)) {
            if(filter.length !== keyField.length * 2 - 1) {
                return false;
            }
            for(let i = 0; i < keyField.length; i++) {
                if(i > 0 && filter[i * 2 - 1] !== 'and') {
                    return false;
                }
                if(!this._isSimpleKeyFilter(filter[i * 2], keyField[i])) {
                    return false;
                }
            }
            return true;
        }

        return this._isSimpleKeyFilter(filter, keyField);
    },
    _hasKeyFiltersOnlyStartingFromIndex: function(selectionFilter, filterIndex) {
        if(filterIndex >= 0) {
            for(let i = filterIndex; i < selectionFilter.length; i++) {
                if(typeof selectionFilter[i] !== 'string' && !this._isKeyFilter(selectionFilter[i])) {
                    return false;
                }
            }

            return true;
        }

        return false;
    },
    _removeSameFilter: function(selectionFilter, filter, inverted, isSelectAll) {
        filter = inverted ? ['!', filter] : filter;

        if(JSON.stringify(filter) === JSON.stringify(selectionFilter)) {
            selectionFilter.splice(0, selectionFilter.length);
            return 0;
        }

        const filterIndex = this._findSubFilter(selectionFilter, filter);

        if(filterIndex >= 0) {
            this._removeFilterByIndex(selectionFilter, filterIndex, isSelectAll);
            return filterIndex;
        } else {
            for(let i = 0; i < selectionFilter.length; i++) {
                if(Array.isArray(selectionFilter[i]) && selectionFilter[i].length > 2) {
                    const filterIndex = this._removeSameFilter(selectionFilter[i], filter, false, isSelectAll);
                    if(filterIndex >= 0) {
                        if(!selectionFilter[i].length) {
                            this._removeFilterByIndex(selectionFilter, i, isSelectAll);
                        } else if(selectionFilter[i].length === 1) {
                            selectionFilter[i] = selectionFilter[i][0];
                        }
                        return filterIndex;
                    }
                }
            }
            return -1;
        }
    },

    getSelectAllState: function() {
        const filter = this.options.filter();
        let selectionFilter = this.options.selectionFilter;

        if(!selectionFilter) return true;
        if(!selectionFilter.length) return false;
        if(!filter || !filter.length) return undefined;

        selectionFilter = this._denormalizeFilter(selectionFilter);

        if(this._isLastSubFilter(selectionFilter, filter)) {
            return true;
        }

        if(this._isLastSubFilter(selectionFilter, ['!', filter])) {
            return false;
        }

        return undefined;
    }
});

var Class = require('../../core/class'),
    commonUtils = require('../../core/utils/common'),
    iteratorUtils = require('../../core/utils/iterator'),
    each = require('../../core/utils/iterator').each,
    typeUtils = require('../../core/utils/type'),
    extend = require('../../core/utils/extend').extend,
    errors = require('../../ui/widget/ui.errors'),
    getOperationBySearchMode = require('../../ui/widget/ui.search_box_mixin').getOperationBySearchMode,
    inArray = require('../../core/utils/array').inArray,
    query = require('../../data/query'),
    storeHelper = require('../../data/store_helper'),
    HierarchicalDataConverter = require('./ui.data_converter');

var EXPANDED = 'expanded',
    SELECTED = 'selected',
    DISABLED = 'disabled';

var DataAdapter = Class.inherit({

    ctor: function(options) {
        this.options = {};
        extend(this.options, this._defaultOptions(), options);
        this.options.dataConverter.setDataAccessors(this.options.dataAccessors);

        this._selectedNodesKeys = [];
        this._expandedNodesKeys = [];
        this._dataStructure = [];

        this._createInternalDataStructure();
        this.getTreeNodes();
    },

    setOption: function(name, value) {
        this.options[name] = value;

        if(name === 'recursiveSelection') {
            this._updateSelection();
        }
    },

    _defaultOptions: function() {
        return {
            dataAccessors: undefined,
            items: [],
            multipleSelection: true,
            recursiveSelection: false,
            recursiveExpansion: false,
            rootValue: 0,
            searchValue: '',
            dataType: 'tree',
            searchMode: 'contains',
            dataConverter: new HierarchicalDataConverter(),
            onNodeChanged: commonUtils.noop,
            sort: null
        };
    },

    _createInternalDataStructure: function() {
        this._initialDataStructure = this.options.dataConverter.createPlainStructure(this.options.items, this.options.rootValue, this.options.dataType);
        this._dataStructure = this.options.searchValue.length ? this.search(this.options.searchValue) : this._initialDataStructure;
        this.options.dataConverter._dataStructure = this._dataStructure;

        this._updateSelection();
        this._updateExpansion();
    },

    _updateSelection: function() {
        if(this.options.recursiveSelection) {
            this._setChildrenSelection();
            this._setParentSelection();
        }

        this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);
    },

    _updateExpansion: function(key) {
        if(this.options.recursiveExpansion) {
            key ? this._updateOneBranch(key) : this._setParentExpansion();
        }

        this._expandedNodesKeys = this._updateNodesKeysArray(EXPANDED);
    },

    _updateNodesKeysArray: function(property) {
        var that = this,
            array = [];

        each(that._getDataBySelectionMode(), function(_, node) {
            if(!that._isNodeVisible(node)) {
                return;
            }

            if(node.internalFields[property]) {
                if(property === EXPANDED || that.options.multipleSelection) {
                    array.push(node.internalFields.key);
                } else {
                    array.length && that.toggleSelection(array[0], false, true);
                    array = [node.internalFields.key];
                }
            }
        });

        return array;
    },

    _getDataBySelectionMode: function() {
        return this.options.multipleSelection ? this.getData() : this.getFullData();
    },

    _isNodeVisible: function(node) {
        return node.internalFields.item.visible !== false;
    },

    _getByKey: function(data, key) {
        return data === this._dataStructure ?
            this.options.dataConverter._getByKey(key) :
            this.options.dataConverter.getByKey(data, key);
    },

    _setChildrenSelection: function() {
        var that = this;

        each(this._dataStructure, function(_, node) {
            if(!node.internalFields.childrenKeys.length) {
                return;
            }

            var isSelected = node.internalFields.selected;
            isSelected === true && that._toggleChildrenSelection(node, isSelected);
        });
    },

    _setParentSelection: function() {
        var that = this;

        each(this._dataStructure, function(_, node) {
            var parent = that.options.dataConverter.getParentNode(node);

            if(parent && node.internalFields.parentKey !== that.options.rootValue) {
                that._iterateParents(node, function(parent) {
                    var newParentState = that._calculateSelectedState(parent);
                    that._setFieldState(parent, SELECTED, newParentState);
                });
            }
        });
    },

    _setParentExpansion: function() {
        var that = this;

        each(this._dataStructure, function(_, node) {
            if(!node.internalFields.expanded) {
                return;
            }

            that._updateOneBranch(node.internalFields.key);
        });
    },

    _updateOneBranch: function(key) {
        var that = this,
            node = this.getNodeByKey(key);

        that._iterateParents(node, function(parent) {
            that._setFieldState(parent, EXPANDED, true);
        });
    },

    _iterateChildren: function(node, recursive, callback, processedKeys) {
        if(!typeUtils.isFunction(callback)) {
            return;
        }

        const that = this;
        const nodeKey = node.internalFields.key;
        processedKeys = processedKeys || [];
        if(processedKeys.indexOf(nodeKey) === -1) {
            processedKeys.push(nodeKey);
            each(node.internalFields.childrenKeys, function(_, key) {
                let child = that.getNodeByKey(key);
                callback(child);
                if(child.internalFields.childrenKeys.length && recursive) {
                    that._iterateChildren(child, recursive, callback, processedKeys);
                }
            });
        }
    },

    _iterateParents: function(node, callback, processedKeys) {
        if(node.internalFields.parentKey === this.options.rootValue || !typeUtils.isFunction(callback)) {
            return;
        }
        processedKeys = processedKeys || [];
        const key = node.internalFields.key;

        if(processedKeys.indexOf(key) === -1) {
            processedKeys.push(key);
            let parent = this.options.dataConverter.getParentNode(node);
            if(parent) {
                callback(parent);
                if(parent.internalFields.parentKey !== this.options.rootValue) {
                    this._iterateParents(parent, callback, processedKeys);
                }
            }
        }
    },

    _calculateSelectedState: function(node) {
        var itemsCount = node.internalFields.childrenKeys.length,
            selectedItemsCount = 0,
            invisibleItemsCount = 0,
            result = false;

        for(var i = 0; i <= itemsCount - 1; i++) {
            var childNode = this.getNodeByKey(node.internalFields.childrenKeys[i]),
                isChildInvisible = childNode.internalFields.item.visible === false,
                childState = childNode.internalFields.selected;

            if(isChildInvisible) {
                invisibleItemsCount++;
                continue;
            }

            if(childState) {
                selectedItemsCount++;
            } else if(childState === undefined) {
                selectedItemsCount += 0.5;
            }
        }

        if(selectedItemsCount) {
            result = selectedItemsCount === itemsCount - invisibleItemsCount ? true : undefined;
        }

        return result;
    },

    _toggleChildrenSelection: function(node, state) {
        var that = this;

        this._iterateChildren(node, true, function(child) {
            if(that._isNodeVisible(child)) {
                that._setFieldState(child, SELECTED, state);
            }
        });
    },

    _setFieldState: function(node, field, state) {
        if(node.internalFields[field] === state) {
            return;
        }

        node.internalFields[field] = state;
        if(node.internalFields.publicNode) {
            node.internalFields.publicNode[field] = state;
        }
        this.options.dataAccessors.setters[field](node.internalFields.item, state);

        this.options.onNodeChanged(node);
    },

    _markChildren: function(keys) {
        var that = this;

        each(keys, function(_, key) {
            var index = that.getIndexByKey(key),
                node = that.getNodeByKey(key);
            that._dataStructure[index] = 0;
            node.internalFields.childrenKeys.length && that._markChildren(node.internalFields.childrenKeys);
        });
    },

    _removeNode: function(key) {
        var node = this.getNodeByKey(key);

        this._dataStructure[this.getIndexByKey(key)] = 0;
        this._markChildren(node.internalFields.childrenKeys);

        var that = this,
            counter = 0,
            items = extend([], this._dataStructure);
        each(items, function(index, item) {
            if(!item) {
                that._dataStructure.splice(index - counter, 1);
                counter++;
            }
        });
    },

    _addNode: function(item) {
        var dataConverter = this.options.dataConverter,
            node = dataConverter._convertItemToNode(item, this.options.dataAccessors.getters.parentKey(item));

        this._dataStructure = this._dataStructure.concat(node);
        this._initialDataStructure = this._initialDataStructure.concat(node);
        dataConverter._dataStructure = dataConverter._dataStructure.concat(node);
    },

    _updateFields: function() {
        this.options.dataConverter.updateChildrenKeys();
        this._updateSelection();
        this._updateExpansion();
    },

    getSelectedNodesKeys: function() {
        return this._selectedNodesKeys;
    },

    getExpandedNodesKeys: function() {
        return this._expandedNodesKeys;
    },

    getData: function() {
        return this._dataStructure;
    },

    getFullData: function() {
        return this._initialDataStructure;
    },

    getNodeByItem: function(item) {
        var result = null;

        each(this._dataStructure, function(_, node) {
            if(node.internalFields.item === item) {
                result = node;
                return false;
            }
        });

        return result;
    },

    getNodesByItems: function(items) {
        var that = this,
            nodes = [];

        each(items, function(_, item) {
            var node = that.getNodeByItem(item);
            node && nodes.push(node);
        });

        return nodes;
    },

    getNodeByKey: function(key, data) {
        return this._getByKey(data || this._getDataBySelectionMode(), key);
    },

    getTreeNodes: function() {
        return this.options.dataConverter.convertToPublicNodes(this.getRootNodes());
    },

    getItemsCount: function() {
        return this.options.dataConverter.getItemsCount();
    },

    getVisibleItemsCount: function() {
        return this.options.dataConverter.getVisibleItemsCount();
    },

    getPublicNode: function(node) {
        return node.internalFields.publicNode;
    },

    getRootNodes: function() {
        return this.getChildrenNodes(this.options.rootValue);
    },

    getChildrenNodes: function(parentKey) {
        return query(this._dataStructure).filter(['internalFields.parentKey', parentKey]).toArray();
    },

    getIndexByKey: function(key) {
        return this.options.dataConverter.getIndexByKey(key);
    },

    addItem: function(item) {
        this._addNode(item);
        this._updateFields();
    },

    removeItem: function(key) {
        this._removeNode(key);
        this._updateFields();
    },

    toggleSelection: function(key, state, selectRecursive) {
        var isSingleModeUnselect = this._isSingleModeUnselect(state),
            node = this._getByKey(selectRecursive || isSingleModeUnselect ? this._initialDataStructure : this._dataStructure, key);
        this._setFieldState(node, SELECTED, state);

        if(this.options.recursiveSelection && !selectRecursive) {
            state ? this._setChildrenSelection() : this._toggleChildrenSelection(node, state);
            this._setParentSelection();
        }

        this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);
    },

    _isSingleModeUnselect: function(selectionState) {
        return !this.options.multipleSelection && !selectionState;
    },

    toggleNodeDisabledState: function(key, state) {
        var node = this.getNodeByKey(key);
        this._setFieldState(node, DISABLED, state);
    },

    toggleSelectAll: function(state) {
        if(!typeUtils.isDefined(state)) {
            return;
        }

        var that = this,
            lastSelectedKey = that._selectedNodesKeys[that._selectedNodesKeys.length - 1],
            dataStructure = that._isSingleModeUnselect(state) ? this._initialDataStructure : this._dataStructure;

        each(dataStructure, function(index, node) {
            if(!that._isNodeVisible(node)) {
                return;
            }

            that._setFieldState(node, SELECTED, state);
        });

        that._selectedNodesKeys = that._updateNodesKeysArray(SELECTED);

        if(!state && that.options.selectionRequired) {
            that.toggleSelection(lastSelectedKey, true);
        }
    },

    isAllSelected: function() {
        if(this.getSelectedNodesKeys().length) {
            return this.getSelectedNodesKeys().length === this.getVisibleItemsCount() ? true : undefined;
        } else {
            return false;
        }
    },

    toggleExpansion: function(key, state) {
        var node = this.getNodeByKey(key);
        this._setFieldState(node, EXPANDED, state);
        if(state) {
            this._updateExpansion(key);
        }
        this._expandedNodesKeys = this._updateNodesKeysArray(EXPANDED);
    },

    isFiltered: function(item) {
        return !this.options.searchValue.length || !!this._filterDataStructure(this.options.searchValue, [item]).length;
    },

    _createCriteria: function(selector, value, operation) {
        var searchFilter = [];
        if(!Array.isArray(selector)) {
            return [selector, operation, value];
        }
        iteratorUtils.each(selector, function(i, item) {
            searchFilter.push([item, operation, value], 'or');
        });

        searchFilter.pop();
        return searchFilter;
    },

    _filterDataStructure: function(filterValue, dataStructure) {
        var selector = this.options.searchExpr || this.options.dataAccessors.getters.display,
            operation = getOperationBySearchMode(this.options.searchMode),
            criteria = this._createCriteria(selector, filterValue, operation);

        dataStructure = dataStructure || this._initialDataStructure;

        return query(dataStructure).filter(criteria).toArray();
    },

    search: function(searchValue) {
        var that = this,
            matches = this._filterDataStructure(searchValue),
            dataConverter = this.options.dataConverter;

        function lookForParents(matches, index) {

            var length = matches.length;

            while(index < length) {
                var node = matches[index];

                if(node.internalFields.parentKey === that.options.rootValue) {
                    index++;
                    continue;
                }

                var parent = dataConverter.getParentNode(node);

                if(!parent) {
                    errors.log('W1007', node.internalFields.parentKey, node.internalFields.key);
                    index++;
                    continue;
                }

                if(!parent.internalFields.expanded) {
                    that._setFieldState(parent, EXPANDED, true);
                }

                if(inArray(parent, matches) > -1) {
                    index++;
                    continue;
                }

                matches.splice(index, 0, parent);
                lookForParents(matches, index);
            }
        }

        lookForParents(matches, 0);

        if(this.options.sort) {
            matches = storeHelper
                .queryByOptions(query(matches), { sort: this.options.sort })
                .toArray();
        }

        dataConverter._indexByKey = {};
        each(matches, function(index, node) {
            node.internalFields.childrenKeys = [];
            dataConverter._indexByKey[node.internalFields.key] = index;
        });

        dataConverter._dataStructure = matches;
        dataConverter.setChildrenKeys();

        return dataConverter._dataStructure;
    }

});

module.exports = DataAdapter;

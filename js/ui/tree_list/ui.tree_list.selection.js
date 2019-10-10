import $ from '../../core/renderer';
import treeListCore from './ui.tree_list.core';
import { equalByComplexValue } from '../../core/utils/data';
import { noop } from '../../core/utils/common';
import selectionModule from '../grid_core/ui.grid_core.selection';
import errors from '../widget/ui.errors';
import { extend } from '../../core/utils/extend';

var TREELIST_SELECT_ALL_CLASS = "dx-treelist-select-all",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    SELECT_CHECKBOX_CLASS = "dx-select-checkbox";

var originalRowClick = selectionModule.extenders.views.rowsView._rowClick,
    originalHandleDataChanged = selectionModule.extenders.controllers.data._handleDataChanged;

var nodeExists = function(array, currentKey) {
    return !!array.filter(function(key) { return key === currentKey; }).length;
};

treeListCore.registerModule("selection", extend(true, {}, selectionModule, {
    defaultOptions: function() {
        return extend(true, selectionModule.defaultOptions(), {
            selection: {
                showCheckBoxesMode: "always",
                /**
                 * @name dxTreeListOptions.selection.recursive
                 * @type boolean
                 * @default false
                 */
                recursive: false
            }
        });
    },
    extenders: {
        controllers: {
            data: {
                _handleDataChanged: function(e) {
                    var selectionController = this.getController("selection"),
                        isRecursiveSelection = selectionController.isRecursiveSelection();

                    if(isRecursiveSelection && (!e || e.changeType !== "updateSelectionState")) {
                        selectionController.updateSelectionState({
                            selectedItemKeys: this.option("selectedRowKeys")
                        });
                    }
                    originalHandleDataChanged.apply(this, arguments);
                },

                loadDescendants: function() {
                    var that = this,
                        d = that.callBase.apply(that, arguments),
                        selectionController = that.getController("selection"),
                        isRecursiveSelection = selectionController.isRecursiveSelection();

                    if(isRecursiveSelection) {
                        d.done(function() {
                            selectionController.updateSelectionState({
                                selectedItemKeys: that.option("selectedRowKeys")
                            });
                        });
                    }

                    return d;
                }
            },

            selection: {
                init: function() {
                    this.callBase.apply(this, arguments);
                    this._selectionStateByKey = {};
                },

                _getSelectionConfig: function() {
                    let config = this.callBase.apply(this, arguments);

                    var plainItems = config.plainItems;
                    config.plainItems = (all) => {
                        if(all) {
                            return this._dataController.getCachedStoreData() || [];
                        }

                        return plainItems.apply(this, arguments).map(item => item.data);
                    };
                    config.isItemSelected = (item) => {
                        let key = this._dataController.keyOf(item);

                        return this.isRowSelected(key);
                    };
                    config.isSelectableItem = () => {
                        return true;
                    };
                    config.getItemData = (item) => {
                        return item;
                    };

                    return config;
                },

                renderSelectCheckBoxContainer: function($container, model) {
                    var that = this,
                        rowsView = that.component.getView("rowsView");

                    $container.addClass(CELL_FOCUS_DISABLED_CLASS);

                    var $checkbox = rowsView._renderSelectCheckBox($container, {
                        value: model.row.isSelected,
                        row: model.row,
                        column: model.column
                    });

                    rowsView._attachCheckBoxClickEvent($checkbox);
                },

                _updateSelectColumn: noop,

                _getVisibleNodeKeys: function(isRecursiveSelection) {
                    var component = this.component,
                        root = component.getRootNode(),
                        cache = {},
                        keys = [];

                    root && treeListCore.foreachNodes(root.children, function(node) {
                        if(node.key !== undefined && (node.visible || isRecursiveSelection)) {
                            keys.push(node.key);
                        }

                        return isRecursiveSelection ? false : component.isRowExpanded(node.key, cache);
                    });

                    return keys;
                },

                isSelectAll: function() {
                    var component = this.component,
                        hasIndeterminateState,
                        visibleKeys = this._getVisibleNodeKeys();

                    var selectedVisibleKeys = visibleKeys.filter(function(key) {
                        return component.isRowSelected(key);
                    });

                    if(!selectedVisibleKeys.length) {
                        hasIndeterminateState = visibleKeys.some(function(key) {
                            return component.isRowSelected(key) === undefined;
                        });

                        return hasIndeterminateState ? undefined : false;
                    } else if(selectedVisibleKeys.length === visibleKeys.length) {
                        return true;
                    }
                },

                selectAll: function() {
                    var that = this,
                        isRecursiveSelection = that.isRecursiveSelection(),
                        visibleKeys = that._getVisibleNodeKeys(isRecursiveSelection).filter(function(key) {
                            return !that.isRowSelected(key);
                        });

                    return that.selectRows(visibleKeys, true);
                },

                deselectAll: function() {
                    var isRecursiveSelection = this.isRecursiveSelection(),
                        visibleKeys = this._getVisibleNodeKeys(isRecursiveSelection);

                    return this.deselectRows(visibleKeys);
                },

                selectedItemKeys: function(value, preserve, isDeselect, isSelectAll) {
                    var that = this,
                        selectedRowKeys = that.option("selectedRowKeys"),
                        isRecursiveSelection = this.isRecursiveSelection(),
                        normalizedArgs = isRecursiveSelection && that._normalizeSelectionArgs({
                            keys: value || []
                        }, !isDeselect);

                    if(normalizedArgs && !equalByComplexValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
                        that._isSelectionNormalizing = true;
                        return this.callBase(normalizedArgs.selectedRowKeys, false, false, false)
                            .always(function() {
                                that._isSelectionNormalizing = false;
                            })
                            .done(function(items) {
                                normalizedArgs.selectedRowsData = items;
                                that._fireSelectionChanged(normalizedArgs);
                            });
                    }

                    return this.callBase(value, preserve, isDeselect, isSelectAll);
                },

                changeItemSelection: function(itemIndex, keyboardKeys) {
                    var isRecursiveSelection = this.isRecursiveSelection();

                    if(isRecursiveSelection && !keyboardKeys.shift) {
                        var key = this._dataController.getKeyByRowIndex(itemIndex);
                        return this.selectedItemKeys(key, true, this.isRowSelected(key));
                    }

                    return this.callBase.apply(this, arguments);
                },

                _updateParentSelectionState: function(node, isSelected) {
                    var that = this,
                        state = isSelected,
                        parentNode = node.parent,
                        hasNonSelectedState,
                        hasSelectedState;

                    if(parentNode) {
                        if(parentNode.children.length > 1) {
                            if(isSelected === false) {
                                hasSelectedState = parentNode.children.some(function(childNode, index, children) {
                                    return that._selectionStateByKey[childNode.key];
                                });

                                state = hasSelectedState ? undefined : false;
                            } else if(isSelected === true) {
                                hasNonSelectedState = parentNode.children.some(function(childNode) {
                                    return !that._selectionStateByKey[childNode.key];
                                });

                                state = hasNonSelectedState ? undefined : true;
                            }
                        }

                        this._selectionStateByKey[parentNode.key] = state;

                        if(parentNode.parent && parentNode.parent.level >= 0) {
                            this._updateParentSelectionState(parentNode, state);
                        }
                    }
                },

                _updateChildrenSelectionState: function(node, isSelected) {
                    var that = this,
                        children = node.children;

                    children && children.forEach(function(childNode) {
                        that._selectionStateByKey[childNode.key] = isSelected;

                        if(childNode.children.length > 0) {
                            that._updateChildrenSelectionState(childNode, isSelected);
                        }
                    });
                },

                _updateSelectionStateCore: function(keys, isSelected) {
                    var node,
                        dataController = this._dataController;

                    for(var i = 0; i < keys.length; i++) {
                        this._selectionStateByKey[keys[i]] = isSelected;
                        node = dataController.getNodeByKey(keys[i]);

                        if(node) {
                            this._updateParentSelectionState(node, isSelected);
                            this._updateChildrenSelectionState(node, isSelected);
                        }
                    }
                },

                _getSelectedParentKeys: function(key, selectedItemKeys, useCash) {
                    var isSelected,
                        selectedParentNode,
                        node = this._dataController.getNodeByKey(key),
                        parentNode = node && node.parent,
                        result = [];

                    while(parentNode && parentNode.level >= 0) {
                        result.unshift(parentNode.key);
                        isSelected = useCash ? !nodeExists(selectedItemKeys, parentNode.key) && this.isRowSelected(parentNode.key) : selectedItemKeys.indexOf(parentNode.key) >= 0;

                        if(isSelected) {
                            selectedParentNode = parentNode;
                            result = this._getSelectedParentKeys(selectedParentNode.key, selectedItemKeys, useCash).concat(result);
                            break;
                        } else if(useCash) {
                            break;
                        }

                        parentNode = parentNode.parent;
                    }

                    return selectedParentNode && result || [];
                },

                _getSelectedChildKeys: function(node, keysToIgnore) {
                    var that = this,
                        childKeys = [];

                    node && treeListCore.foreachNodes(node.children, function(childNode) {
                        var ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);

                        if(ignoreKeyIndex < 0) {
                            childKeys.push(childNode.key);
                        }

                        return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && that._selectionStateByKey[childNode.key] === undefined;
                    });

                    return childKeys;
                },

                _normalizeParentKeys: function(key, args) {
                    var that = this,
                        index,
                        childKeys,
                        parentNode,
                        keysToIgnore = [key],
                        parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);

                    if(parentNodeKeys.length) {
                        keysToIgnore = keysToIgnore.concat(parentNodeKeys);

                        keysToIgnore.forEach(function(key) {
                            index = args.selectedRowKeys.indexOf(key);

                            if(index >= 0) {
                                args.selectedRowKeys.splice(index, 1);
                            }
                        });

                        parentNode = that._dataController.getNodeByKey(parentNodeKeys[0]);
                        childKeys = that._getSelectedChildKeys(parentNode, keysToIgnore);
                        args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
                    }
                },

                _normalizeChildrenKeys: function(key, args) {
                    var that = this,
                        index,
                        node = that._dataController.getNodeByKey(key);

                    node && node.children.forEach(function(childNode) {
                        index = args.selectedRowKeys.indexOf(childNode.key);
                        if(index >= 0) {
                            args.selectedRowKeys.splice(index, 1);
                        }

                        that._normalizeChildrenKeys(childNode.key, args);
                    });
                },

                _normalizeSelectedRowKeysCore: function(keys, args, isSelect) {
                    var that = this,
                        index;

                    keys.forEach(function(key) {
                        if(that.isRowSelected(key) === isSelect) {
                            return;
                        }

                        that._normalizeChildrenKeys(key, args);
                        index = args.selectedRowKeys.indexOf(key);

                        if(isSelect) {
                            if(index < 0) {
                                args.selectedRowKeys.push(key);
                            }
                            args.currentSelectedRowKeys.push(key);
                        } else {
                            if(index >= 0) {
                                args.selectedRowKeys.splice(index, 1);
                            }
                            args.currentDeselectedRowKeys.push(key);
                            that._normalizeParentKeys(key, args);
                        }
                    });
                },

                _normalizeSelectionArgs: function(args, isSelect) {
                    var result,
                        keys = Array.isArray(args.keys) ? args.keys : [args.keys],
                        selectedRowKeys = this.option("selectedRowKeys") || [];

                    if(keys.length) {
                        result = {
                            currentSelectedRowKeys: [],
                            currentDeselectedRowKeys: [],
                            selectedRowKeys: selectedRowKeys.slice(0)
                        };

                        this._normalizeSelectedRowKeysCore(keys, result, isSelect);
                    }

                    return result;
                },

                _updateSelectedItems: function(args) {
                    this.updateSelectionState(args);
                    this.callBase(args);
                },

                _fireSelectionChanged: function() {
                    if(!this._isSelectionNormalizing) {
                        this.callBase.apply(this, arguments);
                    }
                },

                _isModeLeavesOnly: function(mode) {
                    return mode === "leavesOnly" || mode === true;
                },

                _getAllSelectedRowKeys: function(parentKeys) {
                    var that = this,
                        result = [];
                    parentKeys.forEach(function(key) {
                        var insertIndex = result.length,
                            parentKeys = that._getSelectedParentKeys(key, result, true),
                            childKeys = that._dataController.getChildNodeKeys(key);

                        result.splice.apply(result, [insertIndex, 0].concat(parentKeys));
                        result.push(key);
                        result = result.concat(childKeys);
                    });

                    return result;
                },

                _getParentSelectedRowKeys: function(keys) {
                    var that = this,
                        result = [];

                    keys.forEach(key => {
                        const parentKeys = that._getSelectedParentKeys(key, keys);
                        !parentKeys.length && result.push(key);
                    });

                    return result;
                },

                _getLeafSelectedRowKeys: function(keys) {
                    var that = this,
                        result = [],
                        dataController = that._dataController;

                    keys.forEach(function(key) {
                        var node = dataController.getNodeByKey(key);
                        node && !node.hasChildren && result.push(key);
                    });

                    return result;
                },

                isRecursiveSelection: function() {
                    var selectionMode = this.option("selection.mode"),
                        isRecursive = this.option("selection.recursive");

                    return selectionMode === "multiple" && isRecursive;
                },

                updateSelectionState: function(options) {
                    var removedItemKeys = options.removedItemKeys || [],
                        selectedItemKeys = options.selectedItemKeys || [];

                    this._updateSelectionStateCore(removedItemKeys, false);
                    this._updateSelectionStateCore(selectedItemKeys, true);
                },

                isRowSelected: function(key) {
                    var result = this.callBase.apply(this, arguments),
                        isRecursiveSelection = this.isRecursiveSelection();

                    if(!result && isRecursiveSelection) {
                        if(key in this._selectionStateByKey) {
                            return this._selectionStateByKey[key];
                        }
                        return false;
                    }

                    return result;
                },

                /**
                * @name dxTreeListMethods.getSelectedRowKeys
                * @publicName getSelectedRowKeys(leavesOnly)
                * @param1 leavesOnly:boolean
                * @return Array<any>
                * @deprecated
                */

                /**
                * @name dxTreeListMethods.getSelectedRowKeys
                * @publicName getSelectedRowKeys(mode)
                * @param1 mode:string
                * @return Array<any>
                */
                getSelectedRowKeys(mode) {
                    var that = this;

                    if(!that._dataController) {
                        return [];
                    }

                    if(mode === true) {
                        errors.log("W0002", "dxTreeList", "getSelectedRowKeys(leavesOnly)", "18.1", "Use the 'getSelectedRowKeys(mode)' method with a string parameter instead");
                    }

                    var selectedRowKeys = that.callBase.apply(that, arguments);

                    if(mode) {
                        if(this.isRecursiveSelection()) {
                            selectedRowKeys = this._getAllSelectedRowKeys(selectedRowKeys);
                        }

                        if(mode !== "all") {
                            if(mode === "excludeRecursive") {
                                selectedRowKeys = that._getParentSelectedRowKeys(selectedRowKeys);
                            } else if(that._isModeLeavesOnly(mode)) {
                                selectedRowKeys = that._getLeafSelectedRowKeys(selectedRowKeys);
                            }
                        }
                    }
                    return selectedRowKeys;
                },

                /**
                * @name dxTreeListMethods.getSelectedRowsData
                * @publicName getSelectedRowsData()
                * @return Array<any>
                */
                /**
                * @name dxTreeListMethods.getSelectedRowsData
                * @publicName getSelectedRowsData(mode)
                * @param1 mode:string
                * @return Array<any>
                */
                getSelectedRowsData: function(mode) {
                    var that = this,
                        dataController = that._dataController,
                        selectedKeys = this.getSelectedRowKeys(mode) || [],
                        selectedRowsData = [];

                    selectedKeys.forEach(function(key) {
                        var node = dataController.getNodeByKey(key);
                        node && selectedRowsData.push(node.data);
                    });

                    return selectedRowsData;
                },

                refresh: function() {
                    this._selectionStateByKey = {};
                    return this.callBase.apply(this, arguments);
                }
            }
        },
        views: {
            columnHeadersView: {
                _processTemplate: function(template, options) {
                    var that = this,
                        resultTemplate,
                        renderingTemplate = this.callBase(template, options);

                    var firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

                    if(renderingTemplate && options.rowType === "header" && options.column.index === firstDataColumnIndex) {
                        resultTemplate = {
                            render: function(options) {
                                if(that.option("selection.mode") === "multiple") {
                                    that.renderSelectAll(options.container, options.model);
                                }

                                renderingTemplate.render(options);
                            }
                        };
                    } else {
                        resultTemplate = renderingTemplate;
                    }

                    return resultTemplate;
                },

                renderSelectAll: function($cell, options) {
                    $cell.addClass(TREELIST_SELECT_ALL_CLASS);

                    this._renderSelectAllCheckBox($cell);
                },

                _isSortableElement: function($target) {
                    return this.callBase($target) && !$target.closest("." + SELECT_CHECKBOX_CLASS).length;
                }
            },

            rowsView: {
                _renderExpandIcon: function($container, options) {
                    var $iconContainer = this.callBase($container, options);

                    if(this.option("selection.mode") === "multiple") {
                        this.getController("selection").renderSelectCheckBoxContainer($iconContainer, options);
                    }

                    return $iconContainer;
                },

                _rowClick: function(e) {
                    var $targetElement = $(e.event.target);

                    if(this.isExpandIcon($targetElement)) {
                        this.callBase.apply(this, arguments);
                    } else {
                        originalRowClick.apply(this, arguments);
                    }
                }
            }
        }
    }
}));

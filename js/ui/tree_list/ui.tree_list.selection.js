import $ from '../../core/renderer';
import treeListCore from './ui.tree_list.core';
import { noop, equalByValue } from '../../core/utils/common';
import selectionModule from '../grid_core/ui.grid_core.selection';
import errors from '../widget/ui.errors';
import { extend } from '../../core/utils/extend';

const TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';

const originalRowClick = selectionModule.extenders.views.rowsView._rowClick;
const originalHandleDataChanged = selectionModule.extenders.controllers.data._handleDataChanged;

const nodeExists = function(array, currentKey) {
    return !!array.filter(function(key) { return key === currentKey; }).length;
};

treeListCore.registerModule('selection', extend(true, {}, selectionModule, {
    defaultOptions: function() {
        return extend(true, selectionModule.defaultOptions(), {
            selection: {
                showCheckBoxesMode: 'always',
                recursive: false
            }
        });
    },
    extenders: {
        controllers: {
            data: {
                _handleDataChanged: function(e) {
                    const selectionController = this.getController('selection');
                    const isRecursiveSelection = selectionController.isRecursiveSelection();

                    if(isRecursiveSelection && (!e || e.changeType !== 'updateSelectionState')) {
                        selectionController.updateSelectionState({
                            selectedItemKeys: this.option('selectedRowKeys')
                        });
                    }
                    originalHandleDataChanged.apply(this, arguments);
                },

                loadDescendants: function() {
                    const that = this;
                    const d = that.callBase.apply(that, arguments);
                    const selectionController = that.getController('selection');
                    const isRecursiveSelection = selectionController.isRecursiveSelection();

                    if(isRecursiveSelection) {
                        d.done(function() {
                            selectionController.updateSelectionState({
                                selectedItemKeys: that.option('selectedRowKeys')
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
                    const config = this.callBase.apply(this, arguments);

                    const plainItems = config.plainItems;
                    config.plainItems = (all) => {
                        if(all) {
                            return this._dataController.getCachedStoreData() || [];
                        }

                        return plainItems.apply(this, arguments).map(item => item.data);
                    };
                    config.isItemSelected = (item) => {
                        const key = this._dataController.keyOf(item);

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
                    const that = this;
                    const rowsView = that.component.getView('rowsView');

                    $container.addClass(CELL_FOCUS_DISABLED_CLASS);

                    const $checkbox = rowsView._renderSelectCheckBox($container, {
                        value: model.row.isSelected,
                        row: model.row,
                        column: model.column
                    });

                    rowsView._attachCheckBoxClickEvent($checkbox);
                },

                _updateSelectColumn: noop,

                _getVisibleNodeKeys: function(isRecursiveSelection) {
                    const component = this.component;
                    const root = component.getRootNode();
                    const cache = {};
                    const keys = [];

                    root && treeListCore.foreachNodes(root.children, function(node) {
                        if(node.key !== undefined && (node.visible || isRecursiveSelection)) {
                            keys.push(node.key);
                        }

                        return isRecursiveSelection ? false : component.isRowExpanded(node.key, cache);
                    });

                    return keys;
                },

                isSelectAll: function() {
                    const component = this.component;
                    let hasIndeterminateState;
                    const visibleKeys = this._getVisibleNodeKeys();

                    const selectedVisibleKeys = visibleKeys.filter(function(key) {
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
                    const that = this;
                    const isRecursiveSelection = that.isRecursiveSelection();
                    const visibleKeys = that._getVisibleNodeKeys(isRecursiveSelection).filter(function(key) {
                        return !that.isRowSelected(key);
                    });

                    return that.selectRows(visibleKeys, true);
                },

                deselectAll: function() {
                    const isRecursiveSelection = this.isRecursiveSelection();
                    const visibleKeys = this._getVisibleNodeKeys(isRecursiveSelection);

                    return this.deselectRows(visibleKeys);
                },

                selectedItemKeys: function(value, preserve, isDeselect, isSelectAll) {
                    const that = this;
                    const selectedRowKeys = that.option('selectedRowKeys');
                    const isRecursiveSelection = this.isRecursiveSelection();
                    const normalizedArgs = isRecursiveSelection && that._normalizeSelectionArgs({
                        keys: value || []
                    }, !isDeselect);

                    if(normalizedArgs && !equalByValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
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
                    const isRecursiveSelection = this.isRecursiveSelection();

                    if(isRecursiveSelection && !keyboardKeys.shift) {
                        const key = this._dataController.getKeyByRowIndex(itemIndex);
                        return this.selectedItemKeys(key, true, this.isRowSelected(key));
                    }

                    return this.callBase.apply(this, arguments);
                },

                _updateParentSelectionState: function(node, isSelected) {
                    const that = this;
                    let state = isSelected;
                    const parentNode = node.parent;
                    let hasNonSelectedState;
                    let hasSelectedState;

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
                    const that = this;
                    const children = node.children;

                    children && children.forEach(function(childNode) {
                        that._selectionStateByKey[childNode.key] = isSelected;

                        if(childNode.children.length > 0) {
                            that._updateChildrenSelectionState(childNode, isSelected);
                        }
                    });
                },

                _updateSelectionStateCore: function(keys, isSelected) {
                    let node;
                    const dataController = this._dataController;

                    for(let i = 0; i < keys.length; i++) {
                        this._selectionStateByKey[keys[i]] = isSelected;
                        node = dataController.getNodeByKey(keys[i]);

                        if(node) {
                            this._updateParentSelectionState(node, isSelected);
                            this._updateChildrenSelectionState(node, isSelected);
                        }
                    }
                },

                _getSelectedParentKeys: function(key, selectedItemKeys, useCash) {
                    let isSelected;
                    let selectedParentNode;
                    const node = this._dataController.getNodeByKey(key);
                    let parentNode = node && node.parent;
                    let result = [];

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
                    const that = this;
                    const childKeys = [];

                    node && treeListCore.foreachNodes(node.children, function(childNode) {
                        const ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);

                        if(ignoreKeyIndex < 0) {
                            childKeys.push(childNode.key);
                        }

                        return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && that._selectionStateByKey[childNode.key] === undefined;
                    });

                    return childKeys;
                },

                _normalizeParentKeys: function(key, args) {
                    const that = this;
                    let index;
                    let childKeys;
                    let parentNode;
                    let keysToIgnore = [key];
                    const parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);

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
                    const that = this;
                    let index;
                    const node = that._dataController.getNodeByKey(key);

                    node && node.children.forEach(function(childNode) {
                        index = args.selectedRowKeys.indexOf(childNode.key);
                        if(index >= 0) {
                            args.selectedRowKeys.splice(index, 1);
                        }

                        that._normalizeChildrenKeys(childNode.key, args);
                    });
                },

                _normalizeSelectedRowKeysCore: function(keys, args, isSelect) {
                    const that = this;
                    let index;

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
                    let result;
                    const keys = Array.isArray(args.keys) ? args.keys : [args.keys];
                    const selectedRowKeys = this.option('selectedRowKeys') || [];

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
                    return mode === 'leavesOnly' || mode === true;
                },

                _getAllSelectedRowKeys: function(parentKeys) {
                    const that = this;
                    let result = [];
                    parentKeys.forEach(function(key) {
                        const insertIndex = result.length;
                        const parentKeys = that._getSelectedParentKeys(key, result, true);
                        const childKeys = that._dataController.getChildNodeKeys(key);

                        result.splice.apply(result, [insertIndex, 0].concat(parentKeys));
                        result.push(key);
                        result = result.concat(childKeys);
                    });

                    return result;
                },

                _getParentSelectedRowKeys: function(keys) {
                    const that = this;
                    const result = [];

                    keys.forEach(key => {
                        const parentKeys = that._getSelectedParentKeys(key, keys);
                        !parentKeys.length && result.push(key);
                    });

                    return result;
                },

                _getLeafSelectedRowKeys: function(keys) {
                    const that = this;
                    const result = [];
                    const dataController = that._dataController;

                    keys.forEach(function(key) {
                        const node = dataController.getNodeByKey(key);
                        node && !node.hasChildren && result.push(key);
                    });

                    return result;
                },

                isRecursiveSelection: function() {
                    const selectionMode = this.option('selection.mode');
                    const isRecursive = this.option('selection.recursive');

                    return selectionMode === 'multiple' && isRecursive;
                },

                updateSelectionState: function(options) {
                    const removedItemKeys = options.removedItemKeys || [];
                    const selectedItemKeys = options.selectedItemKeys || [];

                    this._updateSelectionStateCore(removedItemKeys, false);
                    this._updateSelectionStateCore(selectedItemKeys, true);
                },

                isRowSelected: function(key) {
                    const result = this.callBase.apply(this, arguments);
                    const isRecursiveSelection = this.isRecursiveSelection();

                    if(!result && isRecursiveSelection) {
                        if(key in this._selectionStateByKey) {
                            return this._selectionStateByKey[key];
                        }
                        return false;
                    }

                    return result;
                },


                getSelectedRowKeys(mode) {
                    const that = this;

                    if(!that._dataController) {
                        return [];
                    }

                    if(mode === true) {
                        errors.log('W0002', 'dxTreeList', 'getSelectedRowKeys(leavesOnly)', '18.1', 'Use the \'getSelectedRowKeys(mode)\' method with a string parameter instead');
                    }

                    let selectedRowKeys = that.callBase.apply(that, arguments);

                    if(mode) {
                        if(this.isRecursiveSelection()) {
                            selectedRowKeys = this._getAllSelectedRowKeys(selectedRowKeys);
                        }

                        if(mode !== 'all') {
                            if(mode === 'excludeRecursive') {
                                selectedRowKeys = that._getParentSelectedRowKeys(selectedRowKeys);
                            } else if(that._isModeLeavesOnly(mode)) {
                                selectedRowKeys = that._getLeafSelectedRowKeys(selectedRowKeys);
                            }
                        }
                    }
                    return selectedRowKeys;
                },

                getSelectedRowsData: function(mode) {
                    const that = this;
                    const dataController = that._dataController;
                    const selectedKeys = this.getSelectedRowKeys(mode) || [];
                    const selectedRowsData = [];

                    selectedKeys.forEach(function(key) {
                        const node = dataController.getNodeByKey(key);
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
                    const that = this;
                    let resultTemplate;
                    const renderingTemplate = this.callBase(template, options);

                    const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

                    if(renderingTemplate && options.rowType === 'header' && options.column.index === firstDataColumnIndex) {
                        resultTemplate = {
                            render: function(options) {
                                if(that.option('selection.mode') === 'multiple') {
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
                    return this.callBase($target) && !$target.closest('.' + SELECT_CHECKBOX_CLASS).length;
                }
            },

            rowsView: {
                _renderExpandIconCore: function($iconContainer, options) {
                    this.callBase.apply(this, arguments);

                    if(this.option('selection.mode') === 'multiple') {
                        this.getController('selection').renderSelectCheckBoxContainer($iconContainer, options);
                    }

                    return $iconContainer;
                },

                _rowClick: function(e) {
                    const $targetElement = $(e.event.target);

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

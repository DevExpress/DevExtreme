"use strict";

var $ = require("../../core/renderer"),
    treeListCore = require("./ui.tree_list.core"),
    commonUtils = require("../../core/utils/common"),
    noop = require("../../core/utils/common").noop,
    selectionModule = require("../grid_core/ui.grid_core.selection"),
    extend = require("../../core/utils/extend").extend;

var TREELIST_SELECT_ALL_CLASS = "dx-treelist-select-all";

var originalRowClick = selectionModule.extenders.views.rowsView._rowClick;

function foreachNodes(nodes, func) {
    for(var i = 0; i < nodes.length; i++) {
        if(func(nodes[i]) !== false && nodes[i].hasChildren && nodes[i].children.length) {
            foreachNodes(nodes[i].children, func);
        }
    }
}

treeListCore.registerModule("selection", extend(true, {}, selectionModule, {
    defaultOptions: function() {
        return extend(true, selectionModule.defaultOptions(), {
            selection: {
                showCheckBoxesMode: "always",
                /**
                 * @name dxTreeListOptions_selection_recursive
                 * @publicName recursive
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
                        dataSource = this.dataSource(),
                        remoteOperations = dataSource && dataSource.remoteOperations(),
                        isRecursiveSelection = selectionController.isRecursiveSelection();

                    if(remoteOperations.filtering && isRecursiveSelection && (!e || e.changeType !== "updateSelectionState")) {
                        selectionController.updateSelectionState({
                            selectedItemKeys: this.option("selectedRowKeys")
                        });
                    }
                    this.callBase.apply(this, arguments);
                }
            },

            selection: {
                init: function() {
                    this.callBase.apply(this, arguments);
                    this._selectionStateByKey = {};
                },

                renderSelectCheckBoxContainer: function($container, model) {
                    var that = this,
                        rowsView = that.component.getView("rowsView");

                    var $checkbox = rowsView._renderSelectCheckBox($container, model.row.isSelected);

                    rowsView._attachCheckBoxClickEvent($checkbox);
                },

                _updateSelectColumn: noop,

                _getVisibleNodeKeys: function(onlyRootChildren) {
                    var component = this.component,
                        root = component.getRootNode(),
                        keys = [];

                    root && foreachNodes(root.children, function(node) {
                        if(node.key !== undefined && node.visible) {
                            keys.push(node.key);
                        }

                        return onlyRootChildren ? false : component.isRowExpanded(node.key);
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
                    var isRecursiveSelection = this.isRecursiveSelection(),
                        visibleKeys = this._getVisibleNodeKeys(isRecursiveSelection);

                    return this.selectRows(visibleKeys, true);
                },

                deselectAll: function() {
                    var isRecursiveSelection = this.isRecursiveSelection(),
                        visibleKeys = this._getVisibleNodeKeys(isRecursiveSelection);

                    return this.deselectRows(visibleKeys);
                },

                _updateParentSelectionState: function(node, isSelected) {
                    var that = this,
                        state = isSelected,
                        parentNode = node.parent,
                        hasNonSelectedState,
                        hasSelectedState;

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
                },

                _updateChildrenSelectionState: function(node, isSelected) {
                    var that = this,
                        children = node.children;

                    children.forEach(function(childNode) {
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

                _getSelectedParentNode: function(node, selectedItemKeys, keysToIgnore) {
                    var index,
                        parentNode = node && node.parent;

                    while(parentNode) {
                        index = selectedItemKeys.indexOf(parentNode.key);

                        if(index < 0) {
                            keysToIgnore.push(parentNode.key);
                            parentNode = parentNode.parent;
                        } else {
                            break;
                        }
                    }

                    return parentNode;
                },

                _getChildKeys: function(node, keysToIgnore) {
                    var that = this,
                        childKeys = [];

                    node && foreachNodes(node.children, function(childNode) {
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
                        keysToIgnore = [key],
                        node = that._dataController.getNodeByKey(key),
                        parentNode = that._getSelectedParentNode(node, args.selectedRowKeys, keysToIgnore);

                    if(parentNode) {
                        index = args.selectedRowKeys.indexOf(parentNode.key);
                        args.currentDeselectedRowKeys.push(parentNode.key);
                        args.selectedRowKeys.splice(index, 1);

                        index = args.selectedRowKeys.indexOf(key);
                        if(index >= 0) {
                            args.currentDeselectedRowKeys.push(key);
                            args.selectedRowKeys.splice(index, 1);
                        }

                        childKeys = that._getChildKeys(parentNode, keysToIgnore);
                        args.currentSelectedRowKeys = args.currentSelectedRowKeys.concat(childKeys);
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
                            args.currentDeselectedRowKeys.push(childNode.key);
                            args.selectedRowKeys.splice(index, 1);
                        }

                        that._normalizeChildrenKeys(childNode.key, args);
                    });
                },

                _normalizeSelectedRowKeysCore: function(keys, args) {
                    var that = this,
                        index;

                    keys.forEach(function(key) {
                        that._normalizeChildrenKeys(key, args);

                        if(that._selectionStateByKey[key]) {
                            index = args.selectedRowKeys.indexOf(key);
                            if(index >= 0) {
                                args.currentDeselectedRowKeys.push(key);
                                args.selectedRowKeys.splice(index, 1);
                            }
                        } else {
                            args.currentSelectedRowKeys.push(key);
                        }

                        that._normalizeParentKeys(key, args);
                    });
                },

                _normalizeSelectionArgs: function(args) {
                    var addedItemKeys = args.addedItemKeys || [],
                        result = {
                            currentSelectedRowKeys: [],
                            currentDeselectedRowKeys: [],
                            selectedRowKeys: args.selectedItemKeys.slice(0) || []
                        };

                    this._normalizeSelectedRowKeysCore(addedItemKeys, result);

                    if(!commonUtils.equalByValue(result.selectedRowKeys, args.selectedItemKeys)) {
                        return result;
                    }
                },

                _updateSelectedItems: function(args) {
                    var that = this,
                        isRecursiveSelection = that.isRecursiveSelection();

                    if(isRecursiveSelection) {
                        if(!that._isSelectionNormalizing) {
                            var normalizedArgs = that._normalizeSelectionArgs(args);

                            if(normalizedArgs) {
                                that._isSelectionNormalizing = true;
                                that.selectRows(normalizedArgs.selectedRowKeys)
                                    .always(function() {
                                        that._isSelectionNormalizing = false;
                                    })
                                    .done(function(items) {
                                        normalizedArgs.selectedRowsData = items;
                                        that._fireSelectionChanged(normalizedArgs);
                                    });
                                return;
                            }
                        }

                        that.updateSelectionState(args);
                    }

                    that.callBase.apply(that, arguments);
                },

                _fireSelectionChanged: function() {
                    if(!this._isSelectionNormalizing) {
                        this.callBase.apply(this, arguments);
                    }
                },

                _getNodeLeafKeys: function(selectedRowKeys) {
                    var that = this,
                        node,
                        result = [],
                        dataController = that._dataController;

                    selectedRowKeys.forEach(function(key) {
                        node = dataController.getNodeByKey(key);

                        if(node) {
                            if(node.hasChildren) {
                                foreachNodes(node.children, function(childNode) {
                                    if(!childNode.hasChildren && that.isRowSelected(childNode.key)) {
                                        result.push(childNode.key);
                                    }
                                    return true;
                                });
                            } else {
                                result.push(key);
                            }
                        }
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

                deselectRows: function(keys) {
                    var that = this,
                        needNormalization,
                        isRecursiveSelection = that.isRecursiveSelection(),
                        selectedItemKeys = that.option("selectedRowKeys");

                    if(isRecursiveSelection) {
                        keys = keys || [];
                        keys = Array.isArray(keys) ? keys : [keys];

                        needNormalization = keys.some(function(key) {
                            return selectedItemKeys.indexOf(key) < 0 && that._selectionStateByKey[key];
                        });

                        if(needNormalization) {
                            return that.selectRows(keys, true);
                        }
                    }

                    return that.callBase.apply(that, arguments);
                },

                /**
                * @name dxTreeListMethods_getSelectedRowKeys
                * @publicName getSelectedRowKeys(leavesOnly)
                * @param1 leavesOnly:boolean
                * @return array
                */
                getSelectedRowKeys: function(leavesOnly) {
                    var selectedRowKeys = this.callBase.apply(this, arguments) || [];

                    return leavesOnly ? this._getNodeLeafKeys(selectedRowKeys) : selectedRowKeys;
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

                    if(renderingTemplate && options.column.index === firstDataColumnIndex) {
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

                    var $checkbox = this._renderSelectAllCheckBox($cell);
                    this._attachSelectAllCheckBoxClickEvent($checkbox);
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
                    var $targetElement = $(e.jQueryEvent.target);

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

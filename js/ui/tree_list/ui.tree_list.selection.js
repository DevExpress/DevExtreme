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
                        isRecursiveSelection = selectionController.isRecursiveSelection();

                    if(isRecursiveSelection && (!e || e.changeType !== "updateSelection")) {
                        selectionController.updateSelection({
                            selectedItemKeys: this.option("selectedRowKeys")
                        });
                    }
                    this.callBase.apply(this, arguments);
                }
            },

            selection: {
                init: function() {
                    this.callBase.apply(this, arguments);
                    this._selectionStateMap = {};
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
                        isIndeterminateLeastOne,
                        visibleKeys = this._getVisibleNodeKeys();

                    var selectedVisibleKeys = visibleKeys.filter(function(key) {
                        var state = component.isRowSelected(key);

                        if(!isIndeterminateLeastOne) {
                            isIndeterminateLeastOne = state === undefined;
                        }

                        return state;
                    });

                    if(!selectedVisibleKeys.length) {
                        return isIndeterminateLeastOne ? undefined : false;
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
                        isUnselectedLeastOne,
                        isSelectedLeastOne;

                    if(parentNode.children.length > 1) {
                        if(isSelected === false) {
                            isSelectedLeastOne = parentNode.children.some(function(childNode, index, children) {
                                return that._selectionStateMap[childNode.key];
                            });

                            if(isSelectedLeastOne) {
                                state = undefined;
                            } else {
                                state = false;
                            }
                        } else if(isSelected === true) {
                            isUnselectedLeastOne = parentNode.children.some(function(childNode) {
                                return !that._selectionStateMap[childNode.key];
                            });

                            if(!isUnselectedLeastOne) {
                                state = true;
                            } else {
                                state = undefined;
                            }
                        }
                    }

                    this._selectionStateMap[parentNode.key] = state;

                    if(parentNode.parent && parentNode.parent.level >= 0) {
                        this._updateParentSelectionState(parentNode, state);
                    }
                },

                _updateChildrenSelectionState: function(node, isSelected) {
                    var that = this,
                        children = node.children;

                    children.forEach(function(childNode) {
                        that._selectionStateMap[childNode.key] = isSelected;

                        if(childNode.children.length > 0) {
                            that._updateChildrenSelectionState(childNode, isSelected);
                        }
                    });
                },

                _updateSelectionCore: function(keys, isSelected) {
                    var node,
                        dataController = this._dataController;

                    for(var i = 0; i < keys.length; i++) {
                        this._selectionStateMap[keys[i]] = isSelected;
                        node = dataController.getNodeByKey(keys[i]);

                        if(node) {
                            this._updateParentSelectionState(node, isSelected);
                            this._updateChildrenSelectionState(node, isSelected);
                        }
                    }
                },

                _processParentKeys: function(key, result) {
                    var that = this,
                        index = -1,
                        parentIndex,
                        childKeys = [],
                        ignoreKeys = [key],
                        node = that._dataController.getNodeByKey(key),
                        parentNode = node && node.parent;

                    while(parentNode) {
                        parentIndex = result.selectedItemKeys.indexOf(parentNode.key);

                        if(parentIndex < 0) {
                            ignoreKeys.push(parentNode.key);
                            parentNode = parentNode.parent;
                        } else {
                            break;
                        }
                    }

                    if(parentIndex >= 0) {
                        result.removedItemKeys.push(parentNode.key);
                        result.selectedItemKeys.splice(parentIndex, 1);

                        index = result.selectedItemKeys.indexOf(key);
                        if(index >= 0) {
                            result.removedItemKeys.push(key);
                            result.selectedItemKeys.splice(index, 1);
                        }

                        foreachNodes(parentNode.children, function(childNode) {
                            var ignoreKeyIndex = ignoreKeys.indexOf(childNode.key);

                            if(ignoreKeyIndex < 0) {
                                childKeys.push(childNode.key);
                            }

                            return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && that._selectionStateMap[childNode.key] === undefined;
                        });
                        result.addedItemKeys = result.addedItemKeys.concat(childKeys);
                        result.selectedItemKeys = result.selectedItemKeys.concat(childKeys);
                    }
                },

                _processChildrenKeys: function(key, result) {
                    var that = this,
                        index,
                        node = that._dataController.getNodeByKey(key);

                    if(node && node.children.length) {
                        node.children.forEach(function(childNode) {
                            index = result.selectedItemKeys.indexOf(childNode.key);
                            if(index >= 0) {
                                result.removedItemKeys.push(childNode.key);
                                result.selectedItemKeys.splice(index, 1);
                            }

                            that._processChildrenKeys(childNode.key, result);
                        });
                    }
                },

                _normalizeSelectedRowKeysCore: function(keys, result) {
                    var that = this,
                        index;

                    keys.forEach(function(key) {
                        that._processChildrenKeys(key, result);

                        if(that._selectionStateMap[key]) {
                            index = result.selectedItemKeys.indexOf(key);
                            if(index >= 0) {
                                result.removedItemKeys.push(key);
                                result.selectedItemKeys.splice(index, 1);
                            }
                        } else {
                            result.addedItemKeys.push(key);
                        }

                        that._processParentKeys(key, result);
                    });
                },

                _normalizeSelectedRowKeys: function(args) {
                    var addedItemKeys = args.addedItemKeys || [],
                        result = {
                            addedItemKeys: [],
                            removedItemKeys: [],
                            selectedItemKeys: args.selectedItemKeys.slice(0) || []
                        };

                    this._normalizeSelectedRowKeysCore(addedItemKeys, result);

                    if(!commonUtils.equalByValue(result.selectedItemKeys, args.selectedItemKeys)) {
                        return result;
                    }
                },

                _updateSelectedItems: function(args) {
                    var that = this,
                        isRecursiveSelection = that.isRecursiveSelection();

                    if(isRecursiveSelection) {
                        if(!that._notNormalizeSelection) {
                            var result = that._normalizeSelectedRowKeys(args);

                            if(result) {
                                that._notNormalizeSelection = true;
                                that.selectRows(result.selectedItemKeys).done(function(items) {
                                    that._fireSelectionChanged({
                                        selectedRowsData: items,
                                        selectedRowKeys: result.selectedItemKeys,
                                        currentSelectedRowKeys: result.addedItemKeys,
                                        currentDeselectedRowKeys: result.removedItemKeys
                                    });
                                });
                                return;
                            }
                        }

                        that.updateSelection(args);
                    }

                    that.callBase.apply(that, arguments);
                    that._notNormalizeSelection = false;
                },

                _fireSelectionChanged: function() {
                    if(!this._notNormalizeSelection) {
                        this.callBase.apply(this, arguments);
                    }
                },

                isRecursiveSelection: function() {
                    var selectionMode = this.option("selection.mode"),
                        isRecursive = this.option("selection.recursive");

                    return selectionMode === "multiple" && isRecursive;
                },

                updateSelection: function(options) {
                    var removedItemKeys = options.removedItemKeys || [],
                        selectedItemKeys = options.selectedItemKeys || [];

                    this._updateSelectionCore(removedItemKeys, false);
                    this._updateSelectionCore(selectedItemKeys, true);
                },

                isRowSelected: function(key) {
                    var result = this.callBase.apply(this, arguments),
                        isRecursiveSelection = this.isRecursiveSelection();

                    if(!result && isRecursiveSelection) {
                        if(key in this._selectionStateMap) {
                            return this._selectionStateMap[key];
                        }
                        return false;
                    }

                    return result;
                },

                deselectRows: function(keys) {
                    var that = this,
                        isNotSelected,
                        isRecursiveSelection = that.isRecursiveSelection(),
                        selectedItemKeys = that.option("selectedRowKeys");

                    if(isRecursiveSelection) {
                        keys = keys || [];
                        keys = Array.isArray(keys) ? keys : [keys];

                        isNotSelected = keys.some(function(key) {
                            return selectedItemKeys.indexOf(key) < 0 && that._selectionStateMap[key];
                        });

                        if(isNotSelected) {
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
                    var that = this,
                        dataController = that._dataController,
                        selectedRowKeys = that.callBase.apply(that, arguments);

                    if(leavesOnly) {
                        var node,
                            result = [];

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
                    }

                    return selectedRowKeys;
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
                _getSelectionStateByItem: function(item) {
                    return item && item.isSelected;
                },

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


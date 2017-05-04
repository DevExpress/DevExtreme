"use strict";

var $ = require("../../core/renderer"),
    treeListCore = require("./ui.tree_list.core"),
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
                showCheckBoxesMode: "always"
            }
        });
    },
    extenders: {
        controllers: {
            selection: {
                renderSelectCheckBoxContainer: function($container, model) {
                    var that = this,
                        rowsView = that.component.getView("rowsView");

                    var $checkbox = rowsView._renderSelectCheckBox($container, model.row.isSelected);

                    rowsView._attachCheckBoxClickEvent($checkbox);
                },

                _updateSelectColumn: noop,

                _getVisibleNodeKeys: function() {
                    var component = this.component,
                        root = component.getRootNode(),
                        keys = [];

                    root && foreachNodes(root.children, function(node) {
                        if(node.key === undefined) return false;

                        keys.push(node.key);
                        return component.isRowExpanded(node.key);
                    });

                    return keys;
                },

                isSelectAll: function() {
                    var component = this.component,
                        visibleKeys = this._getVisibleNodeKeys();

                    var selectedVisibleKeys = visibleKeys.filter(function(key) {
                        return component.isRowSelected(key);
                    });

                    if(!selectedVisibleKeys.length) {
                        return false;
                    } else if(selectedVisibleKeys.length === visibleKeys.length) {
                        return true;
                    }
                },

                selectAll: function() {
                    var visibleKeys = this._getVisibleNodeKeys();
                    return this.selectRows(visibleKeys, true);
                },

                deselectAll: function() {
                    var visibleKeys = this._getVisibleNodeKeys();
                    return this.deselectRows(visibleKeys);
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



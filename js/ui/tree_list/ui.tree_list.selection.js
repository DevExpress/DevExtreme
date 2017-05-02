"use strict";

var $ = require("../../core/renderer"),
    treeListCore = require("./ui.tree_list.core"),
    noop = require("../../core/utils/common").noop,
    selectionModule = require("../grid_core/ui.grid_core.selection"),
    extend = require("../../core/utils/extend").extend,
    messageLocalization = require("../../localization/message");

var TREELIST_EDITOR_CELL_CLASS = "dx-treelist-editor-cell";

var originalRowClick = selectionModule.extenders.views.rowsView._rowClick;

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

                    that.setAria("label", messageLocalization.format("dxDataGrid-ariaSelectRow"), $container);
                    var $checkbox = rowsView._renderSelectCheckBox($container, model.row.isSelected);

                    rowsView._attachCheckBoxClickEvent($checkbox);
                },

                _updateSelectColumn: noop
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
                    $cell.addClass(TREELIST_EDITOR_CELL_CLASS);

                    var $checkbox = this._renderSelectAllCheckBox($cell);
                    this._attachSelectAllCheckBoxClickEvent($checkbox);
                }
            },

            rowsView: {
                _renderCellCommandContent: function(container, model) {
                    var result = this.callBase(container, model);

                    if(result && this.option("selection.mode") === "multiple") {
                        this.getController("selection").renderSelectCheckBoxContainer(container, model);
                    }

                    return result;
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



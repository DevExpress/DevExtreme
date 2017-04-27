"use strict";

var $ = require("../../core/renderer"),
    treeListCore = require("./ui.tree_list.core"),
    rowsViewModule = require("../grid_core/ui.grid_core.rows");

var TREELIST_TEXT_CONTENT = "dx-treelist-text-content",
    TREELIST_EXPAND_ICON_CONTAINER_CLASS = "dx-treelist-icon-container",
    TREELIST_CELL_EXPANDABLE_CLASS = "dx-treelist-cell-expandable",
    TREELIST_EMPTY_SPACE = "dx-treelist-empty-space",
    TREELIST_EXPANDED_CLASS = "dx-treelist-expanded",
    TREELIST_COLLAPSED_CLASS = "dx-treelist-collapsed";

exports.RowsView = rowsViewModule.views.rowsView.inherit((function() {
    var createCellContent = function($container) {
        return $("<div />")
            .addClass(TREELIST_TEXT_CONTENT)
            .appendTo($container);
    };

    var createIcon = function(hasIcon, isExpanded) {
        var $iconElement = $("<div/>").addClass(TREELIST_EMPTY_SPACE);

        if(hasIcon) {
            $iconElement
                .toggleClass(TREELIST_EXPANDED_CLASS, isExpanded)
                .toggleClass(TREELIST_COLLAPSED_CLASS, !isExpanded)
                .append($("<span/>"));
        }

        return $iconElement;
    };

    return {
        _renderExpandIcon: function($container, options) {
            var level = options.row.level,
                $iconContainer = $("<div/>")
                    .addClass(TREELIST_EXPAND_ICON_CONTAINER_CLASS)
                    .appendTo($container);

            for(var i = 0; i <= level; i++) {
                $iconContainer.append(createIcon(i === level && options.row.node.hasChildren, options.row.isExpanded));
            }

            $container.addClass(TREELIST_CELL_EXPANDABLE_CLASS);

            return $iconContainer;
        },

        _renderCellCommandContent: function(container, model) {
            this._renderExpandIcon(container, model);
            return true;
        },

        _processTemplate: function(template, options) {
            var that = this,
                resultTemplate,
                renderingTemplate = this.callBase(template);

            var firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

            if(renderingTemplate && options.column.index === firstDataColumnIndex) {
                resultTemplate = {
                    render: function(options) {
                        var $container = options.container;

                        if(that._renderCellCommandContent($container, options.model)) {
                            options.container = createCellContent($container);
                        }

                        renderingTemplate.render(options);
                    }
                };
            } else {
                resultTemplate = renderingTemplate;
            }

            return resultTemplate;
        },

        _updateCell: function($cell, options) {
            $cell = $cell.hasClass(TREELIST_TEXT_CONTENT) ? $cell.parent() : $cell;
            this.callBase($cell, options);
        },

        _rowClick: function(e) {
            var dataController = this._dataController,
                $targetElement = $(e.jQueryEvent.target),
                isExpandIcon = this.isExpandIcon($targetElement),
                item = dataController && dataController.items()[e.rowIndex];

            if(isExpandIcon && item) {
                dataController.changeRowExpand(item.key);
            }

            this.callBase(e);
        },

        _createRow: function(row) {
            var node = row && row.node,
                $rowElement = this.callBase.apply(this, arguments);

            if(node) {
                this.setAria("level", row.level, $rowElement);

                if(node.hasChildren) {
                    this.setAria("expanded", row.isExpanded, $rowElement);
                }
            }

            return $rowElement;
        },

        _getTableRoleName: function() {
            return "treegrid";
        },

        isExpandIcon: function($targetElement) {
            return !!$targetElement.closest("." + TREELIST_EXPANDED_CLASS + ", ." + TREELIST_COLLAPSED_CLASS).length;
        }
    };
})());


treeListCore.registerModule("rows", {
    defaultOptions: rowsViewModule.defaultOptions,
    views: {
        rowsView: exports.RowsView
    }
});

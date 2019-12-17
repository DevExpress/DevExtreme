import $ from '../../core/renderer';
import treeListCore from './ui.tree_list.core';
import rowsViewModule from '../grid_core/ui.grid_core.rows';

var TREELIST_TEXT_CONTENT = 'dx-treelist-text-content',
    TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container',
    TREELIST_CELL_EXPANDABLE_CLASS = 'dx-treelist-cell-expandable',
    TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space',
    TREELIST_EXPANDED_CLASS = 'dx-treelist-expanded',
    TREELIST_COLLAPSED_CLASS = 'dx-treelist-collapsed';

exports.RowsView = rowsViewModule.views.rowsView.inherit((function() {
    var createCellContent = function($container) {
        return $('<div>')
            .addClass(TREELIST_TEXT_CONTENT)
            .appendTo($container);
    };

    var createIcon = function(hasIcon, isExpanded) {
        var $iconElement = $('<div>').addClass(TREELIST_EMPTY_SPACE);

        if(hasIcon) {
            $iconElement
                .toggleClass(TREELIST_EXPANDED_CLASS, isExpanded)
                .toggleClass(TREELIST_COLLAPSED_CLASS, !isExpanded)
                .append($('<span>'));
        }

        return $iconElement;
    };

    var renderIcons = function($container, row) {
        var level = row.level;

        for(var i = 0; i <= level; i++) {
            $container.append(createIcon(i === level && row.node.hasChildren, row.isExpanded));
        }
    };

    return {
        _renderExpandIcon: function($container, options) {
            var $iconContainer = $('<div>')
                .addClass(TREELIST_EXPAND_ICON_CONTAINER_CLASS)
                .appendTo($container);

            renderIcons($iconContainer, options.row);

            options.watch && options.watch(function() {
                return [options.row.level, options.row.isExpanded, options.row.node.hasChildren];
            }, function() {
                $iconContainer.empty();
                renderIcons($iconContainer, options.row);
            });

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
                $targetElement = $(e.event.target),
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
                this.setAria('level', row.level, $rowElement);

                if(node.hasChildren) {
                    this.setAria('expanded', row.isExpanded, $rowElement);
                }
            }

            return $rowElement;
        },

        isExpandIcon: function($targetElement) {
            return !!$targetElement.closest('.' + TREELIST_EXPANDED_CLASS + ', .' + TREELIST_COLLAPSED_CLASS).length;
        }
    };
})());


treeListCore.registerModule('rows', {
    defaultOptions: rowsViewModule.defaultOptions,
    views: {
        rowsView: exports.RowsView
    }
});

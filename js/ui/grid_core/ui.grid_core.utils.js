"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    LoadPanel = require("../load_panel");

var DATAGRID_NODATA_TEXT_CLASS = "dx-datagrid-nodata",
    DATAGRID_COLUMN_INDICATORS_CLASS = "dx-column-indicators",
    DATAGRID_GROUP_PANEL_ITEM_CLASS = "dx-group-panel-item";

exports.renderNoDataText = function($element) {
    var that = this;
    $element = $element || this.element();

    var noDataElement = $element.find("." + DATAGRID_NODATA_TEXT_CLASS),
        isVisible = this._dataController.isEmpty(),
        isLoading = this._dataController.isLoading(),
        rtlEnabled = this.option("rtlEnabled");

    if(!noDataElement.length) {
        noDataElement = $("<span>")
            .addClass(DATAGRID_NODATA_TEXT_CLASS)
            .appendTo($element);
    }

    if(isVisible && !isLoading) {
        noDataElement.removeClass("dx-hidden").text(that._getNoDataText());
        commonUtils.deferUpdate(function() {
            var noDataHeight = noDataElement.height(),
                noDataWidth = noDataElement.width();

            commonUtils.deferRender(function() {
                noDataElement
                    .css({
                        marginTop: -Math.floor(noDataHeight / 2),
                        marginRight: rtlEnabled ? -Math.floor(noDataWidth / 2) : 0,
                        marginLeft: rtlEnabled ? 0 : -Math.floor(noDataWidth / 2)
                    });
            });
        });
    } else {
        noDataElement.addClass("dx-hidden");
    }
};

exports.renderLoadPanel = function($element, $container, isLocalStore) {
    var that = this,
        loadPanelOptions;

    that._loadPanel && that._loadPanel.element().remove();
    loadPanelOptions = that.option("loadPanel");

    if(loadPanelOptions && (loadPanelOptions.enabled === "auto" ? !isLocalStore : loadPanelOptions.enabled)) {
        loadPanelOptions = $.extend({
            shading: false,
            message: loadPanelOptions.text,
            position: {
                of: $element
            },
            container: $element
        }, loadPanelOptions);

        that._loadPanel = that._createComponent($("<div>").appendTo($container), LoadPanel, loadPanelOptions);
    } else {
        that._loadPanel = null;
    }
};

exports.columnStateMixin = {
    _applyColumnState: function(options) {
        var that = this,
            rtlEnabled = this.option("rtlEnabled"),
            columnAlignment = that._getColumnAlignment(options.column.alignment, rtlEnabled),
            parameters = $.extend(true, { columnAlignment: columnAlignment }, options),
            isGroupPanelItem = parameters.rootElement.hasClass(DATAGRID_GROUP_PANEL_ITEM_CLASS),
            $indicatorsContainer = that._createIndicatorContainer(parameters, isGroupPanelItem),
            $span = $("<span>").addClass(that._getIndicatorClassName(options.name)),
            getIndicatorAlignment = function() {
                if(rtlEnabled) {
                    return columnAlignment === "left" ? "right" : "left";
                }
                return columnAlignment;
            };

        parameters.container = $indicatorsContainer;
        parameters.indicator = $span;
        that._renderIndicator(parameters);

        $indicatorsContainer[(isGroupPanelItem || !options.showColumnLines) && getIndicatorAlignment() === "left" ? "appendTo" : "prependTo"](options.rootElement);

        return $span;
    },

    _getIndicatorClassName: $.noop,

    _getColumnAlignment: function(alignment, rtlEnabled) {
        rtlEnabled = rtlEnabled || this.option("rtlEnabled");

        return alignment !== "center" ? alignment : commonUtils.getDefaultAlignment(rtlEnabled);
    },

    _createIndicatorContainer: function(options, ignoreIndicatorAlignment) {
        var $indicatorsContainer = this._getIndicatorContainer(options.rootElement),
            indicatorAlignment = options.columnAlignment === "left" ? "right" : "left";

        if(!$indicatorsContainer.length) {
            $indicatorsContainer = $("<div>").addClass(DATAGRID_COLUMN_INDICATORS_CLASS);
        }

        return $indicatorsContainer.css("float", options.showColumnLines && !ignoreIndicatorAlignment ? indicatorAlignment : null);
    },

    _getIndicatorContainer: function($cell) {
        return $cell && $cell.find("." + DATAGRID_COLUMN_INDICATORS_CLASS);
    },

    _getIndicatorElements: function($cell) {
        var $indicatorContainer = this._getIndicatorContainer($cell);

        return $indicatorContainer && $indicatorContainer.children();
    },

    _renderIndicator: function(options) {
        var $container = options.container,
            $indicator = options.indicator;

        $container && $indicator && $container.append($indicator);
    },

    _updateIndicators: function(indicatorName) {
        var that = this,
            columns = that.getColumns(),
            $cells = that.getColumnElements(),
            rowOptions,
            $cell,
            i;

        if(!$cells.length) return;

        for(i = 0; i < columns.length; i++) {
            $cell = $cells.eq(i);
            that._updateIndicator($cell, columns[i], indicatorName);

            rowOptions = $cell.parent().data("options");

            if(rowOptions && rowOptions.cells) {
                rowOptions.cells[$cell.index()].column = columns[i];
            }
        }
    },

    _updateIndicator: function($cell, column, indicatorName) {
        if(!column.command) {
            return this._applyColumnState({
                name: indicatorName,
                rootElement: $cell,
                column: column,
                showColumnLines: this.option("showColumnLines")
            });
        }
    }
};

exports.getIndexByKey = function(key, items, keyName) {
    var index = -1,
        item;

    if(commonUtils.isArray(items)) {
        keyName = arguments.length <= 2 ? "key" : keyName;
        for(var i = 0; i < items.length; i++) {
            item = commonUtils.isDefined(keyName) ? items[i][keyName] : items[i];

            if(commonUtils.equalByValue(key, item)) {
                index = i;
                break;
            }
        }
    }

    return index;
};

exports.exportMixin = {
    _getEmptyCell: function() {
        return {
            text: '',
            value: undefined,
            colspan: 1,
            rowspan: 1
        };
    },

    _defaultSetter: function(value) {
        value = parseInt(value, 10);
        return !value ? 1 : value;
    },

    _makeRowOffset: function(resultItems) {
        var offset = 0,
            rowIndex = resultItems.length - 1,
            row = resultItems[rowIndex],
            cellIndex = row.length;

        $.each(resultItems, function(rowIndex) {
            if(this[cellIndex] && this[cellIndex].rowspan + rowIndex > resultItems.length - 1) {
                offset = Math.max.apply(this, [this[cellIndex].colspan, offset]);
            }
        });

        for(var i = 0; i < offset; i++) {
            row.push(this._cloneItem(resultItems[resultItems.length - 2][cellIndex && cellIndex - 1 || 0]));
        }

        if(offset > 0) {
            this._makeRowOffset(resultItems);
        }
    },

    _cloneItem: function(item) {
        return $.extend({}, item, this._getEmptyCell());
    },

    _prepareItems: function(cols, items) {
        var that = this,
            i,
            row,
            cellIndex,
            rowIndex,
            resultItems = [];

        for(rowIndex = 0; rowIndex < items.length; rowIndex++) {
            row = [];
            resultItems.push(row);
            do {
                that._makeRowOffset(resultItems);
                cellIndex = row.length;

                row.push(items[rowIndex].shift());
                if(row[row.length - 1]) {
                    row[row.length - 1].colspan = that._defaultSetter(row[row.length - 1].colspan);
                    row[row.length - 1].rowspan = that._defaultSetter(row[row.length - 1].rowspan);
                } else {
                    row[row.length - 1] = $({}, that._getEmptyCell());
                }
                for(i = 1; i < row[cellIndex].colspan; i++) {
                    row.push(that._cloneItem(row[row.length - 1]));
                }
            } while(items[rowIndex].length);
            while(row.length < cols) {
                row.push(that._cloneItem(row[row.length - 1]));
            }
        }

        return resultItems;
    }
};

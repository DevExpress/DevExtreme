"use strict";

var $ = require("jquery"),
    clickEvent = require("../../events/click"),
    gridCore = require("./ui.data_grid.core");

var DATAGRID_ERROR_ROW_CLASS = "dx-error-row",
    DATAGRID_ERROR_MESSAGE_CLASS = "dx-error-message",
    DATAGRID_ERROR_CLOSEBUTTON_CLASS = "dx-closebutton",
    DATAGRID_ACTION_CLASS = "dx-datagrid-action";

exports.ErrorHandlingController = gridCore.ViewController.inherit({
    init: function() {
        var that = this;

        that._columnHeadersView = that.getView("columnHeadersView");
        that._rowsView = that.getView("rowsView");
    },

    _createErrorRow: function(message, $tableElements) {
        var that = this,
            $errorRow = $("<tr />").addClass(DATAGRID_ERROR_ROW_CLASS),
            $errorMessage = $("<div/>").addClass(DATAGRID_ERROR_MESSAGE_CLASS).text(message),
            $closeButton = $("<div/>").addClass(DATAGRID_ERROR_CLOSEBUTTON_CLASS).addClass(DATAGRID_ACTION_CLASS);

        $closeButton.on(clickEvent.name, that.createAction(function(args) {
            var e = args.jQueryEvent,
                $errorRow,
                errorRowIndex = $(e.currentTarget).closest("." + DATAGRID_ERROR_ROW_CLASS).index();

            e.stopPropagation();
            $.each($tableElements, function(_, tableElement) {
                $errorRow = $(tableElement).children("tbody").children("tr").eq(errorRowIndex);
                that.removeErrorRow($errorRow);
            });
        }));

        $("<td/>")
            .attr({
                "colspan": that.getController("columns").getVisibleColumns().length,
                "role": "presentation"
            })
            .prepend($closeButton)
            .append($errorMessage)
            .appendTo($errorRow);

        return $errorRow;
    },

    renderErrorRow: function(message, rowIndex) {
        var that = this,
            $row,
            $errorRow,
            rowElements,
            viewElement = rowIndex >= 0 ? that._rowsView : that._columnHeadersView,
            $tableElements = viewElement.getTableElements();

        $.each($tableElements, function(_, tableElement) {
            $errorRow = that._createErrorRow(message, $tableElements);
            rowElements = $(tableElement).children("tbody").children("tr");

            if(rowIndex >= 0) {
                $row = viewElement._getRowElements($(tableElement)).eq(rowIndex);
                that.removeErrorRow(rowElements.eq(($row.index() + 1)));
                $errorRow.insertAfter($row);
            } else {
                that.removeErrorRow(rowElements.last());
                $(tableElement).append($errorRow);
            }
        });
    },

    removeErrorRow: function($row) {
        var $columnHeaders = this._columnHeadersView && this._columnHeadersView.element();

        $row = $row || $columnHeaders && $columnHeaders.find("." + DATAGRID_ERROR_ROW_CLASS);
        $row && $row.hasClass(DATAGRID_ERROR_ROW_CLASS) && $row.remove();
    },

    optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "errorRowEnabled":
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    }
});

gridCore.registerModule("errorHandling", {
    defaultOptions: function() {
        return {
            /**
            * @name dxDataGridOptions_errorRowEnabled
            * @publicName errorRowEnabled
            * @type boolean
            * @default true
            */
            errorRowEnabled: true
        };
    },
    controllers: {
        errorHandling: exports.ErrorHandlingController
    },
    extenders: {
        controllers: {
            data: {
                init: function() {
                    var that = this,
                        errorHandlingController = that.getController("errorHandling");

                    that.callBase();

                    that.dataErrorOccurred.add(function(error) {
                        var message = error && error.message || error;

                        if(that.option("errorRowEnabled")) {
                            errorHandlingController.renderErrorRow(message);
                        }
                    });
                    that.changed.add(function() {
                        var errorHandlingController = that.getController("errorHandling"),
                            editingController = that.getController("editing");

                        if(editingController && !editingController.hasChanges()) {
                            errorHandlingController && errorHandlingController.removeErrorRow();
                        }
                    });
                }
            }
        }
    }
});

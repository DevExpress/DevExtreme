"use strict";

var $ = require("../../core/renderer"),
    clickEvent = require("../../events/click"),
    modules = require("./ui.grid_core.modules");

var ERROR_ROW_CLASS = "dx-error-row",
    ERROR_MESSAGE_CLASS = "dx-error-message",
    ERROR_CLOSEBUTTON_CLASS = "dx-closebutton",
    ACTION_CLASS = "action";

var ErrorHandlingController = modules.ViewController.inherit({
    init: function() {
        var that = this;

        that._columnHeadersView = that.getView("columnHeadersView");
        that._rowsView = that.getView("rowsView");
    },

    _createErrorRow: function(message, $tableElements) {
        var that = this,
            $errorRow,
            $closeButton,
            $errorMessage = $("<div/>").addClass(ERROR_MESSAGE_CLASS).text(message);

        if($tableElements) {
            $errorRow = $("<tr />").addClass(ERROR_ROW_CLASS);
            $closeButton = $("<div/>").addClass(ERROR_CLOSEBUTTON_CLASS).addClass(that.addWidgetPrefix(ACTION_CLASS));

            $closeButton.on(clickEvent.name, that.createAction(function(args) {
                var e = args.jQueryEvent,
                    $errorRow,
                    errorRowIndex = $(e.currentTarget).closest("." + ERROR_ROW_CLASS).index();

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
        }

        return $errorMessage;
    },

    renderErrorRow: function(message, rowIndex, $popupContent) {
        var that = this,
            $row,
            $errorMessageElement,
            rowElements,
            viewElement = rowIndex >= 0 ? that._rowsView : that._columnHeadersView,
            $tableElements = $popupContent || viewElement.getTableElements();

        if($popupContent) {
            $popupContent.find("." + ERROR_MESSAGE_CLASS).remove();
            $errorMessageElement = that._createErrorRow(message);
            $popupContent.prepend($errorMessageElement);
            return;
        }

        $.each($tableElements, function(_, tableElement) {
            $errorMessageElement = that._createErrorRow(message, $tableElements);
            rowElements = $(tableElement).children("tbody").children("tr");

            if(rowIndex >= 0) {
                $row = viewElement._getRowElements($(tableElement)).eq(rowIndex);
                that.removeErrorRow(rowElements.eq(($row.index() + 1)));
                $errorMessageElement.insertAfter($row);
            } else {
                that.removeErrorRow(rowElements.last());
                $(tableElement).append($errorMessageElement);
            }
        });
    },

    removeErrorRow: function($row) {
        var $columnHeaders = this._columnHeadersView && this._columnHeadersView.element();

        $row = $row || $columnHeaders && $columnHeaders.find("." + ERROR_ROW_CLASS);
        $row && $row.hasClass(ERROR_ROW_CLASS) && $row.remove();
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

module.exports = {
    defaultOptions: function() {
        return {
            /**
            * @name GridBaseOptions_errorRowEnabled
            * @publicName errorRowEnabled
            * @type boolean
            * @default true
            */
            errorRowEnabled: true
        };
    },
    controllers: {
        errorHandling: ErrorHandlingController
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
};

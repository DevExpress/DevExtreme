import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import clickEvent from '../../events/click';
import { each } from '../../core/utils/iterator';
import modules from './ui.grid_core.modules';

const ERROR_ROW_CLASS = 'dx-error-row';
const ERROR_MESSAGE_CLASS = 'dx-error-message';
const ERROR_CLOSEBUTTON_CLASS = 'dx-closebutton';
const ACTION_CLASS = 'action';

const ErrorHandlingController = modules.ViewController.inherit({
    init: function() {
        const that = this;

        that._columnHeadersView = that.getView('columnHeadersView');
        that._rowsView = that.getView('rowsView');
    },

    _createErrorRow: function(error, $tableElements) {
        const that = this;
        let $errorRow;
        let $closeButton;
        const $errorMessage = this._renderErrorMessage(error);

        if($tableElements) {
            $errorRow = $('<tr>').addClass(ERROR_ROW_CLASS);
            $closeButton = $('<div>').addClass(ERROR_CLOSEBUTTON_CLASS).addClass(that.addWidgetPrefix(ACTION_CLASS));

            eventsEngine.on($closeButton, clickEvent.name, that.createAction(function(args) {
                const e = args.event;
                let $errorRow;
                const errorRowIndex = $(e.currentTarget).closest('.' + ERROR_ROW_CLASS).index();

                e.stopPropagation();
                each($tableElements, function(_, tableElement) {
                    $errorRow = $(tableElement).children('tbody').children('tr').eq(errorRowIndex);
                    that.removeErrorRow($errorRow);
                });

                that.getController('resizing') && that.getController('resizing').fireContentReadyAction();
            }));

            $('<td>')
                .attr({
                    'colSpan': that.getController('columns').getVisibleColumns().length,
                    'role': 'presentation'
                })
                .prepend($closeButton)
                .append($errorMessage)
                .appendTo($errorRow);

            return $errorRow;
        }

        return $errorMessage;
    },

    _renderErrorMessage: function(error) {
        const message = error.url ? error.message.replace(error.url, '') : error.message || error;
        const $message = $('<div>').addClass(ERROR_MESSAGE_CLASS).text(message);

        if(error.url) {
            $('<a>').attr('href', error.url).text(error.url).appendTo($message);
        }

        return $message;
    },

    renderErrorRow: function(error, rowIndex, $popupContent) {
        const that = this;
        let $row;
        let $errorMessageElement;
        let $firstErrorRow;
        let rowElements;
        let viewElement;
        let $tableElements;

        if($popupContent) {
            $popupContent.find('.' + ERROR_MESSAGE_CLASS).remove();
            $errorMessageElement = that._createErrorRow(error);
            $popupContent.prepend($errorMessageElement);
            return $errorMessageElement;
        }

        viewElement = rowIndex >= 0 || !that._columnHeadersView.isVisible() ? that._rowsView : that._columnHeadersView,
        $tableElements = $popupContent || viewElement.getTableElements();

        each($tableElements, function(_, tableElement) {
            $errorMessageElement = that._createErrorRow(error, $tableElements);
            $firstErrorRow = $firstErrorRow || $errorMessageElement;

            if(rowIndex >= 0) {
                $row = viewElement._getRowElements($(tableElement)).eq(rowIndex);
                that.removeErrorRow($row.next());
                $errorMessageElement.insertAfter($row);
            } else {
                const $tbody = $(tableElement).children('tbody');
                rowElements = $tbody.children('tr');
                if(that._columnHeadersView.isVisible()) {
                    that.removeErrorRow(rowElements.last());
                    $(tableElement).append($errorMessageElement);
                } else {
                    that.removeErrorRow(rowElements.first());
                    $tbody.first().prepend($errorMessageElement);
                }
            }
        });
        if(!$popupContent) {
            const resizingController = that.getController('resizing');
            resizingController && resizingController.fireContentReadyAction();
        }
        return $firstErrorRow;
    },

    removeErrorRow: function($row) {
        if(!$row) {
            const $columnHeaders = this._columnHeadersView && this._columnHeadersView.element();
            $row = $columnHeaders && $columnHeaders.find('.' + ERROR_ROW_CLASS);
            if(!$row || !$row.length) {
                const $rowsViewElement = this._rowsView.element();
                $row = $rowsViewElement && $rowsViewElement.find('.' + ERROR_ROW_CLASS);
            }
        }
        $row && $row.hasClass(ERROR_ROW_CLASS) && $row.remove();
    },

    optionChanged: function(args) {
        const that = this;

        switch(args.name) {
            case 'errorRowEnabled':
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
            * @name GridBaseOptions.errorRowEnabled
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
                    const that = this;
                    const errorHandlingController = that.getController('errorHandling');

                    that.callBase();

                    that.dataErrorOccurred.add(function(error, $popupContent) {
                        if(that.option('errorRowEnabled')) {
                            errorHandlingController.renderErrorRow(error, undefined, $popupContent);
                        }
                    });
                    that.changed.add(function(e) {
                        if(e && e.changeType === 'loadError') {
                            return;
                        }
                        const errorHandlingController = that.getController('errorHandling');
                        const editingController = that.getController('editing');

                        if(editingController && !editingController.hasChanges()) {
                            errorHandlingController && errorHandlingController.removeErrorRow();
                        }
                    });
                }
            }
        }
    }
};

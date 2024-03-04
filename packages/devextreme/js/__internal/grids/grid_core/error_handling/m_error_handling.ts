/* eslint-disable max-classes-per-file */
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { name as clickEventName } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';
import messageLocalization from '@js/localization/message';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import type { ModuleType } from '../m_types';
import type { RowsView } from '../views/m_rows_view';

const ERROR_ROW_CLASS = 'dx-error-row';
const ERROR_MESSAGE_CLASS = 'dx-error-message';
const ERROR_CLOSEBUTTON_CLASS = 'dx-closebutton';
const ACTION_CLASS = 'action';

export class ErrorHandlingController extends modules.ViewController {
  private _columnHeadersView!: ColumnHeadersView;

  private _rowsView!: RowsView;

  init() {
    const that = this;

    that._columnHeadersView = that.getView('columnHeadersView');
    that._rowsView = that.getView('rowsView');
  }

  _createErrorRow(error, $tableElements?) {
    const that = this;
    let $errorRow;
    let $closeButton;
    const $errorMessage = this._renderErrorMessage(error);

    if ($tableElements) {
      $errorRow = $('<tr>')
        .attr('role', 'row')
        .addClass(ERROR_ROW_CLASS);
      $closeButton = $('<div>').addClass(ERROR_CLOSEBUTTON_CLASS).addClass(that.addWidgetPrefix(ACTION_CLASS));

      eventsEngine.on($closeButton, clickEventName, that.createAction((args) => {
        const e = args.event;
        let $errorRow;
        const errorRowIndex = $(e.currentTarget).closest(`.${ERROR_ROW_CLASS}`).index();

        e.stopPropagation();
        each($tableElements, (_, tableElement) => {
          $errorRow = $(tableElement).children('tbody').children('tr').eq(errorRowIndex);
          that.removeErrorRow($errorRow);
        });

        that.getController('resizing') && that.getController('resizing').fireContentReadyAction();
      }));

      $('<td>')
        // @ts-expect-errors
        .attr({
          colSpan: that.getController('columns').getVisibleColumns().length,
          role: 'gridcell',
        })
        .prepend($closeButton)
        .append($errorMessage)
        .appendTo($errorRow);

      return $errorRow;
    }

    return $errorMessage;
  }

  _renderErrorMessage(error) {
    const message = error.url ? error.message.replace(error.url, '') : error.message || error;
    const $message = $('<div>')
      .attr('role', 'alert')
      .attr('aria-roledescription', messageLocalization.format('dxDataGrid-ariaError'))
      .addClass(ERROR_MESSAGE_CLASS)
      .text(message);

    if (error.url) {
      $('<a>').attr('href', error.url).text(error.url).appendTo($message);
    }

    return $message;
  }

  renderErrorRow(error, rowIndex, $popupContent) {
    const that = this;
    let $errorMessageElement;
    let $firstErrorRow;

    if ($popupContent) {
      $popupContent.find(`.${ERROR_MESSAGE_CLASS}`).remove();
      $errorMessageElement = that._createErrorRow(error);
      $popupContent.prepend($errorMessageElement);
      return $errorMessageElement;
    }

    const viewElement = rowIndex >= 0 || !that._columnHeadersView.isVisible() ? that._rowsView : that._columnHeadersView;
    const $tableElements = viewElement.getTableElements();

    each($tableElements, (_, tableElement) => {
      $errorMessageElement = that._createErrorRow(error, $tableElements);
      $firstErrorRow = $firstErrorRow || $errorMessageElement;

      if (rowIndex >= 0) {
        const $row = viewElement._getRowElements($(tableElement)).eq(rowIndex);
        that.removeErrorRow($row.next());
        $errorMessageElement.insertAfter($row);
      } else {
        const $tbody = $(tableElement).children('tbody');
        const rowElements = $tbody.children('tr');
        if (that._columnHeadersView.isVisible()) {
          that.removeErrorRow(rowElements.last());
          $(tableElement).append($errorMessageElement);
        } else {
          that.removeErrorRow(rowElements.first());
          $tbody.first().prepend($errorMessageElement);
        }
      }
    });

    const resizingController = that.getController('resizing');
    resizingController && resizingController.fireContentReadyAction();

    return $firstErrorRow;
  }

  removeErrorRow($row?) {
    if (!$row) {
      const $columnHeaders = this._columnHeadersView && this._columnHeadersView.element();
      $row = $columnHeaders && $columnHeaders.find(`.${ERROR_ROW_CLASS}`);
      if (!$row || !$row.length) {
        const $rowsViewElement = this._rowsView.element();
        $row = $rowsViewElement && $rowsViewElement.find(`.${ERROR_ROW_CLASS}`);
      }
    }
    $row && $row.hasClass(ERROR_ROW_CLASS) && $row.remove();
  }

  optionChanged(args) {
    switch (args.name) {
      case 'errorRowEnabled':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
}

const data = (Base: ModuleType<DataController>) => class ErrorHandlingDataControllerExtends extends Base {
  init() {
    const that = this;
    const errorHandlingController = that.getController('errorHandling');

    super.init();

    that.dataErrorOccurred.add((error, $popupContent) => {
      if (that.option('errorRowEnabled')) {
        errorHandlingController.renderErrorRow(error, undefined, $popupContent);
      }
    });
    that.changed.add((e) => {
      if (e && e.changeType === 'loadError') {
        return;
      }
      const errorHandlingController = that.getController('errorHandling');
      const editingController = that.getController('editing');

      if (editingController && !editingController.hasChanges()) {
        errorHandlingController && errorHandlingController.removeErrorRow();
      }
    });
  }
};

export const errorHandlingModule = {
  defaultOptions() {
    return {
      errorRowEnabled: true,
    };
  },
  controllers: {
    errorHandling: ErrorHandlingController,
  },
  extenders: {
    controllers: {
      data,
    },
  },
};

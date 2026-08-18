import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import type { DxError } from '@ts/core/utils/m_error';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import modules from '@ts/grids/grid_core/m_modules';
import type { OptionChanged } from '@ts/grids/grid_core/m_types';
import type { ToastViewController } from '@ts/grids/grid_core/toast/m_toast_controller';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import {
  ACTION_CLASS,
  ERROR_CLOSEBUTTON_CLASS,
  ERROR_MESSAGE_CLASS,
  ERROR_ROW_CLASS,
} from './const';
import type { ExternalError } from './types';
import { getErrorMessage, isDxError } from './utils';

export class ErrorHandlingController extends modules.ViewController {
  private _resizingController!: ResizingController;

  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private _editingController!: EditingController;

  private _columnHeadersView!: ColumnHeadersView;

  private _rowsView!: RowsView;

  private _toastViewController!: ToastViewController;

  public init(): void {
    this._resizingController = this.getController('resizing');
    this._columnsController = this.getController('columns');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._toastViewController = this.getController('toastViewController');
    this._rowsView = this.getView('rowsView');
    this._dataController = this.getController('data');
    this._editingController = this.getController('editing');

    this._dataController.dataErrorOccurred.add(this.handleDataErrorOccurred);
    this._dataController.changed.add(this.handleDataChanged);
  }

  private readonly handleDataErrorOccurred = (
    error: DxError | ExternalError | string,
    $popupContent?: dxElementWrapper,
  ): void => {
    if (this.option('errorRowEnabled')) {
      this.renderErrorRow(error, undefined, $popupContent);
    }
  };

  private readonly handleDataChanged = (e?: DataChange): void => {
    if (e?.changeType === 'loadError') {
      return;
    }

    if (this._editingController && !this._editingController.hasChanges()) {
      this.removeErrorRow();
    }
  };

  private _createErrorRow(
    error: DxError | ExternalError | string,
    $tableElements?: dxElementWrapper,
  ): dxElementWrapper {
    const $errorMessage = this._renderErrorMessage(error);

    if ($tableElements) {
      const $errorRow = $('<tr>')
        .attr('role', 'row')
        .addClass(ERROR_ROW_CLASS);
      const $closeButton = $('<div>')
        .addClass(ERROR_CLOSEBUTTON_CLASS)
        .addClass(this.addWidgetPrefix(ACTION_CLASS));

      eventsEngine.on($closeButton, clickEventName, this.createAction((args) => {
        const e = args.event;
        const errorRowIndex = $(e.currentTarget).closest(`.${ERROR_ROW_CLASS}`).index();

        e.stopPropagation();
        each($tableElements, (_, tableElement) => {
          const $row = $(tableElement).children('tbody').children('tr').eq(errorRowIndex);
          this.removeErrorRow($row);
        });

        this._resizingController?.fireContentReadyAction?.();
      }));

      $('<td>')
        // @ts-expect-error object attributes
        .attr({
          colSpan: this._columnsController.getVisibleColumns().length,
          role: 'gridcell',
        })
        .prepend($closeButton)
        .append($errorMessage)
        .appendTo($errorRow);

      return $errorRow;
    }

    return $errorMessage;
  }

  private _renderErrorMessage(error: DxError | ExternalError | string): dxElementWrapper {
    const $message = $('<div>')
      .addClass(ERROR_MESSAGE_CLASS)
      .text(getErrorMessage(error));

    this.setAria('role', 'alert', $message);
    this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaError'), $message);

    if (isDxError(error)) {
      $('<a>').attr('href', error.url).text(error.url).appendTo($message);
    }

    return $message;
  }

  public renderErrorRow(
    error: DxError | ExternalError | string,
    rowIndex: number | undefined,
    $popupContent: dxElementWrapper | undefined,
  ): dxElementWrapper | undefined {
    if ($popupContent) {
      $popupContent.find(`.${ERROR_MESSAGE_CLASS}`).remove();
      const $errorMessageElement = this._createErrorRow(error);
      $popupContent.prepend($errorMessageElement);

      return $errorMessageElement;
    }

    const targetRowIndex = rowIndex ?? -1;
    const hasTargetRow = targetRowIndex >= 0;
    const shouldRenderInRowsView = hasTargetRow || !this._columnHeadersView.isVisible();
    const viewElement = shouldRenderInRowsView ? this._rowsView : this._columnHeadersView;

    const $tableElements: dxElementWrapper = viewElement.getTableElements();
    let $firstErrorRow: dxElementWrapper | undefined;

    each($tableElements, (_, tableElement: Element): void => {
      const $errorMessageElement = this._createErrorRow(error, $tableElements);
      $firstErrorRow = $firstErrorRow ?? $errorMessageElement;

      if (hasTargetRow) {
        const $row = viewElement._getRowElements($(tableElement)).eq(targetRowIndex);
        this.removeErrorRow($row.next());
        $errorMessageElement.insertAfter($row);
      } else {
        const $tbody = $(tableElement).children('tbody');
        const rowElements = $tbody.children('tr');
        if (this._columnHeadersView.isVisible()) {
          this.removeErrorRow(rowElements.last());
          $(tableElement).append($errorMessageElement);
        } else {
          this.removeErrorRow(rowElements.first());
          $tbody.first().prepend($errorMessageElement);
        }
      }
    });

    this._resizingController?.fireContentReadyAction?.();

    return $firstErrorRow;
  }

  private findErrorRows(): dxElementWrapper | undefined {
    const $columnHeaders: dxElementWrapper | undefined = this._columnHeadersView?.element();
    const $headerErrorRows = $columnHeaders?.find(`.${ERROR_ROW_CLASS}`);

    if ($headerErrorRows?.length) {
      return $headerErrorRows;
    }

    const $rowsViewElement: dxElementWrapper | undefined = this._rowsView?.element();

    return $rowsViewElement?.find(`.${ERROR_ROW_CLASS}`);
  }

  public removeErrorRow($row?: dxElementWrapper): void {
    const $errorRow = $row ?? this.findErrorRows();

    if ($errorRow?.hasClass(ERROR_ROW_CLASS)) {
      $errorRow.remove();
    }
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'errorRowEnabled':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public showToastError(message: string): void {
    this._toastViewController.showToast(message, { type: 'error' });
  }
}

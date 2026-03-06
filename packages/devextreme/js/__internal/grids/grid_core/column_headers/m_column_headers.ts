import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { ColumnContextMenuMixin } from '@ts/grids/grid_core/context_menu/m_column_context_menu_mixin';
import type { HeaderFilterController } from '@ts/grids/grid_core/header_filter/m_header_filter';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';

import type { Column } from '../columns_controller/types';
import { CLASSES as REORDERING_CLASSES } from '../columns_resizing_reordering/const';
import type { HeadersKeyboardNavigationController } from '../keyboard_navigation/m_headers_keyboard_navigation';
import { registerKeyboardAction } from '../m_accessibility';
import { ColumnsView } from '../views/m_columns_view';

const CELL_CONTENT_CLASS = 'text-content';
const HEADERS_CLASS = 'headers';
const NOWRAP_CLASS = 'nowrap';
const ROW_CLASS_SELECTOR = '.dx-row';
const HEADER_ROW_CLASS = 'dx-header-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const CONTEXT_MENU_SORT_ASC_ICON = 'context-menu-sort-asc';
const CONTEXT_MENU_SORT_DESC_ICON = 'context-menu-sort-desc';
const CONTEXT_MENU_SORT_NONE_ICON = 'context-menu-sort-none';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const VISIBILITY_HIDDEN_CLASS = 'dx-visibility-hidden';
const TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX = 'dx-text-content-alignment-';
const SORT_INDICATOR_CLASS = 'dx-sort-indicator';
const SORT_INDEX_INDICATOR_CLASS = 'dx-sort-index-indicator';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
const HEADER_FILTER_INDICATOR_CLASS = 'dx-header-filter-indicator';
const MULTI_ROW_HEADER_CLASS = 'dx-header-multi-row';
const LINK = 'dx-link';

const createCellContent = function (that, $cell, options) {
  const $cellContent = $('<div>').addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));

  that.setAria('role', 'presentation', $cellContent);

  addCssClassesToCellContent(that, $cell, options.column, $cellContent);
  const showColumnLines = that.option('showColumnLines');
  // TODO getController
  const contentAlignment = that.getController('columns').getHeaderContentAlignment(options.column.alignment);

  return $cellContent[showColumnLines || contentAlignment === 'right' ? 'appendTo' : 'prependTo']($cell);
};

function addCssClassesToCellContent(that, $cell, column, $cellContent?) {
  const $indicatorElements = that._getIndicatorElements($cell, true);
  const $visibleIndicatorElements = that._getIndicatorElements($cell);
  const indicatorCount = $indicatorElements?.length;
  const columnAlignment = that._getColumnAlignment(column.alignment);

  const sortIndicatorClassName = `.${that._getIndicatorClassName('sort')}`;
  const sortIndexIndicatorClassName = `.${that._getIndicatorClassName('sortIndex')}`;

  const $sortIndicator = $visibleIndicatorElements.filter(sortIndicatorClassName);
  const $sortIndexIndicator = $visibleIndicatorElements.children().filter(sortIndexIndicatorClassName);

  $cellContent = $cellContent || $cell.children(`.${that.addWidgetPrefix(CELL_CONTENT_CLASS)}`);

  $cellContent
    .toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + columnAlignment, indicatorCount > 0)
    .toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + (columnAlignment === 'left' ? 'right' : 'left'), indicatorCount > 0 && column.alignment === 'center')
    .toggleClass(SORT_INDICATOR_CLASS, !!$sortIndicator.length)
    .toggleClass(SORT_INDEX_INDICATOR_CLASS, !!$sortIndexIndicator.length)
    .toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter(`.${that._getIndicatorClassName('headerFilter')}`).length);
}

export class ColumnHeadersView extends ColumnContextMenuMixin(ColumnsView) {
  private _isGroupingChanged: any;

  private _lastActionElement: any;

  private _hasRowElements: any;

  private _headerPanelView!: HeaderPanel;

  protected _headersKeyboardNavigation!: HeadersKeyboardNavigationController;

  protected _headerFilterController!: HeaderFilterController;

  public init(): void {
    super.init();
    this._headerPanelView = this.getView('headerPanel');
    this._headerFilterController = this.getController('headerFilter');
    this._dataController = this.getController('data');
    this._headersKeyboardNavigation = this.getController('headersKeyboardNavigation');
  }

  protected _createTable() {
    // @ts-expect-error
    const $table = super._createTable.apply(this, arguments);

    eventsEngine.on($table, 'mousedown selectstart', this.createAction((e) => {
      const { event } = e;

      if (event.shiftKey) {
        event.preventDefault();
      }
    }));

    return $table;
  }

  private _isLegacyKeyboardNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  }

  private _getDefaultTemplate(column) {
    const that = this;

    return function ($container, options) {
      const { caption } = column;
      const needCellContent = !column.command || (caption && column.command !== 'expand');

      if (column.command === 'empty') {
        that._renderEmptyMessage($container, options);
      } else if (needCellContent) {
        const $content = createCellContent(that, $container, options);

        $content.text(caption);
      } else if (column.command) {
        $container.html('&nbsp;');
      }
    };
  }

  private _renderEmptyMessage($container, options) {
    const textEmpty = this._getEmptyHeaderText();

    if (!textEmpty) {
      $container.html('&nbsp;');
      return;
    }

    const $cellContent = createCellContent(this, $container, options);
    const needSplit = textEmpty.includes('{0}');

    if (needSplit) {
      const [leftPart, rightPart] = textEmpty.split('{0}');
      const columnChooserTitle = messageLocalization.format('dxDataGrid-emptyHeaderColumnChooserText');

      const columnChooserView = this._columnChooserView;
      const $link = $('<a>').text(columnChooserTitle).addClass(LINK);

      eventsEngine.on($link, 'click', this.createAction(() => columnChooserView.showColumnChooser()));

      $cellContent
        .append(domAdapter.createTextNode(leftPart))
        .append($link)
        .append(domAdapter.createTextNode(rightPart));
    } else {
      $cellContent.text(textEmpty);
    }
  }

  private _getEmptyHeaderText() {
    const hasHiddenColumns = !!this._columnChooserView.hasHiddenColumns();
    const hasGroupedColumns = !!this._headerPanelView.hasGroupedColumns();

    switch (true) {
      case hasHiddenColumns && hasGroupedColumns:
        return messageLocalization.format('dxDataGrid-emptyHeaderWithColumnChooserAndGroupPanelText');

      case hasGroupedColumns:
        return messageLocalization.format('dxDataGrid-emptyHeaderWithGroupPanelText');

      case hasHiddenColumns:
        return messageLocalization.format('dxDataGrid-emptyHeaderWithColumnChooserText');

      default:
        return '';
    }
  }

  private _getHeaderTemplate(column) {
    return column.headerCellTemplate || { allowRenderToDetachedContainer: true, render: this._getDefaultTemplate(column) };
  }

  protected _processTemplate(template, options) {
    const that = this;
    let resultTemplate;
    const { column } = options;
    const renderingTemplate = super._processTemplate(template);

    if (options.rowType === 'header' && renderingTemplate && column.headerCellTemplate && !column.command) {
      resultTemplate = {
        render(options) {
          const $content = createCellContent(that, options.container, options.model);
          renderingTemplate.render(extend({}, options, { container: $content }));
        },
      };
    } else {
      resultTemplate = renderingTemplate;
    }

    return resultTemplate;
  }

  /**
   * @extended: filter_row, selection
   */
  protected _handleDataChanged(e) {
    if (e.changeType !== 'refresh') return;

    if (this._isGroupingChanged || this._requireReady) {
      this._isGroupingChanged = false;
      this.render();
    }
  }

  protected _renderCell($row, options) {
    const $cell = super._renderCell($row, options);

    if (options.row.rowType === 'header') {
      $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
      if (!this._isLegacyKeyboardNavigation()) {
        const { column } = options;
        const isCustomCommandColumn = this._columnsController.isCustomCommandColumn(column);

        if (column && (!column.type || isCustomCommandColumn)) {
          $cell.attr('tabindex', this.option('tabindex') || 0);
        }
      }
    }

    return $cell;
  }

  protected _setCellAriaAttributes($cell, cellOptions, options?) {
    super._setCellAriaAttributes($cell, cellOptions, options);
    if (cellOptions.rowType === 'header') {
      if (!cellOptions.column.type) {
        this.setAria('role', 'columnheader', $cell);
      }
      if (cellOptions.column && !cellOptions.column.command && !cellOptions.column.isBand) {
        $cell.attr('id', cellOptions.column.headerId);
        this.setAria(
          'label',
          `${messageLocalization.format('dxDataGrid-ariaColumn')} ${cellOptions.column.caption}`,
          $cell,
        );
      }
    }
  }

  /**
   * @extended: filter_row
   */
  protected _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);

    $row.toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));

    if (row.rowType === 'header') {
      $row.addClass(HEADER_ROW_CLASS);
      if (!this._isLegacyKeyboardNavigation()) {
        registerKeyboardAction('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
      }
    }

    return $row;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _processHeaderAction(event, $row) {

  }

  private _handleActionKeyDown(args) {
    const { event } = args;
    const $target = $(event.target);

    this._lastActionElement = event.target;

    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      const headerFilterController = this._headerFilterController;
      const $column = $target.closest('td');
      const columnIndex = this.getColumnIndexByElement($column);
      if (columnIndex >= 0) {
        headerFilterController.showHeaderFilterMenu(columnIndex, false);
      }
    } else {
      const $row = $target.closest(ROW_CLASS_SELECTOR);
      this._processHeaderAction(event, $row);
    }

    event.preventDefault();
  }

  /**
   * @extended: filter_row, virtual_column
   */
  protected _renderCore() {
    const that = this;
    const $container = that.element();
    const change = {};

    if (that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
      // @ts-expect-error
      return new Deferred().resolve();
    }

    $container
      .addClass(that.addWidgetPrefix(HEADERS_CLASS))
      .toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled'));

    that.setAria('role', 'presentation', $container);

    const deferred = that._updateContent(that._renderTable({ change }), change);

    $container.toggleClass(MULTI_ROW_HEADER_CLASS, that.getRowCount() > 1);

    // @ts-expect-error
    super._renderCore.apply(that, arguments);
    return deferred;
  }

  protected _renderRows() {
    const that = this;

    if (that._dataController.isLoaded() || that._hasRowElements) {
      // @ts-expect-error
      super._renderRows.apply(that, arguments);
      that._hasRowElements = true;
    }
  }

  protected _renderRow($table, options) {
    const rowIndex = this.getRowCount() === 1 ? null : options.row.rowIndex;

    options.columns = this.getColumns(rowIndex);

    super._renderRow($table, options);
  }

  protected _createCell(options) {
    const { column } = options;
    // @ts-expect-error
    const $cellElement = super._createCell.apply(this, arguments);

    column.rowspan > 1 && options.rowType === 'header' && $cellElement.attr('rowSpan', column.rowspan);

    return $cellElement;
  }

  /**
   * @extended: filter_row
   */
  protected _getRows() {
    const result: any[] = [];
    const rowCount = this.getRowCount();

    if (this.option('showColumnHeaders')) {
      for (let i = 0; i < rowCount; i++) {
        result.push({ rowType: 'header', rowIndex: i });
      }
    }

    return result;
  }

  protected _getCellTemplate(options) {
    if (options.rowType === 'header') {
      return this._getHeaderTemplate(options.column);
    }
  }

  /**
   * @extended: filter_row, header_filter
   */
  protected _columnOptionChanged(e) {
    const { changeTypes } = e;
    const { optionNames } = e;

    if (changeTypes.grouping || changeTypes.groupExpanding) {
      if (changeTypes.grouping) {
        this._isGroupingChanged = true;
      }
      return;
    }

    super._columnOptionChanged(e);

    if (optionNames.width || optionNames.visible) {
      this.resizeCompleted.fire();
    }
  }

  /**
   * @extended: filter_row
   */
  protected _isElementVisible(elementOptions) {
    return elementOptions?.visible;
  }

  private _alignCaptionByCenter($cell) {
    let $indicatorsContainer = this._getIndicatorContainer($cell, true);

    if ($indicatorsContainer?.length) {
      $indicatorsContainer.filter(`.${VISIBILITY_HIDDEN_CLASS}`).remove();
      $indicatorsContainer = this._getIndicatorContainer($cell);

      $indicatorsContainer
        .clone()
        .addClass(VISIBILITY_HIDDEN_CLASS)
        .css('float', '')
        .insertBefore($cell.children(`.${this.addWidgetPrefix(CELL_CONTENT_CLASS)}`));
    }
  }

  public _updateCell($cell, options) {
    if (options.rowType === 'header' && options.column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }

    // @ts-expect-error
    super._updateCell.apply(this, arguments);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _updateIndicator($cell, column, indicatorName) {
    // @ts-expect-error
    const $indicatorElement = super._updateIndicator.apply(this, arguments);

    if (column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }

    addCssClassesToCellContent(this, $cell, column);

    return $indicatorElement;
  }

  protected _getIndicatorContainer($cell, returnAll?) {
    const $indicatorsContainer = super._getIndicatorContainer($cell);

    return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(`:not(.${VISIBILITY_HIDDEN_CLASS})`);
  }

  /**
   * @extended: tree_list/selection
   */
  // eslint-disable-next-line
  protected _isSortableElement($target?) {
    return true;
  }

  public getHeadersRowHeight() {
    const $tableElement = this.getTableElement();
    const $headerRows = $tableElement?.find(`.${HEADER_ROW_CLASS}`);

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return $headerRows?.toArray().reduce((sum, headerRow) => sum + getHeight(headerRow), 0) || 0;
  }

  public getHeaderElement(index: number): dxElementWrapper {
    const $columnElements = this.getColumnElements();

    return $columnElements?.eq(index) ?? $('');
  }

  public getColumnElements(index?, bandColumnIndex?) {
    let $cellElement;
    const columnsController = this._columnsController;
    const rowCount = this.getRowCount();

    if (this.option('showColumnHeaders')) {
      if (rowCount > 1 && (!isDefined(index) || isDefined(bandColumnIndex))) {
        const result: any[] = [];

        let visibleColumns: Column[] = [];
        if (isDefined(bandColumnIndex)) {
          visibleColumns = columnsController.getChildrenByBandColumn(bandColumnIndex, true);
        } else {
          visibleColumns = columnsController.getVisibleColumns();
        }

        visibleColumns.forEach((column) => {
          const rowIndex = index ?? columnsController.getRowIndex(column.index);
          const visibleIndex = columnsController.getVisibleIndex(column.index, rowIndex);
          $cellElement = this._getCellElement(rowIndex, visibleIndex);
          if ($cellElement) {
            result.push($cellElement.get(0));
          }
        });

        return $(result);
      } if (!index || index < rowCount) {
        return this.getCellElements(index || 0);
      }
    }

    return undefined;
  }

  private getColumnIndexByElement($cell) {
    const cellIndex = this.getCellIndex($cell);
    const $row = $cell.closest('.dx-row');
    const { rowIndex } = $row[0];
    const column = this.getColumns(rowIndex)[cellIndex];

    return column ? column.index : -1;
  }

  protected getVisibleColumnIndex(columnIndex, rowIndex) {
    const column = this.getColumns()[columnIndex];

    return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
  }

  /**
   * @extended: column_fixing
   */
  public getColumnWidths($tableElement?, rowIndex?: number) {
    const $columnElements = this.getColumnElements(rowIndex);

    if ($columnElements?.length) {
      return this._getWidths($columnElements);
    }

    // @ts-expect-error
    return super.getColumnWidths.apply(this, arguments);
  }

  /**
   * @extended: column_chooser
   */
  public isColumnReorderingEnabled(column): boolean {
    return column.allowReordering
      && (this.option('allowColumnReordering') ?? this._columnsController.isColumnOptionUsed('allowReordering'));
  }

  public allowDragging(column) {
    const rowIndex = column && this._columnsController.getRowIndex(column.index);
    const columns = this.getColumns(rowIndex);

    return this.isColumnReorderingEnabled(column) && columns.length > 1;
  }

  protected getBoundingRect() {
    const that = this;
    const $columnElements = that.getColumnElements();

    if ($columnElements?.length) {
      const offset = that.getTableElement()!.offset();
      return {
        top: offset!.top,
      };
    }
    return null;
  }

  public getName() {
    return 'headers';
  }

  private getColumnCount() {
    const $columnElements = this.getColumnElements();

    return $columnElements ? $columnElements.length : 0;
  }

  /**
   * @extended: filter_row
   */
  public isVisible() {
    return this.option('showColumnHeaders')!;
  }

  public optionChanged(args) {
    const that = this;

    switch (args.name) {
      case 'showColumnHeaders':
      case 'wordWrapEnabled':
      case 'showColumnLines':
        that._invalidate(true, true);
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public getHeight() {
    return this.getElementHeight();
  }

  /**
   * @extended: column_fixing
   */
  public getContextMenuItems(options) {
    let items;
    const { column } = options;

    if (options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      const sortingOptions = this.option('sorting');

      if (sortingOptions && sortingOptions.mode !== 'none' && column?.allowSorting) {
        const onItemClick = (params) => {
          setTimeout(() => {
            this._columnsController.changeSortOrder(column.index, params.itemData.value);
          });
        };

        items = [
          {
            text: sortingOptions.ascendingText, value: 'asc', disabled: column.sortOrder === 'asc', icon: CONTEXT_MENU_SORT_ASC_ICON, onItemClick,
          },
          {
            text: sortingOptions.descendingText, value: 'desc', disabled: column.sortOrder === 'desc', icon: CONTEXT_MENU_SORT_DESC_ICON, onItemClick,
          },
          {
            name: 'clearSorting', text: sortingOptions.clearText, value: 'none', disabled: !column.sortOrder, icon: CONTEXT_MENU_SORT_NONE_ICON, onItemClick,
          },
        ];
      }

      if (options.row.rowType === 'header') {
        const moveColumnItems = this.getMoveColumnContextMenuItems(options);

        if (moveColumnItems?.length) {
          items = items ?? [];
          items.push(...moveColumnItems);
        }
      }
    }

    return items;
  }

  protected getRowCount() {
    return this._columnsController?.getRowCount();
  }

  public toggleDraggableColumnClass(columnIndex, value, rowIndex?) {
    let i;
    let columnElements;
    const rowCount = this.getRowCount();
    const columns = this._columnsController.getColumns();
    const column = columns?.[columnIndex];
    const columnID = column?.isBand && column.index;
    const setColumnClass = (column, index) => {
      if (column.ownerBand === columnID) {
        columnElements
          .eq(index)
          .toggleClass(this.addWidgetPrefix(REORDERING_CLASSES.draggableColumn), value);

        if (column.isBand) {
          this.toggleDraggableColumnClass(column.index, value, i + 1);
        }
      }
    };

    if (isDefined(columnID)) {
      rowIndex = rowIndex || 0;
      for (i = rowIndex; i < rowCount; i++) {
        columnElements = this.getCellElements(i);

        if (columnElements) {
          const rowColumns = this.getColumns(i);
          rowColumns.forEach(setColumnClass);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isFilterRowCell($cell: dxElementWrapper): boolean {
    return false;
  }

  public getKeyboardNavigationController() {
    return this._headersKeyboardNavigation;
  }
}

export const columnHeadersModule = {
  defaultOptions() {
    return {
      showColumnHeaders: true,
      cellHintEnabled: true,
    };
  },
  views: {
    columnHeadersView: ColumnHeadersView,
  },
};

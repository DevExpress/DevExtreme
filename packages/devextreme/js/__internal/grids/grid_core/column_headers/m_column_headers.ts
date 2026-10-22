import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import { isDefined, isString } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { ItemClickEvent } from '@js/ui/context_menu';
import type {
  Column, ColumnsChanges, ColumnTemplateSource, TemplateModel,
} from '@ts/grids/grid_core/columns_controller/types';
import { ColumnContextMenuMixin } from '@ts/grids/grid_core/context_menu/m_column_context_menu_mixin';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { HeaderFilterController } from '@ts/grids/grid_core/header_filter/m_header_filter';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import type { InternalGridOptions, OptionChanged } from '@ts/grids/grid_core/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';

import { registerKeyboardAction } from '../accessibility';
import { CLASSES as REORDERING_CLASSES } from '../columns_resizing_reordering/const';
import { CELL_FOCUS_DISABLED_CLASS, LINK_CLASS } from '../editing/const';
import type { HeadersKeyboardNavigationController } from '../keyboard_navigation/headers_keyboard_navigation';
import { ColumnsView } from '../views/columns_view';
import type {
  BoundingRect,
  CellRenderOptions,
  ColumnViewTemplate,
  ColumnViewTemplateOptions,
  ContextMenuItemsOptions,
  GridContextMenuItem,
  RowRenderOptions,
  TableRenderOptions,
  ViewCellOptions,
  ViewRow,
} from '../views/types';
import { CLASSES, ICONS } from './const';
import type { ElementVisibilityOptions, KeyboardActionArgs, SortMenuItem } from './types';

const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
const HEADER_FILTER_INDICATOR_CLASS = 'dx-header-filter-indicator';

export class ColumnHeadersView extends ColumnContextMenuMixin(ColumnsView) {
  private _isGroupingChanged?: boolean;

  private _hasRowElements?: boolean;

  private _headerPanelView!: HeaderPanel;

  protected _headersKeyboardNavigation!: HeadersKeyboardNavigationController;

  protected _headerFilterController!: HeaderFilterController;

  private addCssClassesToCellContent(
    $cell: dxElementWrapper,
    column: Column,
    $cellContent?: dxElementWrapper,
  ): void {
    const $indicatorElements = this._getIndicatorElements($cell, true);
    const $visibleIndicatorElements = this._getIndicatorElements($cell);
    const indicatorCount = $indicatorElements?.length;
    const columnAlignment = this._getColumnAlignment(column.alignment ?? '');

    const sortIndicatorClassName = `.${this._getIndicatorClassName('sort')}`;
    const sortIndexIndicatorClassName = `.${this._getIndicatorClassName('sortIndex')}`;

    const $sortIndicator = $visibleIndicatorElements.filter(sortIndicatorClassName);
    const $sortIndexIndicator = $visibleIndicatorElements
      .children()
      .filter(sortIndexIndicatorClassName);
    const $content = $cellContent
      ?? $cell.children(`.${this.addWidgetPrefix(CLASSES.cellContent)}`);

    $content
      .toggleClass(CLASSES.textContentAlignmentPrefix + columnAlignment, indicatorCount > 0)
      .toggleClass(CLASSES.textContentAlignmentPrefix + (columnAlignment === 'left' ? 'right' : 'left'), indicatorCount > 0 && column.alignment === 'center')
      .toggleClass(CLASSES.sortIndicator, Boolean($sortIndicator.length))
      .toggleClass(CLASSES.sortIndexIndicator, Boolean($sortIndexIndicator.length))
      .toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter(`.${this._getIndicatorClassName('headerFilter')}`).length);
  }

  protected createCellContent(
    $cell: dxElementWrapper,
    column: Column,
  ): dxElementWrapper {
    const $cellContent = $('<div>').addClass(this.addWidgetPrefix(CLASSES.cellContent));

    this.setAria('role', 'presentation', $cellContent);

    this.addCssClassesToCellContent($cell, column, $cellContent);
    const showColumnLines = this.option('showColumnLines');
    // TODO getController
    const contentAlignment = this.getController('columns').getHeaderContentAlignment(column.alignment);

    if (showColumnLines || contentAlignment === 'right') {
      $cellContent.appendTo($cell);
    } else {
      $cellContent.prependTo($cell);
    }

    return $cellContent;
  }

  public init(): void {
    super.init();
    this._headerPanelView = this.getView('headerPanel');
    this._headerFilterController = this.getController('headerFilter');
    this._dataController = this.getController('data');
    this._headersKeyboardNavigation = this.getController('headersKeyboardNavigation');
  }

  protected _createTable(columns?: Column[], isAppend?: boolean): dxElementWrapper {
    const $table = super._createTable(columns, isAppend);

    eventsEngine.on($table, 'mousedown selectstart', this.createAction((e) => {
      const { event } = e;

      if (event.shiftKey) {
        event.preventDefault();
      }
    }));

    return $table;
  }

  private _isLegacyKeyboardNavigation(): boolean | undefined {
    return this.option('useLegacyKeyboardNavigation');
  }

  protected getHeaderDefaultTemplate($container: dxElementWrapper, options: ViewCellOptions): void {
    const { column } = options;
    const { caption } = column;
    const needCellContent = !column.command || (caption && column.command !== 'expand');

    if (column.command === 'empty') {
      this._renderEmptyMessage($container, options);
    } else if (needCellContent) {
      const $content = this.createCellContent($container, column);

      $content.text(caption ?? '');
    } else if (column.command) {
      $container.html('&nbsp;');
    }
  }

  private _renderEmptyMessage($container: dxElementWrapper, options: ViewCellOptions): void {
    const textEmpty = this._getEmptyHeaderText();

    if (!textEmpty) {
      $container.html('&nbsp;');
      return;
    }

    const $cellContent = this.createCellContent($container, options.column);
    const needSplit = textEmpty.includes('{0}');

    if (needSplit) {
      const [leftPart, rightPart] = textEmpty.split('{0}');
      const columnChooserTitle = messageLocalization.format('dxDataGrid-emptyHeaderColumnChooserText');

      const columnChooserView = this._columnChooserView;
      const $link = $('<a>').text(columnChooserTitle).addClass(LINK_CLASS);

      eventsEngine.on($link, 'click', this.createAction(() => columnChooserView.showColumnChooser()));

      $cellContent
        .append(domAdapter.createTextNode(leftPart))
        .append($link)
        .append(domAdapter.createTextNode(rightPart));
    } else {
      $cellContent.text(textEmpty);
    }
  }

  private _getEmptyHeaderText(): string {
    const hasHiddenColumns = Boolean(this._columnChooserView.hasHiddenColumns());
    const hasGroupedColumns = Boolean(this._headerPanelView.hasGroupedColumns());

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

  private _getHeaderTemplate(column: Column): ColumnTemplateSource<ViewCellOptions> {
    if (column.headerCellTemplate) {
      return column.headerCellTemplate;
    }

    return {
      allowRenderToDetachedContainer: true,
      render: this.getHeaderDefaultTemplate.bind(this),
    };
  }

  protected _processTemplate(
    template: ColumnTemplateSource,
    options?: TemplateModel,
  ): ColumnViewTemplate {
    const { column, rowType }: TemplateModel = options ?? {};
    const renderingTemplate = super._processTemplate(template);
    const hasHeaderCellTemplate = column?.headerCellTemplate && !column.command;

    if (rowType === 'header' && renderingTemplate && column && hasHeaderCellTemplate) {
      return {
        render: (templateOptions: ColumnViewTemplateOptions): void => {
          const $content = this.createCellContent(templateOptions.container, column);
          renderingTemplate.render(extend({}, templateOptions, { container: $content }));
        },
      };
    }

    return renderingTemplate;
  }

  /**
   * @extended: filter_row, selection
   */
  protected _handleDataChanged(e: DataChange): void {
    if (e.changeType !== 'refresh') {
      return;
    }

    if (this._isGroupingChanged || this._requireReady) {
      this._isGroupingChanged = false;
      this.render();
    }
  }

  protected _renderCell($row: dxElementWrapper, options: CellRenderOptions): dxElementWrapper {
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

  protected _setCellAriaAttributes(
    $cell: dxElementWrapper,
    cellOptions: ViewCellOptions,
    options: CellRenderOptions,
  ): void {
    super._setCellAriaAttributes($cell, cellOptions, options);

    if (cellOptions.rowType !== 'header') {
      return;
    }

    const { column } = cellOptions;

    if (!column.type) {
      this.setAria('role', 'columnheader', $cell);
    }

    if (column && !column.command && !column.isBand) {
      // @ts-expect-error attr() is typed without undefined
      $cell.attr('id', column.headerId);
      this.setAria(
        'label',
        `${messageLocalization.format('dxDataGrid-ariaColumn')} ${column.caption}`,
        $cell,
      );
    }
  }

  /**
   * @extended: filter_row
   */
  protected _createRow(row: ViewRow, tagName?: string): dxElementWrapper {
    const $row = super._createRow(row, tagName);

    $row.toggleClass(VIEW_CLASSES.columnLines, this.option('showColumnLines'));

    if (row.rowType === 'header') {
      $row.addClass(CLASSES.headerRow);
      if (!this._isLegacyKeyboardNavigation()) {
        registerKeyboardAction('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
      }
    }

    return $row;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the params
  protected _processHeaderAction(event: DxEvent, $row: dxElementWrapper): void {

  }

  private _handleActionKeyDown(args: KeyboardActionArgs): void {
    const { event } = args;
    const $target = $(event.target);

    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      const headerFilterController = this._headerFilterController;
      const $column = $target.closest('td');
      const columnIndex = this.getColumnIndexByElement($column);
      if (isDefined(columnIndex) && columnIndex >= 0) {
        headerFilterController.showHeaderFilterMenu(columnIndex, false);
      }
    } else {
      const $row = $target.closest(`.${VIEW_CLASSES.row}`);
      this._processHeaderAction(event, $row);
    }

    event.preventDefault();
  }

  /**
   * @extended: filter_row, virtual_column
   */
  protected _renderCore(options?: DataChange): DeferredObj<unknown> {
    if (this._tableElement && !this._dataController.isLoaded() && !this._hasRowElements) {
      return Deferred().resolve();
    }

    // @ts-expect-error the view is rendered here
    const $container: dxElementWrapper = this.element();

    $container
      .addClass(this.addWidgetPrefix(CLASSES.headers))
      .toggleClass(this.addWidgetPrefix(VIEW_CLASSES.noWrap), !this.option('wordWrapEnabled'));

    this.setAria('role', 'presentation', $container);

    const change = {};
    const deferred = this._updateContent(this._renderTable({ change }), change);

    $container.toggleClass(CLASSES.multiRowHeader, this.getRowCount() > 1);

    super._renderCore(options);

    return deferred.done((): void => {
      this.updateScrollLeftPosition();
    });
  }

  protected _renderRows($table: dxElementWrapper, options: TableRenderOptions): void {
    if (this._dataController.isLoaded() || this._hasRowElements) {
      super._renderRows($table, options);
      this._hasRowElements = true;
    }
  }

  protected _renderRow($table: dxElementWrapper, options: RowRenderOptions): void {
    const rowIndex = this.getRowCount() === 1 ? null : options.row.rowIndex;

    options.columns = this.getColumns(rowIndex);

    super._renderRow($table, options);
  }

  protected _createCell(options: ViewCellOptions): dxElementWrapper {
    const { column } = options;
    const $cellElement = super._createCell(options);

    if (options.rowType !== 'header') {
      return $cellElement;
    }

    const isBandColumnsUsed = this._columnsController.isBandColumnsUsed();

    if (isBandColumnsUsed && options.rowIndex !== undefined) {
      this.toggleFirstCellClass(
        $cellElement,
        this._columnsController.isFirstColumn(column, options.rowIndex),
      );
    }

    if (column.rowspan !== undefined && column.rowspan > 1) {
      $cellElement.attr('rowSpan', column.rowspan);
    }

    return $cellElement;
  }

  /**
   * @extended: filter_row
   */
  public _getRows(): ViewRow[] {
    const result: ViewRow[] = [];
    const rowCount = this.getRowCount();

    if (this.option('showColumnHeaders')) {
      for (let i = 0; i < rowCount; i += 1) {
        result.push({ rowType: 'header', rowIndex: i });
      }
    }

    return result;
  }

  protected _getCellTemplate(
    options: ViewCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    if (options.rowType === 'header') {
      return this._getHeaderTemplate(options.column);
    }

    return undefined;
  }

  /**
   * @extended: filter_row, header_filter
   */
  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { changeTypes, optionNames } = e;

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
  protected _isElementVisible(elementOptions?: ElementVisibilityOptions): boolean {
    return Boolean(elementOptions?.visible);
  }

  private _alignCaptionByCenter($cell: dxElementWrapper): void {
    let $indicatorsContainer = this._getIndicatorContainer($cell, true);

    if ($indicatorsContainer?.length) {
      $indicatorsContainer.filter(`.${CLASSES.visibilityHidden}`).remove();
      $indicatorsContainer = this._getIndicatorContainer($cell);

      $indicatorsContainer
        .clone()
        .addClass(CLASSES.visibilityHidden)
        .css('float', '')
        .insertBefore($cell.children(`.${this.addWidgetPrefix(CLASSES.cellContent)}`));
    }
  }

  public _updateCell($cell: dxElementWrapper, options: ViewCellOptions): void {
    if (options.rowType === 'header' && options.column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }

    super._updateCell($cell, options);
  }

  protected _updateIndicator(
    $cell: dxElementWrapper,
    column: Column,
    indicatorName: string,
  ): dxElementWrapper | undefined {
    const $indicatorElement = super._updateIndicator($cell, column, indicatorName);

    if (column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }

    this.addCssClassesToCellContent($cell, column);

    return $indicatorElement;
  }

  protected _getIndicatorContainer($cell: dxElementWrapper, returnAll?: boolean): dxElementWrapper {
    const $indicatorsContainer = super._getIndicatorContainer($cell);

    return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(`:not(.${CLASSES.visibilityHidden})`);
  }

  /**
   * @extended: tree_list/selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
  protected _isSortableElement($target?: dxElementWrapper): boolean {
    return true;
  }

  public getHeadersRowHeight(): number {
    const $tableElement = this.getTableElement();
    const $headerRows = $tableElement?.find(`.${CLASSES.headerRow}`);

    /* eslint-disable-next-line
      @typescript-eslint/no-unsafe-return, @typescript-eslint/prefer-nullish-coalescing
      -- getHeight() isn't typed yet, NaN falls back to 0 */
    return $headerRows?.toArray().reduce((sum, headerRow) => sum + getHeight(headerRow), 0) || 0;
  }

  public getHeaderElement(index: number): dxElementWrapper {
    const $columnElements = this.getColumnElements();

    return $columnElements?.eq(index) ?? $('');
  }

  public getColumnElements(index?: number, bandColumnIndex?: number): dxElementWrapper | undefined {
    const columnsController = this._columnsController;
    const rowCount = this.getRowCount();

    if (this.option('showColumnHeaders')) {
      if (rowCount > 1 && (!isDefined(index) || isDefined(bandColumnIndex))) {
        const result: Element[] = [];

        let visibleColumns: Column[] = [];
        if (isDefined(bandColumnIndex)) {
          visibleColumns = columnsController.getChildrenByBandColumn(bandColumnIndex, true);
        } else {
          visibleColumns = columnsController.getVisibleColumns();
        }

        visibleColumns.forEach((column) => {
          const rowIndex = index
            ?? (isDefined(column.index) ? columnsController.getRowIndex(column.index) : 0);
          const visibleIndex = columnsController.getVisibleIndex(column.index, rowIndex);
          const $cellElement = this._getCellElement(rowIndex, visibleIndex);
          if ($cellElement) {
            result.push($cellElement.get(0));
          }
        });

        return $(result);
      }
      if (!index) {
        return this.getCellElements(0);
      }
      if (index < rowCount) {
        return this.getCellElements(index);
      }
    }

    return undefined;
  }

  private getColumnIndexByElement($cell: dxElementWrapper): number | undefined {
    const cellIndex = this.getCellIndex($cell);
    const $row = $cell.closest(`.${VIEW_CLASSES.row}`);
    const { rowIndex }: HTMLTableRowElement = $row[0];
    const column = this.getColumns(rowIndex)[cellIndex];

    return column ? column.index : -1;
  }

  protected getVisibleColumnIndex(columnIndex: number, rowIndex?: number): number {
    const column = this.getColumns()[columnIndex];

    return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
  }

  /**
   * @extended: column_fixing
   */
  public getColumnWidths($tableElement?: dxElementWrapper, rowIndex?: number): number[] {
    const $columnElements = this.getColumnElements(rowIndex);

    if ($columnElements?.length) {
      return this._getWidths($columnElements);
    }

    return super.getColumnWidths($tableElement, rowIndex);
  }

  public isColumnReorderingEnabled(column: Column): boolean | undefined {
    return column.allowReordering
      && (this.option('allowColumnReordering') ?? this._columnsController.isColumnOptionUsed('allowReordering'));
  }

  public allowDragging(column: Column): boolean | undefined {
    const rowIndex = column && isDefined(column.index)
      ? this._columnsController.getRowIndex(column.index)
      : undefined;
    const columns = this.getColumns(rowIndex);

    return this.isColumnReorderingEnabled(column) && columns.length > 1;
  }

  protected getBoundingRect(): BoundingRect | null {
    const $columnElements = this.getColumnElements();

    if (!$columnElements?.length) {
      return null;
    }

    const offset = this.getTableElement()?.offset();

    return offset ? { top: offset.top } : null;
  }

  public getName(): string {
    return 'headers';
  }

  private getColumnCount(): number {
    const $columnElements = this.getColumnElements();

    return $columnElements ? $columnElements.length : 0;
  }

  protected _getVisibleColumnIndex(
    $cells: dxElementWrapper,
    rowIndex: number,
    columnIdentifier: string | number,
  ): number {
    if (isString(columnIdentifier)) {
      const columnIndex = this._columnsController.columnOption(columnIdentifier, 'index');

      return this._columnsController.getVisibleIndex(columnIndex, rowIndex);
    }

    return super._getVisibleColumnIndex($cells, rowIndex, columnIdentifier);
  }

  /**
   * @extended: filter_row
   */
  public isVisible(): boolean {
    return Boolean(this.option('showColumnHeaders'));
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'showColumnHeaders':
      case 'wordWrapEnabled':
      case 'showColumnLines':
        this._invalidate(true, true);
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public getHeight(): number {
    return this.getElementHeight();
  }

  /**
   * @extended: column_fixing
   */
  public getContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem[] | undefined {
    const items: GridContextMenuItem[] = [];
    const { column } = options;

    if (options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      const sortingOptions = this.option('sorting');

      if (sortingOptions && sortingOptions.mode !== 'none' && column?.allowSorting) {
        const onItemClick = ({ itemData }: ItemClickEvent<SortMenuItem>): void => {
          setTimeout(() => {
            if (isDefined(column.index) && itemData) {
              this._columnsController.changeSortOrder(column.index, itemData.value);
            }
          });
        };

        items.push(
          {
            text: sortingOptions.ascendingText,
            value: 'asc',
            disabled: column.sortOrder === 'asc',
            icon: ICONS.contextMenuSortAsc,
            onItemClick,
          },
          {
            text: sortingOptions.descendingText,
            value: 'desc',
            disabled: column.sortOrder === 'desc',
            icon: ICONS.contextMenuSortDesc,
            onItemClick,
          },
          {
            name: 'clearSorting',
            text: sortingOptions.clearText,
            value: 'none',
            disabled: !column.sortOrder,
            icon: ICONS.contextMenuSortNone,
            onItemClick,
          },
        );
      }

      if (options.row.rowType === 'header') {
        items.push(...this.getMoveColumnContextMenuItems(options));
      }
    }

    return items.length ? items : undefined;
  }

  protected getRowCount(): number {
    return this._columnsController?.getRowCount();
  }

  public toggleDraggableColumnClass(columnIndex: number, value: boolean, rowIndex = 0): void {
    const rowCount = this.getRowCount();
    const columns = this._columnsController.getColumns();
    const column = columns?.[columnIndex];
    const columnID = column?.isBand && column.index;

    if (!isDefined(columnID)) {
      return;
    }

    for (let i = rowIndex; i < rowCount; i += 1) {
      const columnElements = this.getCellElements(i);

      if (columnElements) {
        this.getColumns(i).forEach((rowColumn, index) => {
          if (rowColumn.ownerBand === columnID) {
            columnElements
              .eq(index)
              .toggleClass(this.addWidgetPrefix(REORDERING_CLASSES.draggableColumn), value);

            if (rowColumn.isBand) {
              // @ts-expect-error a grid column has an index
              this.toggleDraggableColumnClass(rowColumn.index, value, i + 1);
            }
          }
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
  public isFilterRowCell($cell: dxElementWrapper): boolean {
    return false;
  }

  public getKeyboardNavigationController(): HeadersKeyboardNavigationController {
    return this._headersKeyboardNavigation;
  }

  public renderDragCellContent($dragContainer: dxElementWrapper, column: Column): void {
    $dragContainer.text(column.caption ?? '');
  }
}

export const columnHeadersModule = {
  defaultOptions(): InternalGridOptions {
    return {
      showColumnHeaders: true,
      cellHintEnabled: true,
    };
  },
  views: {
    columnHeadersView: ColumnHeadersView,
  },
};

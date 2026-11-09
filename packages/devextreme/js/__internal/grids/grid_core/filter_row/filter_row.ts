/* eslint-disable max-classes-per-file */
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { getOuterWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { InitializedEvent as ButtonInitializedEvent } from '@js/ui/button';
import type { ItemClickEvent, ItemRenderedEvent } from '@js/ui/menu';
import Menu from '@js/ui/menu';
import Overlay from '@js/ui/overlay/ui.overlay';
import { selectView } from '@js/ui/shared/accessibility';
import { findInstanceByElement } from '@ts/core/utils/public_component';
import { isObject } from '@ts/core/utils/type';
import eventsEngine from '@ts/events/core/events_engine';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type { ColumnsResizerViewController } from '@ts/grids/grid_core/columns_resizing_reordering/columns_resizing_reordering';
import type { PointerEventArgs } from '@ts/grids/grid_core/columns_resizing_reordering/types';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { EditingController } from '@ts/grids/grid_core/editing/editing';
import type { EditorCellOptions } from '@ts/grids/grid_core/editing/types';
import { CLASSES as EDITOR_FACTORY_CLASSES } from '@ts/grids/grid_core/editor_factory/const';
import type {
  DataFilter, FilterSourceContext,
} from '@ts/grids/grid_core/filter/types';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import type { ToolbarItem } from '@ts/grids/grid_core/header_panel/types';
import modules from '@ts/grids/grid_core/modules/modules';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import type { CellRenderOptions, ViewCellOptions, ViewRow } from '@ts/grids/grid_core/views/types';
import { DX_MENU_CLASS } from '@ts/ui/context_menu/menu_base';
import type MenuInternal from '@ts/ui/menu/menu';
import type { OverlayProperties } from '@ts/ui/overlay/overlay';

import {
  CLASSES,
  CORRECT_FILTER_RANGE_OVERLAY_WIDTH,
  EDITORS_INPUT_SELECTOR,
  FILTERING_TIMEOUT,
  OPERATION_DESCRIPTORS,
  OPERATION_ICONS,
} from './const';
import type {
  FilterOperationMenuItem,
  FilterRangeSharedData,
  FilterRowColumnHeadersView,
  FilterRowEditorOptions,
  FilterRowHeaderPanel,
  FilterRowOptions,
  FilterRowValue,
  FilterValueUpdateOptions,
} from './types';
import {
  createFilterRowExpressions,
  getEditorInstance,
  isOnClickApplyFilterMode,
  isValidFilterValue,
} from './utils';

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<FilterRowColumnHeadersView> => class ColumnHeadersViewFilterRowExtender extends Base {
  private _filterRangeOverlayInstance?: Overlay | null;

  private _applyFilterViewController!: ApplyFilterViewController;

  private dataSourceController!: DataSourceController;

  public init(): void {
    this.dataSourceController = this.getController('dataSource');

    super.init();
    this._applyFilterViewController = this.getController('applyFilter');
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'filterRow':
      case 'showColumnLines':
        this._invalidate(true, true);
        args.handled = true;
        break;
      case 'syncLookupFilterValues':
        if (args.value) {
          this.updateLookupDataSource();
        } else {
          this.render();
        }
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
        break;
    }
  }

  private getRangeTextByFilterValue(column: Column): string {
    let result = '';
    const filterValue = this.getColumnFilterValue(column);
    const formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'filterRow');

    if (Array.isArray(filterValue)) {
      result = gridCoreUtils.formatValue(filterValue[0], formatOptions);
      const rangeEnd = gridCoreUtils.formatValue(filterValue[1], formatOptions);

      if (rangeEnd !== '') {
        result += ` - ${rangeEnd}`;
      }
    } else if (isDefined(filterValue)) {
      result = gridCoreUtils.formatValue(filterValue, formatOptions);
    }

    return result;
  }

  private getColumnFilterValue(column: Column | undefined): FilterRowValue {
    if (!column) {
      return undefined;
    }

    const {
      bufferedFilterValue,
      filterValue,
    }: {
      bufferedFilterValue?: FilterRowValue;
      filterValue?: FilterRowValue
    } = column;

    return isOnClickApplyFilterMode(this)
      && bufferedFilterValue !== undefined
      ? bufferedFilterValue
      : filterValue;
  }

  private getColumnSelectedFilterOperation(
    column: Column | undefined,
  ): Column['selectedFilterOperation'] {
    if (!column) {
      return undefined;
    }

    return isOnClickApplyFilterMode(this) && column.bufferedSelectedFilterOperation !== undefined
      ? column.bufferedSelectedFilterOperation
      : column.selectedFilterOperation;
  }

  private getFilterValue(
    columnIndex: number | undefined,
    $editorContainer: dxElementWrapper,
  ): FilterRowValue {
    const column = this._columnsController.columnOption(columnIndex);
    const filterValue = this.getColumnFilterValue(column);
    const isFilterRange = $editorContainer
      .closest(`.${this.addWidgetPrefix(CLASSES.filterRangeOverlay)}`)
      .length;
    const isRangeStart = $editorContainer.hasClass(this.addWidgetPrefix(CLASSES.filterRangeStart));
    const isBetween = this.getColumnSelectedFilterOperation(column) === 'between';

    if (filterValue && Array.isArray(filterValue) && isBetween) {
      if (isRangeStart) {
        return filterValue[0];
      }

      return filterValue[1];
    }

    if (isFilterRange || !isValidFilterValue(filterValue, column, $editorContainer)) {
      return null;
    }

    return filterValue;
  }

  private normalizeFilterValue(
    filterValue: FilterRowValue,
    column: Column | undefined,
    $editorContainer: dxElementWrapper,
  ): FilterRowValue {
    if (this.getColumnSelectedFilterOperation(column) === 'between') {
      const columnFilterValue = this.getColumnFilterValue(column);

      if ($editorContainer.hasClass(this.addWidgetPrefix(CLASSES.filterRangeStart))) {
        return [filterValue, Array.isArray(columnFilterValue) ? columnFilterValue[1] : undefined];
      }

      return [
        Array.isArray(columnFilterValue) ? columnFilterValue[0] : columnFilterValue,
        filterValue,
      ];
    }

    return filterValue;
  }

  private updateFilterValue(options: FilterValueUpdateOptions): void {
    const value = options.value === '' ? null : options.value;
    const $editorContainer = options.container;
    const column = this._columnsController.columnOption(options.column.index);

    if (!column) {
      return;
    }

    const filterValue = this.getFilterValue(column.index, $editorContainer);

    if (!isDefined(filterValue) && !isDefined(value)) {
      return;
    }

    this._applyFilterViewController.setHighLight($editorContainer, filterValue !== value);

    const columnOptionName = isOnClickApplyFilterMode(this) ? 'bufferedFilterValue' : 'filterValue';
    const normalizedValue = this.normalizeFilterValue(value, column, $editorContainer);
    const isBetween = this.getColumnSelectedFilterOperation(column) === 'between';
    const notFireEvent = !!options.notFireEvent
      || (isBetween && Array.isArray(normalizedValue) && normalizedValue.includes(undefined));

    this._columnsController.columnOption(
      column.index,
      columnOptionName,
      normalizedValue,
      notFireEvent,
    );
  }

  private _updateEditorValue(column: Column, $editorContainer: dxElementWrapper): void {
    const editor = getEditorInstance($editorContainer);

    editor?.option('value', this.getFilterValue(column.index, $editorContainer));
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { optionNames } = e;
    const isFilterChanged = gridCoreUtils.checkChanges(optionNames, ['filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation', 'filterValues', 'filterType']);

    if (!isFilterChanged || e.columnIndex === undefined) {
      super._columnOptionChanged(e);
      return;
    }

    const visibleIndex = this._columnsController.getVisibleIndex(e.columnIndex);
    const column = this._columnsController.columnOption(e.columnIndex);
    const $element = this.element();

    if (!column || !$element?.length) {
      return;
    }

    const rowIndex = $element.find(`.${this.addWidgetPrefix(CLASSES.filterRow)}`).index();
    const $cell = this._getCellElement(rowIndex, visibleIndex) ?? $();
    const $editorContainer = $cell.find(`.${CLASSES.editorContainer}`).first();

    if (optionNames.filterValue || optionNames.bufferedFilterValue) {
      this._updateEditorValue(column, $editorContainer);

      const overlayInstance = findInstanceByElement(
        $cell.find(`.${this.addWidgetPrefix(CLASSES.filterRangeOverlay)}`),
        Overlay,
      );
      const $overlayContent = overlayInstance?.$content();
      if ($overlayContent) {
        const $editorRangeElements = $overlayContent.find(`.${CLASSES.editorContainer}`);

        this._updateEditorValue(column, $editorRangeElements.first());
        this._updateEditorValue(column, $editorRangeElements.last());
      }
      if (!overlayInstance?.option('visible')) {
        this._updateFilterRangeContent($cell, this.getRangeTextByFilterValue(column));
      }
    }

    if (
      (optionNames.selectedFilterOperation || optionNames.bufferedSelectedFilterOperation)
      && visibleIndex >= 0
    ) {
      const $menu = $cell.find(`.${DX_MENU_CLASS}`);

      if ($menu.length) {
        this._updateFilterOperationChooser($menu, column, $editorContainer);

        if (this.getColumnSelectedFilterOperation(column) === 'between') {
          this._renderFilterRangeContent($cell, column);
        } else if ($editorContainer.find(`.${CLASSES.filterRangeContent}`).length) {
          this._renderEditor($editorContainer, this.getEditorOptions($editorContainer, column));
          this._hideFilterRange();
        }
      }
    }
  }

  protected _renderCore(options?: DataChange): DeferredObj<unknown> {
    this._filterRangeOverlayInstance = null;

    return super._renderCore(options);
  }

  protected _resizeCore(): void {
    super._resizeCore();
    this._filterRangeOverlayInstance?.repaint();
  }

  private isFilterRowVisible(): boolean {
    return this._isElementVisible(this.option('filterRow'));
  }

  public isVisible(): boolean {
    return super.isVisible() || this.isFilterRowVisible();
  }

  private _initFilterRangeOverlay($cell: dxElementWrapper, column: Column): Overlay {
    const sharedData: FilterRangeSharedData = {};
    const $editorContainer = $cell.find(`.${CLASSES.editorContainer}`);
    const filterRangeOverlayClass = this.addWidgetPrefix(CLASSES.filterRangeOverlay);
    const $overlay = $('<div>').addClass(filterRangeOverlayClass).appendTo($cell);

    return this._createComponent($overlay, Overlay, {
      height: 'auto',
      shading: false,
      focusStateEnabled: false,
      hideOnOutsideClick: true,
      hideOnParentScroll: true,
      _hideOnParentScrollTarget: $overlay,
      wrapperAttr: { class: filterRangeOverlayClass },
      container: this.element(),
      animation: null,
      position: {
        my: 'top',
        at: 'top',
        of: $editorContainer.length ? $editorContainer : $cell,
        offset: '0 -1',
      },
      contentTemplate: (contentElement: DxElement): dxElementWrapper => {
        const currentColumn = this._columnsController.columnOption(column.index);

        if (!currentColumn) {
          return $(contentElement).addClass(this.getWidgetContainerClass());
        }

        let $editor = $('<div>').addClass(`${CLASSES.editorContainer} ${this.addWidgetPrefix(CLASSES.filterRangeStart)}`).appendTo(contentElement);
        let editorOptions = this.getEditorOptions($editor, currentColumn);

        editorOptions.sharedData = sharedData;
        this._renderEditor($editor, editorOptions);
        eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', (e: DxEvent<KeyboardEvent>) => {
          let $prevElement = $cell.find('[tabindex]').not(e.target).first();

          if (normalizeKeyName(e) === 'tab' && e.shiftKey) {
            e.preventDefault();
            this._hideFilterRange();

            if (!$prevElement.length) {
              $prevElement = $cell.prev().find('[tabindex]').last();
            }
            eventsEngine.trigger($prevElement, 'focus');
          }
        });

        $editor = $('<div>').addClass(`${CLASSES.editorContainer} ${this.addWidgetPrefix(CLASSES.filterRangeEnd)}`).appendTo(contentElement);
        editorOptions = this.getEditorOptions($editor, currentColumn);

        editorOptions.sharedData = sharedData;
        this._renderEditor($editor, editorOptions);
        eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', (e: DxEvent<KeyboardEvent>) => {
          if (normalizeKeyName(e) === 'tab' && !e.shiftKey) {
            this._hideFilterRange();

            if ($cell.next().length) {
              e.preventDefault();
              eventsEngine.trigger($cell.next().find('[tabindex]').first(), 'focus');
            }
          }
        });

        return $(contentElement).addClass(this.getWidgetContainerClass());
      },
      onShown(e) {
        const $editor = $(e.component.content()).find(`.${CLASSES.editorContainer}`).first();
        eventsEngine.trigger($editor.find(EDITORS_INPUT_SELECTOR), 'focus');
      },
      onHidden: (): void => {
        const currentColumn = this._columnsController.columnOption(column.index);

        $cell.find(`.${DX_MENU_CLASS}`).parent().addClass(CLASSES.editorWithMenu);
        if (currentColumn && this.getColumnSelectedFilterOperation(currentColumn) === 'between') {
          this._updateFilterRangeContent($cell, this.getRangeTextByFilterValue(currentColumn));
          this.component.updateDimensions();
        }
      },
    });
  }

  private _updateFilterRangeOverlay(options: Partial<OverlayProperties>): void {
    const overlayInstance = this._filterRangeOverlayInstance;

    overlayInstance?.option(options);
  }

  private _showFilterRange($cell: dxElementWrapper, column: Column): void {
    const $overlay = $cell.children(`.${this.addWidgetPrefix(CLASSES.filterRangeOverlay)}`);
    let overlayInstance = $overlay.length && findInstanceByElement($overlay, Overlay);

    if (!overlayInstance && column) {
      overlayInstance = this._initFilterRangeOverlay($cell, column);
    }

    if (overlayInstance && !overlayInstance.option('visible')) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      this._filterRangeOverlayInstance?.hide();
      this._filterRangeOverlayInstance = overlayInstance;

      this._updateFilterRangeOverlay({
        width: Number(getOuterWidth($cell, true)) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH,
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      this._filterRangeOverlayInstance?.show();
    }
  }

  private _hideFilterRange(): void {
    const overlayInstance = this._filterRangeOverlayInstance;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    overlayInstance?.hide();
  }

  public getFilterRangeOverlayInstance(): Overlay | null | undefined {
    return this._filterRangeOverlayInstance;
  }

  protected _createRow(row: ViewRow): dxElementWrapper {
    const $row = super._createRow(row);

    if (row.rowType === 'filter') {
      $row.addClass(this.addWidgetPrefix(CLASSES.filterRow));

      if (!this.option('useLegacyKeyboardNavigation')) {
        eventsEngine.on($row, 'keydown', (event) => selectView('filterRow', this, event));
      }
    }

    return $row;
  }

  public _getRows(): ViewRow[] {
    const result = super._getRows();

    if (this.isFilterRowVisible()) {
      result.push({ rowType: 'filter' });
    }

    return result;
  }

  private _renderFilterCell(cell: DxElement, options: ViewCellOptions): void {
    const { column } = options;
    const $cell = $(cell);

    if (this.component.option('showColumnHeaders')) {
      this.setAria('describedby', column.headerId, $cell);
    }
    this.setAria('label', messageLocalization.format('dxDataGrid-ariaFilterCell'), $cell);

    $cell.addClass(CLASSES.editorCell);
    const $container = $('<div>').appendTo($cell);
    const $editorContainer = $('<div>').addClass(CLASSES.editorContainer).appendTo($container);

    if (this.getColumnSelectedFilterOperation(column) === 'between') {
      this._renderFilterRangeContent($cell, column);
    } else {
      const editorOptions = this.getEditorOptions($editorContainer, column);
      this._renderEditor($editorContainer, editorOptions);
    }

    const { alignment } = column;
    if (alignment && alignment !== 'center') {
      $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', alignment);
    }

    if (column.filterOperations?.length) {
      this._renderFilterOperationChooser($container, column, $editorContainer);
    }
  }

  protected _renderCellContent( // TODO _getCellTemplate
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    const { column } = options;

    if (options.rowType === 'filter') {
      if (column.command) {
        $cell.html('&nbsp;');
      } else if (column.allowFiltering) {
        this.renderTemplate($cell, this._renderFilterCell.bind(this), options).done(() => {
          this._updateCell($cell, options);
        });
        return;
      }
    }

    super._renderCellContent($cell, options, renderOptions);
  }

  private getEditorOptions(
    $editorContainer: dxElementWrapper,
    column: Column,
  ): FilterRowEditorOptions {
    const accessibilityOptions = {
      editorOptions: {
        inputAttr: this._getFilterInputAccessibilityAttributes(column),
      },
    };
    const editorOptions: FilterRowEditorOptions = extend(accessibilityOptions, column, {
      value: this.getFilterValue(column.index, $editorContainer),
      parentType: 'filterRow' as const,
      showAllText: this.option('filterRow.showAllText'),
      updateValueTimeout: this.option('filterRow.applyFilter') === 'onClick' ? 0 : FILTERING_TIMEOUT,
      width: null,
      setValue: (value: FilterRowValue, notFireEvent?: boolean): void => {
        this.updateFilterValue({
          column,
          value,
          container: $editorContainer,
          notFireEvent,
        });
      },
    });

    if (this.getColumnSelectedFilterOperation(column) === 'between') {
      if ($editorContainer.hasClass(this.addWidgetPrefix(CLASSES.filterRangeStart))) {
        editorOptions.placeholder = this.option('filterRow.betweenStartText');
      } else {
        editorOptions.placeholder = this.option('filterRow.betweenEndText');
      }
    }

    return editorOptions;
  }

  private _getFilterInputAccessibilityAttributes(
    column: Column,
  ): { 'aria-label': string; 'aria-describedby'?: string } {
    const columnAriaLabel = messageLocalization.format('dxDataGrid-ariaFilterCell');
    if (this.component.option('showColumnHeaders')) {
      return {
        'aria-label': columnAriaLabel,
        'aria-describedby': column.headerId,
      };
    }
    return { 'aria-label': columnAriaLabel };
  }

  private _renderEditor($editorContainer: dxElementWrapper, options: FilterRowEditorOptions): void {
    $editorContainer.empty();
    const $element = $('<div>').appendTo($editorContainer);
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (options.lookup && this.option('syncLookupFilterValues')) {
      const filter = this._dataController.getCombinedFilterWithExcludedColumn(options);

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        options,
        dataSourceAdapter,
        filter,
      );
      const lookupOptions = {
        ...options,
        lookup: {
          ...options.lookup,
          dataSource: lookupDataSource,
        },
      };
      return this._editorFactoryController.createEditor($element, lookupOptions);
    }
    return this._editorFactoryController.createEditor($element, options);
  }

  private _renderFilterRangeContent($cell: dxElementWrapper, column: Column): void {
    const $editorContainer = $cell.find(`.${CLASSES.editorContainer}`).first();

    $editorContainer.empty();
    const $filterRangeContent = $('<div>')
      .addClass(CLASSES.filterRangeContent)
      .attr('tabindex', this.option('tabIndex') ?? null);

    eventsEngine.on($filterRangeContent, 'focusin', () => {
      this._showFilterRange($cell, column);
    });

    $filterRangeContent.appendTo($editorContainer);

    this._updateFilterRangeContent($cell, this.getRangeTextByFilterValue(column));
  }

  private _updateFilterRangeContent($cell: dxElementWrapper, value: string): void {
    const $filterRangeContent = $cell.find(`.${CLASSES.filterRangeContent}`);

    if ($filterRangeContent.length) {
      if (value === '') {
        $filterRangeContent.html('&nbsp;');
      } else {
        $filterRangeContent.text(value);
      }
    }
  }

  private _updateFilterOperationChooser(
    $menu: dxElementWrapper,
    column: Column,
    $editorContainer: dxElementWrapper,
  ): void {
    let isCellWasFocused = false;
    const restoreFocus = (): void => {
      const menu = Menu.getInstance($menu.get(0));
      menu?.option('focusedElement', null);

      if (isCellWasFocused) {
        this._focusEditor($editorContainer);
      }
    };

    const editorFactoryController = this._editorFactoryController;
    const ariaSearchBox = messageLocalization.format('dxDataGrid-ariaSearchBox');

    this._createComponent($menu, Menu, {
      integrationOptions: {},
      activeStateEnabled: false,
      selectionMode: 'single',
      cssClass: `${this.getWidgetContainerClass()} ${EDITOR_FACTORY_CLASSES.cellFocusDisabled} ${CLASSES.filterMenu}`,
      showFirstSubmenuMode: 'onHover',
      hideSubmenuOnMouseLeave: true,
      items: [{
        name: this.getColumnSelectedFilterOperation(column) || ariaSearchBox,
        disabled: !column.filterOperations?.length,
        icon: OPERATION_ICONS[this.getColumnSelectedFilterOperation(column) || 'default'],
        selectable: false,
        items: this._getFilterOperationMenuItems(column),
      }],
      onItemRendered: ({ itemElement, itemData }: ItemRenderedEvent<FilterOperationMenuItem>) => {
        if (itemData?.items && itemData?.name) {
          const labelText = this._getOperationDescriptionFromDescriptor(itemData.name)
            || ariaSearchBox;
          this.setAria('label', labelText, $(itemElement));
        }
      },
      onItemClick: ({ itemData }: ItemClickEvent<FilterOperationMenuItem>): void => {
        if (!itemData) {
          return;
        }

        const selectedFilterOperation = itemData.name;
        const columnSelectedFilterOperation = this.getColumnSelectedFilterOperation(column);
        let notFocusEditor = false;
        const isOnClickMode = isOnClickApplyFilterMode(this);
        const options: Record<string, unknown> = {};

        if (
          itemData.items
          || (selectedFilterOperation && selectedFilterOperation === columnSelectedFilterOperation)
        ) {
          return;
        }

        if (selectedFilterOperation) {
          if (selectedFilterOperation === 'between' || columnSelectedFilterOperation === 'between') {
            notFocusEditor = selectedFilterOperation === 'between';
            options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
          }

          options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = selectedFilterOperation;
        } else {
          options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
          options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = column.defaultSelectedFilterOperation || null;
        }

        const isResetFilterOperation = !itemData.name;
        const isNotFireEvent = isResetFilterOperation ? false : undefined;
        this._columnsController.columnOption(column.index, options, undefined, isNotFireEvent);
        this._applyFilterViewController.setHighLight($editorContainer, true);

        if (!selectedFilterOperation) {
          const editor = getEditorInstance($editorContainer);
          if (editor?.NAME === 'dxDateBox' && !editor.option('isValid')) {
            editor.clear();
            editor.option('isValid', true);
          }
        }

        if (!notFocusEditor) {
          this._focusEditor($editorContainer);
        } else {
          this._showFilterRange($editorContainer.closest(`.${CLASSES.editorCell}`), column);
        }
      },
      onSubmenuShowing: (): void => {
        isCellWasFocused = this._isEditorFocused($editorContainer);
        editorFactoryController.loseFocus();
      },
      onSubmenuHiding() {
        restoreFocus();
      },
      onContentReady(e) {
        eventsEngine.on($menu, 'blur', () => {
          (e.component as unknown as MenuInternal)._hideSubmenuAfterTimeout();
          restoreFocus();
        });
      },
      rtlEnabled: this.option('rtlEnabled'),
    });
  }

  private _isEditorFocused($container: dxElementWrapper): boolean {
    return $container.hasClass(CLASSES.focused) || $container.parents(`.${CLASSES.focused}`).length > 0;
  }

  private _focusEditor($container: dxElementWrapper): void {
    this._editorFactoryController.focus($container);
    eventsEngine.trigger($container.find(EDITORS_INPUT_SELECTOR), 'focus');
  }

  private _renderFilterOperationChooser(
    $container: dxElementWrapper,
    column: Column,
    $editorContainer: dxElementWrapper,
  ): void {
    if (this.option('filterRow.showOperationChooser')) {
      $container.addClass(CLASSES.editorWithMenu);
      const $menu = $('<div>').prependTo($container);
      this._updateFilterOperationChooser($menu, column, $editorContainer);
    }
  }

  private _getFilterOperationMenuItems(column: Column): FilterOperationMenuItem[] {
    let result: FilterOperationMenuItem[] = [{}];
    const filterRowOptions = this.option('filterRow');

    if (column.filterOperations?.length) {
      const availableFilterOperations = column.filterOperations.filter(
        (value) => isDefined(OPERATION_DESCRIPTORS[value]),
      );
      const selectedFilterOperation = this.getColumnSelectedFilterOperation(column)
        || column.defaultFilterOperation;

      result = map(availableFilterOperations, (value) => ({
        name: value,
        selected: selectedFilterOperation === value,
        text: this._getOperationDescriptionFromDescriptor(value),
        icon: OPERATION_ICONS[value],
      }));

      result.push({
        name: null,
        text: filterRowOptions?.resetOperationText,
        icon: OPERATION_ICONS.default,
      });
    }

    return result;
  }

  private _getOperationDescriptionFromDescriptor(value: string): string | undefined {
    const operationDescriptions = this.option('filterRow')?.operationDescriptions;
    const descriptionName = OPERATION_DESCRIPTORS[value];

    return descriptionName && operationDescriptions?.[descriptionName];
  }

  protected _handleDataChanged(e: DataChange): void {
    const lastLoadOptions = this.dataSourceController.lastLoadOptions();

    super._handleDataChanged(e);

    if (e.operationTypes?.filtering || e.operationTypes?.fullReload) {
      this.updateLookupDataSource(!!e.operationTypes?.filtering || lastLoadOptions?.filter);
    }
  }

  public updateLookupDataSource(filterChanged?: boolean | DataFilter): void {
    if (!this.option('syncLookupFilterValues')) {
      return;
    }

    const $element = this.element();

    if (!$element) {
      return;
    }

    const columns = this._columnsController.getVisibleColumns();
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const rowIndex = $element.find(`.${this.addWidgetPrefix(CLASSES.filterRow)}`).index();

    if (rowIndex === -1) {
      return;
    }

    columns.forEach((column, index) => {
      if (!column.lookup || column.calculateCellValue !== column.defaultCalculateCellValue) {
        return;
      }

      const $cell = this._getCellElement(rowIndex, index);
      const editor = getEditorInstance($cell?.find(`.${CLASSES.editorContainer}`));

      if (editor) {
        const filter = this._dataController.getCombinedFilterWithExcludedColumn(column) || null;

        const editorDataSource = editor.option('dataSource');
        const editorDataSourceFilter = isObject(editorDataSource)
          ? editorDataSource.__dataGridSourceFilter
          : undefined;
        const shouldUpdateFilter = !filterChanged
          || !equalByValue(editorDataSourceFilter || null, filter);

        if (shouldUpdateFilter) {
          const selectedItem = editor.option('selectedItem');
          const editorItems = editor.option('items');
          const items = Array.isArray(editorItems) ? editorItems : [];
          const hasSelectedItem = items.some((item) => equalByValue(item, selectedItem));
          if (!hasSelectedItem) {
            editor.option('items', [...items, selectedItem]);
          }

          const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
            column,
            dataSourceAdapter,
            filter,
          );
          editor.option('dataSource', lookupDataSource);
        }
      }
    });
  }

  public getColumnElements(index?: number, bandColumnIndex?: number): dxElementWrapper | undefined {
    const rows = this._getRows();

    if (isDefined(index) && rows?.[index]?.rowType === 'filter' && arguments.length < 2) {
      return this.getCellElements(index);
    }

    return super.getColumnElements(index, bandColumnIndex);
  }

  public isFilterRowCell($cell: dxElementWrapper): boolean {
    return !!$cell.closest(`.${this.addWidgetPrefix(CLASSES.filterRow)}`).length;
  }
};

export class ApplyFilterViewController extends modules.ViewController {
  private _headerPanel?: FilterRowHeaderPanel;

  private _columnsController!: ColumnsController;

  public init(): void {
    this._columnsController = this.getController('columns');
  }

  public isFilterSourceActive({ columnSourcesActive }: FilterSourceContext): boolean {
    return columnSourcesActive;
  }

  public getFilterExpressions({
    excludedColumn,
    columnsController,
  }: FilterSourceContext): DataFilter[] {
    const columns: Column[] = columnsController.getVisibleColumns(null, true);

    return createFilterRowExpressions(columns, excludedColumn);
  }

  private _getHeaderPanel(): FilterRowHeaderPanel {
    // TODO getView
    this._headerPanel ??= this.getView('headerPanel') as FilterRowHeaderPanel;

    return this._headerPanel;
  }

  public setHighLight($element: dxElementWrapper | undefined, value: boolean): void {
    if (isOnClickApplyFilterMode(this)) {
      $element
        ?.toggleClass(CLASSES.highlightOutline, value)
        .closest(`.${CLASSES.editorCell}`)
        .toggleClass(CLASSES.filterModified, value);
      this._getHeaderPanel().enableApplyButton(value);
    }
  }

  public applyFilter(): void {
    const columns = this._columnsController.getColumns();

    this._columnsController.beginUpdate();
    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];
      const { bufferedFilterValue, bufferedSelectedFilterOperation } = column;
      if (bufferedFilterValue !== undefined) {
        this._columnsController.columnOption(i, 'filterValue', bufferedFilterValue);
        column.bufferedFilterValue = undefined;
      }
      if (bufferedSelectedFilterOperation !== undefined) {
        this._columnsController.columnOption(i, 'selectedFilterOperation', bufferedSelectedFilterOperation);
        column.bufferedSelectedFilterOperation = undefined;
      }
    }
    this._columnsController.endUpdate();
    this.removeHighLights();
  }

  private removeHighLights(): void {
    if (isOnClickApplyFilterMode(this)) {
      // TODO getView
      const columnHeadersViewElement = this.getView('columnHeadersView').element();
      columnHeadersViewElement?.find(`.${this.addWidgetPrefix(CLASSES.filterRow)} .${CLASSES.highlightOutline}`).removeClass(CLASSES.highlightOutline);
      columnHeadersViewElement?.find(`.${this.addWidgetPrefix(CLASSES.filterRow)} .${CLASSES.filterModified}`).removeClass(CLASSES.filterModified);
      this._getHeaderPanel().enableApplyButton(false);
    }
  }
}

const columnsResizer = (
  Base: ModuleType<ColumnsResizerViewController>,
): ModuleType<ColumnsResizerViewController> => class FilterRowColumnsResizerExtender extends Base {
  protected declare _columnHeadersView: FilterRowColumnHeadersView;

  protected _startResizing(args: PointerEventArgs<ColumnsResizerViewController>): void {
    super._startResizing(args);

    if (this.isResizing()) {
      const overlayInstance = this._columnHeadersView.getFilterRangeOverlayInstance();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      overlayInstance?.hide();
    }
  }
};

const editing = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class FilterRowEditingController extends Base {
  private _needUpdateLookupDataSource?: boolean;

  public updateFieldValue(
    options: EditorCellOptions,
    value: unknown,
    text?: string,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> {
    if (options.column.lookup) {
      this._needUpdateLookupDataSource = true;
    }

    return super.updateFieldValue(options, value, text, forceUpdateRow);
  }

  protected _afterSaveEditData(
    cancel?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- the base returns void
  ): DeferredObj<unknown> | void {
    if (this._needUpdateLookupDataSource && !cancel) {
      // TODO getView
      const headersView = this.getView('columnHeadersView') as FilterRowColumnHeadersView | undefined;

      headersView?.updateLookupDataSource();
    }
    this._needUpdateLookupDataSource = false;

    return super._afterSaveEditData(cancel);
  }

  protected _afterCancelEditData(rowIndex: number): void {
    this._needUpdateLookupDataSource = false;
    super._afterCancelEditData(rowIndex);
  }
};

const headerPanel = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<FilterRowHeaderPanel> => class FilterRowHeaderPanel extends Base {
  private _applyFilterViewController!: ApplyFilterViewController;

  public init(): void {
    super.init();
    this._dataController = this.getController('data');
    this._applyFilterViewController = this.getController('applyFilter');
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'filterRow') {
      this._invalidate();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  protected _getToolbarItems(): ToolbarItem[] {
    const items = super._getToolbarItems();
    const filterItem = this._prepareFilterItem();

    return filterItem.concat(items);
  }

  private _prepareFilterItem(): ToolbarItem[] {
    const filterItem: ToolbarItem[] = [];

    if (this._isShowApplyFilterButton()) {
      const hintText = this.option('filterRow.applyFilterText');
      const columns = this._columnsController.getColumns();
      const disabled = !columns.filter((column) => column.bufferedFilterValue !== undefined).length;
      const onInitialized = (e: ButtonInitializedEvent): void => {
        $(e.element).addClass(this.getToolbarButtonClass(CLASSES.applyButton));
      };
      const onClickHandler = (): void => {
        this._applyFilterViewController.applyFilter();
      };
      const toolbarItem: ToolbarItem = {
        widget: 'dxButton',
        options: {
          icon: 'apply-filter',
          disabled,
          onClick: onClickHandler,
          hint: hintText,
          text: hintText,
          onInitialized,
        },
        showText: 'inMenu',
        name: 'applyFilterButton',
        location: 'after',
        locateInMenu: 'auto',
        sortIndex: 10,
      };

      filterItem.push(toolbarItem);
    }

    return filterItem;
  }

  private _isShowApplyFilterButton(): boolean {
    const filterRowOptions = this.option('filterRow');
    return !!filterRowOptions?.visible && filterRowOptions.applyFilter === 'onClick';
  }

  public enableApplyButton(value: boolean): void {
    this.setToolbarItemDisabled('applyFilterButton', !value);
  }
};

export const filterRowModule = {
  defaultOptions(): { syncLookupFilterValues: boolean; filterRow: FilterRowOptions } {
    return {
      syncLookupFilterValues: true,
      filterRow: {
        visible: false,
        showOperationChooser: true,
        showAllText: messageLocalization.format('dxDataGrid-filterRowShowAllText'),
        resetOperationText: messageLocalization.format('dxDataGrid-filterRowResetOperationText'),
        applyFilter: 'auto',
        applyFilterText: messageLocalization.format('dxDataGrid-applyFilterText'),
        operationDescriptions: {
          equal: messageLocalization.format('dxDataGrid-filterRowOperationEquals'),
          notEqual: messageLocalization.format('dxDataGrid-filterRowOperationNotEquals'),
          lessThan: messageLocalization.format('dxDataGrid-filterRowOperationLess'),
          lessThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationLessOrEquals'),
          greaterThan: messageLocalization.format('dxDataGrid-filterRowOperationGreater'),
          greaterThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationGreaterOrEquals'),
          startsWith: messageLocalization.format('dxDataGrid-filterRowOperationStartsWith'),
          contains: messageLocalization.format('dxDataGrid-filterRowOperationContains'),
          notContains: messageLocalization.format('dxDataGrid-filterRowOperationNotContains'),

          endsWith: messageLocalization.format('dxDataGrid-filterRowOperationEndsWith'),
          between: messageLocalization.format('dxDataGrid-filterRowOperationBetween'),
          isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
          isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
        },
        betweenStartText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenStartText'),
        betweenEndText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenEndText'),
      },
    };
  },
  controllers: {
    applyFilter: ApplyFilterViewController,
  },
  extenders: {
    controllers: {
      columnsResizer,
      editing,
    },
    views: {
      columnHeadersView,
      headerPanel,
    },
  },
};

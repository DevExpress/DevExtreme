/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { getOuterWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import Editor from '@js/ui/editor/editor';
import Menu from '@js/ui/menu';
import Overlay from '@js/ui/overlay/ui.overlay';
import { selectView } from '@js/ui/shared/accessibility';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ColumnsResizerViewController } from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { DataController } from '../data_controller/m_data_controller';
import type { EditingController } from '../editing/m_editing';
import type { HeaderPanel } from '../header_panel/m_header_panel';
import modules from '../m_modules';
import type { ModuleType } from '../m_types';
import gridCoreUtils from '../m_utils';

const OPERATION_ICONS = {
  '=': 'filter-operation-equals',
  '<>': 'filter-operation-not-equals',
  '<': 'filter-operation-less',
  '<=': 'filter-operation-less-equal',
  '>': 'filter-operation-greater',
  '>=': 'filter-operation-greater-equal',
  default: 'filter-operation-default',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'filter-operation-not-contains',
  contains: 'filter-operation-contains',
  startswith: 'filter-operation-starts-with',
  endswith: 'filter-operation-ends-with',
  between: 'filter-operation-between',
};

const OPERATION_DESCRIPTORS = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  startswith: 'startsWith',
  contains: 'contains',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'notContains',
  endswith: 'endsWith',
  between: 'between',
};

const FILTERING_TIMEOUT = 700;
const CORRECT_FILTER_RANGE_OVERLAY_WIDTH = 1;
const FILTER_ROW_CLASS = 'filter-row';
const FILTER_RANGE_OVERLAY_CLASS = 'filter-range-overlay';
const FILTER_RANGE_START_CLASS = 'filter-range-start';
const FILTER_RANGE_END_CLASS = 'filter-range-end';
const MENU_CLASS = 'dx-menu';
const EDITOR_WITH_MENU_CLASS = 'dx-editor-with-menu';
const EDITOR_CONTAINER_CLASS = 'dx-editor-container';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const FILTER_MENU = 'dx-filter-menu';
const APPLY_BUTTON_CLASS = 'dx-apply-button';
const HIGHLIGHT_OUTLINE_CLASS = 'dx-highlight-outline';
const FOCUSED_CLASS = 'dx-focused';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const FILTER_RANGE_CONTENT_CLASS = 'dx-filter-range-content';
const FILTER_MODIFIED_CLASS = 'dx-filter-modified';

const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';

const BETWEEN_OPERATION_DATA_TYPES = ['date', 'datetime', 'number'];

const ARIA_SEARCH_BOX = messageLocalization.format('dxDataGrid-ariaSearchBox');

function isOnClickApplyFilterMode(that) {
  return that.option('filterRow.applyFilter') === 'onClick';
}

const getEditorInstance = function ($editorContainer) {
  const $editor = $editorContainer && $editorContainer.children();
  const componentNames = $editor && $editor.data('dxComponents');
  const editor = componentNames && componentNames.length && $editor.data(componentNames[0]);

  if (editor instanceof Editor) {
    return editor;
  }
  return null;
};

const getRangeTextByFilterValue = function (that, column) {
  let result = '';
  let rangeEnd = '';
  const filterValue = getColumnFilterValue(that, column);
  const formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'filterRow');

  if (Array.isArray(filterValue)) {
    result = gridCoreUtils.formatValue(filterValue[0], formatOptions);
    rangeEnd = gridCoreUtils.formatValue(filterValue[1], formatOptions);

    if (rangeEnd !== '') {
      result += ` - ${rangeEnd}`;
    }
  } else if (isDefined(filterValue)) {
    result = gridCoreUtils.formatValue(filterValue, formatOptions);
  }

  return result;
};

function getColumnFilterValue(that, column) {
  if (column) {
    return isOnClickApplyFilterMode(that) && column.bufferedFilterValue !== undefined ? column.bufferedFilterValue : column.filterValue;
  }
}

const getColumnSelectedFilterOperation = function (that, column) {
  if (column) {
    return isOnClickApplyFilterMode(that) && column.bufferedSelectedFilterOperation !== undefined ? column.bufferedSelectedFilterOperation : column.selectedFilterOperation;
  }
};

const isValidFilterValue = function (filterValue, column) {
  if (column && BETWEEN_OPERATION_DATA_TYPES.includes(column.dataType) && Array.isArray(filterValue)) {
    return false;
  }

  return filterValue !== undefined;
};

const getFilterValue = function (that, columnIndex, $editorContainer) {
  const column = that._columnsController.columnOption(columnIndex);
  const filterValue = getColumnFilterValue(that, column);
  const isFilterRange = $editorContainer.closest(`.${that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)}`).length;
  const isRangeStart = $editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS));

  if (filterValue && Array.isArray(filterValue) && getColumnSelectedFilterOperation(that, column) === 'between') {
    if (isRangeStart) {
      return filterValue[0];
    }
    return filterValue[1];
  }

  return !isFilterRange && isValidFilterValue(filterValue, column) ? filterValue : null;
};

const normalizeFilterValue = function (that, filterValue, column, $editorContainer) {
  if (getColumnSelectedFilterOperation(that, column) === 'between') {
    const columnFilterValue = getColumnFilterValue(that, column);
    if ($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
      return [filterValue, Array.isArray(columnFilterValue) ? columnFilterValue[1] : undefined];
    }
    return [Array.isArray(columnFilterValue) ? columnFilterValue[0] : columnFilterValue, filterValue];
  }

  return filterValue;
};

const updateFilterValue = function (that, options) {
  const value = options.value === '' ? null : options.value;
  const $editorContainer = options.container;
  const column = that._columnsController.columnOption(options.column.index);
  const filterValue = getFilterValue(that, column.index, $editorContainer);

  if (!isDefined(filterValue) && !isDefined(value)) return;

  that._applyFilterViewController.setHighLight($editorContainer, filterValue !== value);

  const columnOptionName = isOnClickApplyFilterMode(that) ? 'bufferedFilterValue' : 'filterValue';
  const normalizedValue = normalizeFilterValue(that, value, column, $editorContainer);
  const isBetween = getColumnSelectedFilterOperation(that, column) === 'between';
  const notFireEvent = options.notFireEvent || isBetween && Array.isArray(normalizedValue) && normalizedValue.includes(undefined);
  that._columnsController.columnOption(column.index, columnOptionName, normalizedValue, notFireEvent);
};

const columnHeadersView = (Base: ModuleType<ColumnHeadersView>) => class ColumnHeadersViewFilterRowExtender extends Base {
  private _filterRangeOverlayInstance: any;

  private _applyFilterViewController!: ApplyFilterViewController;

  public init() {
    super.init();
    this._applyFilterViewController = this.getController('applyFilter');
  }

  public optionChanged(args) {
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

  private _updateEditorValue(column, $editorContainer) {
    const that = this;
    const editor = getEditorInstance($editorContainer);

    editor && editor.option('value', getFilterValue(that, column.index, $editorContainer));
  }

  protected _columnOptionChanged(e) {
    const that = this;
    const { optionNames } = e;
    let $cell;
    let $editorContainer;
    let $editorRangeElements;
    let $menu;

    if (gridCoreUtils.checkChanges(optionNames, ['filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation', 'filterValues', 'filterType']) && e.columnIndex !== undefined) {
      const visibleIndex = that._columnsController.getVisibleIndex(e.columnIndex);
      const column = that._columnsController.columnOption(e.columnIndex);
      $cell = that._getCellElement(that.element().find(`.${that.addWidgetPrefix(FILTER_ROW_CLASS)}`).index(), visibleIndex) ?? $();
      $editorContainer = $cell.find(`.${EDITOR_CONTAINER_CLASS}`).first();

      if (optionNames.filterValue || optionNames.bufferedFilterValue) {
        that._updateEditorValue(column, $editorContainer);

        const overlayInstance = $cell.find(`.${that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)}`).data('dxOverlay');
        if (overlayInstance) {
          $editorRangeElements = overlayInstance.$content().find(`.${EDITOR_CONTAINER_CLASS}`);

          that._updateEditorValue(column, $editorRangeElements.first());
          that._updateEditorValue(column, $editorRangeElements.last());
        }
        if (!overlayInstance || !overlayInstance.option('visible')) {
          that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
        }
      }
      if (optionNames.selectedFilterOperation || optionNames.bufferedSelectedFilterOperation) {
        if (visibleIndex >= 0 && column) {
          $menu = $cell.find(`.${MENU_CLASS}`);

          if ($menu.length) {
            that._updateFilterOperationChooser($menu, column, $editorContainer);

            if (getColumnSelectedFilterOperation(that, column) === 'between') {
              that._renderFilterRangeContent($cell, column);
            } else if ($editorContainer.find(`.${FILTER_RANGE_CONTENT_CLASS}`).length) {
              that._renderEditor($editorContainer, that._getEditorOptions($editorContainer, column));
              that._hideFilterRange();
            }
          }
        }
      }
      return;
    }

    super._columnOptionChanged(e);
  }

  protected _renderCore() {
    this._filterRangeOverlayInstance = null;
    // @ts-expect-error
    return super._renderCore.apply(this, arguments);
  }

  protected _resizeCore() {
    // @ts-expect-error
    super._resizeCore.apply(this, arguments);
    this._filterRangeOverlayInstance?.repaint();
  }

  private isFilterRowVisible() {
    return this._isElementVisible(this.option('filterRow'));
  }

  public isVisible() {
    return super.isVisible() || this.isFilterRowVisible();
  }

  private _initFilterRangeOverlay($cell, column) {
    const that = this;
    const sharedData = {};
    const $editorContainer = $cell.find('.dx-editor-container');
    const filterRangeOverlayClass = that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS);
    const $overlay = $('<div>').addClass(filterRangeOverlayClass).appendTo($cell);

    return that._createComponent($overlay, Overlay, {
      height: 'auto',
      shading: false,
      showTitle: false,
      focusStateEnabled: false,
      hideOnOutsideClick: true,
      wrapperAttr: { class: filterRangeOverlayClass },
      animation: false,
      position: {
        my: 'top',
        at: 'top',
        of: $editorContainer.length && $editorContainer || $cell,
        offset: '0 -1',
      },
      contentTemplate(contentElement) {
        let editorOptions;
        let $editor = $('<div>').addClass(`${EDITOR_CONTAINER_CLASS} ${that.addWidgetPrefix(FILTER_RANGE_START_CLASS)}`).appendTo(contentElement);

        column = that._columnsController.columnOption(column.index);
        editorOptions = that._getEditorOptions($editor, column);
        editorOptions.sharedData = sharedData;
        that._renderEditor($editor, editorOptions);
        eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', (e) => {
          let $prevElement = $cell.find('[tabindex]').not(e.target).first();

          if (normalizeKeyName(e) === 'tab' && e.shiftKey) {
            e.preventDefault();
            that._hideFilterRange();

            if (!$prevElement.length) {
              $prevElement = $cell.prev().find('[tabindex]').last();
            }
            // @ts-expect-error
            eventsEngine.trigger($prevElement, 'focus');
          }
        });

        $editor = $('<div>').addClass(`${EDITOR_CONTAINER_CLASS} ${that.addWidgetPrefix(FILTER_RANGE_END_CLASS)}`).appendTo(contentElement);
        editorOptions = that._getEditorOptions($editor, column);

        editorOptions.sharedData = sharedData;
        that._renderEditor($editor, editorOptions);
        eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', (e) => {
          if (normalizeKeyName(e) === 'tab' && !e.shiftKey) {
            e.preventDefault();
            that._hideFilterRange();
            // @ts-expect-error
            eventsEngine.trigger($cell.next().find('[tabindex]').first(), 'focus');
          }
        });

        return $(contentElement).addClass(that.getWidgetContainerClass());
      },
      onShown(e) {
        const $editor = e.component.$content().find(`.${EDITOR_CONTAINER_CLASS}`).first();
        // @ts-expect-error
        eventsEngine.trigger($editor.find(EDITORS_INPUT_SELECTOR), 'focus');
      },
      onHidden() {
        column = that._columnsController.columnOption(column.index);

        $cell.find(`.${MENU_CLASS}`).parent().addClass(EDITOR_WITH_MENU_CLASS);
        if (getColumnSelectedFilterOperation(that, column) === 'between') {
          that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
          that.component.updateDimensions();
        }
      },
    });
  }

  private _updateFilterRangeOverlay(options) {
    const overlayInstance = this._filterRangeOverlayInstance;

    overlayInstance && overlayInstance.option(options);
  }

  private _showFilterRange($cell, column) {
    const that = this;
    const $overlay = $cell.children(`.${that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)}`);
    let overlayInstance = $overlay.length && $overlay.data('dxOverlay');

    if (!overlayInstance && column) {
      overlayInstance = that._initFilterRangeOverlay($cell, column);
    }

    if (!overlayInstance.option('visible')) {
      that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.hide();
      that._filterRangeOverlayInstance = overlayInstance;

      that._updateFilterRangeOverlay({ width: getOuterWidth($cell, true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH });
      that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.show();
    }
  }

  private _hideFilterRange() {
    const overlayInstance = this._filterRangeOverlayInstance;

    overlayInstance && overlayInstance.hide();
  }

  private getFilterRangeOverlayInstance() {
    return this._filterRangeOverlayInstance;
  }

  protected _createRow(row) {
    const $row = super._createRow(row);

    if (row.rowType === 'filter') {
      $row.addClass(this.addWidgetPrefix(FILTER_ROW_CLASS));

      if (!this.option('useLegacyKeyboardNavigation')) {
        eventsEngine.on($row, 'keydown', (event) => selectView('filterRow', this, event));
      }
    }

    return $row;
  }

  protected _getRows() {
    const result = super._getRows();

    if (this.isFilterRowVisible()) {
      result.push({ rowType: 'filter' });
    }

    return result;
  }

  private _renderFilterCell(cell, options) {
    const that = this;
    const { column } = options;
    const $cell = $(cell);

    if (that.component.option('showColumnHeaders')) {
      that.setAria('describedby', column.headerId, $cell);
    }
    that.setAria('label', messageLocalization.format('dxDataGrid-ariaFilterCell'), $cell);

    $cell.addClass(EDITOR_CELL_CLASS);
    const $container = $('<div>').appendTo($cell);
    const $editorContainer = $('<div>').addClass(EDITOR_CONTAINER_CLASS).appendTo($container);

    if (getColumnSelectedFilterOperation(that, column) === 'between') {
      that._renderFilterRangeContent($cell, column);
    } else {
      const editorOptions = that._getEditorOptions($editorContainer, column);
      that._renderEditor($editorContainer, editorOptions);
    }

    const { alignment } = column;
    if (alignment && alignment !== 'center') {
      $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', column.alignment);
    }

    if (column.filterOperations && column.filterOperations.length) {
      that._renderFilterOperationChooser($container, column, $editorContainer);
    }
  }

  protected _renderCellContent($cell, options) { // TODO _getCellTemplate
    const that = this;
    const { column } = options;

    if (options.rowType === 'filter') {
      if (column.command) {
        $cell.html('&nbsp;');
      } else if (column.allowFiltering) {
        that.renderTemplate($cell, that._renderFilterCell.bind(that), options).done(() => {
          that._updateCell($cell, options);
        });
        return;
      }
    }

    // @ts-expect-error
    super._renderCellContent.apply(this, arguments);
  }

  private _getEditorOptions($editorContainer, column) {
    const that = this;
    const accessibilityOptions = {
      editorOptions: {
        inputAttr: that._getFilterInputAccessibilityAttributes(column),
      },
    };
    const result = extend(accessibilityOptions, column, {
      value: getFilterValue(that, column.index, $editorContainer),
      parentType: 'filterRow',
      showAllText: that.option('filterRow.showAllText'),
      updateValueTimeout: that.option('filterRow.applyFilter') === 'onClick' ? 0 : FILTERING_TIMEOUT,
      width: null,
      setValue(value, notFireEvent) {
        updateFilterValue(that, {
          column,
          value,
          container: $editorContainer,
          notFireEvent,
        });
      },
    });

    if (getColumnSelectedFilterOperation(that, column) === 'between') {
      if ($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
        result.placeholder = that.option('filterRow.betweenStartText');
      } else {
        result.placeholder = that.option('filterRow.betweenEndText');
      }
    }

    return result;
  }

  private _getFilterInputAccessibilityAttributes(column) {
    const columnAriaLabel = messageLocalization.format('dxDataGrid-ariaFilterCell');
    if (this.component.option('showColumnHeaders')) {
      return {
        'aria-label': columnAriaLabel,
        'aria-describedby': column.headerId,
      };
    }
    return { 'aria-label': columnAriaLabel };
  }

  private _renderEditor($editorContainer, options) {
    $editorContainer.empty();
    const $element = $('<div>').appendTo($editorContainer);
    const dataSource = this._dataController.dataSource();

    if (options.lookup && this.option('syncLookupFilterValues')) {
      this._applyFilterViewController.setCurrentColumnForFiltering(options);
      const filter = this._dataController.getCombinedFilter();
      this._applyFilterViewController.setCurrentColumnForFiltering(null);

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(options, dataSource, filter);
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

  private _renderFilterRangeContent($cell, column) {
    const that = this;
    const $editorContainer = $cell.find(`.${EDITOR_CONTAINER_CLASS}`).first();

    $editorContainer.empty();
    const $filterRangeContent = $('<div>')
      .addClass(FILTER_RANGE_CONTENT_CLASS)
      .attr('tabindex', this.option('tabIndex')!);

    eventsEngine.on($filterRangeContent, 'focusin', () => {
      that._showFilterRange($cell, column);
    });

    $filterRangeContent.appendTo($editorContainer);

    that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
  }

  private _updateFilterRangeContent($cell, value) {
    const $filterRangeContent = $cell.find(`.${FILTER_RANGE_CONTENT_CLASS}`);

    if ($filterRangeContent.length) {
      if (value === '') {
        $filterRangeContent.html('&nbsp;');
      } else {
        $filterRangeContent.text(value);
      }
    }
  }

  private _updateFilterOperationChooser($menu, column, $editorContainer) {
    const that = this;
    let isCellWasFocused;
    const restoreFocus = function () {
      const menu = Menu.getInstance($menu);
      menu && menu.option('focusedElement', null);
      isCellWasFocused && that._focusEditor($editorContainer);
    };

    const editorFactoryController = this._editorFactoryController;

    that._createComponent($menu, Menu, {
      // @ts-expect-error
      integrationOptions: {},
      activeStateEnabled: false,
      selectionMode: 'single',
      cssClass: `${that.getWidgetContainerClass()} ${CELL_FOCUS_DISABLED_CLASS} ${FILTER_MENU}`,
      showFirstSubmenuMode: 'onHover',
      hideSubmenuOnMouseLeave: true,
      items: [{
        disabled: !(column.filterOperations && column.filterOperations.length),
        icon: OPERATION_ICONS[getColumnSelectedFilterOperation(that, column) || 'default'],
        selectable: false,
        items: that._getFilterOperationMenuItems(column),
      }],
      onItemRendered: ({ itemElement }) => {
        this.setAria('label', ARIA_SEARCH_BOX, $(itemElement));
      },
      onItemClick(properties) {
        // @ts-expect-error
        const selectedFilterOperation = properties.itemData.name;
        const columnSelectedFilterOperation = getColumnSelectedFilterOperation(that, column);
        let notFocusEditor = false;
        const isOnClickMode = isOnClickApplyFilterMode(that);
        const options = {};

        // @ts-expect-error
        if (properties.itemData.items || (selectedFilterOperation && selectedFilterOperation === columnSelectedFilterOperation)) {
          return;
        }

        if (selectedFilterOperation) {
          options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = selectedFilterOperation;

          if (selectedFilterOperation === 'between' || columnSelectedFilterOperation === 'between') {
            notFocusEditor = selectedFilterOperation === 'between';
            options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
          }
        } else {
          options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
          options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = column.defaultSelectedFilterOperation || null;
        }

        that._columnsController.columnOption(column.index, options);
        that._applyFilterViewController.setHighLight($editorContainer, true);

        if (!selectedFilterOperation) {
          const editor = getEditorInstance($editorContainer);
          // @ts-expect-error
          if (editor && editor.NAME === 'dxDateBox' && !editor.option('isValid')) {
            editor.clear();
            editor.option('isValid', true);
          }
        }

        if (!notFocusEditor) {
          that._focusEditor($editorContainer);
        } else {
          that._showFilterRange($editorContainer.closest(`.${EDITOR_CELL_CLASS}`), column);
        }
      },
      onSubmenuShowing() {
        isCellWasFocused = that._isEditorFocused($editorContainer);
        editorFactoryController.loseFocus();
      },
      onSubmenuHiding() {
        // @ts-expect-error
        eventsEngine.trigger($menu, 'blur');
        restoreFocus();
      },
      onContentReady(e) {
        eventsEngine.on($menu, 'blur', () => {
          const menu = e.component;
          // @ts-expect-error
          menu._hideSubmenuAfterTimeout();
          restoreFocus();
        });
      },
      rtlEnabled: that.option('rtlEnabled'),
    });
  }

  private _isEditorFocused($container) {
    return $container.hasClass(FOCUSED_CLASS) || $container.parents(`.${FOCUSED_CLASS}`).length;
  }

  private _focusEditor($container) {
    this._editorFactoryController.focus($container);
    // @ts-expect-error
    eventsEngine.trigger($container.find(EDITORS_INPUT_SELECTOR), 'focus');
  }

  private _renderFilterOperationChooser($container, column, $editorContainer) {
    const that = this;
    let $menu;

    if (that.option('filterRow.showOperationChooser')) {
      $container.addClass(EDITOR_WITH_MENU_CLASS);
      $menu = $('<div>').prependTo($container);
      that._updateFilterOperationChooser($menu, column, $editorContainer);
    }
  }

  private _getFilterOperationMenuItems(column) {
    const that = this;
    let result: any = [{}];
    const filterRowOptions = that.option('filterRow');
    const operationDescriptions = filterRowOptions && filterRowOptions.operationDescriptions || {};

    if (column.filterOperations && column.filterOperations.length) {
      const availableFilterOperations = column.filterOperations.filter((value) => isDefined(OPERATION_DESCRIPTORS[value]));
      result = map(availableFilterOperations, (value) => {
        const descriptionName = OPERATION_DESCRIPTORS[value];

        return {
          name: value,
          selected: (getColumnSelectedFilterOperation(that, column) || column.defaultFilterOperation) === value,
          text: operationDescriptions[descriptionName],
          icon: OPERATION_ICONS[value],
        };
      });

      result.push({
        name: null,
        text: filterRowOptions && filterRowOptions.resetOperationText,
        icon: OPERATION_ICONS.default,
      });
    }

    return result;
  }

  protected _handleDataChanged(e) {
    const dataSource = this._dataController?.dataSource?.();
    const lastLoadOptions = dataSource?.lastLoadOptions?.();

    // @ts-expect-error
    super._handleDataChanged.apply(this, arguments);

    if (e.operationTypes?.filtering || e.operationTypes?.fullReload) {
      this.updateLookupDataSource(e.operationTypes?.filtering || lastLoadOptions?.filter);
    }
  }

  private updateLookupDataSource(filterChanged?) {
    if (!this.option('syncLookupFilterValues')) {
      return;
    }

    if (!this.element()) {
      return;
    }

    const columns = this._columnsController.getVisibleColumns();
    const dataSource = this._dataController.dataSource();
    const applyFilterViewController = this._applyFilterViewController;
    const rowIndex = this.element().find(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)}`).index();

    if (rowIndex === -1) {
      return;
    }

    columns.forEach((column, index) => {
      if (!column.lookup || column.calculateCellValue !== column.defaultCalculateCellValue) {
        return;
      }

      const $cell = this._getCellElement(rowIndex, index);
      const editor = getEditorInstance($cell?.find('.dx-editor-container'));

      if (editor) {
        applyFilterViewController.setCurrentColumnForFiltering(column);
        const filter = this._dataController.getCombinedFilter() || null;
        applyFilterViewController.setCurrentColumnForFiltering(null);

        const editorDataSource = editor.option('dataSource');
        const shouldUpdateFilter = !filterChanged
          || !equalByValue(editorDataSource.__dataGridSourceFilter || null, filter);

        if (shouldUpdateFilter) {
          const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(column, dataSource, filter);
          editor.option('dataSource', lookupDataSource);
        }
      }
    });
  }

  public getColumnElements(index?, bandColumnIndex?) {
    const rows = this._getRows();

    if (rows?.[index]?.rowType === 'filter' && arguments.length < 2) {
      return this.getCellElements(index);
    }

    return super.getColumnElements(index, bandColumnIndex);
  }
};

const data = (Base: ModuleType<DataController>) => class DataControllerFilterRowExtender extends Base {
  private skipCalculateColumnFilters() {
    return false;
  }

  protected _calculateAdditionalFilter() {
    if (this.skipCalculateColumnFilters()) {
      return super._calculateAdditionalFilter();
    }

    const filters = [super._calculateAdditionalFilter()];
    const columns = this._columnsController.getVisibleColumns(null, true);

    const applyFilterController = this._applyFilterController;

    each(columns, function () {
      const shouldSkip = applyFilterController.getCurrentColumnForFiltering()?.index === this.index;
      if (this.allowFiltering && this.calculateFilterExpression && isDefined(this.filterValue) && !shouldSkip) {
        const filter = this.createFilterExpression(this.filterValue, this.selectedFilterOperation || this.defaultFilterOperation, 'filterRow');
        filters.push(filter);
      }
    });

    return gridCoreUtils.combineFilters(filters);
  }
};

export class ApplyFilterViewController extends modules.ViewController {
  private _headerPanel: any;

  private _currentColumn: any;

  private _columnsController!: ColumnsController;

  public init() {
    this._columnsController = this.getController('columns');
  }

  private _getHeaderPanel() {
    if (!this._headerPanel) {
      // TODO getView
      this._headerPanel = this.getView('headerPanel');
    }
    return this._headerPanel;
  }

  public setHighLight($element, value) {
    if (isOnClickApplyFilterMode(this)) {
      $element
      && $element.toggleClass(HIGHLIGHT_OUTLINE_CLASS, value)
      && $element.closest(`.${EDITOR_CELL_CLASS}`).toggleClass(FILTER_MODIFIED_CLASS, value);
      this._getHeaderPanel().enableApplyButton(value);
    }
  }

  public applyFilter() {
    const columns = this._columnsController.getColumns();

    this._columnsController.beginUpdate();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.bufferedFilterValue !== undefined) {
        this._columnsController.columnOption(i, 'filterValue', column.bufferedFilterValue);
        column.bufferedFilterValue = undefined;
      }
      if (column.bufferedSelectedFilterOperation !== undefined) {
        this._columnsController.columnOption(i, 'selectedFilterOperation', column.bufferedSelectedFilterOperation);
        column.bufferedSelectedFilterOperation = undefined;
      }
    }
    this._columnsController.endUpdate();
    this.removeHighLights();
  }

  private removeHighLights() {
    if (isOnClickApplyFilterMode(this)) {
      // TODO getView
      const columnHeadersViewElement = this.getView('columnHeadersView').element();
      columnHeadersViewElement.find(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)} .${HIGHLIGHT_OUTLINE_CLASS}`).removeClass(HIGHLIGHT_OUTLINE_CLASS);
      columnHeadersViewElement.find(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)} .${FILTER_MODIFIED_CLASS}`).removeClass(FILTER_MODIFIED_CLASS);
      this._getHeaderPanel().enableApplyButton(false);
    }
  }

  public setCurrentColumnForFiltering(column) {
    this._currentColumn = column;
  }

  public getCurrentColumnForFiltering() {
    return this._currentColumn;
  }
}

const columnsResizer = (Base: ModuleType<ColumnsResizerViewController>) => class FilterRowColumnsResizerExtender extends Base {
  protected _startResizing() {
    const that = this;

    // @ts-expect-error
    super._startResizing.apply(that, arguments);

    if (that.isResizing()) {
      // @ts-expect-error
      const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();

      if (overlayInstance) {
        const cellIndex = overlayInstance.$element().closest('td').index();

        if (cellIndex === that._targetPoint.columnIndex || cellIndex === that._targetPoint.columnIndex + 1) {
          overlayInstance.$content().hide();
        }
      }
    }
  }

  protected _endResizing() {
    const that = this;
    let $cell;

    if (that.isResizing()) {
      // @ts-expect-error
      const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();

      if (overlayInstance) {
        $cell = overlayInstance.$element().closest('td');
        // @ts-expect-error
        that._columnHeadersView._updateFilterRangeOverlay({ width: getOuterWidth($cell, true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH });
        overlayInstance.$content().show();
      }
    }

    // @ts-expect-error
    super._endResizing.apply(that, arguments);
  }
};

const editing = (Base: ModuleType<EditingController>) => class FilterRowEditingController extends Base {
  private _needUpdateLookupDataSource: any;

  public updateFieldValue(options) {
    if (options.column.lookup) {
      this._needUpdateLookupDataSource = true;
    }

    // @ts-expect-error
    return super.updateFieldValue.apply(this, arguments);
  }

  protected _afterSaveEditData(cancel?) {
    if (this._needUpdateLookupDataSource && !cancel) {
      // TODO getView
      // @ts-expect-error
      this.getView('columnHeadersView')?.updateLookupDataSource();
    }
    this._needUpdateLookupDataSource = false;

    // @ts-expect-error
    return super._afterSaveEditData.apply(this, arguments);
  }

  protected _afterCancelEditData() {
    this._needUpdateLookupDataSource = false;
    // @ts-expect-error
    return super._afterCancelEditData.apply(this, arguments);
  }
};

const headerPanel = (Base: ModuleType<HeaderPanel>) => class FilterRowHeaderPanel extends Base {
  private _applyFilterViewController!: ApplyFilterViewController;

  public init() {
    super.init();
    this._dataController = this.getController('data');
    this._applyFilterViewController = this.getController('applyFilter');
  }

  public optionChanged(args) {
    if (args.name === 'filterRow') {
      this._invalidate();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  protected _getToolbarItems() {
    const items = super._getToolbarItems();
    const filterItem = this._prepareFilterItem();

    return filterItem.concat(items);
  }

  private _prepareFilterItem() {
    const that = this;
    const filterItem: object[] = [];

    if (that._isShowApplyFilterButton()) {
      const hintText = that.option('filterRow.applyFilterText');
      const columns = that._columnsController.getColumns();
      const disabled = !columns.filter((column) => column.bufferedFilterValue !== undefined).length;
      const onInitialized = function (e) {
        $(e.element).addClass(that._getToolbarButtonClass(APPLY_BUTTON_CLASS));
      };
      const onClickHandler = function () {
        that._applyFilterViewController.applyFilter();
      };
      const toolbarItem = {
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

  private _isShowApplyFilterButton() {
    const filterRowOptions = this.option('filterRow');
    return !!filterRowOptions?.visible && filterRowOptions.applyFilter === 'onClick';
  }

  private enableApplyButton(value) {
    this.setToolbarItemDisabled('applyFilterButton', !value);
  }

  public isVisible() {
    return super.isVisible() || this._isShowApplyFilterButton();
  }
};

export const filterRowModule = {
  defaultOptions() {
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
      data,
      columnsResizer,
      editing,
    },
    views: {
      columnHeadersView,
      headerPanel,
    },
  },
};

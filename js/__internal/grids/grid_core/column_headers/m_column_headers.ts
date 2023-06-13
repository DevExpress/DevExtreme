import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import eventsEngine from '@js/events/core/events_engine';
import messageLocalization from '@js/localization/message';

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

export const columnHeadersModule = {
  defaultOptions() {
    return {
      showColumnHeaders: true,
      cellHintEnabled: true,
    };
  },
  views: {
    columnHeadersView: ColumnsView.inherit((function () {
      const createCellContent = function (that, $cell, options) {
        const $cellContent = $('<div>').addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));

        that.setAria('role', 'presentation', $cellContent);

        addCssClassesToCellContent(that, $cell, options.column, $cellContent);
        const showColumnLines = that.option('showColumnLines');
        const contentAlignment = that.getController('columns').getHeaderContentAlignment(options.column.alignment);

        return $cellContent[showColumnLines || contentAlignment === 'right' ? 'appendTo' : 'prependTo']($cell);
      };

      function addCssClassesToCellContent(that, $cell, column, $cellContent?) {
        const $indicatorElements = that._getIndicatorElements($cell, true);
        const $visibleIndicatorElements = that._getIndicatorElements($cell);
        const indicatorCount = $indicatorElements && $indicatorElements.length;
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

      /**
             * @type {Partial<import('./ui.grid_core.column_headers').ColumnHeadersView>}
             */
      const members = {
        _createTable() {
          const $table = this.callBase.apply(this, arguments);

          eventsEngine.on($table, 'mousedown selectstart', this.createAction((e) => {
            const { event } = e;

            if (event.shiftKey) {
              event.preventDefault();
            }
          }));

          return $table;
        },

        _isLegacyKeyboardNavigation() {
          return this.option('useLegacyKeyboardNavigation');
        },

        _getDefaultTemplate(column) {
          const that = this;

          return function ($container, options) {
            const $content = column.command ? $container : createCellContent(that, $container, options);
            const caption = column.command !== 'expand' && column.caption;

            if (caption) {
              $content.text(caption);
            } else if (column.command) {
              $container.html('&nbsp;');
            }
          };
        },

        _getHeaderTemplate(column) {
          return column.headerCellTemplate || { allowRenderToDetachedContainer: true, render: this._getDefaultTemplate(column) };
        },

        _processTemplate(template, options) {
          const that = this;
          let resultTemplate;
          const { column } = options;
          const renderingTemplate = that.callBase(template);

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
        },

        _handleDataChanged(e) {
          if (e.changeType !== 'refresh') return;

          if (this._isGroupingChanged || this._requireReady) {
            this._isGroupingChanged = false;
            this.render();
          }
        },

        _renderCell($row, options) {
          const $cell = this.callBase($row, options);

          if (options.row.rowType === 'header') {
            $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
            if (!this._isLegacyKeyboardNavigation()) {
              if (options.column && !options.column.type) {
                $cell.attr('tabindex', this.option('tabindex') || 0);
              }
            }
          }

          return $cell;
        },

        _setCellAriaAttributes($cell, cellOptions) {
          this.callBase($cell, cellOptions);
          if (cellOptions.rowType === 'header') {
            this.setAria('role', 'columnheader', $cell);
            if (cellOptions.column && !cellOptions.column.command && !cellOptions.column.isBand) {
              $cell.attr('id', cellOptions.column.headerId);
              this.setAria(
                'label',
                `${messageLocalization.format('dxDataGrid-ariaColumn')} ${cellOptions.column.caption}`,
                $cell,
              );
            }
          }
        },

        _createRow(row) {
          const $row = this.callBase.apply(this, arguments);

          $row.toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));

          if (row.rowType === 'header') {
            $row.addClass(HEADER_ROW_CLASS);
            if (!this._isLegacyKeyboardNavigation()) {
              registerKeyboardAction('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
            }
          }

          return $row;
        },

        _handleActionKeyDown(args) {
          const { event } = args;
          const $target = $(event.target);

          this._lastActionElement = event.target;

          if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
            const headerFilterController = this.getController('headerFilter');
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
        },

        _renderCore() {
          const that = this;
          const $container = that.element();
          const change = {};

          if (that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
            return;
          }

          $container
            .addClass(that.addWidgetPrefix(HEADERS_CLASS))
            .toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled'))
            .empty();

          that.setAria('role', 'presentation', $container);

          const deferred = that._updateContent(that._renderTable({ change }), change);

          if (that.getRowCount() > 1) {
            $container.addClass(MULTI_ROW_HEADER_CLASS);
          }

          that.callBase.apply(that, arguments);
          return deferred;
        },

        _renderRows() {
          const that = this;

          if (that._dataController.isLoaded() || that._hasRowElements) {
            that.callBase.apply(that, arguments);
            that._hasRowElements = true;
          }
        },

        _getRowVisibleColumns(rowIndex) {
          return this._columnsController.getVisibleColumns(rowIndex);
        },

        _renderRow($table, options) {
          options.columns = this._getRowVisibleColumns(options.row.rowIndex);
          this.callBase($table, options);
        },

        _createCell(options) {
          const { column } = options;
          const $cellElement = this.callBase.apply(this, arguments);

          column.rowspan > 1 && options.rowType === 'header' && $cellElement.attr('rowSpan', column.rowspan);

          return $cellElement;
        },

        _getRows() {
          const result: any[] = [];
          const rowCount = this.getRowCount();

          if (this.option('showColumnHeaders')) {
            for (let i = 0; i < rowCount; i++) {
              result.push({ rowType: 'header', rowIndex: i });
            }
          }

          return result;
        },

        _getCellTemplate(options) {
          if (options.rowType === 'header') {
            return this._getHeaderTemplate(options.column);
          }
        },

        _columnOptionChanged(e) {
          const { changeTypes } = e;
          const { optionNames } = e;

          if (changeTypes.grouping || changeTypes.groupExpanding) {
            if (changeTypes.grouping) {
              this._isGroupingChanged = true;
            }
            return;
          }

          this.callBase(e);

          if (optionNames.width || optionNames.visible) {
            this.resizeCompleted.fire();
          }
        },

        _isElementVisible(elementOptions) {
          return elementOptions && elementOptions.visible;
        },

        _alignCaptionByCenter($cell) {
          let $indicatorsContainer = this._getIndicatorContainer($cell, true);

          if ($indicatorsContainer && $indicatorsContainer.length) {
            $indicatorsContainer.filter(`.${VISIBILITY_HIDDEN_CLASS}`).remove();
            $indicatorsContainer = this._getIndicatorContainer($cell);

            $indicatorsContainer
              .clone()
              .addClass(VISIBILITY_HIDDEN_CLASS)
              .css('float', '')
              .insertBefore($cell.children(`.${this.addWidgetPrefix(CELL_CONTENT_CLASS)}`));
          }
        },

        _updateCell($cell, options) {
          if (options.rowType === 'header' && options.column.alignment === 'center') {
            this._alignCaptionByCenter($cell);
          }

          this.callBase.apply(this, arguments);
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _updateIndicator($cell, column, indicatorName) {
          const $indicatorElement = this.callBase.apply(this, arguments);

          if (column.alignment === 'center') {
            this._alignCaptionByCenter($cell);
          }

          addCssClassesToCellContent(this, $cell, column);

          return $indicatorElement;
        },

        _getIndicatorContainer($cell, returnAll) {
          const $indicatorsContainer = this.callBase($cell);

          return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(`:not(.${VISIBILITY_HIDDEN_CLASS})`);
        },

        _isSortableElement() {
          return true;
        },

        getHeadersRowHeight() {
          const $tableElement = this.getTableElement();
          const $headerRows = $tableElement && $tableElement.find(`.${HEADER_ROW_CLASS}`);

          return $headerRows && $headerRows.toArray().reduce((sum, headerRow) => sum + getHeight(headerRow), 0) || 0;
        },

        getHeaderElement(index) {
          const columnElements = this.getColumnElements();

          return columnElements && columnElements.eq(index);
        },

        getColumnElements(index, bandColumnIndex) {
          const that = this;
          let $cellElement;
          const columnsController = that._columnsController;
          const rowCount = that.getRowCount();

          if (that.option('showColumnHeaders')) {
            if (rowCount > 1 && (!isDefined(index) || isDefined(bandColumnIndex))) {
              const result: any[] = [];
              const visibleColumns = isDefined(bandColumnIndex) ? columnsController.getChildrenByBandColumn(bandColumnIndex, true) : columnsController.getVisibleColumns();

              each(visibleColumns, (_, column) => {
                const rowIndex = isDefined(index) ? index : columnsController.getRowIndex(column.index);
                $cellElement = that._getCellElement(rowIndex, columnsController.getVisibleIndex(column.index, rowIndex));
                $cellElement && result.push($cellElement.get(0));
              });

              // @ts-expect-error
              return $(result);
            } if (!index || index < rowCount) {
              return that.getCellElements(index || 0);
            }
          }
        },

        getColumnIndexByElement($cell) {
          const cellIndex = this.getCellIndex($cell);
          const $row = $cell.closest('.dx-row');
          const { rowIndex } = $row[0];
          const column = this.getColumns(rowIndex)[cellIndex];

          return column ? column.index : -1;
        },

        getVisibleColumnIndex(columnIndex, rowIndex) {
          const column = this.getColumns()[columnIndex];

          return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
        },

        getColumnWidths() {
          const $columnElements = this.getColumnElements();

          if ($columnElements && $columnElements.length) {
            return this._getWidths($columnElements);
          }

          return this.callBase.apply(this, arguments);
        },

        allowDragging(column, sourceLocation, draggingPanels) {
          let i;
          let draggableColumnCount = 0;

          const rowIndex = column && this._columnsController.getRowIndex(column.index);
          const columns = this.getColumns(rowIndex === 0 ? 0 : null);
          const canHideColumn = column?.allowHiding && columns.length > 1;
          const allowDrag = function (column) {
            return column.allowReordering || column.allowGrouping || column.allowHiding;
          };

          for (i = 0; i < columns.length; i++) {
            if (allowDrag(columns[i])) {
              draggableColumnCount++;
            }
          }

          if (draggableColumnCount <= 1 && !canHideColumn) {
            return false;
          } if (!draggingPanels) {
            return (this.option('allowColumnReordering') || this._columnsController.isColumnOptionUsed('allowReordering')) && column && column.allowReordering;
          }

          for (i = 0; i < draggingPanels.length; i++) {
            const draggingPanel = draggingPanels[i];

            if (draggingPanel && draggingPanel.allowDragging(column, sourceLocation)) {
              return true;
            }
          }

          return false;
        },

        getBoundingRect() {
          const that = this;
          const $columnElements = that.getColumnElements();

          if ($columnElements && $columnElements.length) {
            const offset = that.getTableElement().offset();
            return {
              top: offset.top,
            };
          }
          return null;
        },

        getName() {
          return 'headers';
        },

        getColumnCount() {
          const $columnElements = this.getColumnElements();

          return $columnElements ? $columnElements.length : 0;
        },

        isVisible() {
          return this.option('showColumnHeaders');
        },

        optionChanged(args) {
          const that = this;

          switch (args.name) {
            case 'showColumnHeaders':
            case 'wordWrapEnabled':
            case 'showColumnLines':
              that._invalidate(true, true);
              args.handled = true;
              break;
            default:
              that.callBase(args);
          }
        },

        getHeight() {
          return this.getElementHeight();
        },

        getContextMenuItems(options) {
          const that = this;
          const { column } = options;

          if (options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
            const sortingOptions = that.option('sorting');

            if (sortingOptions && sortingOptions.mode !== 'none' && column && column.allowSorting) {
              const onItemClick = function (params) {
                setTimeout(() => {
                  that._columnsController.changeSortOrder(column.index, params.itemData.value);
                });
              };
              return [
                {
                  text: sortingOptions.ascendingText, value: 'asc', disabled: column.sortOrder === 'asc', icon: CONTEXT_MENU_SORT_ASC_ICON, onItemClick,
                },
                {
                  text: sortingOptions.descendingText, value: 'desc', disabled: column.sortOrder === 'desc', icon: CONTEXT_MENU_SORT_DESC_ICON, onItemClick,
                },
                {
                  text: sortingOptions.clearText, value: 'none', disabled: !column.sortOrder, icon: CONTEXT_MENU_SORT_NONE_ICON, onItemClick,
                },
              ];
            }
          }
          return undefined;
        },

        getRowCount() {
          return this._columnsController && this._columnsController.getRowCount();
        },

        setRowsOpacity(columnIndex, value, rowIndex) {
          let i;
          let columnElements;
          const rowCount = this.getRowCount();
          const columns = this._columnsController.getColumns();
          const column = columns && columns[columnIndex];
          const columnID = column && column.isBand && column.index;
          const setColumnOpacity = function (column, index) {
            if (column.ownerBand === columnID) {
              columnElements.eq(index).css({ opacity: value });

              if (column.isBand) {
                this.setRowsOpacity(column.index, value, i + 1);
              }
            }
          };

          if (isDefined(columnID)) {
            rowIndex = rowIndex || 0;
            for (i = rowIndex; i < rowCount; i++) {
              columnElements = this.getCellElements(i);

              if (columnElements) {
                const rowColumns = this.getColumns(i);
                rowColumns.forEach(setColumnOpacity);
              }
            }
          }
        },
      };

      return members;
    })()),
  },
};

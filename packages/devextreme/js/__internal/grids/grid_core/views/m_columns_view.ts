/* eslint-disable @typescript-eslint/no-unused-vars */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dblclickEvent } from '@js/common/core/events/double_click';
import pointerEvents from '@js/common/core/events/pointer';
import { removeEvent } from '@js/common/core/events/remove';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import { data as elementData } from '@js/core/element_data';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Callback } from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import * as iteratorUtils from '@js/core/utils/iterator';
import { getBoundingRect, getDefaultAlignment } from '@js/core/utils/position';
import {
  getHeight,
  getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { setWidth } from '@js/core/utils/style';
import {
  isDefined, isFunction, isNumeric,
  isRenderer, isString,
} from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import supportUtils from '@ts/core/utils/m_support';
import type { AdaptiveColumnsController } from '@ts/grids/grid_core/adaptivity/m_adaptivity';
import type { ColumnChooserController, ColumnChooserView } from '@ts/grids/grid_core/column_chooser/m_column_chooser';
import { CLASSES as COLUMN_FIXING_CLASSES } from '@ts/grids/grid_core/column_fixing/const';
import { CLASSES as COLUMN_HEADERS_CLASSES } from '@ts/grids/grid_core/column_headers/const';
import { ColumnStateMixin } from '@ts/grids/grid_core/column_state_mixin/m_column_state_mixin';
import { CLASSES as COLUMNS_CONTROLLER_CLASSES } from '@ts/grids/grid_core/columns_controller/const';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import { CLASSES as ERROR_HANDLING_CLASSES } from '@ts/grids/grid_core/error_handling/const';
import { CLASSES as FILTER_ROW_CLASSES } from '@ts/grids/grid_core/filter_row/const';
import { CLASSES as MASTER_DETAIL_CLASSES } from '@ts/grids/grid_core/master_detail/const';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import type { OptionChanged } from '@ts/grids/grid_core/types';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import type { ColumnsController } from '../columns_controller/columns_controller';
import type { DataController } from '../data_controller/data_controller';
import gridCoreUtils from '../m_utils';
import modules from '../modules/modules';
import { CLASSES } from './const';
import type {
  AppendRowTemplate,
  BoundingRect,
  CellEventOptions,
  CellPosition,
  CellRenderOptions,
  ColumnRenderTemplate,
  ColumnTemplateSource,
  ColumnViewTemplate,
  ColumnViewTemplateOptions,
  ColumnWidthsOptions,
  DelayedTemplate,
  HintColumn,
  RowPreparedOptions,
  RowRenderOptions,
  ScrollableOptions,
  ScrollPosition,
  TableRenderOptions,
  TemplateModel,
  ViewCellOptions,
  ViewDataChange,
  ViewRow,
  ViewRowEvent,
  WatchableOptions,
} from './types';
import { isRowElementVisible } from './utils';

const HIDDEN_COLUMNS_WIDTH = '0.0001px';

const CELL_HINT_VISIBLE = 'dxCellHintVisible';

const appendElementTemplate: AppendRowTemplate = {
  render(options): void {
    options.container.append(options.content);
  },
};

const subscribeToRowEvents = function subscribeToRowEvents(
  that: ColumnsView,
  $table: dxElementWrapper,
): void {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned by the touch handler
  let touchTarget: EventTarget | null | undefined;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned by the touch handler
  let touchCurrentTarget: EventTarget | null | undefined;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned by the touch handler
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function clearTouchTargets(timeout?: number): ReturnType<typeof setTimeout> {
    return setTimeout(() => {
      touchCurrentTarget = null;
      touchTarget = null;
    }, timeout);
  }

  eventsEngine.on($table, 'touchstart touchend', `.${CLASSES.row}`, (e) => {
    // NOTE: checking for target only for mocks in qunits
    if (e?.event?.target && !gridCoreUtils.isElementInCurrentGrid(that, $(e.event.target))) {
      return;
    }

    clearTimeout(timeoutId);
    if (e.type === 'touchstart') {
      touchTarget = e.target;
      touchCurrentTarget = e.currentTarget;
      timeoutId = clearTouchTargets(1000);
    } else {
      timeoutId = clearTouchTargets();
    }
  });

  eventsEngine.on($table, [clickEventName, dblclickEvent, pointerEvents.down].join(' '), `.${CLASSES.row}`, that.createAction((e) => {
    const { event } = e;

    // NOTE: checking for target only for mocks in qunits
    if (e?.event?.target && !gridCoreUtils.isElementInCurrentGrid(that, $(event.target))) {
      return;
    }

    if (touchTarget) {
      event.target = touchTarget;
      event.currentTarget = touchCurrentTarget;
    }

    if (!$(event.target).closest('a').length) {
      e.rowIndex = that.getRowIndex(event.currentTarget);

      if (e.rowIndex >= 0) {
        e.rowElement = getPublicElement($(event.currentTarget));
        e.columns = that.getColumns();

        if (event.type === pointerEvents.down) {
          // @ts-expect-error the row handlers are protected members of the view
          that._rowPointerDown(e);
        } else if (event.type === clickEventName) {
          // @ts-expect-error the row handlers are protected members of the view
          that._rowClick(e);
        } else {
          // @ts-expect-error the row handlers are protected members of the view
          that._rowDblClick(e);
        }
      }
    }
  }));
};

const getWidthStyle = function getWidthStyle(width: number | string): string {
  if (width === 'auto') {
    return '';
  }

  return isNumeric(width) ? `${width}px` : width;
};

const setCellWidth = function setCellWidth(cell: HTMLElement, column: Column, width: string): void {
  const cellWidth = column.width === 'auto' ? '' : width;

  cell.style.maxWidth = cellWidth;
  cell.style.width = cellWidth;
};

const copyAttributes = function copyAttributes(
  element: Element | undefined,
  newElement: Element | undefined,
): void {
  if (!element || !newElement) return;

  const oldAttributes = element.attributes;
  const newAttributes = newElement.attributes;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- the loop shrinks the live list
  for (let i = 0; i < oldAttributes.length; i += 1) {
    const name = oldAttributes[i].nodeName;
    if (!newElement.hasAttribute(name)) {
      element.removeAttribute(name);
    }
  }

  for (const attribute of newAttributes) {
    element.setAttribute(attribute.nodeName, attribute.value);
  }
};

const removeHandler = function removeHandler(templateDeferred: DeferredObj<unknown>): void {
  templateDeferred.resolve();
};

const isRenderTemplate = function isRenderTemplate<TModel extends TemplateModel>(
  template: ColumnTemplateSource<TModel>,
): template is ColumnRenderTemplate<TModel> {
  return !!template
    && !!(template as Partial<ColumnRenderTemplate<TModel>>).render
    && !isRenderer(template);
};

export const normalizeWidth = (width: string | number | undefined): string | undefined => {
  if (typeof width === 'number') {
    return `${width.toFixed(3)}px`;
  }

  if (width === 'adaptiveHidden') {
    return HIDDEN_COLUMNS_WIDTH;
  }

  return width;
};

export class ColumnsView extends ColumnStateMixin(modules.View) {
  protected _tableElement?: dxElementWrapper | null;

  protected _scrollLeft?: number;

  private _delayedTemplates!: DelayedTemplate[];

  private _templateDeferreds!: Set<DeferredObj<unknown>>;

  private _templateTimeouts!: Set<number>;

  private _templatesCache!: Record<string, ColumnViewTemplate>;

  protected _requireReady?: boolean;

  public scrollChanged!: Callback<[ScrollPosition, string]>;

  protected _columnsController!: ColumnsController;

  protected _dataController!: DataController;

  protected adaptiveColumnsController!: AdaptiveColumnsController;

  protected _columnChooserController!: ColumnChooserController;

  protected _editorFactoryController!: EditorFactory;

  protected _selectionController!: SelectionController;

  protected _columnChooserView!: ColumnChooserView;

  public init(): void {
    this._scrollLeft = undefined;
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
    this._columnChooserController = this.getController('columnChooser');
    this._editorFactoryController = this.getController('editorFactory');
    this._selectionController = this.getController('selection');
    this._columnChooserView = this.getView('columnChooserView');
    this._delayedTemplates = [];
    this._templateDeferreds = new Set();
    this._templatesCache = {};
    this._templateTimeouts = new Set();
    this.createAction('onCellClick');
    this.createAction('onRowClick');
    this.createAction('onCellDblClick');
    this.createAction('onRowDblClick');
    this.createAction('onCellHoverChanged', { excludeValidators: ['disabled', 'readOnly'] });
    this.createAction('onCellPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
    this.createAction('onRowPrepared', {
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering',
      afterExecute: (e) => {
        this._afterRowPrepared(e);
      },
    });

    this._columnsController.columnsChanged.add(this._columnOptionChanged.bind(this));
    if (this._dataController) {
      this._dataController.changed.add(this._handleDataChanged.bind(this));
    }
  }

  public dispose(): void {
    if (hasWindow()) {
      const window = getWindow();

      this._templateTimeouts?.forEach((templateTimeout) => window.clearTimeout(templateTimeout));
      this._templateTimeouts?.clear();
    }
  }

  public optionChanged(args: OptionChanged): void {
    super.optionChanged(args);

    switch (args.name) {
      case 'cellHintEnabled':
      case 'onCellPrepared':
      case 'onRowPrepared':
      case 'onCellHoverChanged':
        this._invalidate(true, true);
        args.handled = true;
        break;
      case 'keyboardNavigation':
        if (args.fullName === 'keyboardNavigation.enabled') {
          this._invalidate(true, true);
        }
        args.handled = true;
        break;
      default:
        break;
    }
  }

  protected _createScrollableOptions(): ScrollableOptions {
    const scrollingOptions = this.option('scrolling');
    let useNativeScrolling = this.option('scrolling.useNative');

    const options: ScrollableOptions = extend({}, scrollingOptions, {
      direction: 'both',
      bounceEnabled: false,
      useKeyboard: false,
    });

    // TODO jsdmitry: This condition is for unit tests and testing scrollable
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- null is not native
    if (useNativeScrolling === undefined) {
      useNativeScrolling = true;
    }
    if (useNativeScrolling === 'auto') {
      delete options.useNative;
      // @ts-expect-error the options are the scrolling options
      delete options.useSimulatedScrollbar;
    } else {
      options.useNative = !!useNativeScrolling;
      // @ts-expect-error the options are the scrolling options
      options.useSimulatedScrollbar = !useNativeScrolling;
    }
    return options;
  }

  public _updateCell($cell: dxElementWrapper, parameters: ViewCellOptions): void {
    if (parameters.rowType) {
      this._cellPrepared($cell, parameters);
    }
  }

  protected _needToSetCellWidths(): boolean | undefined {
    return this.option('columnAutoWidth');
  }

  /**
   * @extended: column_fixing, editing
   */
  protected _createCell(options: ViewCellOptions): dxElementWrapper {
    const { column } = options;
    const alignment = column.alignment ?? getDefaultAlignment(this.option('rtlEnabled'));
    const needToSetCellWidths = this._needToSetCellWidths();

    const cell = domAdapter.createElement('td');
    cell.style.textAlign = alignment;

    const $cell = $(cell);

    if (column.cssClass) {
      $cell.addClass(column.cssClass);
    }

    if (Array.isArray(column.elementAttr)) {
      column.elementAttr.forEach(({ name, value }) => {
        $cell.attr(name, value);
      });
    }

    if (column.command === 'expand') {
      if (isDefined(column.cssClass)) {
        $cell.addClass(column.cssClass);
      }
      $cell.addClass(this.addWidgetPrefix(CLASSES.groupSpace));
    }

    if (isDefined(column.colspan) && column.colspan > 1) {
      $cell.attr('colSpan', column.colspan);
    } else if (!column.isBand && column.visibleWidth !== 'auto' && needToSetCellWidths) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
      const minWidth = column.minWidth || column.width;

      if (minWidth) {
        cell.style.minWidth = getWidthStyle(minWidth);
      }
      if (column.width) {
        setCellWidth(cell, column, getWidthStyle(column.width));
      }
    }

    return $cell;
  }

  /**
   * @extended: selection
   */
  protected _createRow(rowObject?: ViewRow, tagName = 'tr'): dxElementWrapper {
    const $element = $(`<${tagName}>`).addClass(CLASSES.row);

    if (tagName === 'tr') {
      this.setAria('role', 'row', $element);
    }
    return $element;
  }

  protected _isAltRow(row: ViewRow | undefined): boolean | undefined {
    return row && isDefined(row.dataIndex) && row.dataIndex % 2 === 1;
  }

  /**
   * @extended: selection
   */
  protected _createTable(columns?: Column[], isAppend?: boolean): dxElementWrapper {
    const $table = $('<table>')
      .addClass(this.addWidgetPrefix(CLASSES.table))
      .addClass(this.addWidgetPrefix(CLASSES.tableFixed));

    if (columns && !isAppend) {
      $table
        .attr('id', `dx-${new Guid()}`)
        .append(this._createColGroup(columns));

      if (browser.safari) {
        // T198380, T809552
        $table.append($('<thead>').append('<tr>'));
      }

      this.setAria('role', 'presentation', $table);
    } else {
      this.setAria('hidden', true, $table);
    }

    this.setAria('role', 'presentation', $('<tbody>').appendTo($table));

    if (isAppend) {
      return $table;
    }

    // T138469
    if (browser.mozilla) {
      eventsEngine.on($table, 'mousedown', 'td', (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      });
    }

    if (this.option('cellHintEnabled')) {
      eventsEngine.on($table, 'mousemove', `.${CLASSES.row} > td`, this.createAction((args) => {
        const e = args.event;
        const $element = $(e.target);
        const $cell = $(e.currentTarget);
        const $row = $cell.parent();
        const visibleColumns = this._columnsController.getVisibleColumns();
        // @ts-expect-error data(key) is typed as returning the wrapper
        const rowOptions: RowPreparedOptions | undefined = $row.data('options');
        const columnIndex = $cell.index();

        const cellOptions = rowOptions && rowOptions.cells && rowOptions.cells[columnIndex];
        const column: HintColumn | undefined = cellOptions
          ? cellOptions.column
          : visibleColumns[columnIndex];

        const isHeaderRow = $row.hasClass(COLUMN_HEADERS_CLASSES.headerRow);
        const isDataRow = $row.hasClass(CLASSES.dataRow);
        const isMasterDetailRow = $row.hasClass(MASTER_DETAIL_CLASSES.detailRow);
        const isGroupRow = $row.hasClass(CLASSES.groupRow);
        const isFilterRow = $row.hasClass(this.addWidgetPrefix(FILTER_ROW_CLASSES.filterRow));

        const isDataRowWithTemplate = isDataRow && (!column || column.cellTemplate);
        const isEditorShown = isDataRow
          && cellOptions
          && (!!rowOptions.isEditing || !!cellOptions.isEditing || column?.showEditorAlways);
        const isHeaderRowWithTemplate = isHeaderRow && (!column || column.headerCellTemplate);
        const isGroupCellWithTemplate = isGroupRow
          && (!column || (column.groupIndex && column.groupCellTemplate));

        const shouldShowHint = !isMasterDetailRow
                                    && !isFilterRow
                                    && !isEditorShown
                                    && !isDataRowWithTemplate
                                    && !isHeaderRowWithTemplate
                                    && !isGroupCellWithTemplate;

        if (shouldShowHint) {
          this._setCellTitleAttribute($element, isHeaderRow);
        }
      }));
    }

    const getOptions = (event: DxEvent): CellEventOptions | undefined => {
      const $cell = $(event.currentTarget);
      const $fieldItemContent = $(event.target).closest(`.${FIELD_ITEM_CONTENT_CLASS}`);
      const $row = $cell.parent();
      // @ts-expect-error data(key) is typed as returning the wrapper
      const rowOptions: RowPreparedOptions | undefined = $row.data('options');
      const options = rowOptions && rowOptions.cells && rowOptions.cells[$cell.index()];

      if (!$cell.closest('table').is(event.delegateTarget)) {
        return undefined;
      }

      const resultOptions: CellEventOptions = extend({}, options, {
        cellElement: getPublicElement($cell),
        event,
        eventType: event.type,
      });

      resultOptions.rowIndex = this.getRowIndex($row);

      if ($fieldItemContent.length) {
        // @ts-expect-error data(key) is typed as returning the wrapper
        const formItemOptions: { column?: Column } = $fieldItemContent.data('dx-form-item');
        if (formItemOptions.column) {
          resultOptions.column = formItemOptions.column;
          resultOptions.columnIndex = this._columnsController
            .getVisibleIndex(resultOptions.column.index);
        }
      }

      return resultOptions;
    };

    eventsEngine.on($table, 'mouseover', `.${CLASSES.row} > td`, (e) => {
      const options = getOptions(e);
      if (options) {
        this.executeAction('onCellHoverChanged', options);
      }
    });

    eventsEngine.on($table, 'mouseout', `.${CLASSES.row} > td`, (e) => {
      const options = getOptions(e);
      if (options) {
        this.executeAction('onCellHoverChanged', options);
      }
    });

    eventsEngine.on($table, clickEventName, `.${CLASSES.row} > td`, (e) => {
      const options = getOptions(e);
      if (options) {
        this.executeAction('onCellClick', options);
      }
    });

    eventsEngine.on($table, dblclickEvent, `.${CLASSES.row} > td`, (e) => {
      const options = getOptions(e);
      if (options) {
        this.executeAction('onCellDblClick', options);
      }
    });

    subscribeToRowEvents(this, $table);

    return $table;
  }

  private _setCellTitleAttribute($cell: dxElementWrapper, isHeaderRow: boolean): void {
    if ($cell.data(CELL_HINT_VISIBLE)) {
      $cell.removeAttr('title');
      $cell.data(CELL_HINT_VISIBLE, false);
    }

    let $cellContent = $cell;
    const headerContentClass = this.addWidgetPrefix(COLUMN_HEADERS_CLASSES.cellContent);

    if (isHeaderRow && !$cell.hasClass(headerContentClass)) {
      const $headerContent = $cell.find(`.${headerContentClass}`);
      $cellContent = $headerContent.length ? $headerContent : $cellContent;
    }

    const hasWidthOverflow = $cellContent[0].scrollWidth - $cellContent[0].clientWidth > 0;

    if (!hasWidthOverflow || isDefined($cell.attr('title'))) {
      return;
    }

    const hintText = $cellContent.text() || $cell.text();

    $cell.attr('title', hintText);
    $cell.data(CELL_HINT_VISIBLE, true);
  }

  /**
   * @extended: editing
   */
  protected _rowPointerDown(e?: ViewRowEvent): void {}

  protected _rowClick(e?: ViewRowEvent): void {}

  protected _rowDblClick(e?: ViewRowEvent): void {}

  protected _createColGroup(columns: Column[]): dxElementWrapper {
    const colgroupElement = $('<colgroup>');

    for (const column of columns) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
      const colspan = column.colspan || 1;

      for (let j = 0; j < colspan; j += 1) {
        colgroupElement.append(this._createCol(column));
      }
    }
    return colgroupElement;
  }

  /**
   * @extended: column_fixing
   */
  protected _createCol(column: Column): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
    let width = column.visibleWidth || column.width;

    if (width === 'adaptiveHidden') {
      width = HIDDEN_COLUMNS_WIDTH;
    }

    const col = $('<col>');
    setWidth(col, width);

    return col;
  }

  /**
   * @extended: keyboard_navigation, virtual_scrolling
   */
  public renderDelayedTemplates(change?: DataChange): void {
    const delayedTemplates = this._delayedTemplates;
    const syncTemplates = delayedTemplates.filter((template) => !template.async);
    const asyncTemplates = delayedTemplates.filter((template) => template.async);

    this._delayedTemplates = [];

    this._renderDelayedTemplatesCore(syncTemplates, false, change);
    this._renderDelayedTemplatesCoreAsync(asyncTemplates);
  }

  private _renderDelayedTemplatesCoreAsync(templates: DelayedTemplate[]): void {
    if (templates.length) {
      const templateTimeout = getWindow().setTimeout(() => {
        this._templateTimeouts.delete(templateTimeout);
        this._renderDelayedTemplatesCore(templates, true);
      });

      this._templateTimeouts.add(templateTimeout);
    }
  }

  private _renderDelayedTemplatesCore(
    templates: DelayedTemplate[],
    isAsync: boolean,
    change?: DataChange,
  ): void {
    const date = new Date();

    while (templates.length) {
      const templateParameters = templates.shift();

      if (!templateParameters) {
        break;
      }

      const { options } = templateParameters;
      const doc = domAdapter.getRootNode($(options.container).get(0) as HTMLElement);
      const needWaitAsyncTemplates = this.needWaitAsyncTemplates();

      if (!isAsync || $(options.container).closest(doc).length || needWaitAsyncTemplates) {
        if (change) {
          options.change = change;
        }
        templateParameters.template.render(options);
      }
      // @ts-expect-error Date objects subtract as timestamps
      if (isAsync && (new Date() - date) > 30) {
        this._renderDelayedTemplatesCoreAsync(templates);
        break;
      }
    }

    if (!templates.length && this._delayedTemplates.length) {
      this.renderDelayedTemplates();
    }
  }

  protected _processTemplate<TModel extends TemplateModel>(
    template: ColumnTemplateSource<TModel>,
    options?: TModel,
  ): ColumnViewTemplate<TModel> {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
    let renderingTemplate: ColumnViewTemplate<TModel>;

    if (isRenderTemplate(template)) {
      renderingTemplate = {
        allowRenderToDetachedContainer: template.allowRenderToDetachedContainer,
        render(templateOptions: ColumnViewTemplateOptions<TModel>): void {
          template.render(templateOptions.container, templateOptions.model, templateOptions.change);
          templateOptions.deferred?.resolve();
        },
      };
    } else if (isFunction(template)) {
      renderingTemplate = {
        render(templateOptions: ColumnViewTemplateOptions<TModel>): void {
          const renderedTemplate = template(
            getPublicElement(templateOptions.container),
            templateOptions.model,
            templateOptions.change,
          );
          if (renderedTemplate && (renderedTemplate.nodeType || isRenderer(renderedTemplate))) {
            templateOptions.container.append(renderedTemplate);
          }
          templateOptions.deferred?.resolve();
        },
      };
    } else {
      const templateID = isString(template) ? template : $(template).attr('id');

      if (!templateID) {
        renderingTemplate = this.getTemplate(template);
      } else {
        if (!this._templatesCache[templateID]) {
          this._templatesCache[templateID] = this.getTemplate(template);
        }

        renderingTemplate = this._templatesCache[templateID];
      }
    }

    return renderingTemplate;
  }

  public renderTemplate<TModel extends TemplateModel>(
    container: dxElementWrapper,
    template: ColumnTemplateSource<TModel>,
    options: TModel,
    allowRenderToDetachedContainer?: boolean,
    change?: ViewDataChange,
  ): DeferredObj<unknown> {
    const renderingTemplate = this._processTemplate(template, options);
    const { column } = options;
    const isDataRow = options.rowType === 'data';
    const templateDeferred = Deferred<unknown>();
    const templateOptions: ColumnViewTemplateOptions<TModel> = {
      container,
      model: options,
      deferred: templateDeferred,
      onRendered: () => {
        if (this.isDisposed()) {
          templateDeferred.reject();
        } else {
          templateDeferred.resolve();
        }
      },
    };

    if (renderingTemplate) {
      options.component = this.component;

      const columnAsync = column && (
        (column.renderAsync && isDataRow)
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of flags
        || (this.option('renderAsync') && (
          (column.renderAsync !== false
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of flags
            && (column.command || column.showEditorAlways)
            && isDataRow)
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of flags
          || options.rowType === 'filter'
        ))
      );

      const async = options.renderAsync ?? columnAsync;

      if (
        (renderingTemplate.allowRenderToDetachedContainer || allowRenderToDetachedContainer)
        && !async
      ) {
        renderingTemplate.render(templateOptions);
      } else {
        this._delayedTemplates.push({
          // an entry's template is only rendered with that entry's options
          template: renderingTemplate as ColumnViewTemplate,
          options: templateOptions,
          async,
        });
      }

      this._templateDeferreds.add(templateDeferred);
      eventsEngine.on(container, removeEvent, removeHandler.bind(null, templateDeferred));
    } else {
      templateDeferred.reject();
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- promise() is typed as Promise
    return templateDeferred.promise().always(() => {
      this._templateDeferreds.delete(templateDeferred);
    });
  }

  protected _getBodies(tableElement: dxElementWrapper): dxElementWrapper {
    return $(tableElement).children('tbody').not(`.${CLASSES.headerBody}`).not(`.${CLASSES.footerBody}`);
  }

  protected _needWrapRow(): boolean {
    return false;
  }

  protected _wrapRowIfNeed($row: dxElementWrapper): dxElementWrapper {
    const needWrapRow = this._needWrapRow();

    if (needWrapRow) {
      const $tbody = $('<tbody>').addClass($row.attr('class') ?? '');

      this.setAria('role', 'presentation', $tbody);

      return $tbody.append($row);
    }

    return $row;
  }

  private _appendRow(
    $table: dxElementWrapper,
    $row: dxElementWrapper,
    appendTemplate: AppendRowTemplate = appendElementTemplate,
  ): void {
    appendTemplate.render({ content: $row, container: $table });
  }

  private removeFirstCellClasses(): void {
    const firstCellClass = this.addWidgetPrefix(CLASSES.firstCell);

    this._tableElement?.find(`.${firstCellClass}`).removeClass(firstCellClass);
  }

  protected toggleFirstCellClass(
    $cell: dxElementWrapper | undefined,
    isFirstValue: boolean,
  ): void {
    $cell?.toggleClass(this.addWidgetPrefix(CLASSES.firstCell), isFirstValue);
  }

  /**
   * @extended: column_fixing, filter_row, row_dragging, virtual_columns
   */
  protected _resizeCore(): void {
    this.updateScrollLeftPosition();
  }

  /**
   * @extended: column_fixing, header_panel, virtual_column
   */
  protected _renderCore(e?: DataChange): DeferredObj<unknown> {
    // @ts-expect-error the view is rendered here
    const $root = this.element().parent();

    if (!$root || $root.parent().length) {
      this.renderDelayedTemplates(e);
    }

    return Deferred<unknown>().resolve();
  }

  /**
   * @extended: column_fixing
   */
  protected _renderTable(options: TableRenderOptions = {}): dxElementWrapper {
    options.columns = this._columnsController.getVisibleColumns();
    const changeType = options.change && options.change.changeType;
    const $table = this._createTable(
      options.columns,
      changeType === 'append' || changeType === 'prepend' || changeType === 'update',
    );

    this._renderRows($table, options);

    return $table;
  }

  protected _renderRows($table: dxElementWrapper, options: TableRenderOptions): void {
    const rows = this._getRows(options.change);
    const columnIndices = options.change?.columnIndices ?? [];
    const changeTypes = options.change?.changeTypes ?? [];

    for (let i = 0; i < rows.length; i += 1) {
      this._renderRow($table, extend({
        row: rows[i], columnIndices: columnIndices[i], changeType: changeTypes[i],
      }, options));
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _renderRow($table: dxElementWrapper, options: RowRenderOptions): void {
    if (!options.columnIndices) {
      options.row.cells = [];
    }

    const $row = this._createRow(options.row);
    const $wrappedRow = this._wrapRowIfNeed($row);
    if (options.changeType !== 'remove') {
      this._renderCells($row, options);
    }
    this._appendRow($table, $wrappedRow);
    const rowOptions: RowPreparedOptions = extend({ columns: options.columns }, options.row);

    this._addWatchMethod(rowOptions, options.row);

    this._rowPrepared($wrappedRow, rowOptions, options.row);
  }

  protected _needRenderCell(columnIndex: number, columnIndices?: number[]): boolean {
    return !columnIndices || columnIndices.includes(columnIndex);
  }

  protected _renderCells($row: dxElementWrapper, options: RowRenderOptions): void {
    let columnIndex = 0;
    const { row } = options;
    const { columns } = options;

    for (let i = 0; i < columns.length; i += 1) {
      if (this._needRenderCell(i, options.columnIndices)) {
        this._renderCell($row, extend({
          column: columns[i],
          columnIndex,
          value: row.values?.[columnIndex],
          oldValue: row.oldValues?.[columnIndex],
        }, options));
      }

      const { colspan } = columns[i];

      if (isDefined(colspan) && colspan > 1) {
        columnIndex += colspan;
      } else {
        columnIndex += 1;
      }
    }
  }

  protected _updateCells(
    $rowElement: dxElementWrapper,
    $newRowElement: dxElementWrapper,
    columnIndices: number[],
    options?: ViewRow,
  ): void {
    const $cells = $rowElement.children();
    const $newCells = $newRowElement.children();
    const highlightChanges = this.option('highlightChanges');
    const cellUpdatedClass = this.addWidgetPrefix(CLASSES.cellUpdatedAnimation);

    if (options?.node?.hasChildren) {
      // @ts-expect-error each() is typed for callbacks that return a boolean
      $cells.each((_, cell) => {
        this.setAria('expanded', options.isExpanded, $(cell));
      });
    }

    columnIndices.forEach((columnIndex, index) => {
      const $cell = $cells.eq(columnIndex);
      const $newCell = $newCells.eq(index);

      $cell.replaceWith($newCell);

      if (highlightChanges && !$newCell.hasClass(COLUMNS_CONTROLLER_CLASSES.commandExpand)) {
        $newCell.addClass(cellUpdatedClass);
      }
    });

    copyAttributes($rowElement.get(0), $newRowElement.get(0));
  }

  /**
   * @extended: editing
   */
  protected _setCellAriaAttributes(
    $cell: dxElementWrapper,
    cellOptions: Pick<ViewCellOptions, 'rowType' | 'columnIndex'>,
    options: CellRenderOptions,
  ): void {
    const { row } = options;
    const isFreeSpaceRow = cellOptions.rowType === 'freeSpace';
    const isGroupRow = cellOptions.rowType === 'group';
    const rowHasChildren = row?.node?.hasChildren;

    if (isFreeSpaceRow) {
      return;
    }

    this.setAria('role', 'gridcell', $cell);

    if (rowHasChildren) {
      this.setAria('expanded', row.isExpanded, $cell);
    }

    const columnIndexOffset = this._columnsController.getColumnIndexOffset();
    // NOTE: Group rows always visible and their aria column idx shouldn't be shifted
    const ariaColIndex = isGroupRow
      ? cellOptions.columnIndex + 1
      : cellOptions.columnIndex + columnIndexOffset + 1;

    this.setAria('colindex', ariaColIndex, $cell);
  }

  protected _renderCell($row: dxElementWrapper, options: CellRenderOptions): dxElementWrapper {
    const cellOptions = this._getCellOptions(options);

    if (options.columnIndices) {
      if (options.row.cells) {
        const cellIndex = options.row.cells
          .findIndex((cell) => cell.columnIndex === cellOptions.columnIndex);
        options.row.cells[cellIndex] = cellOptions;
      }
    } else {
      // @ts-expect-error _renderRow creates the cells when columnIndices aren't set
      options.row.cells.push(cellOptions);
    }

    const $cell = this._createCell(cellOptions);

    this._setCellAriaAttributes($cell, cellOptions, options);

    this._renderCellContent($cell, cellOptions, options);

    $row.get(0).appendChild($cell.get(0));

    return $cell;
  }

  /**
   * @extended: column_fixing, editing_form_based, filter_row, header_filter
   */
  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    const template = this._getCellTemplate(options);

    when(
      !template || this.renderTemplate($cell, template, options, undefined, renderOptions.change),
    ).done(() => {
      this._updateCell($cell, options);
    });
  }

  protected _getCellTemplate(
    options?: ViewCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    return undefined;
  }

  protected _getRows(change?: ViewDataChange): ViewRow[] {
    return [];
  }

  protected _getCellOptions(options: CellRenderOptions): ViewCellOptions {
    const cellOptions: ViewCellOptions = {
      column: options.column,
      columnIndex: options.columnIndex,
      rowType: options.row.rowType,
      rowIndex: options.row.rowIndex,
      isAltRow: this._isAltRow(options.row),
    };

    this._addWatchMethod(cellOptions);

    return cellOptions;
  }

  public _addWatchMethod(
    options: WatchableOptions,
    source: WatchableOptions = options,
  ): WatchableOptions | undefined {
    if (!this.option('repaintChangesOnly')) {
      return undefined;
    }

    const watchers: ((row?: ProcessedItem) => void)[] = [];

    source.watch ??= function watch(getter, updateValueFunc, updateRowFunc): () => void {
      // @ts-expect-error watch is used for data rows, which have data
      let oldValue = getter(source.data);

      const watcher = function watcher(row?: ProcessedItem): void {
        if (row && updateRowFunc) {
          updateRowFunc(row);
        }

        // @ts-expect-error watch is used for data rows, which have data
        const newValue = getter(source.data);

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          if (row) {
            updateValueFunc(newValue);
          }
          oldValue = newValue;
        }
      };

      watchers.push(watcher);

      const stopWatch = function stopWatch(): void {
        const index = watchers.indexOf(watcher);
        if (index >= 0) {
          watchers.splice(index, 1);
        }
      };

      return stopWatch;
    };

    source.update ??= function update(this: WatchableOptions, row, keepRow): void {
      if (row) {
        options.data = row.data;
        this.data = options.data;
        options.rowIndex = row.rowIndex;
        this.rowIndex = options.rowIndex;
        options.dataIndex = row.dataIndex;
        this.dataIndex = options.dataIndex;
        options.isExpanded = row.isExpanded;
        this.isExpanded = options.isExpanded;

        if (options.row && !keepRow) {
          options.row = row;
        }
      }

      watchers.forEach((watcher) => {
        watcher(row);
      });
    };

    if (source !== options) {
      options.watch = source.watch.bind(source);
    }

    return options;
  }

  /**
   * @extended: adaptivity, editing, validating
   */
  public _cellPrepared(cell: dxElementWrapper, options: ViewCellOptions): void {
    options.cellElement = getPublicElement($(cell));
    this.executeAction('onCellPrepared', options);
  }

  protected _rowPrepared($row: dxElementWrapper, options: RowPreparedOptions, row?: ViewRow): void {
    elementData($row.get(0), 'options', options);

    options.rowElement = getPublicElement($row);
    this.executeAction('onRowPrepared', options);
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { optionNames } = e;

    if (gridCoreUtils.checkChanges(optionNames, ['width', 'visibleWidth'])) {
      const visibleColumns = this._columnsController.getVisibleColumns();
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
      const widths = visibleColumns.map((column) => column.visibleWidth || column.width);

      this.setColumnWidths({ widths, optionNames });
      return;
    }

    if (!this._requireReady) {
      this.render();
    }
  }

  /**
   * @extended: column_fixing, editing
   */
  public getCellIndex($cell: dxElementWrapper, rowIndex?: number): number {
    const cellIndex: number = $cell.length ? $cell[0].cellIndex : -1;

    return cellIndex;
  }

  /**
   * @extended: column_fixing
   */
  public getTableElements(): dxElementWrapper {
    return this._tableElement ?? $();
  }

  /**
   * @extended: column_fixing
   */
  public getTableElement(isFixedTableRendering?: boolean): dxElementWrapper | null | undefined {
    return this._tableElement;
  }

  /**
   * @extended: column_fixing
   */
  public setTableElement(
    tableElement: dxElementWrapper | null | undefined,
    isFixedTableRendering?: boolean,
  ): void {
    this._tableElement = tableElement;
  }

  protected _afterRowPrepared(e?: Record<string, unknown>): void {}

  /**
   * @extended: header_panel
   */
  protected _handleDataChanged(e: DataChange): void {
  }

  public callbackNames(): string[] {
    return ['scrollChanged'];
  }

  protected updateScrollLeftPosition(): void {
    const scrollLeft = this._scrollLeft;

    if (isDefined(scrollLeft)) {
      this._scrollLeft = 0;
      this.scrollTo({ left: scrollLeft });
    }
  }

  public scrollTo(pos: ScrollPosition): void {
    const $element = this.element();
    const $scrollContainer = $element
      ?.children(`.${this.addWidgetPrefix(CLASSES.scrollContainer)}`)
      .not(`.${this.addWidgetPrefix(COLUMN_FIXING_CLASSES.contentFixed)}`);

    if (isDefined(pos) && isDefined(pos.left) && this._scrollLeft !== pos.left) {
      this._scrollLeft = pos.left;
      // @ts-expect-error scrollLeft() is typed for string values
      $scrollContainer?.scrollLeft(pos.left);
    }
  }

  /**
   * @extended: column_fixing
   */
  public getContent(isFixedTableRendering?: boolean): dxElementWrapper | undefined {
    return this._tableElement?.parent();
  }

  private _removeContent(isFixedTableRendering: boolean | undefined): void {
    const $scrollContainer = this.getContent(isFixedTableRendering);

    if ($scrollContainer?.length) {
      $scrollContainer.remove();
    }
  }

  protected handleScroll(e: DxEvent): void {
    // @ts-expect-error scrollLeft() is typed as a setter only
    const scrollLeft: number = $(e.target).scrollLeft();

    if (scrollLeft !== this._scrollLeft) {
      this.scrollChanged.fire({ left: scrollLeft }, this.name);
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _wrapTableInScrollContainer(
    $table: dxElementWrapper,
    isFixedTableRendering?: boolean,
  ): dxElementWrapper {
    const $scrollContainer = $('<div>');
    const useNative = this.option('scrolling.useNative');

    if (useNative === false || (useNative === 'auto' && !supportUtils.nativeScrolling)) {
      $scrollContainer.addClass(this.addWidgetPrefix(CLASSES.scrollableSimulated));
    }
    eventsEngine.on($scrollContainer, 'scroll', this.handleScroll.bind(this));

    $scrollContainer.addClass(this.addWidgetPrefix(CLASSES.content))
      .addClass(this.addWidgetPrefix(CLASSES.scrollContainer))
      .append($table)
      // @ts-expect-error the view is rendered here
      .appendTo(this.element());

    this.setAria('role', 'presentation', $scrollContainer);

    return $scrollContainer;
  }

  private needWaitAsyncTemplates(): boolean | undefined {
    return this.option('templatesRenderAsynchronously') && this.option('renderAsync') === false;
  }

  public isWaitingForAsyncTemplates(): boolean {
    return !!this.needWaitAsyncTemplates() && this._templateDeferreds?.size > 0;
  }

  public waitAsyncTemplates(forceWaiting = false): DeferredObj<unknown> {
    const result = Deferred<unknown>();
    const needWaitAsyncTemplates = forceWaiting || this.needWaitAsyncTemplates();

    if (!needWaitAsyncTemplates || !isDefined(this._templateDeferreds)) {
      return result.resolve();
    }

    const waitTemplatesRecursion = (): DeferredObj<unknown> => when
      .apply(this, Array.from(this._templateDeferreds))
      .done(() => {
        if (this.isDisposed()) {
          result.reject();
        } else if (this._templateDeferreds.size > 0) {
          waitTemplatesRecursion();
        } else {
          result.resolve();
        }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- fail ignores the result
      }).fail(result.reject);

    waitTemplatesRecursion();

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return result.promise();
  }

  /**
   * @extended: sticky_columns, rows_view
   */
  protected _updateContent(
    $newTableElement: dxElementWrapper,
    change?: ViewDataChange,
    isFixedTableRendering?: boolean,
  ): DeferredObj<unknown> {
    return this.waitAsyncTemplates().done(() => {
      this._removeContent(isFixedTableRendering);
      this.setTableElement($newTableElement, isFixedTableRendering);
      this._wrapTableInScrollContainer($newTableElement, isFixedTableRendering);
    });
  }

  public _findContentElement(isFixedTableRendering?: boolean): dxElementWrapper | undefined {
    return undefined;
  }

  public _getWidths($cellElements?: dxElementWrapper): number[] {
    if (!$cellElements) {
      return [];
    }

    const result: number[] = [];
    const cellElements = $cellElements.toArray();

    (cellElements as HTMLElement[]).forEach((cell) => {
      let width = cell.offsetWidth;

      if ((cell as Partial<HTMLElement>).getBoundingClientRect) {
        const rect = getBoundingRect(cell);

        if (rect.width > cell.offsetWidth - 1) {
          width = rect.width;
        }
      }

      result.push(width);
    });

    return result;
  }

  /**
   * @extended: column_fixing
   */
  public getColumnWidths($tableElement?: dxElementWrapper, rowIndex?: number): number[] {
    (this.option('forceApplyBindings') ?? noop)();

    const $table = $tableElement ?? this.getTableElement();

    if ($table) {
      const $rows = $table.children(`tbody:not(.${CLASSES.headerBody})`).children();

      for (let i = 0; i < $rows.length; i += 1) {
        const $row = $rows.eq(i);

        const isGroupRow = $row.hasClass(CLASSES.groupRow);
        const isDetailRow = $row.hasClass(MASTER_DETAIL_CLASSES.detailRow);
        const isErrorRow = $row.hasClass(ERROR_HANDLING_CLASSES.errorRow);

        const isRowVisible = isRowElementVisible($row.get(0) as HTMLElement);
        const isRelevantRow = !isGroupRow && !isDetailRow && !isErrorRow;

        if (isRowVisible && isRelevantRow) {
          const $cells = $row.children('td');

          const result = this._getWidths($cells);

          return result;
        }
      }
    }

    return [];
  }

  protected getVisibleColumnIndex(columnIndex: number, rowIndex?: number): number {
    return columnIndex;
  }

  private setCellPropertiesCore(
    styleProps: Partial<CSSStyleDeclaration>,
    $row: dxElementWrapper,
    visibleCellIndex: number,
  ): void {
    const $cell = $row.hasClass(CLASSES.groupRow)
      ? $row.find(`td[aria-colindex='${visibleCellIndex + 1}']:not(.${CLASSES.groupCell})`)
      : $row.find('td').eq(visibleCellIndex);

    for (let i = 0; i < $cell.length; i += 1) {
      const cell = $cell.get(i) as HTMLElement;

      Object.assign(cell.style, styleProps);
    }
  }

  protected setCellProperties(
    styleProps: Partial<CSSStyleDeclaration>,
    columnIndex: number,
    rowIndex?: number,
  ): void {
    const $tableElement = this.getTableElement();

    if (!$tableElement?.length) {
      return;
    }

    const $rows = $tableElement.children().children(`.${CLASSES.row}`).not(`.${MASTER_DETAIL_CLASSES.detailRow}`);

    if (isDefined(rowIndex)) {
      this.setCellPropertiesCore(styleProps, $rows.eq(rowIndex), columnIndex);
    } else {
      for (let currentRowIndex = 0; currentRowIndex < $rows.length; currentRowIndex += 1) {
        const visibleIndex = this.getVisibleColumnIndex(columnIndex, currentRowIndex);

        if (visibleIndex >= 0) {
          this.setCellPropertiesCore(styleProps, $rows.eq(currentRowIndex), visibleIndex);
        }
      }
    }
  }

  protected setColumnWidths({ widths, optionNames }: ColumnWidthsOptions): void {
    const $tableElement = this.getTableElement();

    if (!$tableElement?.length || !widths) {
      return;
    }

    const columns = this.getColumns();
    const needToSetCellWidths = this._needToSetCellWidths();

    const $cols = $tableElement.children('colgroup').children('col');
    $cols.toArray().forEach((col) => col.removeAttribute('style'));

    columns.forEach((column, columnIndex) => {
      /*
      Probably we do not need this if statement. It seems like there is no point to set
      min-width, width and max-width for each cell, beacuse below width for cols in colgroup is set.
      Style for cols applies to all td elements.

      Also check _createCell method because min-width, width and max-width are also set there.
      */
      if (needToSetCellWidths && column.width && !column.command) {
        const styleProps: Partial<CSSStyleDeclaration> = {};
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
        const width = getWidthStyle(column.visibleWidth || column.width);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
        const minWidth = getWidthStyle(column.minWidth || width);

        styleProps.width = column.width === 'auto' ? '' : width;
        styleProps.maxWidth = styleProps.width;
        styleProps.minWidth = minWidth;

        this.setCellProperties(styleProps, columnIndex);
      }

      const colWidth = normalizeWidth(widths[columnIndex]);

      if (isDefined(colWidth)) {
        setWidth($cols.eq(columnIndex), colWidth);
      }
    });
  }

  /**
   * @extended: editing_form_based
   */
  public getCellElements(rowIndex: number): dxElementWrapper | undefined {
    return this._getCellElementsCore(rowIndex);
  }

  protected _getCellElementsCore(rowIndex: number): dxElementWrapper | undefined {
    if (rowIndex < 0) {
      return undefined;
    }

    const $row = this._getRowElements().eq(rowIndex);

    return $row.children();
  }

  /**
   * @extended: adaptivity
   */
  public _getCellElement(
    rowIndex: number,
    columnIdentifier: string | number,
  ): dxElementWrapper | undefined {
    const $cells = this.getCellElements(rowIndex) ?? $();
    const columnVisibleIndex = this._getVisibleColumnIndex($cells, rowIndex, columnIdentifier);

    if (!$cells?.length || columnVisibleIndex < 0) {
      return undefined;
    }

    const $cell = $cells.eq(columnVisibleIndex);

    return $cell.length > 0 ? $cell : undefined;
  }

  private _getRowElement(rowIndex: number): dxElementWrapper | undefined {
    let $rowElement = $();
    const $tableElements = this.getTableElements();

    iteratorUtils.each($tableElements, (_, tableElement) => {
      $rowElement = $rowElement.add(this._getRowElements($(tableElement)).eq(rowIndex));
    });

    if ($rowElement.length) {
      return $rowElement;
    }
    return undefined;
  }

  private getCellElement(rowIndex: number, columnIdentifier: string | number): Element | undefined {
    const $cell = this._getCellElement(rowIndex, columnIdentifier);

    if ($cell) {
      return getPublicElement($cell);
    }

    return undefined;
  }

  public getRowElement(rowIndex: number): Element[] | dxElementWrapper | undefined {
    const $rows = this._getRowElement(rowIndex);
    let elements: Element[] | dxElementWrapper | undefined = [];

    // @ts-expect-error getPublicElement returns a jQuery object when jQuery is used
    if ($rows && !getPublicElement($rows).get) {
      for (const row of $rows.toArray()) {
        elements.push(row);
      }
    } else {
      elements = $rows;
    }
    return elements;
  }

  /**
   * @extended: editing_form_based, column_headers
   */
  protected _getVisibleColumnIndex(
    $cells: dxElementWrapper,
    rowIndex: number,
    columnIdentifier: string | number,
  ): number {
    if (isString(columnIdentifier)) {
      const columnIndex = this._columnsController.columnOption(columnIdentifier, 'index');
      return this._columnsController.getVisibleIndex(columnIndex);
    }

    return columnIdentifier;
  }

  public getColumnElements(): dxElementWrapper | undefined {
    return undefined;
  }

  public getColumns(rowIndex?: number | null, $tableElement?: dxElementWrapper): Column[] {
    return this._columnsController.getVisibleColumns(rowIndex);
  }

  /**
   * @extended: adaptivity
   */
  public getCell(
    cellPosition: CellPosition,
    rows?: dxElementWrapper,
    cells?: dxElementWrapper,
  ): dxElementWrapper | undefined {
    const $rows = rows ?? this._getRowElements();

    if ($rows.length > 0 && cellPosition.rowIndex >= 0) {
      if (
        this.option('scrolling.mode') !== 'virtual'
        && this.option('scrolling.rowRenderingMode') !== 'virtual'
      ) {
        cellPosition.rowIndex = cellPosition.rowIndex < $rows.length
          ? cellPosition.rowIndex
          : $rows.length - 1;
      }
      const $cells = cells ?? this.getCellElements(cellPosition.rowIndex);
      if ($cells && $cells.length > 0) {
        return $cells.eq(
          $cells.length > cellPosition.columnIndex ? cellPosition.columnIndex : $cells.length - 1,
        );
      }
    }

    return undefined;
  }

  private getRowsCount(): number {
    const tableElement = this.getTableElement();

    if (tableElement?.length === 1) {
      const table: HTMLTableElement = tableElement[0];

      return table.rows.length;
    }
    return 0;
  }

  protected _getRowElementsCore(tableElement?: dxElementWrapper): dxElementWrapper {
    const $table = tableElement ?? this.getTableElement();

    if ($table) {
      const hasDataRowTemplate = !!this.option('dataRowTemplate');
      const tBodies = hasDataRowTemplate && $table.find(`> tbody.${CLASSES.row}`);

      // eslint-disable-next-line no-useless-concat
      return tBodies && tBodies.length ? tBodies : $table.find('> tbody > ' + `.${CLASSES.row}, > .${CLASSES.row}`);
    }

    return $();
  }

  public _getRowElements(tableElement?: dxElementWrapper): dxElementWrapper {
    return this._getRowElementsCore(tableElement);
  }

  /**
   * @extended: column_fixing
   */
  public getRowIndex($row: Element | dxElementWrapper): number {
    return this._getRowElements().index($row);
  }

  protected getBoundingRect(): BoundingRect | null | undefined {
    return undefined;
  }

  public getName(): string | undefined {
    return undefined;
  }

  /**
   * @extended: column_fixing
   */
  public setScrollerSpacing(width: number): void {
    const $element = this.element();

    $element
      ?.toggleClass(this.addWidgetPrefix(CLASSES.scrollerSpacing), !!width)
      .css('paddingInlineEnd', width ? `${width}px` : '');
  }

  protected isScrollbarVisible(isHorizontal: boolean): boolean {
    const $element = this.element();
    const $tableElement = this._tableElement;

    if ($element && $tableElement) {
      return isHorizontal
        ? getOuterWidth($tableElement) - getWidth($element) > 0
        : getOuterHeight($tableElement) - getHeight($element) > 0;
    }

    return false;
  }

  public isDisposed(): boolean | undefined {
    return this.component?._disposed;
  }

  public renderDragCellContent($dragContainer: dxElementWrapper, column: Column): void {
    $dragContainer.text(column.caption ?? '');
  }

  // NOTE: We cannot use modern CSS selectors (e.g. nth-child(index of <selector>))
  // to style the first cell because our current SCSS toolchain does not support them.
  // Instead, we manually toggle a CSS class on the first cell.
  public updateFirstCellClasses(): void {
    const rows = this._getRows();

    this.removeFirstCellClasses();

    rows.forEach((row, index) => {
      const rowIndex = row.rowType === 'header' ? index : null;
      const firstColumn = this._columnsController.getFirstColumn(rowIndex);

      if (firstColumn) {
        const $cell = this._getCellElement(index, `index:${firstColumn.index}`);

        this.toggleFirstCellClass($cell, true);
      }
    });
  }
}

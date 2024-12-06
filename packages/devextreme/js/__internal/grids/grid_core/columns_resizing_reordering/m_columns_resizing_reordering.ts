/* eslint-disable max-classes-per-file */
import { fx } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  end as dragEventEnd,
  move as dragEventMove,
  start as dragEventStart,
} from '@js/common/core/events/drag';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, eventData as getEventData, isTouchEvent } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getWidth,
  setHeight, setWidth,
} from '@js/core/utils/size';
import { isDefined, isObject, isString } from '@js/core/utils/type';
import swatchContainer from '@js/ui/widget/swatch_container';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import type { ColumnChooserView } from '../column_chooser/m_column_chooser';
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { HeaderPanel } from '../header_panel/m_header_panel';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
import type { PagerView } from '../pager/m_pager';
import { CLASSES } from './const';

const COLUMNS_SEPARATOR_CLASS = 'columns-separator';
const COLUMNS_SEPARATOR_TRANSPARENT = 'columns-separator-transparent';
const DRAGGING_HEADER_CLASS = 'drag-header';
const CELL_CONTENT_CLASS = 'text-content';
const HEADERS_DRAG_ACTION_CLASS = 'drag-action';
const TRACKER_CLASS = 'tracker';
const HEADERS_DROP_HIGHLIGHT_CLASS = 'drop-highlight';
const BLOCK_SEPARATOR_CLASS = 'dx-block-separator';
const HEADER_ROW_CLASS = 'dx-header-row';
const WIDGET_CLASS = 'dx-widget';
const DRAGGING_COMMAND_CELL_CLASS = 'dx-drag-command-cell';

const MODULE_NAMESPACE = 'dxDataGridResizingReordering';

const COLUMNS_SEPARATOR_TOUCH_TRACKER_WIDTH = 10;
const DRAGGING_DELTA = 5;

const allowResizing = function (that) {
  // TODO getController
  return that.option('allowColumnResizing') || that.getController('columns').isColumnOptionUsed('allowResizing');
};

const allowReordering = function (that) {
  // TODO getController
  return that.option('allowColumnReordering') || that.getController('columns').isColumnOptionUsed('allowReordering');
};

export class TrackerView extends modules.View {
  private _positionChanged: any;

  private _tablePositionController!: TablePositionViewController;

  public init() {
    super.init();

    this._tablePositionController = this.getController('tablePosition');
    this._subscribeToCallback();
  }

  public dispose() {
    this._unsubscribeFromCallback();
    super.dispose();
  }

  public optionChanged(args) {
    if (args.name === 'allowColumnResizing') {
      this._unsubscribeFromCallback();

      if (args.value) {
        this._subscribeToCallback();
        this._invalidate();
      }
    }

    super.optionChanged(args);
  }

  protected _renderCore() {
    const deferred = super._renderCore();
    this.element().addClass(this.addWidgetPrefix(TRACKER_CLASS));
    this.hide();
    return deferred;
  }

  private _unsubscribeFromCallback() {
    if (this._positionChanged) {
      this._tablePositionController.positionChanged.remove(this._positionChanged);
    }
  }

  private _subscribeToCallback() {
    const that = this;

    that._positionChanged = function (position) {
      const $element = that.element();
      if ($element && $element.hasClass(that.addWidgetPrefix(TRACKER_CLASS))) {
        $element.css({ top: position.top });
        setHeight($element, position.height);
      }
    };
    this._tablePositionController.positionChanged.add(that._positionChanged);
  }

  public isVisible() {
    return allowResizing(this);
  }

  private show() {
    this.element().show();
  }

  private hide() {
    this.element() && this.element().hide();
  }

  private setHeight(value) {
    setHeight(this.element(), value);
  }
}

export class SeparatorView extends modules.View {
  protected _isShown?: boolean;

  protected _renderSeparator() { }

  protected _renderCore(options?) {
    const deferred = super._renderCore(options);
    this._isShown = true;
    this._renderSeparator();
    this.hide();
    return deferred;
  }

  public show() {
    this._isShown = true;
  }

  public hide() {
    this._isShown = false;
  }

  private height(value) {
    const $element = this.element();
    if ($element) {
      if (isDefined(value)) {
        setHeight($element, value);
      } else {
        return getHeight($element);
      }
    }
  }

  public width(value?) {
    const $element = this.element();
    if ($element) {
      if (isDefined(value)) {
        setWidth($element, value);
      } else {
        return getWidth($element);
      }
    }
  }
}

export class ColumnsSeparatorView extends SeparatorView {
  private _positionChanged: any;

  private _tablePositionController!: TablePositionViewController;

  private _isTransparent?: boolean;

  /// #DEBUG
  private _testPosX?: number;

  private _testCursorName?: string;
  /// #ENDDEBUG

  public init() {
    super.init();

    this._tablePositionController = this.getController('tablePosition');
    this._init();
  }

  public dispose() {
    this._unsubscribeFromCallback();
    super.dispose();
  }

  public optionChanged(args) {
    if (args.name === 'allowColumnResizing') {
      if (args.value) {
        this._init();
        this._invalidate();
        this.hide(true);
      } else {
        this._unsubscribeFromCallback();
        this._isTransparent = allowResizing(this);
        this.hide(true);
      }
    }

    super.optionChanged(args);
  }

  protected _renderSeparator() {
    super._renderSeparator();

    const $element = this.element();
    $element.addClass(this.addWidgetPrefix(COLUMNS_SEPARATOR_CLASS));
  }

  private _subscribeToCallback() {
    const that = this;
    let $element;

    that._positionChanged = function (position) {
      $element = that.element();
      if ($element) {
        $element.css({ top: position.top });
        setHeight($element, position.height);
      }
    };
    that._tablePositionController.positionChanged.add(that._positionChanged);
  }

  private _unsubscribeFromCallback() {
    this._positionChanged && this._tablePositionController.positionChanged.remove(this._positionChanged);
  }

  private _init() {
    this._isTransparent = allowResizing(this);
    if (this.isVisible()) {
      this._subscribeToCallback();
    }
  }

  public isVisible() {
    return this.option('showColumnHeaders') && (allowReordering(this) || allowResizing(this));
  }

  public show() {
    const that = this;
    const $element = this.element();

    if ($element && !that._isShown) {
      if (that._isTransparent) {
        $element.removeClass(that.addWidgetPrefix(COLUMNS_SEPARATOR_TRANSPARENT));
      } else {
        $element.show();
      }
    }
    super.show();
  }

  public hide(force?) {
    const $element = this.element();
    const columnsSeparatorTransparent = this.addWidgetPrefix(COLUMNS_SEPARATOR_TRANSPARENT);

    if ($element && (this._isShown || force)) {
      if (this._isTransparent) {
        $element.addClass(columnsSeparatorTransparent);
        $element.css('left', '');
        $element.show();
      } else {
        if ($element.hasClass(columnsSeparatorTransparent)) {
          $element.removeClass(columnsSeparatorTransparent);
        }
        $element.hide();
      }
    }
    super.hide();
  }

  private moveByX(outerX) {
    const $element = this.element();
    if ($element) {
      $element.css('left', outerX === null ? 0 : outerX - this._parentElement().offset().left);
      /// #DEBUG
      this._testPosX = outerX;
      /// #ENDDEBUG
    }
  }

  private changeCursor(cursorName) {
    cursorName = isDefined(cursorName) ? cursorName : '';
    const $element = this.element();
    if ($element) {
      $element.css('cursor', cursorName);
      /// #DEBUG
      this._testCursorName = cursorName;
      /// #ENDDEBUG
    }
  }
}

export class BlockSeparatorView extends SeparatorView {
  public init() {
    super.init();

    const dataController = this.getController('data');
    dataController.loadingChanged.add((isLoading) => {
      if (!isLoading) {
        this.hide();
      }
    });
  }

  protected _renderSeparator() {
    super._renderSeparator();
    this.element().addClass(BLOCK_SEPARATOR_CLASS).html('&nbsp;');
  }

  public hide() {
    const that = this;
    const $parent = this._parentElement();
    const $element = this.element();

    if ($element && this._isShown) {
      $element.css('display', 'none');
    }

    if ($parent && !$parent.children(`.${BLOCK_SEPARATOR_CLASS}`).length) {
      $parent.prepend(that.element());
    }

    super.hide();
  }

  public isVisible() {
    const groupPanelOptions: any = this.option('groupPanel');
    const columnChooserOptions = this.option('columnChooser');

    return (groupPanelOptions && groupPanelOptions.visible) || (columnChooserOptions && columnChooserOptions.enabled);
  }

  public show(targetLocation?) {
    const that = this;
    const $element = this.element();
    const startAnimate = function (toOptions) {
      fx.stop($element, true);
      fx.animate($element, {
        type: 'slide',
        from: {
          width: 0,
          display: toOptions.display,
        } as any,
        to: toOptions,
        duration: 300,
        easing: 'swing',
      });
    };

    if ($element && !that._isShown) {
      switch (targetLocation) {
        case 'group':
          this.element().css('display', 'block');
          break;
        case 'columnChooser':
          startAnimate({ width: '100%', display: 'block' });
          break;
        default:
          $element.css('display', '');
      }
    }

    super.show();
  }
}

export class DraggingHeaderView extends modules.View {
  private _isDragging?: boolean;

  private _controller!: DraggingHeaderViewController;

  private _columnsResizerViewController!: ColumnsResizerViewController;

  private _columnsController!: ColumnsController;

  private _dragOptions: any;

  private _dropOptions: any;

  private _onSelectStart: any;

  /// #DEBUG
  private _testPointsByColumns: any;
  /// #ENDDEBUG

  public init() {
    super.init();

    const dataController = this.getController('data');
    this._controller = this.getController('draggingHeader');
    this._columnsResizerViewController = this.getController('columnsResizer');
    this._columnsController = this.getController('columns');
    this._isDragging = false;

    dataController.loadingChanged.add((isLoading) => {
      const element = this.element();

      if (!isLoading && element) {
        element.hide();
      }
    });
  }

  public isDragging() {
    return this._isDragging;
  }

  private _getDraggingPanelByPos(pos) {
    const that = this;
    let result;

    each(that._dragOptions.draggingPanels, (index, draggingPanel) => {
      if (draggingPanel) {
        const boundingRect = draggingPanel.getBoundingRect();
        if (boundingRect && (boundingRect.bottom === undefined || pos.y < boundingRect.bottom) && (boundingRect.top === undefined || pos.y > boundingRect.top)
                    && (boundingRect.left === undefined || pos.x > boundingRect.left) && (boundingRect.right === undefined || pos.x < boundingRect.right)) {
          result = draggingPanel;
          return false;
        }
      }

      return undefined;
    });

    return result;
  }

  protected _renderCore() {
    this.element()
      .addClass(`${this.addWidgetPrefix(DRAGGING_HEADER_CLASS)} ${this.addWidgetPrefix(CELL_CONTENT_CLASS)} ${WIDGET_CLASS}`)
      .hide();
  }

  private _resetTargetColumnOptions() {
    const params = this._dropOptions;

    params.targetColumnIndex = -1;
    delete params.targetColumnElement;
    delete params.isLast;
    delete params.posX;
    delete params.posY;
  }

  private _getVisibleIndexObject(rowIndex, visibleIndex) {
    if (isDefined(rowIndex)) {
      return {
        columnIndex: visibleIndex,
        rowIndex,
      };
    }

    return visibleIndex;
  }

  public dispose() {
    const element = this.element();

    this._dragOptions = null;
    element && element.parent().find(`.${this.addWidgetPrefix(DRAGGING_HEADER_CLASS)}`).remove();
  }

  public isVisible() {
    const commonColumnSettings = this._columnsController.getCommonSettings();

    return this.option('showColumnHeaders') && (allowReordering(this) || commonColumnSettings.allowGrouping || commonColumnSettings.allowHiding);
  }

  public dragHeader(options) {
    const that = this;
    const { columnElement } = options;
    const isCommandColumn = !!options.sourceColumn.type;

    that._isDragging = true;
    that._dragOptions = options;
    that._dropOptions = {
      sourceIndex: options.index,
      sourceColumnIndex: that._getVisibleIndexObject(options.rowIndex, options.columnIndex),
      sourceColumnElement: options.columnElement,
      sourceLocation: options.sourceLocation,
    };

    const document = domAdapter.getDocument();
    // eslint-disable-next-line spellcheck/spell-checker
    that._onSelectStart = document.onselectstart;

    // eslint-disable-next-line spellcheck/spell-checker
    document.onselectstart = function () {
      return false;
    };

    that._controller.drag(that._dropOptions);

    that.element().css({
      textAlign: columnElement && columnElement.css('textAlign'),
      height: columnElement && (isCommandColumn && columnElement.get(0).clientHeight || getHeight(columnElement)),
      width: columnElement && (isCommandColumn && columnElement.get(0).clientWidth || getWidth(columnElement)),
      whiteSpace: columnElement && columnElement.css('whiteSpace'),
    })
      .addClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS))
      .toggleClass(DRAGGING_COMMAND_CELL_CLASS, isCommandColumn)
      .text(isCommandColumn ? '' : options.sourceColumn.caption);

    that.element().appendTo(swatchContainer.getSwatchContainer(columnElement));
  }

  public moveHeader(args) {
    const e = args.event;
    const { that } = e.data;
    const eventData = getEventData(e);
    const isResizing = that._columnsResizerViewController ? that._columnsResizerViewController.isResizing() : false;
    const dragOptions = that._dragOptions;

    if (that._isDragging && !isResizing) {
      const $element = that.element();

      const moveDeltaX = Math.abs(eventData.x - dragOptions.columnElement.offset().left - dragOptions.deltaX);
      const moveDeltaY = Math.abs(eventData.y - dragOptions.columnElement.offset().top - dragOptions.deltaY);

      if ($element.is(':visible') || moveDeltaX > DRAGGING_DELTA || moveDeltaY > DRAGGING_DELTA) {
        $element.show();

        const newLeft = eventData.x - dragOptions.deltaX;
        const newTop = eventData.y - dragOptions.deltaY;

        $element.css({ left: newLeft, top: newTop });
        that.dockHeader(eventData);
      }
      e.preventDefault();
    }
  }

  public dockHeader(eventData) {
    const that = this;
    const targetDraggingPanel = that._getDraggingPanelByPos(eventData);
    const controller = that._controller;
    const params = that._dropOptions;
    const dragOptions = that._dragOptions;

    if (targetDraggingPanel) {
      const rtlEnabled = that.option('rtlEnabled');
      const isVerticalOrientation = targetDraggingPanel.getName() === 'columnChooser';
      const axisName = isVerticalOrientation ? 'y' : 'x';
      const targetLocation = targetDraggingPanel.getName();
      const rowIndex = targetLocation === 'headers' ? dragOptions.rowIndex : undefined;
      const { sourceColumn } = dragOptions;
      const columnElements = targetDraggingPanel.getColumnElements(rowIndex, sourceColumn?.ownerBand) || [];
      const pointsByTarget = dragOptions.pointsByTarget = dragOptions.pointsByTarget || {};
      const pointsByColumns = targetLocation === 'columnChooser' ? [] : pointsByTarget[targetLocation] || controller._generatePointsByColumns(extend({}, dragOptions, {
        targetDraggingPanel,
        columns: targetDraggingPanel.getColumns(rowIndex),
        columnElements,
        isVerticalOrientation,
        startColumnIndex: targetLocation === 'headers' ? $(columnElements[0]).index() : 0,
      }));

      pointsByTarget[targetLocation] = pointsByColumns;

      /// #DEBUG
      this._testPointsByColumns = pointsByColumns;
      /// #ENDDEBUG

      params.targetLocation = targetLocation;
      if (pointsByColumns.length > 0) {
        for (let i = 0; i < pointsByColumns.length; i++) {
          const centerPosition = pointsByColumns[i + 1] && (pointsByColumns[i][axisName] + pointsByColumns[i + 1][axisName]) / 2;
          if (centerPosition === undefined || (rtlEnabled && axisName === 'x' ? eventData[axisName] > centerPosition : eventData[axisName] < centerPosition)) {
            params.targetColumnIndex = that._getVisibleIndexObject(rowIndex, pointsByColumns[i].columnIndex);
            if (columnElements[i]) {
              params.targetColumnElement = columnElements.eq(i);
              params.isLast = false;
            } else {
              params.targetColumnElement = columnElements.last();
              params.isLast = true;
            }
            params.posX = pointsByColumns[i].x;
            params.posY = pointsByColumns[i].y;
            controller.dock(params);
            break;
          }
        }
      } else {
        that._resetTargetColumnOptions();
        controller.dock(params);
      }
    }
  }

  private dropHeader(args) {
    const e = args.event;
    const { that } = e.data;
    const controller = that._controller;

    that.element().hide();

    if (controller && that._isDragging) {
      controller.drop(that._dropOptions);
    }

    that.element().appendTo(that._parentElement());
    that._dragOptions = null;
    that._dropOptions = null;
    that._isDragging = false;
    // eslint-disable-next-line spellcheck/spell-checker
    domAdapter.getDocument().onselectstart = that._onSelectStart || null;
  }
}

const isNextColumnResizingMode = function (that) {
  return that.option('columnResizingMode') !== 'widget';
};

export class ColumnsResizerViewController extends modules.ViewController {
  protected _columnHeadersView!: ColumnHeadersView;

  private _$parentContainer: any;

  public _targetPoint: any;

  private _resizingInfo: any;

  protected _columnsController!: ColumnsController;

  private _pointsByColumns: any;

  private _moveSeparatorHandler: any;

  private _startResizingHandler: any;

  private _endResizingHandler: any;

  private _columnsSeparatorView!: ColumnsSeparatorView;

  private _rowsView!: RowsView;

  private readonly _scrollRight: any;

  private _subscribesToCallbacks: any;

  private readonly _isResizing?: boolean;

  private _scrollLeft?: number;

  private _trackerView!: TrackerView;

  private _tablePositionController!: TablePositionViewController;

  private _editorFactoryController!: EditorFactory;

  private _draggingHeaderView!: DraggingHeaderView;

  public init() {
    this._subscribesToCallbacks = [];

    if (allowResizing(this)) {
      this._init();
    }
  }

  public dispose() {
    this._unsubscribes();
    super.dispose();
  }

  public optionChanged(args) {
    super.optionChanged(args);

    if (args.name === 'allowColumnResizing') {
      if (args.value) {
        this._init();
        this._subscribeToEvents();
      } else {
        this._unsubscribes();
      }
    }
  }

  private _isHeadersRowArea(posY) {
    if (this._columnHeadersView) {
      const element = this._columnHeadersView.element();

      if (element) {
        const offsetTop = element.offset().top;
        const headersRowHeight = this._columnHeadersView.getHeadersRowHeight();
        return posY >= offsetTop && posY <= offsetTop + headersRowHeight;
      }
    }
    return false;
  }

  private _isRtlParentStyle(): boolean {
    const rtlEnabled = this.option('rtlEnabled') as boolean;

    return rtlEnabled && this._$parentContainer?.parent().css('direction') === 'rtl';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _correctColumnIndexForPoint(point, correctionValue: number, columns): void {
    point.columnIndex -= correctionValue;
  }

  /**
   * @extended: adaptivity
   */
  protected _pointCreated(point, cellsLength, columns) {
    const isNextColumnMode = isNextColumnResizingMode(this);
    const rtlEnabled = this.option('rtlEnabled');
    const isRtlParentStyle = this._isRtlParentStyle();
    const firstPointColumnIndex = !isNextColumnMode && rtlEnabled && !isRtlParentStyle ? 0 : 1;

    if (point.index >= firstPointColumnIndex && point.index < cellsLength + (!isNextColumnMode && (!rtlEnabled || isRtlParentStyle) ? 1 : 0)) {
      this._correctColumnIndexForPoint(point, firstPointColumnIndex, columns);
      const currentColumn = columns[point.columnIndex] || {};
      const nextColumn = columns[point.columnIndex + 1] || {};
      return !(isNextColumnMode ? currentColumn.allowResizing && nextColumn.allowResizing : currentColumn.allowResizing);
    }

    return true;
  }

  /**
   * @extended: column_fixing
   */
  protected _getTargetPoint(pointsByColumns, currentX, deltaX) {
    if (pointsByColumns) {
      for (let i = 0; i < pointsByColumns.length; i++) {
        if (pointsByColumns[i].x === pointsByColumns[0].x && pointsByColumns[i + 1] && pointsByColumns[i].x === pointsByColumns[i + 1].x) {
          continue;
        }
        if (pointsByColumns[i].x - deltaX <= currentX && currentX <= pointsByColumns[i].x + deltaX) {
          return pointsByColumns[i];
        }
      }
    }
    return null;
  }

  protected getSeparatorOffsetX($cell: dxElementWrapper): number {
    const isNextColumnMode = isNextColumnResizingMode(this);
    const rtlEnabled = this.option('rtlEnabled');
    const isRtlParentStyle = this._isRtlParentStyle();
    const outerWidth: number = $cell[0].getBoundingClientRect().width;
    const cellOffset: number = $cell.offset()?.left ?? 0;

    return cellOffset + ((isNextColumnMode || isRtlParentStyle) && rtlEnabled ? 0 : outerWidth);
  }

  private _moveSeparator(args) {
    const e = args.event;
    const that = e.data;
    const columnsSeparatorWidth = that._columnsSeparatorView.width();
    const isNextColumnMode = isNextColumnResizingMode(that);
    const deltaX = columnsSeparatorWidth / 2;
    const parentOffset = that._$parentContainer.offset();
    const parentOffsetLeft = parentOffset.left;
    const eventData = getEventData(e);
    const isRtlParentStyle = this._isRtlParentStyle();
    const isDragging = that._draggingHeaderView?.isDragging();

    if (that._isResizing && that._resizingInfo) {
      if ((parentOffsetLeft <= eventData.x || !isNextColumnMode && isRtlParentStyle) && (!isNextColumnMode || eventData.x <= parentOffsetLeft + getWidth(that._$parentContainer))) {
        if (that._updateColumnsWidthIfNeeded(eventData.x)) {
          const $cell = that._columnHeadersView.getColumnElements().eq(that._resizingInfo.currentColumnIndex);

          if ($cell.length) {
            const offsetX = this.getSeparatorOffsetX($cell);

            that._columnsSeparatorView.moveByX(offsetX);
            that._tablePositionController.update(that._targetPoint.y);
            e.preventDefault();
          }
        }
      }
    } else if (!isDragging) {
      if (that._isHeadersRowArea(eventData.y)) {
        if (that._previousParentOffset) {
          if (that._previousParentOffset.left !== parentOffset.left || that._previousParentOffset.top !== parentOffset.top) {
            that.pointsByColumns(null);
          }
        }

        that._targetPoint = that._getTargetPoint(that.pointsByColumns(), eventData.x, columnsSeparatorWidth);
        that._previousParentOffset = parentOffset;
        that._isReadyResizing = false;

        if (that._targetPoint) {
          that._columnsSeparatorView.changeCursor('col-resize');
          that._columnsSeparatorView.moveByX(that._targetPoint.x - deltaX);
          that._tablePositionController.update(that._targetPoint.y);
          that._isReadyResizing = true;
          e.preventDefault();
        } else {
          that._columnsSeparatorView.changeCursor();
          that._columnsSeparatorView.moveByX(null);
        }
      } else {
        that.pointsByColumns(null);
        that._isReadyResizing = false;
        that._columnsSeparatorView.changeCursor();
        that._columnsSeparatorView.moveByX(null);
      }
    }
  }

  /**
   * @extended: filter_row
   */
  protected _endResizing(args) {
    const e = args.event;
    const that = e.data;

    if (that._isResizing) {
      that.pointsByColumns(null);

      that._resizingInfo = null;

      that._columnsSeparatorView.hide();
      that._columnsSeparatorView.changeCursor();
      that._trackerView.hide();

      that._isReadyResizing = false;
      that._isResizing = false;
    }
  }

  /**
   * @extended: adaptivity
   */
  protected _getNextColumnIndex(currentColumnIndex) {
    return currentColumnIndex + 1;
  }

  private _setupResizingInfo(posX) {
    const currentColumnIndex = this._targetPoint.columnIndex;
    const nextColumnIndex = this._getNextColumnIndex(currentColumnIndex);
    const $currentHeader = this._columnHeadersView.getHeaderElement(currentColumnIndex);
    const $nextHeader = this._columnHeadersView.getHeaderElement(nextColumnIndex);

    this._resizingInfo = {
      startPosX: posX,
      currentColumnIndex,
      currentColumnWidth: $currentHeader?.length ? getBoundingRect($currentHeader[0]).width : 0,
      nextColumnIndex,
      nextColumnWidth: $nextHeader?.length ? getBoundingRect($nextHeader[0]).width : 0,
      needToInvertResizing: this._needToInvertResizing($currentHeader),
    };
  }

  /**
   * @extended: filter_row
   */
  protected _startResizing(args) {
    const e = args.event;
    const that = e.data;
    const eventData = getEventData(e);

    if (isTouchEvent(e)) {
      if (that._isHeadersRowArea(eventData.y)) {
        that._targetPoint = that._getTargetPoint(that.pointsByColumns(), eventData.x, COLUMNS_SEPARATOR_TOUCH_TRACKER_WIDTH);
        if (that._targetPoint) {
          that._columnsSeparatorView.moveByX(that._targetPoint.x - that._columnsSeparatorView.width() / 2);
          that._isReadyResizing = true;
        }
      } else {
        that._isReadyResizing = false;
      }
    }

    if (that._isReadyResizing) {
      /// #DEBUG
      if (that._targetPoint) {
        that._testColumnIndex = that._targetPoint.columnIndex;
      }
      /// #ENDDEBUG

      that._setupResizingInfo(eventData.x);

      that._isResizing = true;

      that._tablePositionController.update(that._targetPoint.y);
      that._columnsSeparatorView.show();
      that._trackerView.show();
      const scrollable = that.component.getScrollable();

      if (scrollable && that._isRtlParentStyle()) {
        that._scrollRight = getWidth(scrollable.$content()) - getWidth(scrollable.container()) - scrollable.scrollLeft();
      }

      e.preventDefault();
      e.stopPropagation();
    }

    if (this.isResizing()) {
      this._editorFactoryController.loseFocus();
    }
  }

  /**
   * @extended: column_fixing
   * @protected
   */
  protected _generatePointsByColumns(needToCheckPrevPoint = false) {
    const that = this;
    const columns = that._columnsController ? that._columnsController.getVisibleColumns() : [];
    const cells = that._columnHeadersView.getColumnElements();
    let pointsByColumns: any = [];

    if (cells && cells.length > 0) {
      pointsByColumns = gridCoreUtils.getPointsByColumns(
        cells,
        (point) => that._pointCreated(point, cells.length, columns),
        false,
        0,
        needToCheckPrevPoint,
      );
    }

    that._pointsByColumns = pointsByColumns;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _needToInvertResizing($cell: dxElementWrapper): boolean {
    const rtlEnabled = this.option('rtlEnabled') as boolean;
    const isRtlParentStyle = this._isRtlParentStyle();
    const isNextColumnMode = isNextColumnResizingMode(this);

    return (isNextColumnMode || isRtlParentStyle) && rtlEnabled;
  }

  private _unsubscribeFromEvents() {
    this._moveSeparatorHandler && eventsEngine.off(domAdapter.getDocument(), addNamespace(pointerEvents.move, MODULE_NAMESPACE), this._moveSeparatorHandler);
    this._startResizingHandler && eventsEngine.off(this._$parentContainer, addNamespace(pointerEvents.down, MODULE_NAMESPACE), this._startResizingHandler);
    if (this._endResizingHandler) {
      eventsEngine.off(this._columnsSeparatorView.element(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this._endResizingHandler);
      eventsEngine.off(domAdapter.getDocument(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this._endResizingHandler);
    }
  }

  private _subscribeToEvents() {
    this._moveSeparatorHandler = this.createAction(this._moveSeparator);
    this._startResizingHandler = this.createAction(this._startResizing);
    this._endResizingHandler = this.createAction(this._endResizing);

    eventsEngine.on(domAdapter.getDocument(), addNamespace(pointerEvents.move, MODULE_NAMESPACE), this, this._moveSeparatorHandler);
    eventsEngine.on(this._$parentContainer, addNamespace(pointerEvents.down, MODULE_NAMESPACE), this, this._startResizingHandler);
    eventsEngine.on(this._columnsSeparatorView.element(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this, this._endResizingHandler);
    eventsEngine.on(domAdapter.getDocument(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this, this._endResizingHandler);
  }

  private _updateColumnsWidthIfNeeded(posX) {
    let deltaX;
    let needUpdate = false;
    let contentWidth = this._rowsView.contentWidth();
    const resizingInfo = this._resizingInfo;
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const columnsSeparatorWidth = this._columnsSeparatorView.width();
    const isNextColumnMode = isNextColumnResizingMode(this);
    const adaptColumnWidthByRatio = isNextColumnMode && this.option('adaptColumnWidthByRatio') && !this.option('columnAutoWidth');
    const isRtlParentStyle = this._isRtlParentStyle();
    const column = visibleColumns[resizingInfo.currentColumnIndex];
    const nextColumn = visibleColumns[resizingInfo.nextColumnIndex];
    const { needToInvertResizing } = resizingInfo;

    function isPercentWidth(width) {
      return isString(width) && width.endsWith('%');
    }

    function setColumnWidth(column, columnWidth, contentWidth, adaptColumnWidthByRatio) {
      if (column) {
        const oldColumnWidth = column.width;
        if (oldColumnWidth) {
          adaptColumnWidthByRatio = isPercentWidth(oldColumnWidth);
        }

        if (adaptColumnWidthByRatio) {
          columnsController.columnOption(column.index, 'visibleWidth', columnWidth);
          columnsController.columnOption(column.index, 'width', `${(columnWidth / contentWidth * 100).toFixed(3)}%`);
        } else {
          columnsController.columnOption(column.index, 'visibleWidth', null);
          columnsController.columnOption(column.index, 'width', columnWidth);
        }
      }
    }

    function correctContentWidth(contentWidth, visibleColumns) {
      const allColumnsHaveWidth = visibleColumns.every((column) => column.width);

      if (allColumnsHaveWidth) {
        const totalPercent = visibleColumns.reduce((sum, column) => {
          if (isPercentWidth(column.width)) {
            sum += parseFloat(column.width);
          }
          return sum;
        }, 0);

        if (totalPercent > 100) {
          contentWidth = contentWidth / totalPercent * 100;
        }
      }

      return contentWidth;
    }

    function calculateCellWidths(delta) {
      let nextMinWidth;
      let nextCellWidth;
      let needCorrectionNextCellWidth;
      const cellWidth = resizingInfo.currentColumnWidth + delta;
      const minWidth = column && column.minWidth || columnsSeparatorWidth;
      const result: any = {};

      if (cellWidth >= minWidth) {
        result.cellWidth = cellWidth;
      } else {
        result.cellWidth = minWidth;
        needCorrectionNextCellWidth = true;
      }

      if (isNextColumnMode) {
        nextCellWidth = resizingInfo.nextColumnWidth - delta;
        nextMinWidth = nextColumn && nextColumn.minWidth || columnsSeparatorWidth;

        if (nextCellWidth >= nextMinWidth) {
          if (needCorrectionNextCellWidth) {
            result.nextCellWidth = resizingInfo.nextColumnWidth - (delta + minWidth - cellWidth);
          } else {
            result.nextCellWidth = nextCellWidth;
          }
        } else {
          result.nextCellWidth = nextMinWidth;
          result.cellWidth = resizingInfo.currentColumnWidth + (delta - nextMinWidth + nextCellWidth);
        }
      }

      return result;
    }

    deltaX = posX - resizingInfo.startPosX;

    if (needToInvertResizing) {
      deltaX = -deltaX;
    }

    let { cellWidth, nextCellWidth } = calculateCellWidths(deltaX);

    needUpdate = column.width !== cellWidth;

    if (needUpdate) {
      columnsController.beginUpdate();

      cellWidth = Math.floor(cellWidth);

      contentWidth = correctContentWidth(contentWidth, visibleColumns);

      setColumnWidth(column, cellWidth, contentWidth, adaptColumnWidthByRatio);

      if (isNextColumnMode) {
        nextCellWidth = Math.floor(nextCellWidth);
        setColumnWidth(nextColumn, nextCellWidth, contentWidth, adaptColumnWidthByRatio);
      } else {
        const columnWidths = this._columnHeadersView.getColumnWidths();
        columnWidths[resizingInfo.currentColumnIndex] = cellWidth;
        const hasScroll = columnWidths.reduce((totalWidth, width) => totalWidth + width, 0) > this._rowsView.contentWidth();
        if (!hasScroll) {
          const lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns);
          if (lastColumnIndex >= 0) {
            columnsController.columnOption(visibleColumns[lastColumnIndex].index, 'visibleWidth', 'auto');
          }
        }
        for (let i = 0; i < columnWidths.length; i++) {
          if (visibleColumns[i] && visibleColumns[i] !== column && visibleColumns[i].width === undefined) {
            columnsController.columnOption(visibleColumns[i].index, 'width', columnWidths[i]);
          }
        }
      }

      columnsController.endUpdate();
      if (!isNextColumnMode) {
        this.component.updateDimensions();

        const scrollable = this.component.getScrollable();
        if (scrollable && isRtlParentStyle) {
          const left = getWidth((scrollable as any).$content()) - getWidth((scrollable as any).container()) - this._scrollRight;
          scrollable.scrollTo({ left });
        }
      }
    }

    return needUpdate;
  }

  private _subscribeToCallback(callback, handler) {
    callback.add(handler);
    this._subscribesToCallbacks.push({
      callback,
      handler,
    });
  }

  private _unsubscribeFromCallbacks() {
    for (let i = 0; i < this._subscribesToCallbacks.length; i++) {
      const subscribe = this._subscribesToCallbacks[i];
      subscribe.callback.remove(subscribe.handler);
    }

    this._subscribesToCallbacks = [];
  }

  private _unsubscribes() {
    this._unsubscribeFromEvents();
    this._unsubscribeFromCallbacks();
  }

  private _init() {
    const generatePointsByColumnsHandler = () => {
      if (!this._isResizing) {
        this.pointsByColumns(null);
      }
    };
    const generatePointsByColumnsScrollHandler = (offset) => {
      if (this._scrollLeft !== offset.left) {
        this._scrollLeft = offset.left;
        this.pointsByColumns(null);
      }
    };

    // TODO: Move this controllers/views initialization to public init() method.
    this._columnsSeparatorView = this.getView('columnsSeparatorView');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._trackerView = this.getView('trackerView');
    this._rowsView = this.getView('rowsView');
    this._columnsController = this.getController('columns');
    this._tablePositionController = this.getController('tablePosition');
    this._editorFactoryController = this.getController('editorFactory');
    this._draggingHeaderView = this.component.getView('draggingHeaderView');

    this._$parentContainer = this.component.$element();

    this._subscribeToCallback(this._columnHeadersView.renderCompleted, generatePointsByColumnsHandler);
    this._subscribeToCallback(this._columnHeadersView.resizeCompleted, generatePointsByColumnsHandler);
    this._subscribeToCallback(this._columnsSeparatorView.renderCompleted, () => {
      this._unsubscribeFromEvents();
      this._subscribeToEvents();
    });
    this._subscribeToCallback(this._rowsView.renderCompleted, () => {
      this._rowsView.scrollChanged.remove(generatePointsByColumnsScrollHandler);
      this._rowsView.scrollChanged.add(generatePointsByColumnsScrollHandler);
    });

    let previousScrollbarVisibility = this._rowsView.getScrollbarWidth() !== 0;
    let previousTableHeight = 0;

    this._subscribeToCallback(this._tablePositionController.positionChanged, (e) => {
      if (this._isResizing && !this._rowsView.isResizing) {
        const scrollbarVisibility = this._rowsView.getScrollbarWidth() !== 0;
        if (previousScrollbarVisibility !== scrollbarVisibility || (previousTableHeight && previousTableHeight !== e.height)) {
          previousScrollbarVisibility = scrollbarVisibility;
          previousTableHeight = e.height;

          this.component.updateDimensions();
        } else {
          this._rowsView.updateFreeSpaceRowHeight();
        }
      }
      previousTableHeight = e.height;
    });
  }

  public isResizing() {
    return this._isResizing;
  }

  private pointsByColumns(value) {
    if (value !== undefined) {
      this._pointsByColumns = value;
    } else {
      if (!this._pointsByColumns) {
        this._generatePointsByColumns();
      }
      return this._pointsByColumns;
    }
  }
}

export class TablePositionViewController extends modules.ViewController {
  private _columnsResizerController!: ColumnsResizerViewController;

  private _columnHeadersView!: ColumnHeadersView;

  private _rowsView!: RowsView;

  public readonly positionChanged: any;

  private _pagerView!: PagerView;

  constructor(component) {
    super(component);
    this.positionChanged = Callbacks();
  }

  public init() {
    super.init();

    this._columnsResizerController = this.getController('columnsResizer');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowsView = this.getView('rowsView');
    this._pagerView = this.getView('pagerView');

    this._rowsView.resizeCompleted.add(() => {
      if (this.option('allowColumnResizing')) {
        const targetPoint = this._columnsResizerController._targetPoint;
        this.update(targetPoint ? targetPoint.y : null);
      }
    });
  }

  public update(top) {
    const that = this;
    const params: any = {};
    const $element = that._columnHeadersView.element();
    const offset = $element && $element.offset();
    const offsetTop = offset && offset.top || 0;
    const diffOffsetTop = isDefined(top) ? Math.abs(top - offsetTop) : 0;
    const columnsHeadersHeight = that._columnHeadersView ? that._columnHeadersView.getHeight() : 0;
    const scrollBarWidth = that._rowsView.getScrollbarWidth(true);
    const rowsHeight = that._rowsView ? that._rowsView.height() - scrollBarWidth : 0;
    // TODO getView
    const draggingHeaderView = that.component.getView('draggingHeaderView');

    params.height = columnsHeadersHeight;

    const isDraggingOrResizing = this._columnsResizerController.isResizing()
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || draggingHeaderView.isDragging();

    if (isDraggingOrResizing) {
      params.height += rowsHeight - diffOffsetTop;
    }

    if (top !== null && $element && $element.length) {
      params.top = $element[0].offsetTop + diffOffsetTop;
    }

    that.positionChanged.fire(params);
  }
}

export class DraggingHeaderViewController extends modules.ViewController {
  private _tablePositionController!: TablePositionViewController;

  private _columnsSeparatorView!: ColumnsSeparatorView;

  private _blockSeparatorView!: BlockSeparatorView;

  private _animationColumnIndex?: number;

  private _draggingHeaderView!: DraggingHeaderView;

  private _rowsView!: RowsView;

  private _headerPanelView!: HeaderPanel;

  private _columnChooserView!: ColumnChooserView;

  private isCustomGroupColumnPosition?: boolean;

  protected _columnHeadersView!: ColumnHeadersView;

  protected _columnsController!: ColumnsController;

  public init() {
    super.init();

    this._columnsController = this.getController('columns');
    this._tablePositionController = this.getController('tablePosition');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._columnsSeparatorView = this.getView('columnsSeparatorView');
    this._draggingHeaderView = this.getView('draggingHeaderView');
    this._rowsView = this.getView('rowsView');
    this._blockSeparatorView = this.getView('blockSeparatorView');
    this._headerPanelView = this.getView('headerPanel');
    this._columnChooserView = this.getView('columnChooserView');

    const subscribeToEvents = () => {
      if (this._draggingHeaderView) {
        const draggingPanels = [this._columnChooserView, this._columnHeadersView, this._headerPanelView];

        this._unsubscribeFromEvents(this._draggingHeaderView, draggingPanels);
        this._subscribeToEvents(this._draggingHeaderView, draggingPanels);
      }
    };

    this._columnHeadersView.renderCompleted.add(subscribeToEvents);
    this._headerPanelView && this._headerPanelView.renderCompleted.add(subscribeToEvents);
    this._columnChooserView && this._columnChooserView.renderCompleted.add(subscribeToEvents);
  }

  public dispose() {
    if (this._draggingHeaderView) {
      this._unsubscribeFromEvents(this._draggingHeaderView, [this._columnChooserView, this._columnHeadersView, this._headerPanelView]);
    }
  }

  /**
   * @extended: column_fixing
   */
  public _generatePointsByColumns(options, needToCheckPrevPoint = false) {
    this.isCustomGroupColumnPosition = this.checkIsCustomGroupColumnPosition(options);
    const points = gridCoreUtils.getPointsByColumns(
      options.columnElements,
      (point) => this._pointCreated(point, options.columns, options.targetDraggingPanel.getName(), options.sourceColumn),
      options.isVerticalOrientation,
      options.startColumnIndex,
      needToCheckPrevPoint,
    );

    return points;
  }

  private checkIsCustomGroupColumnPosition(options): boolean {
    let wasOnlyCommandColumns = true;

    for (let i = 0; i < options.columns.length; i += 1) {
      const col = options.columns[i];
      if (col.command === 'expand' && !wasOnlyCommandColumns) {
        return true;
      }

      if (!col.command) {
        wasOnlyCommandColumns = false;
      }
    }

    return false;
  }

  /**
   * @extended: adaptivity, column_fixing
   * Function that is used to filter column points, it's called for each point
   * @param point Point that we are checking
   * @param columns All columns in the given location
   * @param location Location where we move column (headers, group, column chooser etc)
   * @param sourceColumn Column that is dragging
   * @returns whether to filter current point (true - remove point, false - keep it)
   */
  protected _pointCreated(point, columns, location, sourceColumn): boolean {
    const targetColumn = columns[point.columnIndex];
    const prevColumn = columns[point.columnIndex - 1];

    const isColumnAfterExpandColumn = prevColumn?.command === 'expand';
    const isFirstExpandColumn = targetColumn?.command === 'expand' && prevColumn?.command !== 'expand';

    const sourceColumnReorderingDisabled = sourceColumn && !sourceColumn.allowReordering;
    const otherColumnsReorderingDisabled = !targetColumn?.allowReordering && !prevColumn?.allowReordering;

    switch (location) {
      case 'columnChooser':
        return true;
      case 'headers':
        if (sourceColumnReorderingDisabled) {
          return true;
        }

        if (!isFirstExpandColumn) {
          return isColumnAfterExpandColumn || otherColumnsReorderingDisabled;
        }

        if (this.isCustomGroupColumnPosition) {
          return false;
        }

        while (columns[point.columnIndex]?.command === 'expand') {
          point.columnIndex += 1;
        }

        return false;
      default:
        return columns.length === 0;
    }
  }

  private _subscribeToEvents(draggingHeader, draggingPanels) {
    const that = this;

    each(draggingPanels, (_, draggingPanel) => {
      if (draggingPanel) {
        let columns;
        const rowCount = draggingPanel.getRowCount ? draggingPanel.getRowCount() : 1;
        const nameDraggingPanel = draggingPanel.getName();
        const subscribeToEvents = function (index, columnElement) {
          if (!columnElement) {
            return;
          }

          const $columnElement = $(columnElement);
          const column = columns[index];

          if (column && draggingPanel.allowDragging(column)) {
            $columnElement.addClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
            eventsEngine.on($columnElement, addNamespace(dragEventStart, MODULE_NAMESPACE), that.createAction((args) => {
              const e = args.event;
              const eventData = getEventData(e);

              draggingHeader.dragHeader({
                // @ts-expect-error
                deltaX: eventData.x - $(e.currentTarget).offset().left,
                // @ts-expect-error
                deltaY: eventData.y - $(e.currentTarget).offset().top,
                sourceColumn: column,
                index: column.index,
                columnIndex: index,
                columnElement: $columnElement,
                sourceLocation: nameDraggingPanel,
                draggingPanels,
                rowIndex: that._columnsController.getRowIndex(column.index, true),
              });
            }));
            eventsEngine.on($columnElement, addNamespace(dragEventMove, MODULE_NAMESPACE), { that: draggingHeader }, that.createAction(draggingHeader.moveHeader));
            eventsEngine.on($columnElement, addNamespace(dragEventEnd, MODULE_NAMESPACE), { that: draggingHeader }, that.createAction(draggingHeader.dropHeader));
          }
        };

        for (let i = 0; i < rowCount; i++) {
          const columnElements = draggingPanel.getColumnElements(i) || [];
          if (columnElements.length) {
            columns = draggingPanel.getColumns(i) || [];
            each(columnElements, subscribeToEvents);
          }
        }
      }
    });
  }

  private _unsubscribeFromEvents(draggingHeader, draggingPanels) {
    const that = this;

    each(draggingPanels, (_, draggingPanel) => {
      if (draggingPanel) {
        const columnElements = draggingPanel.getColumnElements() || [];

        each(columnElements, (index, columnElement) => {
          const $columnElement = $(columnElement);
          eventsEngine.off($columnElement, addNamespace(dragEventStart, MODULE_NAMESPACE));
          eventsEngine.off($columnElement, addNamespace(dragEventMove, MODULE_NAMESPACE));
          eventsEngine.off($columnElement, addNamespace(dragEventEnd, MODULE_NAMESPACE));
          $columnElement.removeClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
        });
      }
    });
  }

  private _getSeparator(targetLocation) {
    return targetLocation === 'headers' ? this._columnsSeparatorView : this._blockSeparatorView;
  }

  private hideSeparators(type?) {
    const blockSeparator = this._blockSeparatorView;
    const columnsSeparator = this._columnsSeparatorView;

    this._animationColumnIndex = undefined;
    blockSeparator && blockSeparator.hide();
    type !== 'block' && columnsSeparator && columnsSeparator.hide();
  }

  private allowDrop(parameters) {
    return this._columnsController.allowMoveColumn(parameters.sourceColumnIndex, parameters.targetColumnIndex, parameters.sourceLocation, parameters.targetLocation);
  }

  public drag(parameters) {
    const { sourceIndex } = parameters;
    const { sourceLocation } = parameters;
    const { sourceColumnElement } = parameters;
    const headersView = this._columnHeadersView;
    const rowsView = this._rowsView;

    if (sourceColumnElement) {
      sourceColumnElement.addClass(this.addWidgetPrefix(CLASSES.draggableColumn));

      if (sourceLocation === 'headers') {
        headersView && headersView.toggleDraggableColumnClass(sourceIndex, true);
        rowsView && rowsView.toggleDraggableColumnClass(sourceIndex, true);
      }
    }
  }

  public dock(parameters) {
    const that = this;
    const targetColumnIndex = isObject(parameters.targetColumnIndex) ? parameters.targetColumnIndex.columnIndex : parameters.targetColumnIndex;
    const { sourceLocation } = parameters;
    const { targetLocation } = parameters;
    const separator = that._getSeparator(targetLocation);
    const hasTargetVisibleIndex = targetColumnIndex >= 0;

    const showSeparator = function () {
      if (that._animationColumnIndex !== targetColumnIndex) {
        that.hideSeparators();
        separator.element()[parameters.isLast ? 'insertAfter' : 'insertBefore'](parameters.targetColumnElement);

        that._animationColumnIndex = targetColumnIndex;
        separator.show(targetLocation);
      }
    };

    that._columnHeadersView.element().find(`.${HEADER_ROW_CLASS}`).toggleClass(that.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS), sourceLocation !== 'headers' && targetLocation === 'headers' && !hasTargetVisibleIndex);

    if (separator) {
      if (that.allowDrop(parameters) && hasTargetVisibleIndex) {
        if (targetLocation === 'group' || targetLocation === 'columnChooser') {
          showSeparator();
        } else {
          that.hideSeparators('block');
          that._tablePositionController.update(parameters.posY);
          // @ts-expect-error
          separator.moveByX(parameters.posX - separator.width());
          separator.show();
        }
      } else {
        that.hideSeparators();
      }
    }
  }

  private drop(parameters) {
    const { sourceColumnElement } = parameters;

    if (sourceColumnElement) {
      sourceColumnElement.removeClass(this.addWidgetPrefix(CLASSES.draggableColumn));
      this._columnHeadersView.toggleDraggableColumnClass(parameters.sourceIndex, false);
      this._rowsView.toggleDraggableColumnClass(parameters.sourceIndex, false);
      this._columnHeadersView.element().find(`.${HEADER_ROW_CLASS}`).removeClass(this.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS));
    }

    if (this.allowDrop(parameters)) {
      const separator = this._getSeparator(parameters.targetLocation);
      if (separator) {
        separator.hide();
      }

      this._columnsController.moveColumn(parameters.sourceColumnIndex, parameters.targetColumnIndex, parameters.sourceLocation, parameters.targetLocation);
    }
  }
}

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewColumnsResizingExtender extends Base {
  protected _needUpdateRowHeight(itemCount) {
    const wordWrapEnabled = this.option('wordWrapEnabled');
    const isResizing = this._columnsResizerController.isResizing();

    return super._needUpdateRowHeight.apply(this, arguments as any) || itemCount > 0 && !!wordWrapEnabled && !!isResizing;
  }
};

const editorFactory = (Base: ModuleType<EditorFactory>) => class EditorFactoryColumnsResizingExtender extends Base {
  protected renderFocusOverlay() {
    if (this._columnsResizerController.isResizing()) {
      return;
    }

    return super.renderFocusOverlay.apply(this, arguments as any);
  }
};

export const columnsResizingReorderingModule = {
  views: {
    columnsSeparatorView: ColumnsSeparatorView,
    blockSeparatorView: BlockSeparatorView,
    draggingHeaderView: DraggingHeaderView,
    trackerView: TrackerView,
  },
  controllers: {
    draggingHeader: DraggingHeaderViewController,
    tablePosition: TablePositionViewController,
    columnsResizer: ColumnsResizerViewController,
  },
  extenders: {
    views: {
      rowsView,
    },
    controllers: {
      editorFactory,
    },
  },
};

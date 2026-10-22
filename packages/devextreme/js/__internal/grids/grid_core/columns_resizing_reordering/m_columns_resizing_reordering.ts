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
import type { Coordinates as Offset, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getWidth,
  setHeight, setWidth,
} from '@js/core/utils/size';
import { isDefined, isObject } from '@js/core/utils/type';
import type { GroupPanel } from '@js/ui/data_grid';
import swatchContainer from '@ts/core/utils/swatch_container';
import { CLASSES as COLUMN_HEADERS_CLASSES } from '@ts/grids/grid_core/column_headers/const';
import { getDraggingPanelBoundingRects } from '@ts/grids/grid_core/columns_resizing_reordering/utils';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type {
  ColumnPoint, InternalGrid, ModuleType, OptionChanged,
} from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ScrollPosition } from '@ts/grids/grid_core/views/types';
import { isPercentWidth } from '@ts/grids/grid_core/views/utils';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import type { ColumnChooserView } from '../column_chooser/m_column_chooser';
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ColumnsController } from '../columns_controller/columns_controller';
import type { Column, ColumnIndex, DropLocationNames } from '../columns_controller/types';
import type { HeaderPanel } from '../header_panel/header_panel';
import type { ModuleItem } from '../modules/modules';
import modules from '../modules/modules';
import gridCoreUtils from '../utils';
import { CLASSES } from './const';
import type {
  CallbackSubscription,
  CellWidths,
  Coordinates,
  DraggingPanel,
  DraggingPointCreatedOptions,
  DraggingPointsOptions,
  DragHeaderOptions,
  DragOptions,
  DropOptions,
  PointerEventArgs,
  ResizingInfo,
  TablePosition,
} from './types';

const COLUMNS_SEPARATOR_CLASS = 'columns-separator';
const COLUMNS_SEPARATOR_TRANSPARENT = 'columns-separator-transparent';
const DRAGGING_HEADER_CLASS = 'drag-header';
const HEADERS_DRAG_ACTION_CLASS = 'drag-action';
const TRACKER_CLASS = 'tracker';
const HEADERS_DROP_HIGHLIGHT_CLASS = 'drop-highlight';
const BLOCK_SEPARATOR_CLASS = 'dx-block-separator';
const WIDGET_CLASS = 'dx-widget';

const MODULE_NAMESPACE = 'dxDataGridResizingReordering';

const COLUMNS_SEPARATOR_TOUCH_TRACKER_WIDTH = 10;
const DRAGGING_DELTA = 5;

const allowResizing = (that: ModuleItem): boolean => (
  // TODO getController
  Boolean(that.option('allowColumnResizing')) || that.getController('columns').isColumnOptionUsed('allowResizing')
);

const allowReordering = (that: ModuleItem): boolean => (
  // TODO getController
  Boolean(that.option('allowColumnReordering')) || that.getController('columns').isColumnOptionUsed('allowReordering')
);

export class TrackerView extends modules.View {
  private _positionChanged?: (position: TablePosition) => void;

  private _tablePositionController!: TablePositionViewController;

  public init(): void {
    super.init();

    this._tablePositionController = this.getController('tablePosition');
    this._subscribeToCallback();
  }

  public dispose(): void {
    this._unsubscribeFromCallback();
    super.dispose();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'allowColumnResizing') {
      this._unsubscribeFromCallback();

      if (args.value) {
        this._subscribeToCallback();
        this._invalidate();
      }
    }

    super.optionChanged(args);
  }

  /* eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    -- a view that renders synchronously returns nothing */
  protected _renderCore(): DeferredObj<unknown> | void {
    const deferred = super._renderCore();
    // @ts-expect-error the view is rendered here
    this.element().addClass(this.addWidgetPrefix(TRACKER_CLASS));
    this.hide();
    return deferred;
  }

  private _unsubscribeFromCallback(): void {
    if (this._positionChanged) {
      this._tablePositionController.positionChanged.remove(this._positionChanged);
    }
  }

  private _subscribeToCallback(): void {
    this._positionChanged = (position: TablePosition): void => {
      const $element = this.element();
      if ($element?.hasClass(this.addWidgetPrefix(TRACKER_CLASS))) {
        $element.css({ top: position.top });
        setHeight($element, position.height);
      }
    };
    this._tablePositionController.positionChanged.add(this._positionChanged);
  }

  public isVisible(): boolean {
    return allowResizing(this);
  }

  public show(): void {
    // @ts-expect-error the view is rendered here
    this.element().show();
  }

  public hide(): void {
    this.element()?.hide();
  }
}

export class SeparatorView extends modules.View {
  protected _isShown?: boolean;

  protected _renderSeparator(): void { }

  /* eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    -- a view that renders synchronously returns nothing */
  protected _renderCore(options?: unknown): DeferredObj<unknown> | void {
    const deferred = super._renderCore(options);
    this._isShown = true;
    this._renderSeparator();
    this.hide();
    return deferred;
  }

  public show(): void {
    this._isShown = true;
  }

  public hide(): void {
    this._isShown = false;
  }

  private height(value?: number): number | undefined {
    const $element = this.element();
    if ($element) {
      if (isDefined(value)) {
        setHeight($element, value);
      } else {
        return getHeight($element);
      }
    }

    return undefined;
  }

  public width(value?: number): number | undefined {
    const $element = this.element();
    if ($element) {
      if (isDefined(value)) {
        setWidth($element, value);
      } else {
        return getWidth($element);
      }
    }

    return undefined;
  }
}

export class ColumnsSeparatorView extends SeparatorView {
  private _positionChanged?: (position: TablePosition) => void;

  private _tablePositionController!: TablePositionViewController;

  private _isTransparent?: boolean;

  private _testPosX?: number | null;

  private _testCursorName?: string;

  public init(): void {
    super.init();

    this._tablePositionController = this.getController('tablePosition');
    this._init();
  }

  public dispose(): void {
    this._unsubscribeFromCallback();
    super.dispose();
  }

  public optionChanged(args: OptionChanged): void {
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

  protected _renderSeparator(): void {
    super._renderSeparator();

    const $element = this.element();
    // @ts-expect-error the view is rendered here
    $element.addClass(this.addWidgetPrefix(COLUMNS_SEPARATOR_CLASS));
  }

  private _subscribeToCallback(): void {
    this._positionChanged = (position: TablePosition): void => {
      const $element = this.element();
      if ($element) {
        $element.css({ top: position.top });
        setHeight($element, position.height);
      }
    };
    this._tablePositionController.positionChanged.add(this._positionChanged);
  }

  private _unsubscribeFromCallback(): void {
    if (this._positionChanged) {
      this._tablePositionController.positionChanged.remove(this._positionChanged);
    }
  }

  private _init(): void {
    this._isTransparent = allowResizing(this);
    if (this.isVisible()) {
      this._subscribeToCallback();
    }
  }

  public isVisible(): boolean {
    return Boolean(this.option('showColumnHeaders')) && (allowReordering(this) || allowResizing(this));
  }

  public show(): void {
    const $element = this.element();

    if ($element && !this._isShown) {
      if (this._isTransparent) {
        $element.removeClass(this.addWidgetPrefix(COLUMNS_SEPARATOR_TRANSPARENT));
      } else {
        $element.show();
      }
    }
    super.show();
  }

  public hide(force?: boolean): void {
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

  public moveByX(outerX: number | null): void {
    const $element = this.element();
    if ($element) {
      // @ts-expect-error render() sets _$parent together with _$element
      $element.css('left', outerX === null ? 0 : outerX - this._parentElement().offset().left);
      /// #DEBUG
      this._testPosX = outerX;
      /// #ENDDEBUG
    }
  }

  public changeCursor(cursorName?: string): void {
    const cursor = cursorName ?? '';
    const $element = this.element();
    if ($element) {
      $element.css('cursor', cursor);
      /// #DEBUG
      this._testCursorName = cursor;
      /// #ENDDEBUG
    }
  }
}

export class BlockSeparatorView extends SeparatorView {
  public init(): void {
    super.init();

    const dataController = this.getController('data');
    dataController.loadingChanged.add((isLoading) => {
      if (!isLoading) {
        this.hide();
      }
    });
  }

  protected _renderSeparator(): void {
    super._renderSeparator();
    // @ts-expect-error the view is rendered here
    this.element().addClass(BLOCK_SEPARATOR_CLASS).html('&nbsp;');
  }

  public hide(): void {
    const $parent = this._parentElement();
    const $element = this.element();

    if ($element && this._isShown) {
      $element.css('display', 'none');
    }

    if ($parent && !$parent.children(`.${BLOCK_SEPARATOR_CLASS}`).length) {
      // @ts-expect-error the view is rendered here
      $parent.prepend(this.element());
    }

    super.hide();
  }

  public isVisible(): boolean {
    const groupPanelOptions: GroupPanel = this.option('groupPanel') ?? {};
    const columnChooserOptions = this.option('columnChooser');

    return Boolean(groupPanelOptions.visible) || Boolean(columnChooserOptions?.enabled);
  }

  public show(targetLocation?: DropLocationNames): void {
    const $element = this.element();
    const startAnimate = (toOptions: { width: string; display: string }): void => {
      // @ts-expect-error fx is typed for Element
      fx.stop($element, true);
      const animationConfig = {
        type: 'slide',
        from: {
          width: 0,
          display: toOptions.display,
        },
        to: toOptions,
        duration: 300,
        easing: 'swing',
      };
      // @ts-expect-error fx is typed for Element, and animation states have no width or display
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      fx.animate($element, animationConfig);
    };

    if ($element && !this._isShown) {
      switch (targetLocation) {
        case 'group':
          // @ts-expect-error the view is rendered here
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

  private _dragOptions?: DragOptions | null;

  private _dropOptions?: DropOptions | null;

  private _onSelectStart?: Document['onselectstart'];

  private _testPointsByColumns?: ColumnPoint[];

  private getSourceDraggingPanel(): DraggingPanel {
    // @ts-expect-error the drag options are set while dragging
    const { sourceLocation, draggingPanels }: DragOptions = this._dragOptions;

    return draggingPanels
      .find(
        (draggingPanel: DraggingPanel) => draggingPanel.getName() === sourceLocation,
      ) as DraggingPanel;
  }

  private updateDragElement(): void {
    // @ts-expect-error the drag options are set while dragging
    const { columnElement, sourceColumn }: DragOptions = this._dragOptions;
    const sourceDraggingPanel = this.getSourceDraggingPanel();
    // @ts-expect-error the view is rendered here
    const dragElement: dxElementWrapper = this.element();

    dragElement
      .empty()
      .css({
        textAlign: columnElement?.css('textAlign'),
        height: columnElement && getHeight(columnElement),
        width: columnElement && getWidth(columnElement),
        whiteSpace: columnElement?.css('whiteSpace'),
      })
      .addClass(this.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));

    sourceDraggingPanel.renderDragCellContent(dragElement, sourceColumn);
  }

  public init(): void {
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

  public isDragging(): boolean | undefined {
    return this._isDragging;
  }

  private _getDraggingPanelByPos(pos: Coordinates): DraggingPanel | undefined {
    /* eslint-disable-next-line @typescript-eslint/init-declarations
      -- assigned in the each callback */
    let result: DraggingPanel | undefined;

    // @ts-expect-error the drag options are set while dragging
    each(this._dragOptions.draggingPanelBoundingRects, (_, { draggingPanel, boundingRect }) => {
      if (boundingRect
        && (boundingRect.bottom === undefined || pos.y < boundingRect.bottom)
        && (boundingRect.top === undefined || pos.y > boundingRect.top)
        && (boundingRect.left === undefined || pos.x > boundingRect.left)
        && (boundingRect.right === undefined || pos.x < boundingRect.right)
      ) {
        result = draggingPanel;
        return false;
      }

      return undefined;
    });

    return result;
  }

  protected _renderCore(): void {
    // @ts-expect-error the view is rendered here
    this.element()
      .addClass(`${this.addWidgetPrefix(DRAGGING_HEADER_CLASS)} ${this.addWidgetPrefix(COLUMN_HEADERS_CLASSES.cellContent)} ${WIDGET_CLASS}`)
      .hide();
  }

  private _resetTargetColumnOptions(): void {
    // @ts-expect-error the drag options are set while dragging
    const params: DropOptions = this._dropOptions;

    params.targetColumnIndex = -1;
    delete params.targetColumnElement;
    delete params.isLast;
    delete params.posX;
    delete params.posY;
  }

  private _getVisibleIndexObject(rowIndex: number | undefined, visibleIndex: number): ColumnIndex {
    if (isDefined(rowIndex)) {
      return {
        columnIndex: visibleIndex,
        rowIndex,
      };
    }

    return visibleIndex;
  }

  public dispose(): void {
    const element = this.element();

    this._dragOptions = null;
    element?.parent().find(`.${this.addWidgetPrefix(DRAGGING_HEADER_CLASS)}`).remove();
    super.dispose();
  }

  public isVisible(): boolean {
    const commonColumnSettings = this._columnsController.getCommonSettings();

    return Boolean(this.option('showColumnHeaders'))
      && (allowReordering(this)
        || Boolean(commonColumnSettings.allowGrouping)
        || Boolean(commonColumnSettings.allowHiding));
  }

  public dragHeader(options: DragHeaderOptions): void {
    const { columnElement } = options;
    const dragOptions = {
      ...options,
      draggingPanelBoundingRects: getDraggingPanelBoundingRects(options.draggingPanels),
    };

    this._isDragging = true;
    this._dragOptions = dragOptions;
    this._dropOptions = {
      sourceIndex: options.index,
      sourceColumnIndex: this._getVisibleIndexObject(options.rowIndex, options.columnIndex),
      sourceColumnElement: columnElement,
      sourceLocation: options.sourceLocation,
    };

    const document = domAdapter.getDocument();
    // eslint-disable-next-line spellcheck/spell-checker
    this._onSelectStart = document.onselectstart;

    // eslint-disable-next-line spellcheck/spell-checker
    document.onselectstart = (): boolean => false;

    this._controller.drag(this._dropOptions);
    this.updateDragElement();

    // @ts-expect-error the view is rendered here
    this.element().appendTo(swatchContainer.getSwatchContainer(columnElement));
  }

  public moveHeader(args: PointerEventArgs<{ that: DraggingHeaderView }>): void {
    const e = args.event;
    const { that } = e.data;
    const eventData = getEventData(e);
    const isResizing = that._columnsResizerViewController
      ? that._columnsResizerViewController.isResizing()
      : false;

    if (that._isDragging && !isResizing) {
      // @ts-expect-error the drag options are set while dragging
      const dragOptions: DragOptions = that._dragOptions;
      // @ts-expect-error the view is rendered here
      const $element: dxElementWrapper = that.element();
      // @ts-expect-error offset() is typed as possibly undefined
      const columnOffset: Offset = dragOptions.columnElement.offset();

      const moveDeltaX = Math.abs(eventData.x - columnOffset.left - dragOptions.deltaX);
      const moveDeltaY = Math.abs(eventData.y - columnOffset.top - dragOptions.deltaY);

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

  public dockHeader(eventData: Coordinates): void {
    const targetDraggingPanel = this._getDraggingPanelByPos(eventData);

    if (!targetDraggingPanel) {
      return;
    }

    const controller = this._controller;
    // @ts-expect-error the drag options are set while dragging
    const params: DropOptions = this._dropOptions;
    // @ts-expect-error the drag options are set while dragging
    const dragOptions: DragOptions = this._dragOptions;
    const rtlEnabled = this.option('rtlEnabled');
    const isVerticalOrientation = targetDraggingPanel.getName() === 'columnChooser';
    const axisName = isVerticalOrientation ? 'y' : 'x';
    // @ts-expect-error the dragging panels are named by their drop locations
    const targetLocation: DropLocationNames = targetDraggingPanel.getName();
    const rowIndex = targetLocation === 'headers' ? dragOptions.rowIndex : undefined;
    const { sourceColumn } = dragOptions;
    // @ts-expect-error an empty array stands in for missing column elements
    const columnElements: dxElementWrapper = targetDraggingPanel
      .getColumnElements(rowIndex, sourceColumn?.ownerBand) ?? [];

    dragOptions.pointsByTarget ??= {};
    const { pointsByTarget } = dragOptions;
    const pointsByColumns = targetLocation === 'columnChooser'
      ? []
      : pointsByTarget[targetLocation]
        ?? controller._generatePointsByColumns(extend({}, dragOptions, {
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
      for (let i = 0; i < pointsByColumns.length; i += 1) {
        const nextPoint: ColumnPoint | undefined = pointsByColumns[i + 1];
        const centerPosition = nextPoint
          && (pointsByColumns[i][axisName] + nextPoint[axisName]) / 2;
        const isTargetPoint = centerPosition === undefined
          || (rtlEnabled && axisName === 'x'
            ? eventData[axisName] > centerPosition
            : eventData[axisName] < centerPosition);

        if (isTargetPoint) {
          const hasColumnElement = Boolean(columnElements[i]);

          params.targetColumnIndex = this._getVisibleIndexObject(
            rowIndex,
            pointsByColumns[i].columnIndex,
          );
          params.targetColumnElement = hasColumnElement
            ? columnElements.eq(i)
            : columnElements.last();
          params.isLast = !hasColumnElement;
          params.posX = pointsByColumns[i].x;
          params.posY = pointsByColumns[i].y;
          controller.dock(params);
          break;
        }
      }
    } else {
      this._resetTargetColumnOptions();
      controller.dock(params);
    }
  }

  public dropHeader(args: PointerEventArgs<{ that: DraggingHeaderView }>): void {
    const e = args.event;
    const { that } = e.data;
    const controller = that._controller;
    // @ts-expect-error the view is rendered here
    const $element: dxElementWrapper = that.element();

    $element.hide();

    if (controller && that._isDragging) {
      // @ts-expect-error the drag options are set while dragging
      controller.drop(that._dropOptions);
    }

    // @ts-expect-error render() sets _$parent together with _$element
    $element.appendTo(that._parentElement());
    that._dragOptions = null;
    that._dropOptions = null;
    that._isDragging = false;
    // eslint-disable-next-line spellcheck/spell-checker
    domAdapter.getDocument().onselectstart = that._onSelectStart ?? null;
  }
}

const isNextColumnResizingMode = (that: ModuleItem): boolean => that.option('columnResizingMode') !== 'widget';

export class ColumnsResizerViewController extends modules.ViewController {
  protected _columnHeadersView!: ColumnHeadersView;

  private _$parentContainer!: dxElementWrapper;

  public _targetPoint?: ColumnPoint | null;

  private _resizingInfo?: ResizingInfo | null;

  protected _columnsController!: ColumnsController;

  private _pointsByColumns?: ColumnPoint[] | null;

  private _moveSeparatorHandler?: (e: unknown) => void;

  private _startResizingHandler?: (e: unknown) => void;

  private _endResizingHandler?: (e: unknown) => void;

  private _columnsSeparatorView!: ColumnsSeparatorView;

  private _rowsView!: RowsView;

  private _scrollRight?: number;

  private _subscribesToCallbacks!: CallbackSubscription[];

  private _isResizing?: boolean;

  private _isReadyResizing?: boolean;

  private _previousParentOffset?: Offset;

  private _testColumnIndex?: number;

  private _scrollLeft?: number;

  private _trackerView!: TrackerView;

  private _tablePositionController!: TablePositionViewController;

  private _editorFactoryController!: EditorFactory;

  private _draggingHeaderView!: DraggingHeaderView;

  /**
   * Fired when column resizing begins.
   * Used to notify other components (e.g., to close open dropdowns).
   */
  public resizeStarted!: Callback;

  protected callbackNames(): string[] {
    return ['resizeStarted'];
  }

  public init(): void {
    super.init();

    this._subscribesToCallbacks = [];

    if (allowResizing(this)) {
      this._init();
    }
  }

  public dispose(): void {
    this._unsubscribes();
    super.dispose();
  }

  public optionChanged(args: OptionChanged): void {
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

  private _isHeadersRowArea(posY: number): boolean {
    if (this._columnHeadersView) {
      const element = this._columnHeadersView.element();

      if (element) {
        // @ts-expect-error offset() is typed as possibly undefined
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

  protected _correctColumnIndexForPoint(
    point: ColumnPoint,
    correctionValue: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
    columns: Column[],
  ): void {
    point.columnIndex -= correctionValue;
  }

  /**
   * @extended: adaptivity
   */
  protected _pointCreated(
    point: ColumnPoint,
    columns: Column[],
    cells?: dxElementWrapper,
  ): boolean {
    const isNextColumnMode = isNextColumnResizingMode(this);
    const rtlEnabled = this.option('rtlEnabled');
    const isRtlParentStyle = this._isRtlParentStyle();
    const firstPointColumnIndex = !isNextColumnMode && rtlEnabled && !isRtlParentStyle ? 0 : 1;
    const cellsLength = cells?.length ?? columns.length;
    const lastPointIndexCorrection = !isNextColumnMode && (!rtlEnabled || isRtlParentStyle) ? 1 : 0;

    if (
      point.index >= firstPointColumnIndex
      && point.index < cellsLength + lastPointIndexCorrection
    ) {
      this._correctColumnIndexForPoint(point, firstPointColumnIndex, columns);
      const currentColumn: Column | undefined = columns[point.columnIndex];
      const nextColumn: Column | undefined = columns[point.columnIndex + 1];

      return !(isNextColumnMode
        ? currentColumn?.allowResizing && nextColumn?.allowResizing
        : currentColumn?.allowResizing);
    }

    return true;
  }

  /**
   * @extended: column_fixing
   */
  protected _getTargetPoint(
    pointsByColumns: ColumnPoint[] | null | undefined,
    currentPoint: Coordinates,
    deltaX: number,
  ): ColumnPoint | null {
    if (pointsByColumns) {
      for (let i = 0; i < pointsByColumns.length; i += 1) {
        if (pointsByColumns[i].x === pointsByColumns[0].x
          && pointsByColumns[i].x === pointsByColumns[i + 1]?.x
        ) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (currentPoint.y >= pointsByColumns[i].y
          && pointsByColumns[i].x - deltaX <= currentPoint.x
          && currentPoint.x <= pointsByColumns[i].x + deltaX
        ) {
          return pointsByColumns[i];
        }
      }
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
  protected getSeparatorOffsetX($cell: dxElementWrapper, $nextCell: dxElementWrapper): number {
    const isNextColumnMode = isNextColumnResizingMode(this);
    const rtlEnabled = this.option('rtlEnabled');
    const isRtlParentStyle = this._isRtlParentStyle();
    const outerWidth: number = $cell[0].getBoundingClientRect().width;
    const cellOffset: number = $cell.offset()?.left ?? 0;

    return cellOffset + ((isNextColumnMode || isRtlParentStyle) && rtlEnabled ? 0 : outerWidth);
  }

  private _moveSeparator(args: PointerEventArgs<ColumnsResizerViewController>): void {
    const e = args.event;
    const that = e.data;
    // @ts-expect-error the view is rendered here
    const columnsSeparatorWidth: number = that._columnsSeparatorView.width();
    const isNextColumnMode = isNextColumnResizingMode(that);
    const deltaX = columnsSeparatorWidth / 2;
    // @ts-expect-error offset() is typed as possibly undefined
    const parentOffset: Offset = that._$parentContainer.offset();
    const parentOffsetLeft = parentOffset.left;
    const eventData = getEventData(e);
    const isRtlParentStyle = this._isRtlParentStyle();
    const isDragging = that._draggingHeaderView?.isDragging();

    if (that._isResizing && that._resizingInfo) {
      const parentOffsetRight = parentOffsetLeft + Number(getWidth(that._$parentContainer));
      const isInsideParent = (
        parentOffsetLeft <= eventData.x || (!isNextColumnMode && isRtlParentStyle)
      ) && (!isNextColumnMode || eventData.x <= parentOffsetRight);

      if (isInsideParent && that._updateColumnsWidthIfNeeded(eventData.x)) {
        // @ts-expect-error the view is rendered here
        const $cells: dxElementWrapper = that._columnHeadersView.getColumnElements();
        const $cell = $cells.eq(that._resizingInfo.currentColumnIndex);
        const $nextCell = $cells.eq(that._resizingInfo.nextColumnIndex);

        if ($cell.length) {
          const offsetX = this.getSeparatorOffsetX($cell, $nextCell);

          that._columnsSeparatorView.moveByX(offsetX);
          // @ts-expect-error resizing starts at a target point
          that._tablePositionController.update(that._targetPoint.y);
          e.preventDefault();
        }
      }
    } else if (!isDragging) {
      if (that._isHeadersRowArea(eventData.y)) {
        if (
          that._previousParentOffset
          && (that._previousParentOffset.left !== parentOffset.left
            || that._previousParentOffset.top !== parentOffset.top)
        ) {
          that.pointsByColumns(null);
        }

        that._targetPoint = that._getTargetPoint(
          that.pointsByColumns(),
          eventData,
          columnsSeparatorWidth,
        );
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

  protected _endResizing(args: PointerEventArgs<ColumnsResizerViewController>): void {
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
  protected _getNextColumnIndex(currentColumnIndex: number): number {
    return currentColumnIndex + 1;
  }

  private _setupResizingInfo(posX: number): void {
    if (this._targetPoint) {
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
  }

  /**
   * @extended: filter_row
   */
  protected _startResizing(args: PointerEventArgs<ColumnsResizerViewController>): void {
    const e = args.event;
    const that = e.data;
    const eventData = getEventData(e);

    if (isTouchEvent(e)) {
      if (that._isHeadersRowArea(eventData.y)) {
        that._targetPoint = that._getTargetPoint(
          that.pointsByColumns(),
          eventData,
          COLUMNS_SEPARATOR_TOUCH_TRACKER_WIDTH,
        );
        if (that._targetPoint) {
          // @ts-expect-error the view is rendered here
          const columnsSeparatorWidth: number = that._columnsSeparatorView.width();

          that._columnsSeparatorView.moveByX(that._targetPoint.x - columnsSeparatorWidth / 2);
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

      // @ts-expect-error resizing starts at a target point
      that._tablePositionController.update(that._targetPoint.y);
      that._columnsSeparatorView.show();
      that._trackerView.show();
      // @ts-expect-error the public Scrollable type has no $content() and container()
      const scrollable: Scrollable | undefined = that.component.getScrollable();

      if (scrollable && that._isRtlParentStyle()) {
        that._scrollRight = Number(getWidth(scrollable.$content()))
          - Number(getWidth(scrollable.container()))
          - scrollable.scrollLeft();
      }

      this.resizeStarted.fire();

      e.preventDefault();
      e.stopPropagation();
    }

    if (this.isResizing()) {
      this._editorFactoryController.loseFocus();
    }
  }

  private _generateColumnsTopYIndex(needToCheckPrevPoint = false): Record<number, number> {
    const rowCount = this._columnsController.getRowCount();
    const topYMap: Record<number, number> = {};
    const pointCreated = (point: ColumnPoint): boolean => {
      const x = Math.ceil(point.x);

      if (!topYMap[x]) {
        topYMap[x] = point.y;
      }

      return true;
    };

    for (let rowIndex = 0; rowIndex < rowCount - 1; rowIndex += 1) {
      const cells = this._columnHeadersView.getColumnElements(rowIndex);

      if (cells && cells.length > 0) {
        gridCoreUtils.getPointsByColumns(cells, pointCreated, false, 0, needToCheckPrevPoint);
      }
    }

    return topYMap;
  }

  /**
   * @extended: column_fixing
   * @protected
   */
  protected _generatePointsByColumns(needToCheckPrevPoint = false): void {
    const topYMap = this._generateColumnsTopYIndex(needToCheckPrevPoint);
    const columns = this._columnsController ? this._columnsController.getVisibleColumns() : [];
    const cells = this._columnHeadersView.getColumnElements();
    const correctColumnY = (point: ColumnPoint): ColumnPoint => {
      const x = Math.ceil(point.x);

      if (topYMap[x]) {
        point.y = topYMap[x];
      }

      return point;
    };

    this._pointsByColumns = [];
    if (cells && cells.length > 0) {
      this._pointsByColumns = gridCoreUtils.getPointsByColumns(
        cells,
        (point) => this._pointCreated(correctColumnY(point), columns, cells),
        false,
        0,
        needToCheckPrevPoint,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
  protected _needToInvertResizing($cell: dxElementWrapper): boolean {
    const rtlEnabled = this.option('rtlEnabled') as boolean;
    const isRtlParentStyle = this._isRtlParentStyle();
    const isNextColumnMode = isNextColumnResizingMode(this);

    return (isNextColumnMode || isRtlParentStyle) && rtlEnabled;
  }

  private _unsubscribeFromEvents(): void {
    if (this._moveSeparatorHandler) {
      eventsEngine.off(
        domAdapter.getDocument(),
        addNamespace(pointerEvents.move, MODULE_NAMESPACE),
        this._moveSeparatorHandler,
      );
    }
    if (this._startResizingHandler) {
      eventsEngine.off(
        this._$parentContainer,
        addNamespace(pointerEvents.down, MODULE_NAMESPACE),
        this._startResizingHandler,
      );
    }
    if (this._endResizingHandler) {
      eventsEngine.off(
        this._columnsSeparatorView.element(),
        addNamespace(pointerEvents.up, MODULE_NAMESPACE),
        this._endResizingHandler,
      );
      eventsEngine.off(
        domAdapter.getDocument(),
        addNamespace(pointerEvents.up, MODULE_NAMESPACE),
        this._endResizingHandler,
      );
    }
  }

  private _subscribeToEvents(): void {
    this._moveSeparatorHandler = this.createAction(this._moveSeparator);
    this._startResizingHandler = this.createAction(this._startResizing);
    this._endResizingHandler = this.createAction(this._endResizing);

    eventsEngine.on(
      domAdapter.getDocument(),
      addNamespace(pointerEvents.move, MODULE_NAMESPACE),
      this,
      this._moveSeparatorHandler,
    );
    eventsEngine.on(
      this._$parentContainer,
      addNamespace(pointerEvents.down, MODULE_NAMESPACE),
      this,
      this._startResizingHandler,
    );
    eventsEngine.on(
      this._columnsSeparatorView.element(),
      addNamespace(pointerEvents.up, MODULE_NAMESPACE),
      this,
      this._endResizingHandler,
    );
    eventsEngine.on(
      domAdapter.getDocument(),
      addNamespace(pointerEvents.up, MODULE_NAMESPACE),
      this,
      this._endResizingHandler,
    );
  }

  private _updateColumnsWidthIfNeeded(posX: number): boolean {
    let contentWidth = this._rowsView.contentWidth();
    // @ts-expect-error the resizing info is set while resizing
    const resizingInfo: ResizingInfo = this._resizingInfo;
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    // @ts-expect-error the view is rendered here
    const columnsSeparatorWidth: number = this._columnsSeparatorView.width();
    const isNextColumnMode = isNextColumnResizingMode(this);
    const adaptColumnWidthByRatio = isNextColumnMode
      && Boolean(this.option('adaptColumnWidthByRatio'))
      && !this.option('columnAutoWidth');
    const isRtlParentStyle = this._isRtlParentStyle();
    const column = visibleColumns[resizingInfo.currentColumnIndex];
    const nextColumn = visibleColumns[resizingInfo.nextColumnIndex];
    const { needToInvertResizing } = resizingInfo;

    const setColumnWidth = (
      targetColumn: Column | undefined,
      columnWidth: number,
      totalWidth: number,
      adaptByRatio: boolean,
    ): void => {
      if (targetColumn) {
        const oldColumnWidth = targetColumn.width;
        const isAdaptedByRatio = oldColumnWidth ? isPercentWidth(oldColumnWidth) : adaptByRatio;

        if (isAdaptedByRatio) {
          columnsController.columnOption(targetColumn.index, 'visibleWidth', columnWidth);
          columnsController.columnOption(targetColumn.index, 'width', `${((columnWidth / totalWidth) * 100).toFixed(3)}%`);
        } else {
          columnsController.columnOption(targetColumn.index, 'visibleWidth', null);
          columnsController.columnOption(targetColumn.index, 'width', columnWidth);
        }
      }
    };

    const correctContentWidth = (width: number, columns: Column[]): number => {
      const allColumnsHaveWidth = columns.every((visibleColumn) => visibleColumn.width);

      if (allColumnsHaveWidth) {
        const totalPercent = columns.reduce(
          (sum, visibleColumn) => (isPercentWidth(visibleColumn.width)
            ? sum + parseFloat(visibleColumn.width)
            : sum),
          0,
        );

        if (totalPercent > 100) {
          return (width / totalPercent) * 100;
        }
      }

      return width;
    };

    const calculateCellWidths = (delta: number): CellWidths => {
      const cellWidth = resizingInfo.currentColumnWidth + delta;
      /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        -- a zero minWidth falls back to the separator width */
      const minWidth = column?.minWidth || columnsSeparatorWidth;
      const isCellWidthAllowed = cellWidth >= minWidth;
      const needCorrectionNextCellWidth = !isCellWidthAllowed;
      const result: CellWidths = { cellWidth: isCellWidthAllowed ? cellWidth : minWidth };

      if (isNextColumnMode) {
        const nextCellWidth = resizingInfo.nextColumnWidth - delta;
        /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          -- a zero minWidth falls back to the separator width */
        const nextMinWidth = nextColumn?.minWidth || columnsSeparatorWidth;

        if (nextCellWidth >= nextMinWidth) {
          if (needCorrectionNextCellWidth) {
            result.nextCellWidth = resizingInfo.nextColumnWidth - (delta + minWidth - cellWidth);
          } else {
            result.nextCellWidth = nextCellWidth;
          }
        } else {
          result.nextCellWidth = nextMinWidth;
          result.cellWidth = resizingInfo.currentColumnWidth
            + (delta - nextMinWidth + nextCellWidth);
        }
      }

      return result;
    };

    const resizingDelta = posX - resizingInfo.startPosX;
    const deltaX = needToInvertResizing ? -resizingDelta : resizingDelta;

    let { cellWidth, nextCellWidth } = calculateCellWidths(deltaX);

    const needUpdate = column.width !== cellWidth;

    if (!needUpdate) {
      return needUpdate;
    }

    columnsController.beginUpdate();

    cellWidth = Math.floor(cellWidth);

    contentWidth = correctContentWidth(contentWidth, visibleColumns);

    setColumnWidth(column, cellWidth, contentWidth, adaptColumnWidthByRatio);

    if (isNextColumnMode) {
      // @ts-expect-error the next cell width is calculated in the next column mode
      nextCellWidth = Math.floor(nextCellWidth);
      setColumnWidth(nextColumn, nextCellWidth, contentWidth, adaptColumnWidthByRatio);
    } else {
      const columnWidths = this._columnHeadersView.getColumnWidths();
      columnWidths[resizingInfo.currentColumnIndex] = cellWidth;
      const totalColumnsWidth = columnWidths.reduce((totalWidth, width) => totalWidth + width, 0);
      const hasScroll = totalColumnsWidth > this._rowsView.contentWidth();
      if (!hasScroll) {
        const lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns);
        if (lastColumnIndex >= 0) {
          columnsController.columnOption(visibleColumns[lastColumnIndex].index, 'visibleWidth', 'auto');
        }
      }
      for (let i = 0; i < columnWidths.length; i += 1) {
        if (
          visibleColumns[i]
          && visibleColumns[i] !== column
          && visibleColumns[i].width === undefined
        ) {
          columnsController.columnOption(visibleColumns[i].index, 'width', columnWidths[i]);
        }
      }
    }

    columnsController.endUpdate();
    if (!isNextColumnMode) {
      this.component.updateDimensions();

      // @ts-expect-error the public Scrollable type has no $content() and container()
      const scrollable: Scrollable | undefined = this.component.getScrollable();
      if (scrollable && isRtlParentStyle) {
        const left = Number(getWidth(scrollable.$content()))
          - Number(getWidth(scrollable.container()))
          // @ts-expect-error resizing in an RTL parent sets the right scroll offset
          - this._scrollRight;
        scrollable.scrollTo({ left });
      }
    }

    return needUpdate;
  }

  private _subscribeToCallback<TArgs extends unknown[]>(
    callback: Callback<TArgs>,
    handler: (...args: TArgs) => void,
  ): void {
    callback.add(handler);
    this._subscribesToCallbacks.push({
      callback,
      handler,
    });
  }

  private _unsubscribeFromCallbacks(): void {
    for (const subscribe of this._subscribesToCallbacks) {
      subscribe.callback.remove(subscribe.handler);
    }

    this._subscribesToCallbacks = [];
  }

  private _unsubscribes(): void {
    this._unsubscribeFromEvents();
    this._unsubscribeFromCallbacks();
  }

  private _init(): void {
    const generatePointsByColumnsHandler = (): void => {
      if (!this._isResizing) {
        this.pointsByColumns(null);
      }
    };
    const generatePointsByColumnsScrollHandler = (offset: ScrollPosition): void => {
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

    this._subscribeToCallback(
      this._columnHeadersView.renderCompleted,
      generatePointsByColumnsHandler,
    );
    this._subscribeToCallback(
      this._columnHeadersView.resizeCompleted,
      generatePointsByColumnsHandler,
    );
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
        if (
          previousScrollbarVisibility !== scrollbarVisibility
          || (previousTableHeight && previousTableHeight !== e.height)
        ) {
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

  public isResizing(): boolean | undefined {
    return this._isResizing;
  }

  private pointsByColumns(value?: ColumnPoint[] | null): ColumnPoint[] | null | undefined {
    if (value !== undefined) {
      this._pointsByColumns = value;
    } else if (!this._pointsByColumns) {
      this._generatePointsByColumns();
    }

    return this._pointsByColumns;
  }
}

export class TablePositionViewController extends modules.ViewController {
  private _columnsResizerController!: ColumnsResizerViewController;

  private _columnHeadersView!: ColumnHeadersView;

  private _rowsView!: RowsView;

  public readonly positionChanged: Callback<[TablePosition]>;

  constructor(component: InternalGrid) {
    super(component);
    this.positionChanged = Callbacks();
  }

  public init(): void {
    super.init();

    this._columnsResizerController = this.getController('columnsResizer');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowsView = this.getView('rowsView');

    this._rowsView.resizeCompleted.add(() => {
      if (this.option('allowColumnResizing')) {
        const targetPoint = this._columnsResizerController._targetPoint;
        this.update(targetPoint ? targetPoint.y : null);
      }
    });
  }

  public update(top?: number | null): void {
    const $element = this._columnHeadersView.element();
    const offset = $element?.offset();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back to 0
    const offsetTop = offset?.top || 0;
    const diffOffsetTop = isDefined(top) ? Math.abs(top - offsetTop) : 0;
    const columnsHeadersHeight = this._columnHeadersView ? this._columnHeadersView.getHeight() : 0;
    const scrollBarWidth = this._rowsView.getScrollbarWidth(true);
    const rowsHeight = this._rowsView ? this._rowsView.height() - scrollBarWidth : 0;
    // TODO getView
    const draggingHeaderView = this.component.getView('draggingHeaderView');
    const params: TablePosition = { height: columnsHeadersHeight };

    const isDraggingOrResizing = this._columnsResizerController.isResizing()
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of two flags
      || draggingHeaderView.isDragging();

    if (isDraggingOrResizing) {
      params.height += rowsHeight - diffOffsetTop;
    }

    if (top !== null && $element?.length) {
      params.top = $element[0].offsetTop + diffOffsetTop;
    }

    this.positionChanged.fire(params);
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

  public init(): void {
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

    const subscribeToEvents = (): void => {
      if (this._draggingHeaderView) {
        const draggingPanels = this.getDraggingPanels();

        this._unsubscribeFromEvents(this._draggingHeaderView, draggingPanels);
        this._subscribeToEvents(this._draggingHeaderView, draggingPanels);
      }
    };

    this._columnHeadersView.renderCompleted.add(subscribeToEvents);
    this._headerPanelView?.renderCompleted.add(subscribeToEvents);
    this._columnChooserView?.renderCompleted.add(subscribeToEvents);
  }

  public dispose(): void {
    if (this._draggingHeaderView) {
      this._unsubscribeFromEvents(this._draggingHeaderView, this.getDraggingPanels());
    }
    super.dispose();
  }

  private getDraggingPanels(): DraggingPanel[] {
    return [this._columnChooserView, this._columnHeadersView, this._headerPanelView];
  }

  /**
   * @extended: column_fixing
   */
  public _generatePointsByColumns(
    options: DraggingPointsOptions,
    needToCheckPrevPoint = false,
  ): ColumnPoint[] {
    const cells = this._columnHeadersView.getColumnElements();
    this.isCustomGroupColumnPosition = this.checkIsCustomGroupColumnPosition(options);

    return gridCoreUtils.getPointsByColumns(
      options.columnElements,
      (point) => this._pointCreated({
        point,
        columns: options.columns,
        location: options.targetDraggingPanel.getName(),
        sourceColumn: options.sourceColumn,
        cells,
      }),
      options.isVerticalOrientation,
      options.startColumnIndex,
      needToCheckPrevPoint,
    );
  }

  private checkIsCustomGroupColumnPosition(options: DraggingPointsOptions): boolean {
    let wasOnlyCommandColumns = true;

    for (const col of options.columns) {
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
   * @description Function used to filter column points, it's called for each point
   * @param point Point that we are checking
   * @param columns All columns in the given location
   * @param location Location where we move column (headers, group, column chooser, etc.)
   * @param sourceColumn Column that is dragging
   * @param cells JQuery-wrapped collection of header cell elements
   * @returns whether to filter current point (true - remove point, false - keep it)
   */

  protected _pointCreated({
    point, columns, location, sourceColumn,
  }: DraggingPointCreatedOptions): boolean {
    const targetColumn: Column | undefined = columns[point.columnIndex];
    const prevColumn: Column | undefined = columns[point.columnIndex - 1];

    const isColumnAfterExpandColumn = prevColumn?.command === 'expand';
    const isFirstExpandColumn = targetColumn?.command === 'expand' && prevColumn?.command !== 'expand';

    const sourceColumnReorderingDisabled = sourceColumn && !sourceColumn.allowReordering;
    const otherColumnsReorderingDisabled = !targetColumn?.allowReordering
      && !prevColumn?.allowReordering;

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

  private _subscribeToEvents(
    draggingHeader: DraggingHeaderView,
    draggingPanels: DraggingPanel[],
  ): void {
    each(draggingPanels, (_, draggingPanel) => {
      if (draggingPanel) {
        /* eslint-disable-next-line @typescript-eslint/init-declarations
          -- assigned per header row before subscribing */
        let columns: Column[];
        const rowCount = 'getRowCount' in draggingPanel ? draggingPanel.getRowCount() : 1;
        // @ts-expect-error the dragging panels are named by their drop locations
        const nameDraggingPanel: DropLocationNames = draggingPanel.getName();
        const subscribeToEvents = (index: number, columnElement: Element): void => {
          if (!columnElement) {
            return;
          }

          const $columnElement = $(columnElement);
          const column = columns[index];

          if (column && draggingPanel.allowDragging(column)) {
            $columnElement.addClass(this.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
            eventsEngine.on(
              $columnElement,
              addNamespace(dragEventStart, MODULE_NAMESPACE),
              this.createAction((args: PointerEventArgs): void => {
                const e = args.event;
                const eventData = getEventData(e);
                // @ts-expect-error a grid column has an index
                const sourceIndex: number = column.index;

                draggingHeader.dragHeader({
                  // @ts-expect-error offset() is typed as possibly undefined
                  deltaX: eventData.x - $(e.currentTarget).offset().left,
                  // @ts-expect-error offset() is typed as possibly undefined
                  deltaY: eventData.y - $(e.currentTarget).offset().top,
                  sourceColumn: column,
                  index: sourceIndex,
                  columnIndex: index,
                  columnElement: $columnElement,
                  sourceLocation: nameDraggingPanel,
                  draggingPanels,
                  rowIndex: this._columnsController.getRowIndex(sourceIndex, true),
                });
              }),
            );
            eventsEngine.on(
              $columnElement,
              addNamespace(dragEventMove, MODULE_NAMESPACE),
              { that: draggingHeader },
              this.createAction(draggingHeader.moveHeader),
            );
            eventsEngine.on(
              $columnElement,
              addNamespace(dragEventEnd, MODULE_NAMESPACE),
              { that: draggingHeader },
              this.createAction(draggingHeader.dropHeader),
            );
          }
        };

        for (let i = 0; i < rowCount; i += 1) {
          const columnElements = draggingPanel.getColumnElements(i) ?? [];
          if (columnElements.length) {
            columns = draggingPanel.getColumns(i) || [];
            each(columnElements, subscribeToEvents);
          }
        }
      }
    });
  }

  private _unsubscribeFromEvents(
    draggingHeader: DraggingHeaderView,
    draggingPanels: DraggingPanel[],
  ): void {
    each(draggingPanels, (_, draggingPanel) => {
      if (draggingPanel) {
        const columnElements = draggingPanel.getColumnElements() ?? [];

        each(columnElements, (index, columnElement) => {
          const $columnElement = $(columnElement);
          eventsEngine.off($columnElement, addNamespace(dragEventStart, MODULE_NAMESPACE));
          eventsEngine.off($columnElement, addNamespace(dragEventMove, MODULE_NAMESPACE));
          eventsEngine.off($columnElement, addNamespace(dragEventEnd, MODULE_NAMESPACE));
          $columnElement.removeClass(this.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
        });
      }
    });
  }

  private _getSeparator(
    targetLocation?: DropLocationNames,
  ): ColumnsSeparatorView | BlockSeparatorView {
    return targetLocation === 'headers' ? this._columnsSeparatorView : this._blockSeparatorView;
  }

  private hideSeparators(type?: 'block'): void {
    const blockSeparator = this._blockSeparatorView;
    const columnsSeparator = this._columnsSeparatorView;

    this._animationColumnIndex = undefined;
    blockSeparator?.hide();
    if (type !== 'block') {
      columnsSeparator?.hide();
    }
  }

  private allowDrop(parameters: DropOptions): boolean | undefined {
    return this._columnsController.allowMoveColumn(
      parameters.sourceColumnIndex,
      // @ts-expect-error a drop without a docked target has no target
      parameters.targetColumnIndex,
      parameters.sourceLocation,
      parameters.targetLocation,
    );
  }

  public drag(parameters: DropOptions): void {
    const { sourceIndex, sourceLocation, sourceColumnElement } = parameters;
    const headersView = this._columnHeadersView;
    const rowsView = this._rowsView;

    if (sourceColumnElement) {
      sourceColumnElement.addClass(this.addWidgetPrefix(CLASSES.draggableColumn));

      if (sourceLocation === 'headers') {
        headersView?.toggleDraggableColumnClass(sourceIndex, true);
        rowsView?.toggleDraggableColumnClass(sourceIndex, true);
      }
    }
  }

  public dock(parameters: DropOptions): void {
    const targetColumnIndex = isObject(parameters.targetColumnIndex)
      ? parameters.targetColumnIndex.columnIndex
      : parameters.targetColumnIndex;
    const { sourceLocation, targetLocation } = parameters;
    const separator = this._getSeparator(targetLocation);
    const hasTargetVisibleIndex = isDefined(targetColumnIndex) && targetColumnIndex >= 0;

    const showSeparator = (): void => {
      if (this._animationColumnIndex !== targetColumnIndex) {
        this.hideSeparators();
        // @ts-expect-error the view is rendered here
        separator.element()[parameters.isLast ? 'insertAfter' : 'insertBefore'](parameters.targetColumnElement);

        this._animationColumnIndex = targetColumnIndex;
        separator.show(targetLocation);
      }
    };

    // @ts-expect-error the view is rendered here
    this._columnHeadersView.element().find(`.${COLUMN_HEADERS_CLASSES.headerRow}`).toggleClass(this.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS), sourceLocation !== 'headers' && targetLocation === 'headers' && !hasTargetVisibleIndex);

    if (separator) {
      if (this.allowDrop(parameters) && hasTargetVisibleIndex) {
        if (targetLocation === 'group' || targetLocation === 'columnChooser') {
          showSeparator();
        } else {
          this.hideSeparators('block');
          this._tablePositionController.update(parameters.posY);
          // @ts-expect-error a docked headers target has the columns separator and a point
          separator.moveByX(parameters.posX - separator.width());
          separator.show();
        }
      } else {
        this.hideSeparators();
      }
    }
  }

  public drop(parameters: DropOptions): void {
    const { sourceColumnElement } = parameters;

    if (sourceColumnElement) {
      sourceColumnElement.removeClass(this.addWidgetPrefix(CLASSES.draggableColumn));
      this._columnHeadersView.toggleDraggableColumnClass(parameters.sourceIndex, false);
      this._rowsView.toggleDraggableColumnClass(parameters.sourceIndex, false);
      // @ts-expect-error the view is rendered here
      this._columnHeadersView.element().find(`.${COLUMN_HEADERS_CLASSES.headerRow}`).removeClass(this.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS));
    }

    if (this.allowDrop(parameters)) {
      const separator = this._getSeparator(parameters.targetLocation);
      if (separator) {
        separator.hide();
      }

      this._columnsController.moveColumn(
        parameters.sourceColumnIndex,
        // @ts-expect-error a drop without a docked target has no target
        parameters.targetColumnIndex,
        parameters.sourceLocation,
        parameters.targetLocation,
      );
    }
  }
}

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class RowsViewColumnsResizingExtender extends Base {
  protected _needUpdateRowHeight(itemCount: number): boolean {
    const wordWrapEnabled = this.option('wordWrapEnabled');
    const isResizing = this._columnsResizerController.isResizing();

    return Boolean(super._needUpdateRowHeight(itemCount))
      || (itemCount > 0 && !!wordWrapEnabled && !!isResizing);
  }
};

const editorFactory = (
  Base: ModuleType<EditorFactory>,
): ModuleType<EditorFactory> => class EditorFactoryColumnsResizingExtender extends Base {
  protected renderFocusOverlay($element: dxElementWrapper, isHideBorder?: boolean): void {
    if (this._columnsResizerController.isResizing()) {
      return;
    }

    super.renderFocusOverlay($element, isHideBorder);
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

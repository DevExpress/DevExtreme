import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import Callbacks from '../../core/utils/callbacks';
import { isDefined, isString, isObject } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import { addNamespace, eventData as getEventData, isTouchEvent } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import {
    start as dragEventStart,
    move as dragEventMove,
    end as dragEventEnd
} from '../../events/drag';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import fx from '../../animation/fx';
import swatchContainer from '../widget/swatch_container';

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
const COLUMN_OPACITY = 0.5;

const allowResizing = function(that) {
    return that.option('allowColumnResizing') || that.getController('columns').isColumnOptionUsed('allowResizing');
};

const allowReordering = function(that) {
    return that.option('allowColumnReordering') || that.getController('columns').isColumnOptionUsed('allowReordering');
};

const TrackerView = modules.View.inherit({
    _renderCore: function() {
        this.callBase();
        this.element().addClass(this.addWidgetPrefix(TRACKER_CLASS));
        this.hide();
    },

    _unsubscribeFromCallback: function() {
        if(this._positionChanged) {
            this._tablePositionController.positionChanged.remove(this._positionChanged);
        }
    },

    _subscribeToCallback: function() {
        const that = this;

        that._positionChanged = function(position) {
            const $element = that.element();
            if($element && $element.hasClass(that.addWidgetPrefix(TRACKER_CLASS))) {
                $element.css({ top: position.top });
                $element.height(position.height);
            }
        };
        this._tablePositionController.positionChanged.add(that._positionChanged);
    },

    optionChanged: function(args) {
        if(args.name === 'allowColumnResizing') {
            this._unsubscribeFromCallback();

            if(args.value) {
                this._subscribeToCallback();
                this._invalidate();
            }
        }

        this.callBase(args);
    },

    init: function() {
        this.callBase();
        this._tablePositionController = this.getController('tablePosition');
        this._subscribeToCallback();
    },

    isVisible: function() {
        return allowResizing(this);
    },

    show: function() {
        this.element().show();
    },

    hide: function() {
        this.element() && this.element().hide();
    },

    setHeight: function(value) {
        this.element().height(value);
    },

    dispose: function() {
        this._unsubscribeFromCallback();
        this.callBase();
    }
});

const SeparatorView = modules.View.inherit({
    _renderSeparator: function() { },

    _renderCore: function(options) {
        this.callBase(options);
        this._isShown = true;
        this._renderSeparator();
        this.hide();
    },

    show: function() {
        this._isShown = true;
    },

    hide: function() {
        this._isShown = false;
    },

    height: function(value) {
        const $element = this.element();
        if($element) {
            if(isDefined(value)) {
                $element.height(value);
            } else {
                return $element.height();
            }
        }
    },

    width: function(value) {
        const $element = this.element();
        if($element) {
            if(isDefined(value)) {
                $element.width(value);
            } else {
                return $element.width();
            }
        }
    }
});

const ColumnsSeparatorView = SeparatorView.inherit({
    _renderSeparator: function() {
        this.callBase();

        const $element = this.element();
        $element.addClass(this.addWidgetPrefix(COLUMNS_SEPARATOR_CLASS));
    },

    _subscribeToCallback: function() {
        const that = this;
        let $element;

        that._positionChanged = function(position) {
            $element = that.element();
            if($element) {
                $element.css({ top: position.top });
                $element.height(position.height);
            }
        };
        that._tablePositionController.positionChanged.add(that._positionChanged);
    },

    _unsubscribeFromCallback: function() {
        this._positionChanged && this._tablePositionController.positionChanged.remove(this._positionChanged);
    },

    _init: function() {
        this._isTransparent = allowResizing(this);
        if(this.isVisible()) {
            this._subscribeToCallback();
        }
    },

    isVisible: function() {
        return this.option('showColumnHeaders') && (allowReordering(this) || allowResizing(this));
    },

    optionChanged: function(args) {
        if(args.name === 'allowColumnResizing') {
            if(args.value) {
                this._init();
                this._invalidate();
                this.hide(true);
            } else {
                this._unsubscribeFromCallback();
                this._isTransparent = allowResizing(this);
                this.hide(true);
            }
        }

        this.callBase(args);
    },

    init: function() {
        this.callBase();
        this._tablePositionController = this.getController('tablePosition');
        this._init();
    },

    show: function() {
        const that = this;
        const $element = this.element();

        if($element && !that._isShown) {
            if(that._isTransparent) {
                $element.removeClass(that.addWidgetPrefix(COLUMNS_SEPARATOR_TRANSPARENT));
            } else {
                $element.show();
            }
        }
        this.callBase();
    },

    hide: function(force) {
        const $element = this.element();
        const columnsSeparatorTransparent = this.addWidgetPrefix(COLUMNS_SEPARATOR_TRANSPARENT);

        if($element && (this._isShown || force)) {
            if(this._isTransparent) {
                $element.addClass(columnsSeparatorTransparent);
                $element.css('left', '');
                $element.show();
            } else {
                if($element.hasClass(columnsSeparatorTransparent)) {
                    $element.removeClass(columnsSeparatorTransparent);
                }
                $element.hide();
            }
        }
        this.callBase();
    },

    moveByX: function(outerX) {
        const $element = this.element();
        if($element) {
            $element.css('left', outerX - this._parentElement().offset().left);
            ///#DEBUG
            this._testPosX = outerX;
            ///#ENDDEBUG
        }
    },

    changeCursor: function(cursorName) {
        cursorName = isDefined(cursorName) ? cursorName : '';
        const $element = this.element();
        if($element) {
            $element.css('cursor', cursorName);
            ///#DEBUG
            this._testCursorName = cursorName;
            ///#ENDDEBUG
        }
    },

    dispose: function() {
        this._unsubscribeFromCallback();
        this.callBase();
    }
});

const BlockSeparatorView = SeparatorView.inherit({
    init: function() {
        const that = this;

        this.callBase();

        this.getController('data').loadingChanged.add(function(isLoading) {
            if(!isLoading) {
                that.hide();
            }
        });
    },

    _renderSeparator: function() {
        this.callBase();
        this.element().addClass(BLOCK_SEPARATOR_CLASS).html('&nbsp;');
    },

    hide: function() {
        const that = this;
        const $parent = this._parentElement();
        const $element = this.element();

        if($element && this._isShown) {
            $element.css('display', 'none');
        }

        if($parent && !$parent.children('.' + BLOCK_SEPARATOR_CLASS).length) {
            $parent.prepend(that.element());
        }

        that.callBase();
    },

    isVisible: function() {
        const groupPanelOptions = this.option('groupPanel');
        const columnChooserOptions = this.option('columnChooser');

        return (groupPanelOptions && groupPanelOptions.visible) || (columnChooserOptions && columnChooserOptions.enabled);
    },

    show: function(targetLocation) {
        const that = this;
        const $element = this.element();
        const startAnimate = function(toOptions) {
            fx.stop($element, true);
            fx.animate($element, {
                type: 'slide',
                from: {
                    width: 0,
                    display: toOptions.display
                },
                to: toOptions,
                duration: 300,
                easing: 'swing'
            });
        };

        if($element && !that._isShown) {
            switch(targetLocation) {
                case 'group':
                    startAnimate({ width: '50px', display: 'inline-block' });
                    break;
                case 'columnChooser':
                    startAnimate({ width: '100%', display: 'block' });
                    break;
                default:
                    $element.css('display', '');
            }
        }

        that.callBase();
    }
});

const DraggingHeaderView = modules.View.inherit({
    _isDragging: false,

    isDragging: function() {
        return this._isDragging;
    },

    _getDraggingPanelByPos: function(pos) {
        const that = this;
        let result;

        each(that._dragOptions.draggingPanels, function(index, draggingPanel) {
            if(draggingPanel) {
                const boundingRect = draggingPanel.getBoundingRect();
                if(boundingRect && (boundingRect.bottom === undefined || pos.y < boundingRect.bottom) && (boundingRect.top === undefined || pos.y > boundingRect.top)
                    && (boundingRect.left === undefined || pos.x > boundingRect.left) && (boundingRect.right === undefined || pos.x < boundingRect.right)) {
                    result = draggingPanel;
                    return false;
                }
            }
        });

        return result;
    },

    _renderCore: function() {
        this.element()
            .addClass(this.addWidgetPrefix(DRAGGING_HEADER_CLASS) + ' ' + this.addWidgetPrefix(CELL_CONTENT_CLASS) + ' ' + WIDGET_CLASS)
            .hide();
    },

    _resetTargetColumnOptions: function() {
        const params = this._dropOptions;

        params.targetColumnIndex = -1;
        delete params.targetColumnElement;
        delete params.isLast;
        delete params.posX;
        delete params.posY;
    },

    _getVisibleIndexObject: function(rowIndex, visibleIndex) {
        if(isDefined(rowIndex)) {
            return {
                columnIndex: visibleIndex,
                rowIndex: rowIndex
            };
        }

        return visibleIndex;
    },

    dispose: function() {
        const element = this.element();

        this._dragOptions = null;
        element && element.parent().find('.' + this.addWidgetPrefix(DRAGGING_HEADER_CLASS)).remove();
    },

    isVisible: function() {
        const columnsController = this.getController('columns');
        const commonColumnSettings = columnsController.getCommonSettings();

        return this.option('showColumnHeaders') && (allowReordering(this) || commonColumnSettings.allowGrouping || commonColumnSettings.allowHiding);
    },

    init: function() {
        const that = this;

        this.callBase();
        this._controller = this.getController('draggingHeader');
        this._columnsResizerViewController = this.getController('columnsResizer');

        this.getController('data').loadingChanged.add(function(isLoading) {
            const element = that.element();

            if(!isLoading && element) {
                element.hide();
            }
        });
    },

    dragHeader: function(options) {
        const that = this;
        const columnElement = options.columnElement;
        const isCommandColumn = !!options.sourceColumn.type;

        that._isDragging = true;
        that._dragOptions = options;
        that._dropOptions = {
            sourceIndex: options.index,
            sourceColumnIndex: that._getVisibleIndexObject(options.rowIndex, options.columnIndex),
            sourceColumnElement: options.columnElement,
            sourceLocation: options.sourceLocation
        };

        const document = domAdapter.getDocument();
        that._onSelectStart = document['onselectstart'];

        document['onselectstart'] = function() {
            return false;
        };

        that._controller.drag(that._dropOptions);

        that.element().css({
            textAlign: columnElement && columnElement.css('textAlign'),
            height: columnElement && (isCommandColumn && columnElement.get(0).clientHeight || columnElement.height()),
            width: columnElement && (isCommandColumn && columnElement.get(0).clientWidth || columnElement.width()),
            whiteSpace: columnElement && columnElement.css('whiteSpace')
        })
            .addClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS))
            .toggleClass(DRAGGING_COMMAND_CELL_CLASS, isCommandColumn)
            .text(isCommandColumn ? '' : options.sourceColumn.caption);

        that.element().appendTo(swatchContainer.getSwatchContainer(columnElement));
    },

    moveHeader: function(args) {
        const e = args.event;
        const that = e.data.that;
        const eventData = getEventData(e);
        const isResizing = that._columnsResizerViewController ? that._columnsResizerViewController.isResizing() : false;
        const dragOptions = that._dragOptions;

        if(that._isDragging && !isResizing) {
            const $element = that.element();

            const moveDeltaX = Math.abs(eventData.x - dragOptions.columnElement.offset().left - dragOptions.deltaX);
            const moveDeltaY = Math.abs(eventData.y - dragOptions.columnElement.offset().top - dragOptions.deltaY);

            if($element.is(':visible') || moveDeltaX > DRAGGING_DELTA || moveDeltaY > DRAGGING_DELTA) {

                $element.show();

                const newLeft = eventData.x - dragOptions.deltaX;
                const newTop = eventData.y - dragOptions.deltaY;

                $element.css({ left: newLeft, top: newTop });
                that.dockHeader(eventData);
            }
            e.preventDefault();
        }
    },

    dockHeader: function(eventData) {
        const that = this;
        const targetDraggingPanel = that._getDraggingPanelByPos(eventData);
        const controller = that._controller;
        const params = that._dropOptions;
        const dragOptions = that._dragOptions;

        if(targetDraggingPanel) {
            const rtlEnabled = that.option('rtlEnabled');
            const isVerticalOrientation = targetDraggingPanel.getName() === 'columnChooser';
            const axisName = isVerticalOrientation ? 'y' : 'x';
            const targetLocation = targetDraggingPanel.getName();
            const rowIndex = targetLocation === 'headers' ? dragOptions.rowIndex : undefined;
            const sourceColumn = dragOptions.sourceColumn;
            const columnElements = targetDraggingPanel.getColumnElements(rowIndex, sourceColumn?.ownerBand) || [];
            const pointsByTarget = dragOptions.pointsByTarget = dragOptions.pointsByTarget || {};
            const pointsByColumns = targetLocation === 'columnChooser' ? [] : pointsByTarget[targetLocation] || controller._generatePointsByColumns(extend({}, dragOptions, {
                targetDraggingPanel: targetDraggingPanel,
                columns: targetDraggingPanel.getColumns(rowIndex),
                columnElements: columnElements,
                isVerticalOrientation: isVerticalOrientation,
                startColumnIndex: targetLocation === 'headers' && $(columnElements[0]).index()
            }));

            pointsByTarget[targetLocation] = pointsByColumns;

            ///#DEBUG
            this._testPointsByColumns = pointsByColumns;
            ///#ENDDEBUG

            params.targetLocation = targetLocation;
            if(pointsByColumns.length > 0) {
                for(let i = 0; i < pointsByColumns.length; i++) {
                    const centerPosition = pointsByColumns[i + 1] && (pointsByColumns[i][axisName] + pointsByColumns[i + 1][axisName]) / 2;
                    if(centerPosition === undefined || (rtlEnabled && axisName === 'x' ? eventData[axisName] > centerPosition : eventData[axisName] < centerPosition)) {
                        params.targetColumnIndex = that._getVisibleIndexObject(rowIndex, pointsByColumns[i].columnIndex);
                        if(columnElements[i]) {
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
    },

    dropHeader: function(args) {
        const e = args.event;
        const that = e.data.that;
        const controller = that._controller;

        that.element().hide();

        if(controller && that._isDragging) {
            controller.drop(that._dropOptions);
        }

        that.element().appendTo(that._parentElement());
        that._dragOptions = null;
        that._dropOptions = null;
        that._isDragging = false;
        domAdapter.getDocument()['onselectstart'] = that._onSelectStart || null;
    }
});

const isNextColumnResizingMode = function(that) {
    return that.option('columnResizingMode') !== 'widget';
};

const ColumnsResizerViewController = modules.ViewController.inherit({
    _isHeadersRowArea: function(posY) {
        if(this._columnHeadersView) {
            const element = this._columnHeadersView.element();

            if(element) {
                const offsetTop = element.offset().top;
                const headersRowHeight = this._columnHeadersView.getHeadersRowHeight();
                return posY >= offsetTop && posY <= offsetTop + headersRowHeight;
            }
        }
        return false;
    },

    _isRtlParentStyle: function() {
        return this.option('rtlEnabled') && this._$parentContainer?.parent().css('direction') === 'rtl';
    },

    _pointCreated: function(point, cellsLength, columns) {
        const isNextColumnMode = isNextColumnResizingMode(this);
        const rtlEnabled = this.option('rtlEnabled');
        const isRtlParentStyle = this._isRtlParentStyle();
        const firstPointColumnIndex = !isNextColumnMode && rtlEnabled && !isRtlParentStyle ? 0 : 1;

        if(point.index >= firstPointColumnIndex && point.index < cellsLength + (!isNextColumnMode && (!rtlEnabled || isRtlParentStyle) ? 1 : 0)) {
            point.columnIndex -= firstPointColumnIndex;
            const currentColumn = columns[point.columnIndex] || {};
            const nextColumn = columns[point.columnIndex + 1] || {};
            return !(isNextColumnMode ? currentColumn.allowResizing && nextColumn.allowResizing : currentColumn.allowResizing);
        }

        return true;
    },

    _getTargetPoint: function(pointsByColumns, currentX, deltaX) {
        if(pointsByColumns) {
            for(let i = 0; i < pointsByColumns.length; i++) {
                if(pointsByColumns[i].x === pointsByColumns[0].x && pointsByColumns[i + 1] && pointsByColumns[i].x === pointsByColumns[i + 1].x) {
                    continue;
                }
                if(pointsByColumns[i].x - deltaX <= currentX && currentX <= pointsByColumns[i].x + deltaX) {
                    return pointsByColumns[i];
                }
            }
        }
        return null;
    },

    _moveSeparator: function(args) {
        const e = args.event;
        const that = e.data;
        const columnsSeparatorWidth = that._columnsSeparatorView.width();
        const isNextColumnMode = isNextColumnResizingMode(that);
        const deltaX = columnsSeparatorWidth / 2;
        const parentOffset = that._$parentContainer.offset();
        const parentOffsetLeft = parentOffset.left;
        const eventData = getEventData(e);
        const rtlEnabled = that.option('rtlEnabled');
        const isRtlParentStyle = this._isRtlParentStyle();

        if(that._isResizing && that._resizingInfo) {
            if((parentOffsetLeft <= eventData.x || !isNextColumnMode && isRtlParentStyle) && (!isNextColumnMode || eventData.x <= parentOffsetLeft + that._$parentContainer.width())) {
                if(that._updateColumnsWidthIfNeeded(eventData.x)) {
                    const $cell = that._columnHeadersView.getColumnElements().eq(that._resizingInfo.currentColumnIndex);
                    const cell = $cell[0];
                    if(cell) {
                        const outerWidth = cell.getBoundingClientRect().width;
                        that._columnsSeparatorView.moveByX($cell.offset().left + ((isNextColumnMode || isRtlParentStyle) && rtlEnabled ? 0 : outerWidth));
                        that._tablePositionController.update(that._targetPoint.y);
                        e.preventDefault();
                    }
                }
            }
        } else {
            if(that._isHeadersRowArea(eventData.y)) {
                if(that._previousParentOffset) {
                    if(that._previousParentOffset.left !== parentOffset.left || that._previousParentOffset.top !== parentOffset.top) {
                        that.pointsByColumns(null);
                    }
                }

                that._targetPoint = that._getTargetPoint(that.pointsByColumns(), eventData.x, columnsSeparatorWidth);
                that._previousParentOffset = parentOffset;
                that._isReadyResizing = false;

                if(that._targetPoint) {
                    that._columnsSeparatorView.changeCursor('col-resize');
                    that._columnsSeparatorView.moveByX(that._targetPoint.x - deltaX);
                    that._tablePositionController.update(that._targetPoint.y);
                    that._isReadyResizing = true;
                    e.preventDefault();
                } else {
                    that._columnsSeparatorView.changeCursor();
                }
            } else {
                that.pointsByColumns(null);
                that._isReadyResizing = false;
                that._columnsSeparatorView.changeCursor();
            }
        }
    },

    _endResizing: function(args) {
        const e = args.event;
        const that = e.data;

        if(that._isResizing) {
            that.pointsByColumns(null);

            that._resizingInfo = null;

            that._columnsSeparatorView.hide();
            that._columnsSeparatorView.changeCursor();
            that._trackerView.hide();

            that._isReadyResizing = false;
            that._isResizing = false;
        }
    },

    _getNextColumnIndex: function(currentColumnIndex) {
        return currentColumnIndex + 1;
    },

    _setupResizingInfo: function(posX) {
        const that = this;
        const currentColumnIndex = that._targetPoint.columnIndex;
        const nextColumnIndex = that._getNextColumnIndex(currentColumnIndex);
        const currentHeader = that._columnHeadersView.getHeaderElement(currentColumnIndex);
        const nextHeader = that._columnHeadersView.getHeaderElement(nextColumnIndex);

        that._resizingInfo = {
            startPosX: posX,
            currentColumnIndex: currentColumnIndex,
            currentColumnWidth: currentHeader && currentHeader.length > 0 ? getBoundingRect(currentHeader[0]).width : 0,
            nextColumnIndex: nextColumnIndex,
            nextColumnWidth: nextHeader && nextHeader.length > 0 ? getBoundingRect(nextHeader[0]).width : 0
        };
    },

    _startResizing: function(args) {
        const e = args.event;
        const that = e.data;
        const eventData = getEventData(e);

        if(isTouchEvent(e)) {
            if(that._isHeadersRowArea(eventData.y)) {
                that._targetPoint = that._getTargetPoint(that.pointsByColumns(), eventData.x, COLUMNS_SEPARATOR_TOUCH_TRACKER_WIDTH);
                if(that._targetPoint) {
                    that._columnsSeparatorView.moveByX(that._targetPoint.x - that._columnsSeparatorView.width() / 2);
                    that._isReadyResizing = true;
                }
            } else {
                that._isReadyResizing = false;
            }
        }

        if(that._isReadyResizing) {
            ///#DEBUG
            if(that._targetPoint) {
                that._testColumnIndex = that._targetPoint.columnIndex;
            }
            ///#ENDDEBUG

            that._setupResizingInfo(eventData.x);

            that._isResizing = true;

            that._tablePositionController.update(that._targetPoint.y);
            that._columnsSeparatorView.show();
            that._trackerView.show();
            const scrollable = that.component.getScrollable();

            if(scrollable && that._isRtlParentStyle()) {
                that._scrollRight = scrollable.$content().width() - scrollable._container().width() - scrollable.scrollLeft();
            }

            e.preventDefault();
            e.stopPropagation();
        }

        if(this.isResizing()) {
            this.getController('editorFactory').loseFocus();
        }
    },

    _generatePointsByColumns: function() {
        const that = this;
        const columns = that._columnsController ? that._columnsController.getVisibleColumns() : [];
        const cells = that._columnHeadersView.getColumnElements();
        let pointsByColumns = [];

        if(cells && cells.length > 0) {
            pointsByColumns = gridCoreUtils.getPointsByColumns(cells, function(point) {
                return that._pointCreated(point, cells.length, columns);
            });
        }

        that._pointsByColumns = pointsByColumns;
    },

    _unsubscribeFromEvents: function() {
        this._moveSeparatorHandler && eventsEngine.off(domAdapter.getDocument(), addNamespace(pointerEvents.move, MODULE_NAMESPACE), this._moveSeparatorHandler);
        this._startResizingHandler && eventsEngine.off(this._$parentContainer, addNamespace(pointerEvents.down, MODULE_NAMESPACE), this._startResizingHandler);
        if(this._endResizingHandler) {
            eventsEngine.off(this._columnsSeparatorView.element(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this._endResizingHandler);
            eventsEngine.off(domAdapter.getDocument(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this._endResizingHandler);
        }
    },

    _subscribeToEvents: function() {
        this._moveSeparatorHandler = this.createAction(this._moveSeparator);
        this._startResizingHandler = this.createAction(this._startResizing);
        this._endResizingHandler = this.createAction(this._endResizing);

        eventsEngine.on(domAdapter.getDocument(), addNamespace(pointerEvents.move, MODULE_NAMESPACE), this, this._moveSeparatorHandler);
        eventsEngine.on(this._$parentContainer, addNamespace(pointerEvents.down, MODULE_NAMESPACE), this, this._startResizingHandler);
        eventsEngine.on(this._columnsSeparatorView.element(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this, this._endResizingHandler);
        eventsEngine.on(domAdapter.getDocument(), addNamespace(pointerEvents.up, MODULE_NAMESPACE), this, this._endResizingHandler);
    },

    _updateColumnsWidthIfNeeded: function(posX) {
        let deltaX;
        let needUpdate = false;
        let nextCellWidth;
        const resizingInfo = this._resizingInfo;
        const columnsController = this._columnsController;
        const visibleColumns = columnsController.getVisibleColumns();
        const columnsSeparatorWidth = this._columnsSeparatorView.width();
        let contentWidth = this._rowsView.contentWidth();
        const isNextColumnMode = isNextColumnResizingMode(this);
        const adaptColumnWidthByRatio = isNextColumnMode && this.option('adaptColumnWidthByRatio') && !this.option('columnAutoWidth');
        let minWidth;
        let nextColumn;
        let cellWidth;
        const rtlEnabled = this.option('rtlEnabled');
        const isRtlParentStyle = this._isRtlParentStyle();

        function isPercentWidth(width) {
            return isString(width) && width.slice(-1) === '%';
        }

        function setColumnWidth(column, columnWidth, contentWidth, adaptColumnWidthByRatio) {
            if(column) {
                const oldColumnWidth = column.width;
                if(oldColumnWidth) {
                    adaptColumnWidthByRatio = isPercentWidth(oldColumnWidth);
                }

                if(adaptColumnWidthByRatio) {
                    columnsController.columnOption(column.index, 'visibleWidth', columnWidth);
                    columnsController.columnOption(column.index, 'width', (columnWidth / contentWidth * 100).toFixed(3) + '%');
                } else {
                    columnsController.columnOption(column.index, 'visibleWidth', null);
                    columnsController.columnOption(column.index, 'width', columnWidth);
                }
            }
        }

        function correctContentWidth(contentWidth, visibleColumns) {
            const allColumnsHaveWidth = visibleColumns.every(column => column.width);

            if(allColumnsHaveWidth) {
                const totalPercent = visibleColumns.reduce((sum, column) => {
                    if(isPercentWidth(column.width)) {
                        sum += parseFloat(column.width);
                    }
                    return sum;
                }, 0);

                if(totalPercent > 100) {
                    contentWidth = contentWidth / totalPercent * 100;
                }
            }

            return contentWidth;
        }

        deltaX = posX - resizingInfo.startPosX;
        if((isNextColumnMode || isRtlParentStyle) && rtlEnabled) {
            deltaX = -deltaX;
        }
        cellWidth = resizingInfo.currentColumnWidth + deltaX;
        const column = visibleColumns[resizingInfo.currentColumnIndex];
        minWidth = column && column.minWidth || columnsSeparatorWidth;
        needUpdate = cellWidth >= minWidth;

        if(isNextColumnMode) {
            nextCellWidth = resizingInfo.nextColumnWidth - deltaX;
            nextColumn = visibleColumns[resizingInfo.nextColumnIndex];
            minWidth = nextColumn && nextColumn.minWidth || columnsSeparatorWidth;
            needUpdate = needUpdate && nextCellWidth >= minWidth;
        }

        if(needUpdate) {
            columnsController.beginUpdate();

            cellWidth = Math.floor(cellWidth);

            contentWidth = correctContentWidth(contentWidth, visibleColumns);

            setColumnWidth(column, cellWidth, contentWidth, adaptColumnWidthByRatio);

            if(isNextColumnMode) {
                nextCellWidth = Math.floor(nextCellWidth);
                setColumnWidth(nextColumn, nextCellWidth, contentWidth, adaptColumnWidthByRatio);
            } else {
                const columnWidths = this._columnHeadersView.getColumnWidths();
                columnWidths[resizingInfo.currentColumnIndex] = cellWidth;
                const hasScroll = columnWidths.reduce((totalWidth, width) => totalWidth + width, 0) > this._rowsView.contentWidth();
                if(!hasScroll) {
                    const lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns);
                    if(lastColumnIndex >= 0) {
                        columnsController.columnOption(visibleColumns[lastColumnIndex].index, 'visibleWidth', 'auto');
                    }
                }
                for(let i = 0; i < columnWidths.length; i++) {
                    if(visibleColumns[i] && visibleColumns[i] !== column && visibleColumns[i].width === undefined) {
                        columnsController.columnOption(visibleColumns[i].index, 'width', columnWidths[i]);
                    }
                }
            }

            columnsController.endUpdate();
            if(!isNextColumnMode) {
                this.component.updateDimensions();

                const scrollable = this.component.getScrollable();
                if(scrollable && isRtlParentStyle) {
                    const left = scrollable.$content().width() - scrollable._container().width() - this._scrollRight;
                    scrollable.scrollTo({ left: left });
                }
            }
        }

        return needUpdate;
    },

    _subscribeToCallback: function(callback, handler) {
        callback.add(handler);
        this._subscribesToCallbacks.push({
            callback: callback,
            handler: handler
        });
    },

    _unsubscribeFromCallbacks: function() {

        for(let i = 0; i < this._subscribesToCallbacks.length; i++) {
            const subscribe = this._subscribesToCallbacks[i];
            subscribe.callback.remove(subscribe.handler);
        }

        this._subscribesToCallbacks = [];
    },

    _unsubscribes: function() {
        this._unsubscribeFromEvents();
        this._unsubscribeFromCallbacks();
    },

    _init: function() {
        const that = this;
        const generatePointsByColumnsHandler = function() {
            if(!that._isResizing) {
                that.pointsByColumns(null);
            }
        };
        const generatePointsByColumnsScrollHandler = function(offset) {
            if(that._scrollLeft !== offset.left) {
                that._scrollLeft = offset.left;
                that.pointsByColumns(null);
            }
        };

        that._columnsSeparatorView = that.getView('columnsSeparatorView');
        that._columnHeadersView = that.getView('columnHeadersView');
        that._trackerView = that.getView('trackerView');
        that._rowsView = that.getView('rowsView');
        that._columnsController = that.getController('columns');
        that._tablePositionController = that.getController('tablePosition');
        that._$parentContainer = that.component.$element();

        that._subscribeToCallback(that._columnHeadersView.renderCompleted, generatePointsByColumnsHandler);
        that._subscribeToCallback(that._columnHeadersView.resizeCompleted, generatePointsByColumnsHandler);
        that._subscribeToCallback(that._columnsSeparatorView.renderCompleted, function() {
            that._unsubscribeFromEvents();
            that._subscribeToEvents();
        });
        that._subscribeToCallback(that._rowsView.renderCompleted, function() {
            that._rowsView.scrollChanged.remove(generatePointsByColumnsScrollHandler);
            that._rowsView.scrollChanged.add(generatePointsByColumnsScrollHandler);
        });

        let previousScrollbarVisibility = that._rowsView.getScrollbarWidth() !== 0;
        let previousTableHeight = 0;

        that._subscribeToCallback(that.getController('tablePosition').positionChanged, function(e) {
            if(that._isResizing && !that._rowsView.isResizing) {
                const scrollbarVisibility = that._rowsView.getScrollbarWidth() !== 0;
                if(previousScrollbarVisibility !== scrollbarVisibility || (previousTableHeight && previousTableHeight !== e.height)) {
                    previousScrollbarVisibility = scrollbarVisibility;
                    previousTableHeight = e.height;

                    that.component.updateDimensions();
                } else {
                    that._rowsView.updateFreeSpaceRowHeight();
                }
            }
            previousTableHeight = e.height;
        });
    },

    optionChanged: function(args) {
        this.callBase(args);

        if(args.name === 'allowColumnResizing') {
            if(args.value) {
                this._init();
                this._subscribeToEvents();
            } else {
                this._unsubscribes();
            }
        }
    },

    isResizing: function() {
        return this._isResizing;
    },

    init: function() {
        this._subscribesToCallbacks = [];
        if(allowResizing(this)) {
            this._init();
        }
    },

    pointsByColumns: function(value) {
        if(value !== undefined) {
            this._pointsByColumns = value;
        } else {
            if(!this._pointsByColumns) {
                this._generatePointsByColumns();
            }
            return this._pointsByColumns;
        }
    },

    dispose: function() {
        this._unsubscribes();
        this.callBase();
    }
});

const TablePositionViewController = modules.ViewController.inherit({
    update: function(top) {
        const that = this;
        const params = {};
        const $element = that._columnHeadersView.element();
        const offset = $element && $element.offset();
        const offsetTop = offset && offset.top || 0;
        const diffOffsetTop = isDefined(top) ? Math.abs(top - offsetTop) : 0;
        const columnsHeadersHeight = that._columnHeadersView ? that._columnHeadersView.getHeight() : 0;
        const scrollBarWidth = that._rowsView.getScrollbarWidth(true);
        const rowsHeight = that._rowsView ? that._rowsView.height() - scrollBarWidth : 0;
        const columnsResizerController = that.component.getController('columnsResizer');
        const draggingHeaderView = that.component.getView('draggingHeaderView');

        params.height = columnsHeadersHeight;

        const isDraggingOrResizing = columnsResizerController.isResizing() !== false || draggingHeaderView.isDragging();

        if(isDraggingOrResizing) {
            params.height += rowsHeight - diffOffsetTop;
        }

        if(top !== null && $element && $element.length) {
            params.top = $element[0].offsetTop + diffOffsetTop;
        }

        that.positionChanged.fire(params);
    },

    init: function() {
        const that = this;

        that.callBase();

        that._columnHeadersView = this.getView('columnHeadersView');
        that._rowsView = this.getView('rowsView');
        that._pagerView = this.getView('pagerView');

        that._rowsView.resizeCompleted.add(function() {
            if(that.option('allowColumnResizing')) {
                const targetPoint = that.getController('columnsResizer')._targetPoint;

                that.update(targetPoint ? targetPoint.y : null);
            }
        });
    },

    ctor: function(component) {
        this.callBase(component);
        this.positionChanged = Callbacks();
    }
});

const DraggingHeaderViewController = modules.ViewController.inherit({
    _generatePointsByColumns: function(options) {
        const that = this;

        return gridCoreUtils.getPointsByColumns(options.columnElements, function(point) {
            return that._pointCreated(point, options.columns, options.targetDraggingPanel.getName(), options.sourceColumn);
        }, options.isVerticalOrientation, options.startColumnIndex);
    },

    _pointCreated: function(point, columns, location, sourceColumn) {
        const targetColumn = columns[point.columnIndex];
        const prevColumn = columns[point.columnIndex - 1];

        switch(location) {
            case 'columnChooser':
                return true;
            case 'headers':
                return (sourceColumn && !sourceColumn.allowReordering) || (!targetColumn || !targetColumn.allowReordering) && (!prevColumn || !prevColumn.allowReordering);
            default:
                return columns.length === 0;
        }
    },

    _subscribeToEvents: function(draggingHeader, draggingPanels) {
        const that = this;

        each(draggingPanels, function(_, draggingPanel) {
            if(draggingPanel) {
                let columns;
                const rowCount = draggingPanel.getRowCount ? draggingPanel.getRowCount() : 1;
                const nameDraggingPanel = draggingPanel.getName();
                const subscribeToEvents = function(index, columnElement) {
                    if(!columnElement) {
                        return;
                    }

                    const $columnElement = $(columnElement);
                    const column = columns[index];

                    if(draggingPanel.allowDragging(column, nameDraggingPanel, draggingPanels)) {
                        $columnElement.addClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
                        eventsEngine.on($columnElement, addNamespace(dragEventStart, MODULE_NAMESPACE), that.createAction(function(args) {
                            const e = args.event;
                            const eventData = getEventData(e);

                            draggingHeader.dragHeader({
                                deltaX: eventData.x - $(e.currentTarget).offset().left,
                                deltaY: eventData.y - $(e.currentTarget).offset().top,
                                sourceColumn: column,
                                index: column.index,
                                columnIndex: index,
                                columnElement: $columnElement,
                                sourceLocation: nameDraggingPanel,
                                draggingPanels: draggingPanels,
                                rowIndex: that._columnsController.getRowIndex(column.index, true)
                            });
                        }));
                        eventsEngine.on($columnElement, addNamespace(dragEventMove, MODULE_NAMESPACE), { that: draggingHeader }, that.createAction(draggingHeader.moveHeader));
                        eventsEngine.on($columnElement, addNamespace(dragEventEnd, MODULE_NAMESPACE), { that: draggingHeader }, that.createAction(draggingHeader.dropHeader));
                    }
                };

                for(let i = 0; i < rowCount; i++) {
                    const columnElements = draggingPanel.getColumnElements(i) || [];
                    if(columnElements.length) {
                        columns = draggingPanel.getColumns(i) || [];
                        each(columnElements, subscribeToEvents);
                    }
                }
            }
        });
    },

    _unsubscribeFromEvents: function(draggingHeader, draggingPanels) {
        const that = this;

        each(draggingPanels, function(_, draggingPanel) {
            if(draggingPanel) {
                const columnElements = draggingPanel.getColumnElements() || [];

                each(columnElements, function(index, columnElement) {
                    const $columnElement = $(columnElement);
                    eventsEngine.off($columnElement, addNamespace(dragEventStart, MODULE_NAMESPACE));
                    eventsEngine.off($columnElement, addNamespace(dragEventMove, MODULE_NAMESPACE));
                    eventsEngine.off($columnElement, addNamespace(dragEventEnd, MODULE_NAMESPACE));
                    $columnElement.removeClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
                });
            }
        });
    },

    _getSeparator: function(targetLocation) {
        return targetLocation === 'headers' ? this._columnsSeparatorView : this._blockSeparatorView;
    },

    hideSeparators: function(type) {
        const blockSeparator = this._blockSeparatorView;
        const columnsSeparator = this._columnsSeparatorView;

        this._animationColumnIndex = null;
        blockSeparator && blockSeparator.hide();
        type !== 'block' && columnsSeparator && columnsSeparator.hide();
    },

    init: function() {
        const that = this;

        that.callBase();
        that._columnsController = that.getController('columns');

        that._columnHeadersView = that.getView('columnHeadersView');
        that._columnsSeparatorView = that.getView('columnsSeparatorView');
        that._draggingHeaderView = that.getView('draggingHeaderView');
        that._rowsView = that.getView('rowsView');
        that._blockSeparatorView = that.getView('blockSeparatorView');
        that._headerPanelView = that.getView('headerPanel');
        that._columnChooserView = that.getView('columnChooserView');

        const subscribeToEvents = function() {
            if(that._draggingHeaderView) {
                const draggingPanels = [that._columnChooserView, that._columnHeadersView, that._headerPanelView];

                that._unsubscribeFromEvents(that._draggingHeaderView, draggingPanels);
                that._subscribeToEvents(that._draggingHeaderView, draggingPanels);
            }
        };

        that._columnHeadersView.renderCompleted.add(subscribeToEvents);
        that._headerPanelView && that._headerPanelView.renderCompleted.add(subscribeToEvents);
        that._columnChooserView && that._columnChooserView.renderCompleted.add(subscribeToEvents);
    },

    allowDrop: function(parameters) {
        return this._columnsController.allowMoveColumn(parameters.sourceColumnIndex, parameters.targetColumnIndex, parameters.sourceLocation, parameters.targetLocation);
    },

    drag: function(parameters) {
        const sourceIndex = parameters.sourceIndex;
        const sourceLocation = parameters.sourceLocation;
        const sourceColumnElement = parameters.sourceColumnElement;
        const headersView = this._columnHeadersView;
        const rowsView = this._rowsView;

        if(sourceColumnElement) {
            sourceColumnElement.css({ opacity: COLUMN_OPACITY });

            if(sourceLocation === 'headers') {
                headersView && headersView.setRowsOpacity(sourceIndex, COLUMN_OPACITY);
                rowsView && rowsView.setRowsOpacity(sourceIndex, COLUMN_OPACITY);
            }
        }
    },

    dock: function(parameters) {
        const that = this;
        const targetColumnIndex = isObject(parameters.targetColumnIndex) ? parameters.targetColumnIndex.columnIndex : parameters.targetColumnIndex;
        const sourceLocation = parameters.sourceLocation;
        const targetLocation = parameters.targetLocation;
        const separator = that._getSeparator(targetLocation);
        const hasTargetVisibleIndex = targetColumnIndex >= 0;

        const showSeparator = function() {
            if(that._animationColumnIndex !== targetColumnIndex) {
                that.hideSeparators();
                separator.element()[parameters.isLast ? 'insertAfter' : 'insertBefore'](parameters.targetColumnElement);

                that._animationColumnIndex = targetColumnIndex;
                separator.show(targetLocation);
            }
        };

        that._columnHeadersView.element().find('.' + HEADER_ROW_CLASS).toggleClass(that.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS), sourceLocation !== 'headers' && targetLocation === 'headers' && !hasTargetVisibleIndex);

        if(separator) {
            if(that.allowDrop(parameters) && hasTargetVisibleIndex) {
                if(targetLocation === 'group' || targetLocation === 'columnChooser') {
                    showSeparator();
                } else {
                    that.hideSeparators('block');
                    that.getController('tablePosition').update(parameters.posY);
                    separator.moveByX(parameters.posX - separator.width());
                    separator.show();
                }
            } else {
                that.hideSeparators();
            }
        }
    },

    drop: function(parameters) {
        const sourceColumnElement = parameters.sourceColumnElement;

        if(sourceColumnElement) {
            sourceColumnElement.css({ opacity: '' });
            this._columnHeadersView.setRowsOpacity(parameters.sourceIndex, '');
            this._rowsView.setRowsOpacity(parameters.sourceIndex, '');
            this._columnHeadersView.element().find('.' + HEADER_ROW_CLASS).removeClass(this.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS));
        }

        if(this.allowDrop(parameters)) {
            const separator = this._getSeparator(parameters.targetLocation);
            if(separator) {
                separator.hide();
            }

            this._columnsController.moveColumn(parameters.sourceColumnIndex, parameters.targetColumnIndex, parameters.sourceLocation, parameters.targetLocation);
        }
    },

    dispose: function() {
        if(this._draggingHeaderView) {
            this._unsubscribeFromEvents(this._draggingHeaderView, [this._columnChooserView, this._columnHeadersView, this._headerPanelView]);
        }
    }
});

export const columnsResizingReorderingModule = {
    views: {
        columnsSeparatorView: ColumnsSeparatorView,
        blockSeparatorView: BlockSeparatorView,
        draggingHeaderView: DraggingHeaderView,
        trackerView: TrackerView
    },
    controllers: {
        draggingHeader: DraggingHeaderViewController,
        tablePosition: TablePositionViewController,
        columnsResizer: ColumnsResizerViewController
    },
    extenders: {
        views: {
            rowsView: {
                _needUpdateRowHeight: function(itemCount) {
                    const wordWrapEnabled = this.option('wordWrapEnabled');
                    const columnsResizerController = this.getController('columnsResizer');
                    const isResizing = columnsResizerController.isResizing();

                    return this.callBase.apply(this, arguments) || itemCount > 0 && wordWrapEnabled && isResizing;
                }
            }
        },
        controllers: {
            editorFactory: {
                renderFocusOverlay: function() {
                    if(this.getController('columnsResizer').isResizing()) {
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                }
            }
        }
    }
};

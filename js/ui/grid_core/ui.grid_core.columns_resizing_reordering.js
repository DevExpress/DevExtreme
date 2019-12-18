import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import Callbacks from '../../core/utils/callbacks';
import typeUtils from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { addNamespace, eventData as getEventData, isTouchEvent } from '../../events/utils';
import pointerEvents from '../../events/pointer';
import dragEvents from '../../events/drag';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import fx from '../../animation/fx';
import { getSwatchContainer } from '../widget/swatch_container';

var COLUMNS_SEPARATOR_CLASS = 'columns-separator',
    COLUMNS_SEPARATOR_TRANSPARENT = 'columns-separator-transparent',
    DRAGGING_HEADER_CLASS = 'drag-header',
    CELL_CONTENT_CLASS = 'text-content',
    HEADERS_DRAG_ACTION_CLASS = 'drag-action',
    TRACKER_CLASS = 'tracker',
    HEADERS_DROP_HIGHLIGHT_CLASS = 'drop-highlight',
    BLOCK_SEPARATOR_CLASS = 'dx-block-separator',
    HEADER_ROW_CLASS = 'dx-header-row',
    WIDGET_CLASS = 'dx-widget',
    DRAGGING_COMMAND_CELL_CLASS = 'dx-drag-command-cell',

    MODULE_NAMESPACE = 'dxDataGridResizingReordering',

    COLUMNS_SEPARATOR_TOUCH_TRACKER_WIDTH = 10,
    DRAGGING_DELTA = 5,
    COLUMN_OPACITY = 0.5;

var allowResizing = function(that) {
    return that.option('allowColumnResizing') || that.getController('columns').isColumnOptionUsed('allowResizing');
};

var allowReordering = function(that) {
    return that.option('allowColumnReordering') || that.getController('columns').isColumnOptionUsed('allowReordering');
};

var TrackerView = modules.View.inherit({
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
        var that = this;

        that._positionChanged = function(position) {
            var $element = that.element();
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

var SeparatorView = modules.View.inherit({
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
        var $element = this.element();
        if($element) {
            if(typeUtils.isDefined(value)) {
                $element.height(value);
            } else {
                return $element.height();
            }
        }
    },

    width: function(value) {
        var $element = this.element();
        if($element) {
            if(typeUtils.isDefined(value)) {
                $element.width(value);
            } else {
                return $element.width();
            }
        }
    }
});

var ColumnsSeparatorView = SeparatorView.inherit({
    _renderSeparator: function() {
        this.callBase();

        var $element = this.element();
        $element.addClass(this.addWidgetPrefix(COLUMNS_SEPARATOR_CLASS));
    },

    _subscribeToCallback: function() {
        var that = this,
            $element;

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
        var that = this,
            $element = this.element();

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
        var $element = this.element(),
            columnsSeparatorTransparent = this.addWidgetPrefix(COLUMNS_SEPARATOR_TRANSPARENT);

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
        var $element = this.element();
        if($element) {
            $element.css('left', outerX - this._parentElement().offset().left);
            ///#DEBUG
            this._testPosX = outerX;
            ///#ENDDEBUG
        }
    },

    changeCursor: function(cursorName) {
        cursorName = typeUtils.isDefined(cursorName) ? cursorName : '';
        var $element = this.element();
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

var BlockSeparatorView = SeparatorView.inherit({
    init: function() {
        var that = this;

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
        var that = this,
            $parent = this._parentElement(),
            $element = this.element();

        if($element && this._isShown) {
            $element.css('display', 'none');
        }

        if($parent && !$parent.children('.' + BLOCK_SEPARATOR_CLASS).length) {
            $parent.prepend(that.element());
        }

        that.callBase();
    },

    isVisible: function() {
        var groupPanelOptions = this.option('groupPanel'),
            columnChooserOptions = this.option('columnChooser');

        return (groupPanelOptions && groupPanelOptions.visible) || (columnChooserOptions && columnChooserOptions.enabled);
    },

    show: function(targetLocation) {
        var that = this,
            $element = this.element(),
            startAnimate = function(toOptions) {
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

var DraggingHeaderView = modules.View.inherit({
    _isDragging: false,

    _getDraggingPanelByPos: function(pos) {
        var that = this,
            result;

        each(that._dragOptions.draggingPanels, function(index, draggingPanel) {
            if(draggingPanel) {
                var boundingRect = draggingPanel.getBoundingRect();
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
        var params = this._dropOptions;

        params.targetColumnIndex = -1;
        delete params.targetColumnElement;
        delete params.isLast;
        delete params.posX;
        delete params.posY;
    },

    _getVisibleIndexObject: function(rowIndex, visibleIndex) {
        if(typeUtils.isDefined(rowIndex)) {
            return {
                columnIndex: visibleIndex,
                rowIndex: rowIndex
            };
        }

        return visibleIndex;
    },

    dispose: function() {
        var element = this.element();

        this._dragOptions = null;
        element && element.parent().find('.' + this.addWidgetPrefix(DRAGGING_HEADER_CLASS)).remove();
    },

    isVisible: function() {
        var columnsController = this.getController('columns'),
            commonColumnSettings = columnsController.getCommonSettings();

        return this.option('showColumnHeaders') && (allowReordering(this) || commonColumnSettings.allowGrouping || commonColumnSettings.allowHiding);
    },

    init: function() {
        var that = this;

        this.callBase();
        this._controller = this.getController('draggingHeader');
        this._columnsResizerViewController = this.getController('columnsResizer');

        this.getController('data').loadingChanged.add(function(isLoading) {
            var element = that.element();

            if(!isLoading && element) {
                element.hide();
            }
        });
    },

    dragHeader: function(options) {
        var that = this,
            columnElement = options.columnElement,
            isCommandColumn = !!options.sourceColumn.type;

        that._isDragging = true;
        that._dragOptions = options;
        that._dropOptions = {
            sourceIndex: options.index,
            sourceColumnIndex: that._getVisibleIndexObject(options.rowIndex, options.columnIndex),
            sourceColumnElement: options.columnElement,
            sourceLocation: options.sourceLocation
        };

        var document = domAdapter.getDocument();
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

        that.element().appendTo(getSwatchContainer(columnElement));
    },

    moveHeader: function(args) {
        var e = args.event,
            that = e.data.that,
            newLeft,
            newTop,
            moveDeltaX,
            moveDeltaY,
            eventData = getEventData(e),
            isResizing = that._columnsResizerViewController ? that._columnsResizerViewController.isResizing() : false,
            dragOptions = that._dragOptions;

        if(that._isDragging && !isResizing) {
            var $element = that.element();

            moveDeltaX = Math.abs(eventData.x - dragOptions.columnElement.offset().left - dragOptions.deltaX);
            moveDeltaY = Math.abs(eventData.y - dragOptions.columnElement.offset().top - dragOptions.deltaY);

            if($element.is(':visible') || moveDeltaX > DRAGGING_DELTA || moveDeltaY > DRAGGING_DELTA) {

                $element.show();

                newLeft = eventData.x - dragOptions.deltaX;
                newTop = eventData.y - dragOptions.deltaY;

                $element.css({ left: newLeft, top: newTop });
                that.dockHeader(eventData);
            }
            e.preventDefault();
        }
    },

    dockHeader: function(eventData) {
        var that = this,
            targetDraggingPanel = that._getDraggingPanelByPos(eventData),
            controller = that._controller,
            i,
            params = that._dropOptions,
            dragOptions = that._dragOptions,
            centerPosition;

        if(targetDraggingPanel) {
            var rtlEnabled = that.option('rtlEnabled'),
                isVerticalOrientation = targetDraggingPanel.getName() === 'columnChooser',
                axisName = isVerticalOrientation ? 'y' : 'x',
                targetLocation = targetDraggingPanel.getName(),
                rowIndex = targetLocation === 'headers' ? dragOptions.rowIndex : undefined,
                sourceColumn = dragOptions.sourceColumn,
                columnElements = targetDraggingPanel.getColumnElements(rowIndex, sourceColumn && sourceColumn.ownerBand) || [],
                pointsByTarget = dragOptions.pointsByTarget = dragOptions.pointsByTarget || {},
                pointsByColumns = targetLocation === 'columnChooser' ? [] : pointsByTarget[targetLocation] || controller._generatePointsByColumns(extend({}, dragOptions, {
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
                for(i = 0; i < pointsByColumns.length; i++) {
                    centerPosition = pointsByColumns[i + 1] && (pointsByColumns[i][axisName] + pointsByColumns[i + 1][axisName]) / 2;
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
        var e = args.event,
            that = e.data.that,
            controller = that._controller;

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

var isNextColumnResizingMode = function(that) {
    return that.option('columnResizingMode') !== 'widget';
};

var ColumnsResizerViewController = modules.ViewController.inherit({
    _isHeadersRowArea: function(posY) {
        if(this._columnHeadersView) {
            var element = this._columnHeadersView.element(),
                headersRowHeight,
                offsetTop;

            if(element) {
                offsetTop = element.offset().top;
                headersRowHeight = this._columnHeadersView.getHeadersRowHeight();
                return posY >= offsetTop && posY <= offsetTop + headersRowHeight;
            }
        }
        return false;
    },

    _pointCreated: function(point, cellsLength, columns) {
        var currentColumn,
            isNextColumnMode = isNextColumnResizingMode(this),
            rtlEnabled = this.option('rtlEnabled'),
            firstPointColumnIndex = !isNextColumnMode && rtlEnabled ? 0 : 1,
            nextColumn;

        if(point.index >= firstPointColumnIndex && point.index < cellsLength + (!isNextColumnMode && !rtlEnabled ? 1 : 0)) {
            point.columnIndex -= firstPointColumnIndex;
            currentColumn = columns[point.columnIndex] || {};
            nextColumn = columns[point.columnIndex + 1] || {};
            return !(isNextColumnMode ? currentColumn.allowResizing && nextColumn.allowResizing : currentColumn.allowResizing);
        }

        return true;
    },

    _getTargetPoint: function(pointsByColumns, currentX, deltaX) {
        if(pointsByColumns) {
            for(var i = 0; i < pointsByColumns.length; i++) {
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
        var e = args.event,
            that = e.data,
            columnsSeparatorWidth = that._columnsSeparatorView.width(),
            isNextColumnMode = isNextColumnResizingMode(that),
            deltaX = columnsSeparatorWidth / 2,
            parentOffset = that._$parentContainer.offset(),
            parentOffsetLeft = parentOffset.left,
            eventData = getEventData(e);

        if(that._isResizing && that._resizingInfo) {
            if(parentOffsetLeft <= eventData.x && (!isNextColumnMode || eventData.x <= parentOffsetLeft + that._$parentContainer.width())) {
                if(that._updateColumnsWidthIfNeeded(eventData.x)) {
                    var $cell = that._columnHeadersView.getColumnElements().eq(that._resizingInfo.currentColumnIndex);
                    that._columnsSeparatorView.moveByX($cell.offset().left + (isNextColumnMode && that.option('rtlEnabled') ? 0 : $cell.outerWidth()));
                    that._tablePositionController.update(that._targetPoint.y);
                    e.preventDefault();
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
        var e = args.event,
            that = e.data;

        if(that._isResizing) {
            that.pointsByColumns(null);

            that._resizingInfo = null;

            that._columnsSeparatorView.hide();
            that._columnsSeparatorView.changeCursor();
            that._trackerView.hide();

            if(!isNextColumnResizingMode(that)) {
                var pageIndex = that.component.pageIndex();
                that.component.updateDimensions();

                if(that.option('wordWrapEnabled') && that.option('scrolling.mode') === 'virtual') {
                    that.component.refresh().done(function() {
                        that._rowsView.scrollToPage(pageIndex);
                    });
                }
            }

            that._isReadyResizing = false;
            that._isResizing = false;
        }
    },

    _getNextColumnIndex: function(currentColumnIndex) {
        return currentColumnIndex + 1;
    },

    _setupResizingInfo: function(posX) {
        var that = this,
            currentColumnIndex = that._targetPoint.columnIndex,
            nextColumnIndex = that._getNextColumnIndex(currentColumnIndex),
            currentHeader = that._columnHeadersView.getHeaderElement(currentColumnIndex),
            nextHeader = that._columnHeadersView.getHeaderElement(nextColumnIndex);

        that._resizingInfo = {
            startPosX: posX,
            currentColumnIndex: currentColumnIndex,
            currentColumnWidth: currentHeader && currentHeader.length > 0 ? currentHeader[0].getBoundingClientRect().width : 0,
            nextColumnIndex: nextColumnIndex,
            nextColumnWidth: nextHeader && nextHeader.length > 0 ? nextHeader[0].getBoundingClientRect().width : 0
        };
    },

    _startResizing: function(args) {
        var e = args.event,
            that = e.data,
            eventData = getEventData(e),
            editingController = that.getController('editing'),
            editingMode = that.option('editing.mode'),
            isCellEditing = editingController.isEditing() && (editingMode === 'batch' || editingMode === 'cell');

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

        if(that._isReadyResizing && !isCellEditing) {
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
            e.preventDefault();
            e.stopPropagation();
        }
    },

    _generatePointsByColumns: function() {
        var that = this,
            columns = that._columnsController ? that._columnsController.getVisibleColumns() : [],
            cells = that._columnHeadersView.getColumnElements(),
            pointsByColumns = [];

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
        var deltaX,
            needUpdate = false,
            nextCellWidth,
            resizingInfo = this._resizingInfo,
            columnsController = this._columnsController,
            visibleColumns = columnsController.getVisibleColumns(),
            columnsSeparatorWidth = this._columnsSeparatorView.width(),
            contentWidth = this._rowsView.contentWidth(),
            isNextColumnMode = isNextColumnResizingMode(this),
            adaptColumnWidthByRatio = isNextColumnMode && this.option('adaptColumnWidthByRatio') && !this.option('columnAutoWidth'),
            column,
            minWidth,
            nextColumn,
            cellWidth;

        function isPercentWidth(width) {
            return typeUtils.isString(width) && width.slice(-1) === '%';
        }

        function setColumnWidth(column, columnWidth, contentWidth, adaptColumnWidthByRatio) {
            if(column) {
                var oldColumnWidth = column.width;
                if(oldColumnWidth) {
                    adaptColumnWidthByRatio = isPercentWidth(oldColumnWidth);
                }

                if(adaptColumnWidthByRatio) {
                    column && columnsController.columnOption(column.index, 'visibleWidth', columnWidth);
                    column && columnsController.columnOption(column.index, 'width', (columnWidth / contentWidth * 100).toFixed(3) + '%');
                } else {
                    column && columnsController.columnOption(column.index, 'visibleWidth', null);
                    column && columnsController.columnOption(column.index, 'width', columnWidth);
                }
            }
        }

        function correctContentWidth(contentWidth, visibleColumns) {
            var allColumnsHaveWidth = visibleColumns.every(column => column.width),
                totalPercent;

            if(allColumnsHaveWidth) {
                totalPercent = visibleColumns.reduce((sum, column) => {
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
        if(isNextColumnMode && this.option('rtlEnabled')) {
            deltaX = -deltaX;
        }
        cellWidth = resizingInfo.currentColumnWidth + deltaX;
        column = visibleColumns[resizingInfo.currentColumnIndex];
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
                var columnWidths = this._columnHeadersView.getColumnWidths();
                columnWidths[resizingInfo.currentColumnIndex] = cellWidth;
                var hasScroll = columnWidths.reduce((totalWidth, width) => totalWidth + width, 0) > this._rowsView.contentWidth();
                if(!hasScroll) {
                    var lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns);
                    if(lastColumnIndex >= 0) {
                        columnsController.columnOption(visibleColumns[lastColumnIndex].index, 'visibleWidth', 'auto');
                    }
                }
                for(var i = 0; i < columnWidths.length; i++) {
                    if(visibleColumns[i] && visibleColumns[i] !== column && visibleColumns[i].width === undefined) {
                        columnsController.columnOption(visibleColumns[i].index, 'width', columnWidths[i]);
                    }
                }
            }

            columnsController.endUpdate();
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
        var i,
            subscribe;

        for(i = 0; i < this._subscribesToCallbacks.length; i++) {
            subscribe = this._subscribesToCallbacks[i];
            subscribe.callback.remove(subscribe.handler);
        }

        this._subscribesToCallbacks = [];
    },

    _unsubscribes: function() {
        this._unsubscribeFromEvents();
        this._unsubscribeFromCallbacks();
    },

    _init: function() {
        var that = this,
            generatePointsByColumnsHandler = function() {
                if(!that._isResizing) {
                    that.pointsByColumns(null);
                }
            },
            generatePointsByColumnsScrollHandler = function(offset) {
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
        that._$parentContainer = that._columnsSeparatorView.component.$element();

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

        var previousScrollbarVisibility = that._rowsView.getScrollbarWidth() !== 0;
        var previousTableHeight = 0;

        that._subscribeToCallback(that.getController('tablePosition').positionChanged, function(e) {
            if(that._isResizing && !that._rowsView.isResizing) {
                var scrollbarVisibility = that._rowsView.getScrollbarWidth() !== 0;
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

var TablePositionViewController = modules.ViewController.inherit({
    update: function(top) {
        var that = this,
            params = {},
            $element = that._columnHeadersView.element(),
            offset = $element && $element.offset(),
            offsetTop = offset && offset.top || 0,
            diffOffsetTop = typeUtils.isDefined(top) ? Math.abs(top - offsetTop) : 0,
            columnsHeadersHeight = that._columnHeadersView ? that._columnHeadersView.getHeight() : 0,
            scrollBarWidth = that._rowsView.getScrollbarWidth(true),
            rowsHeight = that._rowsView ? that._rowsView.height() - scrollBarWidth : 0,
            columnsResizerController = that.component.getController('columnsResizer');

        params.height = columnsHeadersHeight;
        if(columnsResizerController.isResizing() !== false) {
            params.height += rowsHeight - diffOffsetTop;
        }

        if(top !== null && $element && $element.length) {
            params.top = $element[0].offsetTop + diffOffsetTop;
        }

        that.positionChanged.fire(params);
    },

    init: function() {
        var that = this;

        that.callBase();

        that._columnHeadersView = this.getView('columnHeadersView');
        that._rowsView = this.getView('rowsView');
        that._pagerView = this.getView('pagerView');

        that._rowsView.resizeCompleted.add(function() {
            if(that.option('allowColumnResizing')) {
                that.update(null);
            }
        });
    },

    ctor: function(component) {
        this.callBase(component);
        this.positionChanged = Callbacks();
    }
});

var DraggingHeaderViewController = modules.ViewController.inherit({
    _generatePointsByColumns: function(options) {
        var that = this;

        return gridCoreUtils.getPointsByColumns(options.columnElements, function(point) {
            return that._pointCreated(point, options.columns, options.targetDraggingPanel.getName(), options.sourceColumn);
        }, options.isVerticalOrientation, options.startColumnIndex);
    },

    _pointCreated: function(point, columns, location, sourceColumn) {
        var targetColumn = columns[point.columnIndex],
            prevColumn = columns[point.columnIndex - 1];

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
        var that = this;

        each(draggingPanels, function(_, draggingPanel) {
            if(draggingPanel) {
                var i,
                    columns,
                    columnElements,
                    rowCount = draggingPanel.getRowCount ? draggingPanel.getRowCount() : 1,
                    nameDraggingPanel = draggingPanel.getName(),
                    subscribeToEvents = function(index, columnElement) {
                        if(!columnElement) {
                            return;
                        }

                        var $columnElement = $(columnElement),
                            column = columns[index];

                        if(draggingPanel.allowDragging(column, nameDraggingPanel, draggingPanels)) {
                            $columnElement.addClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
                            eventsEngine.on($columnElement, addNamespace(dragEvents.start, MODULE_NAMESPACE), that.createAction(function(args) {
                                var e = args.event,
                                    eventData = getEventData(e);

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
                            eventsEngine.on($columnElement, addNamespace(dragEvents.move, MODULE_NAMESPACE), { that: draggingHeader }, that.createAction(draggingHeader.moveHeader));
                            eventsEngine.on($columnElement, addNamespace(dragEvents.end, MODULE_NAMESPACE), { that: draggingHeader }, that.createAction(draggingHeader.dropHeader));
                        }
                    };

                for(i = 0; i < rowCount; i++) {
                    columnElements = draggingPanel.getColumnElements(i) || [];
                    if(columnElements.length) {
                        columns = draggingPanel.getColumns(i) || [];
                        each(columnElements, subscribeToEvents);
                    }
                }
            }
        });
    },

    _unsubscribeFromEvents: function(draggingHeader, draggingPanels) {
        var that = this;

        each(draggingPanels, function(_, draggingPanel) {
            if(draggingPanel) {
                var columnElements = draggingPanel.getColumnElements() || [];

                each(columnElements, function(index, columnElement) {
                    var $columnElement = $(columnElement);
                    eventsEngine.off($columnElement, addNamespace(dragEvents.start, MODULE_NAMESPACE));
                    eventsEngine.off($columnElement, addNamespace(dragEvents.move, MODULE_NAMESPACE));
                    eventsEngine.off($columnElement, addNamespace(dragEvents.end, MODULE_NAMESPACE));
                    $columnElement.removeClass(that.addWidgetPrefix(HEADERS_DRAG_ACTION_CLASS));
                });
            }
        });
    },

    _getSeparator: function(targetLocation) {
        return targetLocation === 'headers' ? this._columnsSeparatorView : this._blockSeparatorView;
    },

    hideSeparators: function(type) {
        var blockSeparator = this._blockSeparatorView,
            columnsSeparator = this._columnsSeparatorView;

        this._animationColumnIndex = null;
        blockSeparator && blockSeparator.hide();
        type !== 'block' && columnsSeparator && columnsSeparator.hide();
    },

    init: function() {
        var that = this,
            subscribeToEvents;

        that.callBase();
        that._columnsController = that.getController('columns');

        that._columnHeadersView = that.getView('columnHeadersView');
        that._columnsSeparatorView = that.getView('columnsSeparatorView');
        that._draggingHeaderView = that.getView('draggingHeaderView');
        that._rowsView = that.getView('rowsView');
        that._blockSeparatorView = that.getView('blockSeparatorView');
        that._headerPanelView = that.getView('headerPanel');
        that._columnChooserView = that.getView('columnChooserView');

        subscribeToEvents = function() {
            if(that._draggingHeaderView) {
                var draggingPanels = [that._columnChooserView, that._columnHeadersView, that._headerPanelView];

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
        var sourceIndex = parameters.sourceIndex,
            sourceLocation = parameters.sourceLocation,
            sourceColumnElement = parameters.sourceColumnElement,
            headersView = this._columnHeadersView,
            rowsView = this._rowsView;

        if(sourceColumnElement) {
            sourceColumnElement.css({ opacity: COLUMN_OPACITY });

            if(sourceLocation === 'headers') {
                headersView && headersView.setRowsOpacity(sourceIndex, COLUMN_OPACITY);
                rowsView && rowsView.setRowsOpacity(sourceIndex, COLUMN_OPACITY);
            }
        }
    },

    dock: function(parameters) {
        var that = this,
            targetColumnIndex = typeUtils.isObject(parameters.targetColumnIndex) ? parameters.targetColumnIndex.columnIndex : parameters.targetColumnIndex,
            sourceLocation = parameters.sourceLocation,
            targetLocation = parameters.targetLocation,
            separator = that._getSeparator(targetLocation),
            hasTargetVisibleIndex = targetColumnIndex >= 0;

        var showSeparator = function() {
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
        var sourceColumnElement = parameters.sourceColumnElement;

        if(sourceColumnElement) {
            sourceColumnElement.css({ opacity: '' });
            this._columnHeadersView.setRowsOpacity(parameters.sourceIndex, '');
            this._rowsView.setRowsOpacity(parameters.sourceIndex, '');
            this._columnHeadersView.element().find('.' + HEADER_ROW_CLASS).removeClass(this.addWidgetPrefix(HEADERS_DROP_HIGHLIGHT_CLASS));
        }

        if(this.allowDrop(parameters)) {
            var separator = this._getSeparator(parameters.targetLocation);
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

module.exports = {
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
                    var wordWrapEnabled = this.option('wordWrapEnabled'),
                        columnsResizerController = this.getController('columnsResizer'),
                        isResizing = columnsResizerController.isResizing();

                    return this.callBase.apply(this, arguments) || itemCount > 0 && wordWrapEnabled && isResizing;
                }
            }
        }
    }
};

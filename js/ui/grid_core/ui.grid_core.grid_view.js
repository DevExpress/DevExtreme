import $ from '../../core/renderer';
import modules from './ui.grid_core.modules';
import commonUtils from '../../core/utils/common';
import windowUtils from '../../core/utils/window';
import { each } from '../../core/utils/iterator';
import typeUtils from '../../core/utils/type';
import gridCoreUtils from './ui.grid_core.utils';
import messageLocalization from '../../localization/message';
import { when, Deferred } from '../../core/utils/deferred';
import domAdapter from '../../core/dom_adapter';
import browser from '../../core/utils/browser';
import accessibility from '../shared/accessibility';

const TABLE_CLASS = 'table';
const BORDERS_CLASS = 'borders';
const TABLE_FIXED_CLASS = 'table-fixed';
const IMPORTANT_MARGIN_CLASS = 'important-margin';
const TEXT_CONTENT_CLASS = 'text-content';
const HIDDEN_CLASS = 'dx-hidden';
const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';

const VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];

const isPercentWidth = function(width) {
    return typeUtils.isString(width) && width.slice(-1) === '%';
};

const isPixelWidth = function(width) {
    return typeUtils.isString(width) && width.slice(-2) === 'px';
};


const mergeArraysByMaxValue = function(values1, values2) {
    let result = [];
    let i;

    if(values1 && values2 && values1.length && (values1.length === values2.length)) {
        for(i = 0; i < values1.length; i++) {
            result.push(values1[i] > values2[i] ? values1[i] : values2[i]);
        }
    } else if(values1 && values1.length) {
        result = values1;
    } else if(values2) {
        result = values2;
    }

    return result;
};

const getContainerHeight = function($container) {
    const clientHeight = $container.get(0).clientHeight;
    const paddingTop = parseFloat($container.css('paddingTop'));
    const paddingBottom = parseFloat($container.css('paddingBottom'));

    return clientHeight - paddingTop - paddingBottom;
};

const calculateFreeWidth = function(that, widths) {
    const contentWidth = that._rowsView.contentWidth();
    const totalWidth = that._getTotalWidth(widths, contentWidth);

    return contentWidth - totalWidth;
};

const calculateFreeWidthWithCurrentMinWidth = function(that, columnIndex, currentMinWidth, widths) {
    return calculateFreeWidth(that, widths.map(function(width, index) {
        return index === columnIndex ? currentMinWidth : width;
    }));
};

const restoreFocus = function(focusedElement, selectionRange) {
    accessibility.hiddenFocus(focusedElement);
    gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
};

const ResizingController = modules.ViewController.inherit({
    _initPostRenderHandlers: function() {
        const that = this;
        const dataController = that._dataController;

        if(!that._refreshSizesHandler) {
            that._refreshSizesHandler = function(e) {
                dataController.changed.remove(that._refreshSizesHandler);

                let resizeDeferred;
                const changeType = e && e.changeType;
                const isDelayed = e && e.isDelayed;
                const items = dataController.items();

                if(!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
                    if(!isDelayed) {
                        resizeDeferred = that.resize();
                    }
                } else if(changeType === 'update' && e.changeTypes) {
                    if((items.length > 1 || e.changeTypes[0] !== 'insert') &&
                        !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
                        commonUtils.deferUpdate(function() {
                            that._rowsView.resize();
                        });
                    } else {
                        resizeDeferred = that.resize();
                    }
                }

                if(changeType && changeType !== 'updateSelection' && changeType !== 'updateFocusedRow' && !isDelayed) {
                    when(resizeDeferred).done(function() {
                        that._setAriaRowColCount();
                        that.fireContentReadyAction();
                    });
                }
            };
            // TODO remove resubscribing
            that._dataController.changed.add(function() {
                that._dataController.changed.add(that._refreshSizesHandler);
            });
        }
    },

    fireContentReadyAction: function() {
        this.component._fireContentReadyAction();
    },

    _setAriaRowColCount: function() {
        const component = this.component;
        component.setAria({
            'rowCount': this._dataController.totalItemsCount(),
            'colCount': component.columnCount()
        }, component.$element().children('.' + GRIDBASE_CONTAINER_CLASS));
    },

    _getBestFitWidths: function() {
        if(!this.option('legacyRendering')) {
            return this._rowsView.getColumnWidths();
        }

        const that = this;
        let rowsColumnWidths;
        let headerColumnWidths;
        let footerColumnWidths;
        let resultWidths;

        rowsColumnWidths = that._rowsView.getColumnWidths();
        headerColumnWidths = that._columnHeadersView && that._columnHeadersView.getColumnWidths();
        footerColumnWidths = that._footerView && that._footerView.getColumnWidths();


        resultWidths = mergeArraysByMaxValue(rowsColumnWidths, headerColumnWidths);
        resultWidths = mergeArraysByMaxValue(resultWidths, footerColumnWidths);
        return resultWidths;
    },

    _setVisibleWidths: function(visibleColumns, widths) {
        const columnsController = this._columnsController;
        columnsController.beginUpdate();
        each(visibleColumns, function(index, column) {
            const columnId = columnsController.getColumnId(column);
            columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
        });
        columnsController.endUpdate();
    },

    _toggleBestFitModeForView: function(view, className, isBestFit) {
        if(!view || !view.isVisible()) return;

        const $rowsTables = this._rowsView.getTableElements();
        const $viewTables = view.getTableElements();

        each($rowsTables, (index, tableElement) => {
            let $tableBody;
            const $rowsTable = $(tableElement);
            const $viewTable = $viewTables.eq(index);

            if($viewTable && $viewTable.length) {
                if(isBestFit) {
                    $tableBody = $viewTable.children('tbody').appendTo($rowsTable);
                } else {
                    $tableBody = $rowsTable.children('.' + className).appendTo($viewTable);
                }
                $tableBody.toggleClass(className, isBestFit);
                $tableBody.toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
            }
        });
    },

    _toggleBestFitMode: function(isBestFit) {
        const $element = this.component.$element();
        const that = this;

        if(!that.option('legacyRendering')) {
            const $rowsTable = that._rowsView._getTableElement();
            const $rowsFixedTable = that._rowsView.getTableElements().eq(1);

            $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
            $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');
            $rowsFixedTable.toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);

            that._toggleBestFitModeForView(that._columnHeadersView, 'dx-header', isBestFit);
            that._toggleBestFitModeForView(that._footerView, 'dx-footer', isBestFit);

            if(that._needStretch()) {
                $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
            }
            if(browser.msie && parseInt(browser.version) === 11) {
                $rowsTable.find('.' + this.addWidgetPrefix(TABLE_FIXED_CLASS)).each(function() {
                    this.style.width = isBestFit ? '10px' : '';
                });
            }
        } else {
            $element.find('.' + this.addWidgetPrefix(TABLE_CLASS)).toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);

            // B253906
            $element.find(EDITORS_INPUT_SELECTOR).toggleClass(HIDDEN_CLASS, isBestFit);
            $element.find('.dx-group-cell').toggleClass(HIDDEN_CLASS, isBestFit);
            $element.find('.dx-header-row .' + this.addWidgetPrefix(TEXT_CONTENT_CLASS)).css('maxWidth', '');
        }
    },

    _synchronizeColumns: function() {
        const that = this;
        const columnsController = that._columnsController;
        const visibleColumns = columnsController.getVisibleColumns();
        const columnAutoWidth = that.option('columnAutoWidth');
        const legacyRendering = that.option('legacyRendering');
        let needBestFit = that._needBestFit();
        let hasMinWidth = false;
        let resetBestFitMode;
        let isColumnWidthsCorrected = false;
        let resultWidths = [];
        let focusedElement;
        let isFocusOutsideWindow;
        let selectionRange;
        const normalizeWidthsByExpandColumns = function() {
            let expandColumnWidth;

            each(visibleColumns, function(index, column) {
                if(column.type === 'groupExpand') {
                    expandColumnWidth = resultWidths[index];
                }
            });

            each(visibleColumns, function(index, column) {
                if(column.type === 'groupExpand' && expandColumnWidth) {
                    resultWidths[index] = expandColumnWidth;
                }
            });
        };

        !needBestFit && each(visibleColumns, function(index, column) {
            if(column.width === 'auto' || (legacyRendering && column.fixed)) {
                needBestFit = true;
                return false;
            }
        });

        each(visibleColumns, function(index, column) {
            if(column.minWidth) {
                hasMinWidth = true;
                return false;
            }
        });

        that._setVisibleWidths(visibleColumns, []);

        if(needBestFit) {
            focusedElement = domAdapter.getActiveElement();
            selectionRange = gridCoreUtils.getSelectionRange(focusedElement);
            that._toggleBestFitMode(true);
            resetBestFitMode = true;
        }

        commonUtils.deferUpdate(function() {
            if(needBestFit) {
                resultWidths = that._getBestFitWidths();

                each(visibleColumns, function(index, column) {
                    const columnId = columnsController.getColumnId(column);
                    columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
                });
            } else if(hasMinWidth) {
                resultWidths = that._getBestFitWidths();
            }

            each(visibleColumns, function(index) {
                const width = this.width;
                if(width !== 'auto') {
                    if(typeUtils.isDefined(width)) {
                        resultWidths[index] = typeUtils.isNumeric(width) || isPixelWidth(width) ? parseFloat(width) : width;
                    } else if(!columnAutoWidth) {
                        resultWidths[index] = undefined;
                    }
                }
            });

            if(resetBestFitMode) {
                that._toggleBestFitMode(false);
                resetBestFitMode = false;
                if(focusedElement && focusedElement !== domAdapter.getActiveElement()) {
                    isFocusOutsideWindow = focusedElement.getBoundingClientRect().bottom < 0;
                    if(!isFocusOutsideWindow) {
                        if(browser.msie) {
                            setTimeout(function() { restoreFocus(focusedElement, selectionRange); });
                        } else {
                            restoreFocus(focusedElement, selectionRange);
                        }
                    }
                }
            }

            isColumnWidthsCorrected = that._correctColumnWidths(resultWidths, visibleColumns);

            if(columnAutoWidth) {
                normalizeWidthsByExpandColumns();
                if(that._needStretch()) {
                    that._processStretch(resultWidths, visibleColumns);
                }
            }

            commonUtils.deferRender(function() {
                if(needBestFit || isColumnWidthsCorrected) {
                    that._setVisibleWidths(visibleColumns, resultWidths);
                }
            });
        });
    },

    _needBestFit: function() {
        return this.option('columnAutoWidth');
    },

    _needStretch: function() {
        return this.option('legacyRendering') || this._columnsController.getVisibleColumns().some(c => c.width === 'auto' && !c.command);
    },

    _getAverageColumnsWidth: function(resultWidths) {
        const freeWidth = calculateFreeWidth(this, resultWidths);
        const columnCountWithoutWidth = resultWidths.filter(function(width) { return width === undefined; }).length;

        return freeWidth / columnCountWithoutWidth;
    },

    _correctColumnWidths: function(resultWidths, visibleColumns) {
        const that = this;
        let i;
        let hasPercentWidth = false;
        let hasAutoWidth = false;
        let isColumnWidthsCorrected = false;
        const $element = that.component.$element();
        const hasWidth = that._hasWidth;
        let averageColumnsWidth;
        let lastColumnIndex;

        for(i = 0; i < visibleColumns.length; i++) {
            const index = i;
            const column = visibleColumns[index];
            const isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
            let width = resultWidths[index];
            const minWidth = column.minWidth;

            if(minWidth) {
                if(width === undefined) {
                    averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);
                    width = averageColumnsWidth;
                } else if(isPercentWidth(width)) {
                    const freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);

                    if(freeWidth < 0) {
                        width = -1;
                    }
                }
            }
            if(minWidth && that._getRealColumnWidth(width) < minWidth && !isHiddenColumn) {
                resultWidths[index] = minWidth;
                isColumnWidthsCorrected = true;
                i = -1;
            }
            if(!typeUtils.isDefined(column.width)) {
                hasAutoWidth = true;
            }
            if(isPercentWidth(column.width)) {
                hasPercentWidth = true;
            }
        }

        if($element && that._maxWidth) {
            delete that._maxWidth;
            $element.css('maxWidth', '');
        }

        if(!hasAutoWidth && resultWidths.length) {
            const contentWidth = that._rowsView.contentWidth();
            const scrollbarWidth = that._rowsView.getScrollbarWidth();
            const totalWidth = that._getTotalWidth(resultWidths, contentWidth);

            if(totalWidth < contentWidth) {
                lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns, resultWidths);

                if(lastColumnIndex >= 0) {
                    resultWidths[lastColumnIndex] = 'auto';
                    isColumnWidthsCorrected = true;
                    if(hasWidth === false && !hasPercentWidth) {
                        that._maxWidth = totalWidth + scrollbarWidth + (that.option('showBorders') ? 2 : 0);
                        $element.css('maxWidth', that._maxWidth);
                    }
                }
            }
        }
        return isColumnWidthsCorrected;
    },

    _processStretch: function(resultSizes, visibleColumns) {
        const groupSize = this._rowsView.contentWidth();
        const tableSize = this._getTotalWidth(resultSizes, groupSize);
        const unusedIndexes = { length: 0 };
        let diff;
        let diffElement;
        let onePixelElementsCount;
        let i;

        if(!resultSizes.length) return;

        each(visibleColumns, function(index) {
            if(this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
                unusedIndexes[index] = true;
                unusedIndexes.length++;
            }
        });

        diff = groupSize - tableSize;
        diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
        onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);
        if(diff >= 0) {
            for(i = 0; i < resultSizes.length; i++) {
                if(unusedIndexes[i]) {
                    continue;
                }
                resultSizes[i] += diffElement;
                if(onePixelElementsCount > 0) {
                    if(onePixelElementsCount < 1) {
                        resultSizes[i] += onePixelElementsCount;
                        onePixelElementsCount = 0;
                    } else {
                        resultSizes[i]++;
                        onePixelElementsCount--;
                    }
                }
            }
        }
    },

    _getRealColumnWidth: function(width, groupWidth) {
        if(!isPercentWidth(width)) {
            return parseFloat(width);
        }

        groupWidth = groupWidth || this._rowsView.contentWidth();

        return parseFloat(width) * groupWidth / 100;
    },

    _getTotalWidth: function(widths, groupWidth) {
        let result = 0;
        let width;
        let i;

        for(i = 0; i < widths.length; i++) {
            width = widths[i];
            if(width && width !== HIDDEN_COLUMNS_WIDTH) {
                result += this._getRealColumnWidth(width, groupWidth);
            }
        }

        return result;
    },

    updateSize: function($rootElement) {
        const that = this;
        let $groupElement;
        let width;
        const importantMarginClass = that.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);

        if(that._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && $rootElement.width()) {
            $groupElement = $rootElement.children('.' + that.getWidgetContainerClass());
            if($groupElement.length) {
                $groupElement.detach();
            }

            that._hasHeight = !!getContainerHeight($rootElement);

            width = $rootElement.width();
            $rootElement.addClass(importantMarginClass);
            that._hasWidth = $rootElement.width() === width;
            $rootElement.removeClass(importantMarginClass);

            if($groupElement.length) {
                $groupElement.appendTo($rootElement);
            }
        }
    },

    publicMethods: function() {
        return ['resize', 'updateDimensions'];
    },

    resize: function() {
        return !this.component._requireResize && this.updateDimensions();
    },

    updateDimensions: function(checkSize) {
        const that = this;

        that._initPostRenderHandlers();

        // T335767
        if(!that._checkSize(checkSize)) {
            return;
        }

        const prevResult = that._resizeDeferred;
        const result = that._resizeDeferred = new Deferred();

        when(prevResult).always(function() {
            commonUtils.deferRender(function() {
                if(that._dataController.isLoaded()) {
                    that._synchronizeColumns();
                }
                // IE11
                that._resetGroupElementHeight();

                commonUtils.deferUpdate(function() {
                    commonUtils.deferRender(function() {
                        commonUtils.deferUpdate(function() {
                            that._updateDimensionsCore();
                        });
                    });
                });
            }).done(result.resolve).fail(result.reject);
        });

        return result.promise();
    },
    _resetGroupElementHeight: function() {
        const groupElement = this.component.$element().children().get(0);
        const scrollable = this._rowsView.getScrollable();

        if(groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
            groupElement.style.height = '';
        }
    },
    _checkSize: function(checkSize) {
        const $rootElement = this.component.$element();

        if(checkSize && (this._lastWidth === $rootElement.width() && this._lastHeight === $rootElement.height() || !$rootElement.is(':visible'))) {
            return false;
        }
        return true;
    },
    _setScrollerSpacingCore: function(hasHeight) {
        const that = this;
        const vScrollbarWidth = hasHeight ? that._rowsView.getScrollbarWidth() : 0;
        const hScrollbarWidth = that._rowsView.getScrollbarWidth(true);

        commonUtils.deferRender(function() {
            that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
            that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);
            that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
        });
    },
    _setScrollerSpacing: function(hasHeight) {
        if(this.option('scrolling.useNative') === true) {
            // T722415, T758955
            commonUtils.deferRender(() => {
                commonUtils.deferUpdate(() => {
                    this._setScrollerSpacingCore(hasHeight);
                });
            });
        } else {
            this._setScrollerSpacingCore(hasHeight);
        }
    },
    _updateDimensionsCore: function() {
        const that = this;
        let hasHeight;
        const dataController = that._dataController;
        const rowsView = that._rowsView;
        const $rootElement = that.component.$element();
        const groupElement = $rootElement.children().get(0);
        const rootElementHeight = $rootElement && ($rootElement.get(0).clientHeight || $rootElement.height());
        const maxHeight = parseInt($rootElement.css('maxHeight'));
        const maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
        const height = that.option('height') || $rootElement.get(0).style.height;
        const editorFactory = that.getController('editorFactory');
        const isMaxHeightApplied = maxHeightHappened && groupElement.scrollHeight === groupElement.offsetHeight;
        let $testDiv;

        that.updateSize($rootElement);
        hasHeight = that._hasHeight || maxHeightHappened;

        if(height && (that._hasHeight ^ height !== 'auto')) {
            $testDiv = $('<div>').height(height).appendTo($rootElement);
            that._hasHeight = !!$testDiv.height();
            $testDiv.remove();
        }

        commonUtils.deferRender(function() {
            rowsView.height(null, hasHeight);
            // IE11
            if(maxHeightHappened && !isMaxHeightApplied) {
                $(groupElement).css('height', maxHeight);
            }

            if(!dataController.isLoaded()) {
                rowsView.setLoading(dataController.isLoading());
                return;
            }
            commonUtils.deferUpdate(function() {
                that._updateLastSizes($rootElement);
                that._setScrollerSpacing(hasHeight);

                each(VIEW_NAMES, function(index, viewName) {
                    const view = that.getView(viewName);
                    if(view) {
                        view.resize();
                    }
                });

                editorFactory && editorFactory.resize();
            });
        });
    },

    _updateLastSizes: function($rootElement) {
        this._lastWidth = $rootElement.width();
        this._lastHeight = $rootElement.height();
    },

    optionChanged: function(args) {
        switch(args.name) {
            case 'width':
            case 'height':
                this.component._renderDimensions();
                this.resize();
                /* falls through */
            case 'legacyRendering':
            case 'renderAsync':
                args.handled = true;
                return;
            default:
                this.callBase(args);
        }
    },

    init: function() {
        const that = this;

        that._dataController = that.getController('data');
        that._columnsController = that.getController('columns');
        that._columnHeadersView = that.getView('columnHeadersView');
        that._footerView = that.getView('footerView');
        that._rowsView = that.getView('rowsView');
    }
});

const SynchronizeScrollingController = modules.ViewController.inherit({
    _scrollChangedHandler: function(views, pos, viewName) {
        for(let j = 0; j < views.length; j++) {
            if(views[j] && views[j].name !== viewName) {
                views[j].scrollTo({ left: pos.left, top: pos.top });
            }
        }
    },

    init: function() {
        let view;
        const views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];
        let i;

        for(i = 0; i < views.length; i++) {
            view = views[i];
            if(view) {
                view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
            }
        }
    }
});

const GridView = modules.View.inherit({
    _endUpdateCore: function() {
        if(this.component._requireResize) {
            this.component._requireResize = false;
            this._resizingController.resize();
        }
    },

    _getWidgetAriaLabel: function() {
        return 'dxDataGrid-ariaDataGrid';
    },

    init: function() {
        const that = this;
        that._resizingController = that.getController('resizing');
        that._dataController = that.getController('data');
    },

    getView: function(name) {
        return this.component._views[name];
    },

    element: function() {
        return this._groupElement;
    },

    optionChanged: function(args) {
        const that = this;

        if(typeUtils.isDefined(that._groupElement) && args.name === 'showBorders') {
            that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);
            args.handled = true;
        } else {
            that.callBase(args);
        }
    },

    _renderViews: function($groupElement) {
        const that = this;

        each(VIEW_NAMES, function(index, viewName) {
            const view = that.getView(viewName);
            if(view) {
                view.render($groupElement);
            }
        });
    },

    _getTableRoleName: function() {
        return 'grid';
    },

    render: function($rootElement) {
        const that = this;
        const isFirstRender = !that._groupElement;
        const $groupElement = that._groupElement || $('<div>').addClass(that.getWidgetContainerClass());

        $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
        $groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!that.option('showBorders'));

        that.setAria('role', 'presentation', $rootElement);

        that.component.setAria({
            'role': this._getTableRoleName(),
            'label': messageLocalization.format(that._getWidgetAriaLabel())
        }, $groupElement);

        that._rootElement = $rootElement || that._rootElement;

        if(isFirstRender) {
            that._groupElement = $groupElement;
            windowUtils.hasWindow() && that.getController('resizing').updateSize($rootElement);
            $groupElement.appendTo($rootElement);
        }

        that._renderViews($groupElement);
    },

    update: function() {
        const that = this;
        const $rootElement = that._rootElement;
        const $groupElement = that._groupElement;
        const resizingController = that.getController('resizing');

        if($rootElement && $groupElement) {
            resizingController.resize();
            if(that._dataController.isLoaded()) {
                that._resizingController.fireContentReadyAction();
            }
        }
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            showBorders: false,
            renderAsync: false,
            legacyRendering: false,
        };
    },
    controllers: {
        resizing: ResizingController,
        synchronizeScrolling: SynchronizeScrollingController
    },
    views: {
        gridView: GridView
    }
};

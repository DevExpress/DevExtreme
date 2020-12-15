import $ from '../../core/renderer';
import { getWindow, hasWindow } from '../../core/utils/window';
const window = getWindow();
import coreBrowserUtils from '../../core/utils/browser';
import eventsEngine from '../../events/core/events_engine';
import registerComponent from '../../core/component_registrator';
import { getPublicElement } from '../../core/element';
import { format as formatString } from '../../core/utils/string';
import { noop, deferRender, deferUpdate } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { name as clickEventName } from '../../events/click';
import localizationMessage from '../../localization/message';
import Widget from '../widget/ui.widget';
import { addNamespace } from '../../events/utils/index';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import { setFieldProperty, findField, mergeArraysByMaxValue } from './ui.pivot_grid.utils';
import { DataController } from './ui.pivot_grid.data_controller';
import { DataArea } from './ui.pivot_grid.data_area';
import { VerticalHeadersArea, HorizontalHeadersArea } from './ui.pivot_grid.headers_area';
import { getSize } from '../../core/utils/size';

import { FieldsArea } from './ui.pivot_grid.fields_area';

import PivotGridFieldChooser from './ui.pivot_grid.field_chooser';
import PivotGridFieldChooserBase from './ui.pivot_grid.field_chooser_base';
import { ExportMixin } from './ui.pivot_grid.export';
import chartIntegrationMixin from './ui.pivot_grid.chart_integration';
import Popup from '../popup';
import ContextMenu from '../context_menu';
import { when, Deferred } from '../../core/utils/deferred';

// STYLE pivotGrid

const DATA_AREA_CELL_CLASS = 'dx-area-data-cell';
const ROW_AREA_CELL_CLASS = 'dx-area-row-cell';
const COLUMN_AREA_CELL_CLASS = 'dx-area-column-cell';
const DESCRIPTION_AREA_CELL_CLASS = 'dx-area-description-cell';
const BORDERS_CLASS = 'dx-pivotgrid-border';
const PIVOTGRID_CLASS = 'dx-pivotgrid';
const ROW_LINES_CLASS = 'dx-row-lines';
const BOTTOM_ROW_CLASS = 'dx-bottom-row';
const BOTTOM_BORDER_CLASS = 'dx-bottom-border';
const FIELDS_CONTAINER_CLASS = 'dx-pivotgrid-fields-container';
const FIELDS_CLASS = 'dx-area-fields';
const FIELD_CHOOSER_POPUP_CLASS = 'dx-fieldchooser-popup';
const INCOMPRESSIBLE_FIELDS_CLASS = 'dx-incompressible-fields';
const OVERFLOW_HIDDEN_CLASS = 'dx-overflow-hidden';

const TR = '<tr>';
const TD = '<td>';
const DIV = '<div>';
const TEST_HEIGHT = 66666;

const FIELD_CALCULATED_OPTIONS = ['allowSorting', 'allowSortingBySummary', 'allowFiltering', 'allowExpandAll'];

function getArraySum(array) {
    let sum = 0;

    each(array, function(_, value) {
        sum += (value || 0);
    });

    return sum;
}

function adjustSizeArray(sizeArray, space) {
    const delta = space / sizeArray.length;

    for(let i = 0; i < sizeArray.length; i++) {
        sizeArray[i] -= delta;
    }
}

function unsubscribeScrollEvents(area) {
    area.off('scroll')
        .off('stop');
}

function subscribeToScrollEvent(area, handler) {
    unsubscribeScrollEvents(area);

    area.on('scroll', handler)
        .on('stop', handler);
}

const scrollBarInfoCache = {};

function getScrollBarInfo(useNativeScrolling) {
    if(scrollBarInfoCache[useNativeScrolling]) {
        return scrollBarInfoCache[useNativeScrolling];
    }

    let scrollBarWidth = 0;
    const options = {};

    const container = $(DIV).css({
        position: 'absolute',
        visibility: 'hidden',
        top: -1000,
        left: -1000,
        width: 100,
        height: 100
    }).appendTo('body');

    const content = $('<p>').css({
        width: '100%',
        height: 200
    }).appendTo(container);

    if(useNativeScrolling !== 'auto') {
        options.useNative = !!useNativeScrolling;
        options.useSimulatedScrollbar = !useNativeScrolling;
    }

    container.dxScrollable(options);

    const scrollBarUseNative = container.dxScrollable('instance').option('useNative');
    scrollBarWidth = scrollBarUseNative ? container.width() - content.width() : 0;

    container.remove();

    scrollBarInfoCache[useNativeScrolling] = {
        scrollBarWidth: scrollBarWidth,
        scrollBarUseNative: scrollBarUseNative
    };

    return scrollBarInfoCache[useNativeScrolling];
}

function getCommonBorderWidth(elements, direction) {
    const borderStyleNames = direction === 'width' ? ['borderLeftWidth', 'borderRightWidth'] : ['borderTopWidth', 'borderBottomWidth'];
    let width = 0;

    each(elements, function(_, elem) {
        const computedStyle = window.getComputedStyle(elem.get(0));
        borderStyleNames.forEach(function(borderStyleName) {
            width += (parseFloat(computedStyle[borderStyleName]) || 0);
        });
    });

    return width;
}

function clickedOnFieldsArea($targetElement) {
    return $targetElement.closest('.' + FIELDS_CLASS).length || $targetElement.find('.' + FIELDS_CLASS).length;
}

/**
* @name dxPivotGridOptions.activeStateEnabled
* @hidden
*/

/**
* @name dxPivotGridOptions.hoverStateEnabled
* @hidden
*/

/**
* @name dxPivotGridOptions.focusStateEnabled
* @hidden
*/

/**
* @name dxPivotGridOptions.accessKey
* @hidden
*/

/**
* @name dxPivotGridMethods.registerKeyHandler
* @publicName registerKeyHandler(key, handler)
* @hidden
*/

const PivotGrid = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            scrolling: {
                timeout: 300,
                renderingThreshold: 150,
                minTimeout: 10,
                /**
                 * @name dxPivotGridOptions.scrolling.mode
                 * @type Enums.PivotGridScrollingMode
                 * @default "standard"
                 */
                mode: 'standard',
                /**
                 * @name dxPivotGridOptions.scrolling.useNative
                 * @type boolean|Enums.Mode
                 * @default "auto"
                 */
                useNative: 'auto',

                removeInvisiblePages: true,
                virtualRowHeight: 50,
                virtualColumnWidth: 100,
                loadTwoPagesOnStart: true
            },
            encodeHtml: true,
            dataSource: null,
            activeStateEnabled: false,
            fieldChooser: {
                minWidth: 250,
                minHeight: 250,
                /**
                 * @name dxPivotGridOptions.fieldChooser.enabled
                 * @type boolean
                 * @default true
                 */
                enabled: true,
                /**
                 * @name dxPivotGridOptions.fieldChooser.allowSearch
                 * @type boolean
                 * @default false
                 */
                allowSearch: false,
                /**
                 * @name dxPivotGridOptions.fieldChooser.searchTimeout
                 * @type number
                 * @default searchTimeout
                 */
                searchTimeout: 500,
                /**
                 * @name dxPivotGridOptions.fieldChooser.layout
                 * @type Enums.PivotGridFieldChooserLayout
                 * @default 0
                 */
                layout: 0,
                /**
                 * @name dxPivotGridOptions.fieldChooser.title
                 * @type string
                 * @default "Field Chooser"
                 */
                title: localizationMessage.format('dxPivotGrid-fieldChooserTitle'),
                /**
                 * @name dxPivotGridOptions.fieldChooser.width
                 * @type number
                 * @default 600
                 */
                width: 600,
                /**
                 * @name dxPivotGridOptions.fieldChooser.height
                 * @type number
                 * @default 600
                 */
                height: 600,
                /**
                 * @name dxPivotGridOptions.fieldChooser.applyChangesMode
                 * @type Enums.ApplyChangesMode
                 * @default "instantly"
                 */
                applyChangesMode: 'instantly'
                /**
                 * @name dxPivotGridOptions.fieldChooser.texts
                 * @type object
                 */
                /**
                 * @name dxPivotGridOptions.fieldChooser.texts.columnFields
                 * @type string
                 * @default 'Column Fields'
                 */
                /**
                 * @name dxPivotGridOptions.fieldChooser.texts.rowFields
                 * @type string
                 * @default 'Row Fields'
                 */
                /**
                 * @name dxPivotGridOptions.fieldChooser.texts.dataFields
                 * @type string
                 * @default 'Data Fields'
                 */
                /**
                 * @name dxPivotGridOptions.fieldChooser.texts.filterFields
                 * @type string
                 * @default 'Filter Fields'
                 */
                /**
                 * @name dxPivotGridOptions.fieldChooser.texts.allFields
                 * @type string
                 * @default 'All Fields'
                 */
            },
            onContextMenuPreparing: null,
            allowSorting: false,
            allowSortingBySummary: false,
            allowFiltering: false,
            allowExpandAll: false,
            wordWrapEnabled: true,
            fieldPanel: {
                /**
                * @name dxPivotGridOptions.fieldPanel.showColumnFields
                * @type boolean
                * @default true
                */
                showColumnFields: true,
                /**
                * @name dxPivotGridOptions.fieldPanel.showFilterFields
                * @type boolean
                * @default true
                */
                showFilterFields: true,

                /**
                * @name dxPivotGridOptions.fieldPanel.showDataFields
                * @type boolean
                * @default true
                */
                showDataFields: true,

                /**
                * @name dxPivotGridOptions.fieldPanel.showRowFields
                * @type boolean
                * @default true
                */
                showRowFields: true,
                /**
                * @name dxPivotGridOptions.fieldPanel.allowFieldDragging
                * @type boolean
                * @default true
                */
                allowFieldDragging: true,
                /**
                * @name dxPivotGridOptions.fieldPanel.visible
                * @type boolean
                * @default false
                */
                visible: false,

                /**
                * @name dxPivotGridOptions.fieldPanel.texts
                * @type object
                */
                texts: {
                    /**
                    * @name dxPivotGridOptions.fieldPanel.texts.columnFieldArea
                    * @type string
                    * @default "Drop Column Fields Here"
                    */
                    columnFieldArea: localizationMessage.format('dxPivotGrid-columnFieldArea'),
                    /**
                    * @name dxPivotGridOptions.fieldPanel.texts.rowFieldArea
                    * @type string
                    * @default "Drop Row Fields Here"
                    */
                    rowFieldArea: localizationMessage.format('dxPivotGrid-rowFieldArea'),
                    /**
                    * @name dxPivotGridOptions.fieldPanel.texts.filterFieldArea
                    * @type string
                    * @default "Drop Filter Fields Here"
                    */
                    filterFieldArea: localizationMessage.format('dxPivotGrid-filterFieldArea'),
                    /**
                    * @name dxPivotGridOptions.fieldPanel.texts.dataFieldArea
                    * @type string
                    * @default "Drop Data Fields Here"
                    */
                    dataFieldArea: localizationMessage.format('dxPivotGrid-dataFieldArea')
                }
            },
            dataFieldArea: 'column',

            'export': {
                /**
                 * @name dxPivotGridOptions.export.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxPivotGridOptions.export.fileName
                 * @type string
                 * @default "PivotGrid"
                 * @deprecated
                 */
                fileName: 'PivotGrid',
                /**
                 * @name dxPivotGridOptions.export.proxyUrl
                 * @type string
                 * @default undefined
                 * @deprecated
                 */
                proxyUrl: undefined,
                /**
                 * @name dxPivotGridOptions.export.ignoreExcelErrors
                 * @type boolean
                 * @default true
                 * @deprecated
                 */
                ignoreExcelErrors: true
            },
            showRowTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showColumnGrandTotals: true,
            hideEmptySummaryCells: true,
            showTotalsPrior: 'none',
            rowHeaderLayout: 'standard',

            loadPanel: {
                /**
                 * @name dxPivotGridOptions.loadPanel.enabled
                 * @type boolean
                 * @default true
                 */
                enabled: true,
                /**
                 * @name dxPivotGridOptions.loadPanel.text
                 * @type string
                 * @default 'Loading...'
                 */
                text: localizationMessage.format('Loading'),
                /**
                 * @name dxPivotGridOptions.loadPanel.width
                 * @type number
                 * @default 200
                 */
                width: 200,
                /**
                 * @name dxPivotGridOptions.loadPanel.height
                 * @type number
                 * @default 70
                 */
                height: 70,
                /**
                * @name dxPivotGridOptions.loadPanel.showIndicator
                * @type boolean
                * @default true
                */
                showIndicator: true,

                /**
                * @name dxPivotGridOptions.loadPanel.indicatorSrc
                * @type string
                * @default ""
                */
                indicatorSrc: '',

                /**
                * @name dxPivotGridOptions.loadPanel.showPane
                * @type boolean
                * @default true
                */
                showPane: true

                /**
                * @name dxPivotGridOptions.loadPanel.shading
                * @type boolean
                * @default false
                */

                /**
                * @name dxPivotGridOptions.loadPanel.shadingColor
                * @type string
                * @default ''
                */
            },
            texts: {
                /**
                 * @name dxPivotGridOptions.texts.grandTotal
                 * @type string
                 * @default 'Grand Total'
                 */
                grandTotal: localizationMessage.format('dxPivotGrid-grandTotal'),
                /**
                 * @name dxPivotGridOptions.texts.total
                 * @type string
                 * @default '{0} Total'
                 */
                total: localizationMessage.getFormatter('dxPivotGrid-total'),
                /**
                 * @name dxPivotGridOptions.texts.noData
                 * @type string
                 * @default 'No data'
                 */
                noData: localizationMessage.format('dxDataGrid-noDataText'),
                /**
                  * @name dxPivotGridOptions.texts.showFieldChooser
                  * @type string
                  * @default 'Show Field Chooser'
                  */
                showFieldChooser: localizationMessage.format('dxPivotGrid-showFieldChooser'),
                /**
                 * @name dxPivotGridOptions.texts.expandAll
                 * @type string
                 * @default 'Expand All'
                 */
                expandAll: localizationMessage.format('dxPivotGrid-expandAll'),
                /**
                 * @name dxPivotGridOptions.texts.collapseAll
                 * @type string
                 * @default 'Collapse All'
                 */
                collapseAll: localizationMessage.format('dxPivotGrid-collapseAll'),
                /**
                 * @name dxPivotGridOptions.texts.sortColumnBySummary
                 * @type string
                 * @default 'Sort {0} by This Column'
                 */
                sortColumnBySummary: localizationMessage.getFormatter('dxPivotGrid-sortColumnBySummary'),
                /**
                 * @name dxPivotGridOptions.texts.sortRowBySummary
                 * @type string
                 * @default 'Sort {0} by This Row'
                 */
                sortRowBySummary: localizationMessage.getFormatter('dxPivotGrid-sortRowBySummary'),
                /**
                 * @name dxPivotGridOptions.texts.removeAllSorting
                 * @type string
                 * @default 'Remove All Sorting'
                 */
                removeAllSorting: localizationMessage.format('dxPivotGrid-removeAllSorting'),
                /**
                 * @name dxPivotGridOptions.texts.exportToExcel
                 * @type string
                 * @default "Export to Excel file"
                 */
                exportToExcel: localizationMessage.format('dxDataGrid-exportToExcel'),
                /**
                 * @name dxPivotGridOptions.texts.dataNotAvailable
                 * @type string
                 * @default "N/A"
                 */
                dataNotAvailable: localizationMessage.format('dxPivotGrid-dataNotAvailable')
            },
            onCellClick: null,
            onCellPrepared: null,
            showBorders: false,

            stateStoring: {
                /**
                 * @name dxPivotGridOptions.stateStoring.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxPivotGridOptions.stateStoring.storageKey
                 * @type string
                 * @default null
                 */
                storageKey: null,
                /**
                 * @name dxPivotGridOptions.stateStoring.type
                 * @type Enums.StateStoringType
                 * @default "localStorage"
                 */
                type: 'localStorage',

                /**
                 * @name dxPivotGridOptions.stateStoring.customLoad
                 * @type function()
                 * @type_function_return Promise<Object>
                 */
                customLoad: null,

                /**
                 * @name dxPivotGridOptions.stateStoring.customSave
                 * @type function(state)
                 * @type_function_param1 state:object
                 */
                customSave: null,

                /**
                 * @name dxPivotGridOptions.stateStoring.savingTimeout
                 * @type number
                 * @default 2000
                 */
                savingTimeout: 2000
            },

            onExpandValueChanging: null,
            renderCellCountLimit: 20000,
            onExporting: null,
            onExported: null,
            onFileSaving: null,
            headerFilter: {
                /**
                 * @name dxPivotGridOptions.headerFilter.width
                 * @type number
                 * @default 252
                 */
                width: 252,
                /**
                 * @name dxPivotGridOptions.headerFilter.height
                 * @type number
                 * @default 325
                 */
                height: 325,
                /**
                 * @name dxPivotGridOptions.headerFilter.allowSearch
                 * @type boolean
                 * @default false
                 */
                allowSearch: false,
                /**
                 * @name dxPivotGridOptions.headerFilter.showRelevantValues
                 * @type boolean
                 * @default false
                 */
                showRelevantValues: false,
                /**
                 * @name dxPivotGridOptions.headerFilter.searchTimeout
                 * @type number
                 * @default searchTimeout
                 */
                searchTimeout: 500,
                /**
                 * @name dxPivotGridOptions.headerFilter.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name dxPivotGridOptions.headerFilter.texts.emptyValue
                     * @type string
                     * @default "(Blanks)"
                     */
                    emptyValue: localizationMessage.format('dxDataGrid-headerFilterEmptyValue'),
                    /**
                     * @name dxPivotGridOptions.headerFilter.texts.ok
                     * @type string
                     * @default "Ok"
                     */
                    ok: localizationMessage.format('dxDataGrid-headerFilterOK'),
                    /**
                     * @name dxPivotGridOptions.headerFilter.texts.cancel
                     * @type string
                     * @default "Cancel"
                     */
                    cancel: localizationMessage.format('dxDataGrid-headerFilterCancel')
                }
            }
        });
    },

    _updateCalculatedOptions: function(fields) {
        const that = this;
        each(fields, function(index, field) {
            each(FIELD_CALCULATED_OPTIONS, function(_, optionName) {
                const isCalculated = field._initProperties
                    && (optionName in field._initProperties)
                    && (field._initProperties[optionName] === undefined);
                const needUpdate = field[optionName] === undefined || isCalculated;
                if(needUpdate) {
                    setFieldProperty(field, optionName, that.option(optionName));
                }
            });
        });
    },

    _getDataControllerOptions: function() {
        const that = this;
        return {
            component: that,
            dataSource: that.option('dataSource'),
            texts: that.option('texts'),
            showRowTotals: that.option('showRowTotals'),
            showRowGrandTotals: that.option('showRowGrandTotals'),
            showColumnTotals: that.option('showColumnTotals'),
            showTotalsPrior: that.option('showTotalsPrior'),
            showColumnGrandTotals: that.option('showColumnGrandTotals'),
            dataFieldArea: that.option('dataFieldArea'),
            rowHeaderLayout: that.option('rowHeaderLayout'),
            hideEmptySummaryCells: that.option('hideEmptySummaryCells'),

            onFieldsPrepared: function(fields) {
                that._updateCalculatedOptions(fields);
            }
        };
    },

    _initDataController: function() {
        const that = this;
        that._dataController && that._dataController.dispose();

        that._dataController = new DataController(that._getDataControllerOptions());

        if(hasWindow()) {
            that._dataController.changed.add(function() {
                that._render();
            });
        }

        that._dataController.scrollChanged.add(function(options) {
            that._scrollLeft = options.left;
            that._scrollTop = options.top;
        });

        that._dataController.loadingChanged.add(function(isLoading) {
            that._updateLoading();
        });

        that._dataController.progressChanged.add(that._updateLoading.bind(that));

        that._dataController.dataSourceChanged.add(function() {
            that._trigger('onChanged');
        });

        const expandValueChanging = that.option('onExpandValueChanging');

        if(expandValueChanging) {
            that._dataController.expandValueChanging.add(function(e) {
                expandValueChanging(e);
            });
        }
    },

    _init: function() {
        const that = this;

        that.callBase();
        that._initDataController();

        that._scrollLeft = that._scrollTop = null;
        that._initActions();
    },

    _initActions: function() {
        const that = this;
        that._actions = {
            onChanged: that._createActionByOption('onChanged'),
            onContextMenuPreparing: that._createActionByOption('onContextMenuPreparing'),
            onCellClick: that._createActionByOption('onCellClick'),
            onExporting: that._createActionByOption('onExporting'),
            onExported: that._createActionByOption('onExported'),
            onFileSaving: that._createActionByOption('onFileSaving'),
            onCellPrepared: that._createActionByOption('onCellPrepared'),
        };
    },

    _trigger: function(eventName, eventArg) {
        this._actions[eventName](eventArg);
    },

    _optionChanged: function(args) {
        const that = this;

        if(FIELD_CALCULATED_OPTIONS.indexOf(args.name) >= 0) {
            const fields = this.getDataSource().fields();
            this._updateCalculatedOptions(fields);
        }

        switch(args.name) {
            case 'dataSource':
            case 'allowSorting':
            case 'allowFiltering':
            case 'allowExpandAll':
            case 'allowSortingBySummary':
            case 'scrolling':
            case 'stateStoring':
                that._initDataController();
                that._fieldChooserPopup.hide();
                that._renderFieldChooser();
                that._invalidate();
                break;
            case 'texts':
            case 'showTotalsPrior':
            case 'showRowTotals':
            case 'showRowGrandTotals':
            case 'showColumnTotals':
            case 'showColumnGrandTotals':
            case 'hideEmptySummaryCells':
            case 'dataFieldArea':
                that._dataController.updateViewOptions(that._getDataControllerOptions());
                break;
            case 'useNativeScrolling':
            case 'encodeHtml':
            case 'renderCellCountLimit':
                break;
            case 'rtlEnabled':
                that.callBase(args);
                that._renderFieldChooser();
                that._renderContextMenu();
                hasWindow() && that._renderLoadPanel(that._dataArea.groupElement(), that.$element());
                that._invalidate();
                break;
            case 'export':
                that._renderDescriptionArea();
                break;
            case 'onExpandValueChanging':
                break;
            case 'onCellClick':
            case 'onContextMenuPreparing':
            case 'onExporting':
            case 'onExported':
            case 'onFileSaving':
            case 'onCellPrepared':
                that._actions[args.name] = that._createActionByOption(args.name);
                break;
            case 'fieldChooser':
                that._renderFieldChooser();
                that._renderDescriptionArea();
                break;
            case 'loadPanel':
                if(hasWindow()) {
                    that._renderLoadPanel(that._dataArea.groupElement(), that.$element());
                    that._invalidate();
                }
                break;
            case 'fieldPanel':
                that._renderDescriptionArea();
                that._invalidate();
                break;
            case 'headerFilter':
                that._renderFieldChooser();
                that._invalidate();
                break;
            case 'showBorders':
                that._tableElement().toggleClass(BORDERS_CLASS, !!args.value);
                that.updateDimensions();
                break;
            case 'wordWrapEnabled':
                that._tableElement().toggleClass('dx-word-wrap', !!args.value);
                that.updateDimensions();
                break;
            case 'rowHeaderLayout':
                that._tableElement().find('.' + ROW_AREA_CELL_CLASS).toggleClass('dx-area-tree-view', args.value === 'tree');
                that._dataController.updateViewOptions(that._getDataControllerOptions());
                break;
            case 'height':
            case 'width':
                that._hasHeight = null;
                that.callBase(args);
                that.resize();
                break;
            default:
                that.callBase(args);
        }
    },

    _updateScrollPosition: function(columnsArea, rowsArea, dataArea) {
        const that = this;
        let scrollTop;
        let scrollLeft;
        const scrolled = that._scrollTop || that._scrollLeft;

        if(that._scrollUpdating) return; // T645458

        that._scrollUpdating = true;

        if(rowsArea && !rowsArea.hasScroll() && that._hasHeight) {
            that._scrollTop = null;
        }

        if(columnsArea && !columnsArea.hasScroll()) {
            that._scrollLeft = null;
        }
        if(that._scrollTop !== null || that._scrollLeft !== null || scrolled || that.option('rtlEnabled')) {
            scrollTop = that._scrollTop || 0;
            scrollLeft = that._scrollLeft || 0;
            dataArea.scrollTo({ x: scrollLeft, y: scrollTop });
            columnsArea.scrollTo(scrollLeft);
            rowsArea.scrollTo(scrollTop);
            that._dataController.updateWindowScrollPosition(that._scrollTop);
        }

        that._scrollUpdating = false;
    },

    _subscribeToEvents: function(columnsArea, rowsArea, dataArea) {
        const that = this;
        const scrollHandler = function(e) {
            const scrollOffset = e.scrollOffset;
            const leftOffset = isDefined(scrollOffset.left) ? scrollOffset.left : that._scrollLeft;
            const topOffset = isDefined(scrollOffset.top) && that._hasHeight ? scrollOffset.top : that._scrollTop;

            if((that._scrollLeft || 0) !== (leftOffset || 0) || (that._scrollTop || 0) !== (topOffset || 0)) {

                that._scrollLeft = leftOffset;
                that._scrollTop = topOffset;

                that._updateScrollPosition(columnsArea, rowsArea, dataArea);

                if(that.option('scrolling.mode') === 'virtual') {
                    that._dataController.setViewportPosition(that._scrollLeft, that._scrollTop);
                }
            }
        };

        each([columnsArea, rowsArea, dataArea], function(_, area) {
            subscribeToScrollEvent(area, scrollHandler);
        });

        !that._hasHeight && that._dataController.subscribeToWindowScrollEvents(dataArea.groupElement());
    },

    _clean: noop,

    _needDelayResizing: function(cellsInfo) {
        const cellsCount = cellsInfo.length * (cellsInfo.length ? cellsInfo[0].length : 0);
        return cellsCount > this.option('renderCellCountLimit');
    },

    _renderFieldChooser: function() {
        const that = this;
        const container = that._pivotGridContainer;
        const fieldChooserOptions = that.option('fieldChooser') || {};
        const toolbarItems = fieldChooserOptions.applyChangesMode === 'onDemand' ? [
            {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                options: {
                    text: localizationMessage.format('OK'),
                    onClick: function(e) {
                        that._fieldChooserPopup.$content().dxPivotGridFieldChooser('applyChanges');
                        that._fieldChooserPopup.hide();
                    }
                }
            },
            {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                options: {
                    text: localizationMessage.format('Cancel'),
                    onClick: function(e) {
                        that._fieldChooserPopup.hide();
                    }
                }
            }
        ] : [];
        const fieldChooserComponentOptions = {
            layout: fieldChooserOptions.layout,
            texts: fieldChooserOptions.texts || {},
            dataSource: that.getDataSource(),
            allowSearch: fieldChooserOptions.allowSearch,
            searchTimeout: fieldChooserOptions.searchTimeout,
            width: undefined,
            height: undefined,
            headerFilter: that.option('headerFilter'),
            encodeHtml: that.option('encodeHtml'),
            applyChangesMode: fieldChooserOptions.applyChangesMode,
            onContextMenuPreparing: function(e) {
                that._trigger('onContextMenuPreparing', e);
            }
        };
        const popupOptions = {
            shading: false,
            title: fieldChooserOptions.title,
            width: fieldChooserOptions.width,
            height: fieldChooserOptions.height,
            showCloseButton: true,
            resizeEnabled: true,
            minWidth: fieldChooserOptions.minWidth,
            minHeight: fieldChooserOptions.minHeight,
            toolbarItems: toolbarItems,
            onResize: function(e) {
                e.component.$content().dxPivotGridFieldChooser('updateDimensions');
            },
            onShown: function(e) {
                that._createComponent(e.component.content(), PivotGridFieldChooser, fieldChooserComponentOptions);
            },
            onHidden: function(e) {
                const fieldChooser = e.component.$content().dxPivotGridFieldChooser('instance');
                fieldChooser.resetTreeView();
                fieldChooser.cancelChanges();
            }
        };

        if(that._fieldChooserPopup) {
            that._fieldChooserPopup.option(popupOptions);
            that._fieldChooserPopup.$content().dxPivotGridFieldChooser(fieldChooserComponentOptions);
        } else {
            that._fieldChooserPopup = that._createComponent($(DIV).addClass(FIELD_CHOOSER_POPUP_CLASS).appendTo(container), Popup, popupOptions);
        }
    },

    _renderContextMenu: function() {
        const that = this;
        const $container = that._pivotGridContainer;

        if(that._contextMenu) {
            that._contextMenu.$element().remove();
        }

        that._contextMenu = that._createComponent($(DIV).appendTo($container), ContextMenu, {
            onPositioning: function(actionArgs) {
                const event = actionArgs.event;

                actionArgs.cancel = true;

                if(!event) {
                    return;
                }

                const targetElement = event.target.cellIndex >= 0 ? event.target : $(event.target).closest('td').get(0);
                if(!targetElement) {
                    return;
                }

                const args = that._createEventArgs(targetElement, event);
                const items = that._getContextMenuItems(args);
                if(items) {
                    actionArgs.component.option('items', items);
                    actionArgs.cancel = false;
                    return;
                }
            },
            onItemClick: function(params) {
                params.itemData.onItemClick && params.itemData.onItemClick(params);
            },
            cssClass: PIVOTGRID_CLASS,
            target: that.$element()
        });
    },

    _getContextMenuItems: function(e) {
        const that = this;
        let items = [];
        const texts = that.option('texts');

        if(e.area === 'row' || e.area === 'column') {
            const areaFields = e[e.area + 'Fields'];
            const oppositeAreaFields = e[e.area === 'column' ? 'rowFields' : 'columnFields'];
            const field = e.cell.path && areaFields[e.cell.path.length - 1];
            const dataSource = that.getDataSource();

            if(field && field.allowExpandAll && e.cell.path.length < e[e.area + 'Fields'].length && !dataSource.paginate()) {
                items.push({
                    beginGroup: true,
                    icon: 'none',
                    text: texts.expandAll,
                    onItemClick: function() {
                        dataSource.expandAll(field.index);
                    }
                });
                items.push({
                    text: texts.collapseAll,
                    icon: 'none',
                    onItemClick: function() {
                        dataSource.collapseAll(field.index);
                    }
                });
            }

            if(e.cell.isLast && !dataSource.paginate()) {
                let sortingBySummaryItemCount = 0;
                each(oppositeAreaFields, function(index, field) {
                    if(!field.allowSortingBySummary) {
                        return;
                    }

                    each(e.dataFields, function(dataIndex, dataField) {
                        if(isDefined(e.cell.dataIndex) && e.cell.dataIndex !== dataIndex) {
                            return;
                        }

                        const showDataFieldCaption = (!isDefined(e.cell.dataIndex) && e.dataFields.length > 1);
                        const textFormat = e.area === 'column' ? texts.sortColumnBySummary : texts.sortRowBySummary;
                        const checked = findField(e.dataFields, field.sortBySummaryField) === dataIndex && (e.cell.path || []).join('/') === (field.sortBySummaryPath || []).join('/');
                        const text = formatString(textFormat, showDataFieldCaption ? field.caption + ' - ' + dataField.caption : field.caption);

                        items.push({
                            beginGroup: sortingBySummaryItemCount === 0,
                            icon: checked ? (field.sortOrder === 'desc' ? 'sortdowntext' : 'sortuptext') : 'none',
                            text: text,
                            onItemClick: function() {
                                dataSource.field(field.index, {
                                    sortBySummaryField: dataField.name || dataField.caption || dataField.dataField,
                                    sortBySummaryPath: e.cell.path,
                                    sortOrder: field.sortOrder === 'desc' ? 'asc' : 'desc'
                                });
                                dataSource.load();
                            }
                        });
                        sortingBySummaryItemCount++;
                    });

                });
                each(oppositeAreaFields, function(index, field) {
                    if(!field.allowSortingBySummary || !isDefined(field.sortBySummaryField)) {
                        return;
                    }
                    items.push({
                        beginGroup: sortingBySummaryItemCount === 0,
                        icon: 'none',
                        text: texts.removeAllSorting,
                        onItemClick: function() {
                            each(oppositeAreaFields, function(index, field) {
                                dataSource.field(field.index, {
                                    sortBySummaryField: undefined,
                                    sortBySummaryPath: undefined,
                                    sortOrder: undefined
                                });
                            });
                            dataSource.load();
                        }
                    });
                    return false;
                });
            }
        }

        if(that.option('fieldChooser.enabled')) {
            items.push({
                beginGroup: true,
                icon: 'columnchooser',
                text: texts.showFieldChooser,
                onItemClick: function() {
                    that._fieldChooserPopup.show();
                }
            });
        }

        if(that.option('export.enabled')) {
            items.push({
                beginGroup: true,
                icon: 'xlsxfile',
                text: texts.exportToExcel,
                onItemClick: function() {
                    that.exportToExcel();
                }
            });
        }

        e.items = items;
        that._trigger('onContextMenuPreparing', e);
        items = e.items;

        if(items && items.length) {
            return items;
        }
    },

    _createEventArgs: function(targetElement, dxEvent) {
        const that = this;
        const dataSource = that.getDataSource();
        const args = {
            rowFields: dataSource.getAreaFields('row'),
            columnFields: dataSource.getAreaFields('column'),
            dataFields: dataSource.getAreaFields('data'),
            event: dxEvent
        };

        if(clickedOnFieldsArea($(targetElement))) {
            return extend(that._createFieldArgs(targetElement), args);
        } else {
            return extend(that._createCellArgs(targetElement), args);
        }
    },

    _createFieldArgs: function(targetElement) {
        const field = $(targetElement).children().data('field');
        const args = {
            field: field
        };
        return isDefined(field) ? args : {};
    },

    _createCellArgs: function(cellElement) {
        const $cellElement = $(cellElement);
        const columnIndex = cellElement.cellIndex;
        const rowIndex = cellElement.parentElement.rowIndex;
        const $table = $cellElement.closest('table');
        const data = $table.data('data');
        const cell = data && data[rowIndex] && data[rowIndex][columnIndex];
        const args = {
            area: $table.data('area'),
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            cellElement: getPublicElement($cellElement),
            cell: cell
        };
        return args;
    },

    _handleCellClick: function(e) {
        const that = this;
        const args = that._createEventArgs(e.currentTarget, e);
        const cell = args.cell;

        if(!cell || (!args.area && (args.rowIndex || args.columnIndex))) {
            return;
        }

        that._trigger('onCellClick', args);

        cell && !args.cancel && isDefined(cell.expanded) && setTimeout(function() {
            that._dataController[cell.expanded ? 'collapseHeaderItem' : 'expandHeaderItem'](args.area, cell.path);
        });
    },

    _getNoDataText: function() {
        return this.option('texts.noData');
    },

    _renderNoDataText: gridCoreUtils.renderNoDataText,

    _renderLoadPanel: gridCoreUtils.renderLoadPanel,

    _updateLoading: function(progress) {
        const that = this;
        const isLoading = that._dataController.isLoading();

        if(!that._loadPanel) return;

        const loadPanelVisible = that._loadPanel.option('visible');

        if(!loadPanelVisible) {
            that._startLoadingTime = new Date();
        }
        if(isLoading) {
            if(progress) {
                if(new Date() - that._startLoadingTime >= 1000) {
                    that._loadPanel.option('message', Math.floor(progress * 100) + '%');
                }
            } else {
                that._loadPanel.option('message', that.option('loadPanel.text'));
            }
        }
        clearTimeout(that._hideLoadingTimeoutID);
        if(loadPanelVisible && !isLoading) {
            that._hideLoadingTimeoutID = setTimeout(function() {
                that._loadPanel.option('visible', false);
                that.$element().removeClass(OVERFLOW_HIDDEN_CLASS);
            });
        } else {
            that._loadPanel.option('visible', isLoading);
            that.$element().toggleClass(OVERFLOW_HIDDEN_CLASS, !isLoading);
        }
    },

    _renderDescriptionArea: function() {
        const $element = this.$element();
        const $descriptionCell = $element.find('.' + DESCRIPTION_AREA_CELL_CLASS);
        const $toolbarContainer = $(DIV).addClass('dx-pivotgrid-toolbar');
        const fieldPanel = this.option('fieldPanel');
        const $filterHeader = $element.find('.dx-filter-header');
        const $columnHeader = $element.find('.dx-column-header');

        let $targetContainer;

        if(fieldPanel.visible && fieldPanel.showFilterFields) {
            $targetContainer = $filterHeader;
        } else if(fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)) {
            $targetContainer = $columnHeader;
        } else {
            $targetContainer = $descriptionCell;
        }

        $columnHeader.toggleClass(BOTTOM_BORDER_CLASS, !!(fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)));
        $filterHeader.toggleClass(BOTTOM_BORDER_CLASS, !!(fieldPanel.visible && fieldPanel.showFilterFields));

        $descriptionCell.toggleClass('dx-pivotgrid-background', fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields || fieldPanel.showRowFields));

        this.$element().find('.dx-pivotgrid-toolbar').remove();

        $toolbarContainer.prependTo($targetContainer);

        if(this.option('fieldChooser.enabled')) {
            const $buttonElement = $(DIV)
                .appendTo($toolbarContainer)
                .addClass('dx-pivotgrid-field-chooser-button');
            const buttonOptions = {
                icon: 'columnchooser',
                hint: this.option('texts.showFieldChooser'),
                onClick: () => {
                    this.getFieldChooserPopup().show();
                }
            };

            this._createComponent($buttonElement, 'dxButton', buttonOptions);
        }

        if(this.option('export.enabled')) {
            const $buttonElement = $(DIV)
                .appendTo($toolbarContainer)
                .addClass('dx-pivotgrid-export-button');
            const buttonOptions = {
                icon: 'xlsxfile',
                hint: this.option('texts.exportToExcel'),
                onClick: () => {
                    this.exportToExcel();
                }
            };

            this._createComponent($buttonElement, 'dxButton', buttonOptions);
        }
    },

    _detectHasContainerHeight: function() {
        const that = this;
        const element = that.$element();

        if(isDefined(that._hasHeight)) {
            const height = that.option('height') || that.$element().get(0).style.height;

            if(height && (that._hasHeight ^ height !== 'auto')) {
                that._hasHeight = null;
            }
        }

        if(isDefined(that._hasHeight) || element.is(':hidden')) {
            return;
        }

        that._pivotGridContainer.addClass('dx-hidden');
        const testElement = $(DIV).height(TEST_HEIGHT);
        element.append(testElement);
        that._hasHeight = element.height() !== TEST_HEIGHT;
        that._pivotGridContainer.removeClass('dx-hidden');
        testElement.remove();
    },

    _renderHeaders: function(rowHeaderContainer, columnHeaderContainer, filterHeaderContainer, dataHeaderContainer) {
        const that = this;
        const dataSource = that.getDataSource();

        that._rowFields = that._rowFields || new FieldsArea(that, 'row');
        that._rowFields.render(rowHeaderContainer, dataSource.getAreaFields('row'));

        that._columnFields = that._columnFields || new FieldsArea(that, 'column');
        that._columnFields.render(columnHeaderContainer, dataSource.getAreaFields('column'));

        that._filterFields = that._filterFields || new FieldsArea(that, 'filter');
        that._filterFields.render(filterHeaderContainer, dataSource.getAreaFields('filter'));

        that._dataFields = that._dataFields || new FieldsArea(that, 'data');
        that._dataFields.render(dataHeaderContainer, dataSource.getAreaFields('data'));

        that.$element().dxPivotGridFieldChooserBase('instance').renderSortable();
    },

    _createTableElement: function() {
        const that = this;
        const $table = $('<table>')
            .css({ width: '100%' })
            .toggleClass(BORDERS_CLASS, !!that.option('showBorders'))
            .toggleClass('dx-word-wrap', !!that.option('wordWrapEnabled'));

        eventsEngine.on($table, addNamespace(clickEventName, 'dxPivotGrid'), 'td', that._handleCellClick.bind(that));

        return $table;
    },

    _renderDataArea: function(dataAreaElement) {
        const that = this;
        const dataArea = that._dataArea || new DataArea(that);
        that._dataArea = dataArea;
        dataArea.render(dataAreaElement, that._dataController.getCellsInfo());

        return dataArea;
    },

    _renderRowsArea: function(rowsAreaElement) {
        const that = this;
        const rowsArea = that._rowsArea || new VerticalHeadersArea(that);
        that._rowsArea = rowsArea;
        rowsArea.render(rowsAreaElement, that._dataController.getRowsInfo());

        return rowsArea;
    },

    _renderColumnsArea: function(columnsAreaElement) {
        const that = this;
        const columnsArea = that._columnsArea || new HorizontalHeadersArea(that);
        that._columnsArea = columnsArea;
        columnsArea.render(columnsAreaElement, that._dataController.getColumnsInfo());

        return columnsArea;
    },

    _initMarkup: function() {
        const that = this;
        that.callBase.apply(this, arguments);
        that.$element().addClass(PIVOTGRID_CLASS);
    },

    _renderContentImpl: function() {
        const that = this;
        let columnsAreaElement;
        let rowsAreaElement;
        let dataAreaElement;
        let tableElement;
        const isFirstDrawing = !that._pivotGridContainer;
        let rowHeaderContainer;
        let columnHeaderContainer;
        let filterHeaderContainer;
        let dataHeaderContainer;

        tableElement = !isFirstDrawing && that._tableElement();

        if(!tableElement) {
            that.$element().addClass(ROW_LINES_CLASS)
                .addClass(FIELDS_CONTAINER_CLASS);

            that._pivotGridContainer = $(DIV).addClass('dx-pivotgrid-container');
            that._renderFieldChooser();
            that._renderContextMenu();

            columnsAreaElement = $(TD).addClass(COLUMN_AREA_CELL_CLASS);
            rowsAreaElement = $(TD).addClass(ROW_AREA_CELL_CLASS);
            dataAreaElement = $(TD).addClass(DATA_AREA_CELL_CLASS);

            tableElement = that._createTableElement();

            dataHeaderContainer = $(TD).addClass('dx-data-header');

            filterHeaderContainer = $('<td>').attr('colspan', '2').addClass('dx-filter-header');
            columnHeaderContainer = $(TD).addClass('dx-column-header');
            rowHeaderContainer = $(TD).addClass(DESCRIPTION_AREA_CELL_CLASS);

            $(TR)
                .append(filterHeaderContainer)
                .appendTo(tableElement);

            $(TR)
                .append(dataHeaderContainer)
                .append(columnHeaderContainer)
                .appendTo(tableElement);

            $(TR)
                .toggleClass('dx-ie', coreBrowserUtils.msie === true)
                .append(rowHeaderContainer)
                .append(columnsAreaElement)
                .appendTo(tableElement);

            $(TR)
                .addClass(BOTTOM_ROW_CLASS)
                .append(rowsAreaElement)
                .append(dataAreaElement)
                .appendTo(tableElement);

            that._pivotGridContainer.append(tableElement);
            that.$element().append(that._pivotGridContainer);

            if(that.option('rowHeaderLayout') === 'tree') {
                rowsAreaElement.addClass('dx-area-tree-view');
            }
        }

        that.$element().addClass(OVERFLOW_HIDDEN_CLASS);

        that._createComponent(that.$element(), PivotGridFieldChooserBase, {
            dataSource: that.getDataSource(),
            encodeHtml: that.option('encodeHtml'),
            allowFieldDragging: that.option('fieldPanel.allowFieldDragging'),
            headerFilter: that.option('headerFilter'),
            visible: that.option('visible')
        });

        const dataArea = that._renderDataArea(dataAreaElement);
        const rowsArea = that._renderRowsArea(rowsAreaElement);
        const columnsArea = that._renderColumnsArea(columnsAreaElement);

        dataArea.tableElement().prepend(columnsArea.headElement());

        if(isFirstDrawing) {
            that._renderLoadPanel(dataArea.groupElement().parent(), that.$element());
            that._renderDescriptionArea();

            rowsArea.processScroll();
            columnsArea.processScroll();
        }

        [dataArea, rowsArea, columnsArea].forEach(function(area) {
            unsubscribeScrollEvents(area);
        });

        that._renderHeaders(rowHeaderContainer, columnHeaderContainer, filterHeaderContainer, dataHeaderContainer);

        that._update(isFirstDrawing);
    },

    _update: function(isFirstDrawing) {
        const that = this;
        const updateHandler = function() {
            that.updateDimensions();
        };
        if(that._needDelayResizing(that._dataArea.getData()) && isFirstDrawing) {
            setTimeout(updateHandler);
        } else {
            updateHandler();
        }
    },

    _fireContentReadyAction: function() {
        if(!this._dataController.isLoading()) {
            this.callBase();
        }
    },

    getScrollPath: function(area) {
        const that = this;

        if(area === 'column') {
            return that._columnsArea.getScrollPath(that._scrollLeft);
        } else {
            return that._rowsArea.getScrollPath(that._scrollTop);
        }
    },

    getDataSource: function() {
        return this._dataController.getDataSource();
    },

    getFieldChooserPopup: function() {
        return this._fieldChooserPopup;
    },

    hasScroll: function(area) {
        const that = this;
        return area === 'column' ? that._columnsArea.hasScroll() : that._rowsArea.hasScroll();
    },

    _dimensionChanged: function() {
        this.updateDimensions();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this.updateDimensions();
        }
    },

    _dispose: function() {
        const that = this;
        clearTimeout(that._hideLoadingTimeoutID);
        that.callBase.apply(that, arguments);
        if(that._dataController) {
            that._dataController.dispose();
        }
    },

    _tableElement: function() {
        return this.$element().find('table').first();
    },

    addWidgetPrefix: function(className) {
        return 'dx-pivotgrid-' + className;
    },

    resize: function() {
        this.updateDimensions();
    },

    isReady: function() {
        return this.callBase() && !this._dataController.isLoading();
    },

    updateDimensions: function() {
        const that = this;
        let groupWidth;
        const tableElement = that._tableElement();
        const rowsArea = that._rowsArea;
        const columnsArea = that._columnsArea;
        const dataArea = that._dataArea;
        let bordersWidth;
        let totalWidth = 0;
        let totalHeight = 0;
        let rowsAreaWidth = 0;
        let hasRowsScroll;
        let hasColumnsScroll;
        const scrollingOptions = that.option('scrolling') || {};
        const scrollBarInfo = getScrollBarInfo(scrollingOptions.useNative);
        const scrollBarWidth = scrollBarInfo.scrollBarWidth;
        const dataAreaCell = tableElement.find('.' + DATA_AREA_CELL_CLASS);
        const rowAreaCell = tableElement.find('.' + ROW_AREA_CELL_CLASS);
        const columnAreaCell = tableElement.find('.' + COLUMN_AREA_CELL_CLASS);
        const descriptionCell = tableElement.find('.' + DESCRIPTION_AREA_CELL_CLASS);
        const filterHeaderCell = tableElement.find('.dx-filter-header');
        const columnHeaderCell = tableElement.find('.dx-column-header');
        const rowFieldsHeader = that._rowFields;
        const d = new Deferred();

        if(!hasWindow()) {
            return;
        }

        const needSynchronizeFieldPanel = rowFieldsHeader.isVisible() && that.option('rowHeaderLayout') !== 'tree';

        ///#DEBUG
        that.__scrollBarUseNative = scrollBarInfo.scrollBarUseNative;
        that.__scrollBarWidth = scrollBarWidth;
        ///#ENDDEBUG

        that._detectHasContainerHeight();

        if(!dataArea.headElement().length) {
            dataArea.tableElement().prepend(columnsArea.headElement());
        }

        if(needSynchronizeFieldPanel) {
            rowsArea.updateColspans(rowFieldsHeader.getColumnsCount());
            rowsArea.tableElement().prepend(rowFieldsHeader.headElement());
        }

        tableElement.addClass(INCOMPRESSIBLE_FIELDS_CLASS);
        dataArea.reset();
        rowsArea.reset();
        columnsArea.reset();
        rowFieldsHeader.reset();

        const calculateHasScroll = (areaSize, totalSize) => totalSize - areaSize >= 1;
        const calculateGroupHeight = (dataAreaHeight, totalHeight, hasRowsScroll, hasColumnsScroll, scrollBarWidth) => {
            return hasRowsScroll ? dataAreaHeight : totalHeight + (hasColumnsScroll ? scrollBarWidth : 0);
        };

        deferUpdate(function() {
            const resultWidths = dataArea.getColumnsWidth();

            const rowHeights = rowsArea.getRowsHeight();

            const rowsAreaHeights = needSynchronizeFieldPanel ? rowHeights.slice(1) : rowHeights;
            const dataAreaHeights = dataArea.getRowsHeight();

            const descriptionCellHeight = getSize(descriptionCell[0], 'height', {
                paddings: true,
                borders: true,
                margins: true
            }) + (needSynchronizeFieldPanel ? rowHeights[0] : 0);

            const columnsAreaRowCount = that._dataController.getColumnsInfo().length;

            const resultHeights = mergeArraysByMaxValue(rowsAreaHeights, dataAreaHeights.slice(columnsAreaRowCount));

            const columnsAreaRowHeights = dataAreaHeights.slice(0, columnsAreaRowCount);
            const columnsAreaHeight = getArraySum(columnsAreaRowHeights);

            const rowsAreaColumnWidths = rowsArea.getColumnsWidth();

            let filterAreaHeight = 0;
            let dataAreaHeight = 0;
            if(that._hasHeight) {
                filterAreaHeight = filterHeaderCell.height();

                const $dataHeader = tableElement.find('.dx-data-header');
                const dataHeaderHeight = coreBrowserUtils.msie
                    ? getSize($dataHeader.get(0), 'height', { paddings: false, borders: false, margins: false })
                    : $dataHeader.height();

                bordersWidth = getCommonBorderWidth([columnAreaCell, dataAreaCell, tableElement, columnHeaderCell, filterHeaderCell], 'height');
                dataAreaHeight = that.$element().height() - filterAreaHeight - dataHeaderHeight - (Math.max(dataArea.headElement().height(), columnAreaCell.height(), descriptionCellHeight) + bordersWidth);
            }

            totalWidth = dataArea.tableElement().width();

            totalHeight = getArraySum(resultHeights);

            if(!totalWidth || !totalHeight) {
                d.resolve();
                return;
            }

            rowsAreaWidth = getArraySum(rowsAreaColumnWidths);

            const elementWidth = that.$element().width();

            bordersWidth = getCommonBorderWidth([rowAreaCell, dataAreaCell, tableElement], 'width');
            groupWidth = elementWidth - rowsAreaWidth - bordersWidth;

            groupWidth = groupWidth > 0 ? groupWidth : totalWidth;
            const diff = totalWidth - groupWidth;
            const needAdjustWidthOnZoom = diff >= 0 && diff <= 2;
            if(needAdjustWidthOnZoom) { // T914454
                adjustSizeArray(resultWidths, diff);
                totalWidth = groupWidth;
            }

            hasRowsScroll = that._hasHeight && calculateHasScroll(dataAreaHeight, totalHeight);
            hasColumnsScroll = calculateHasScroll(groupWidth, totalWidth);

            const groupHeight = calculateGroupHeight(dataAreaHeight, totalHeight, hasRowsScroll, hasColumnsScroll, scrollBarWidth);

            deferRender(function() {
                columnsArea.tableElement().append(dataArea.headElement());

                rowFieldsHeader.tableElement().append(rowsArea.headElement());

                if(!hasColumnsScroll && hasRowsScroll && scrollBarWidth) {
                    adjustSizeArray(resultWidths, scrollBarWidth);
                    totalWidth -= scrollBarWidth;
                }

                if(descriptionCellHeight > columnsAreaHeight) {
                    adjustSizeArray(columnsAreaRowHeights, columnsAreaHeight - descriptionCellHeight);
                    columnsArea.setRowsHeight(columnsAreaRowHeights);
                }

                tableElement.removeClass(INCOMPRESSIBLE_FIELDS_CLASS);
                columnHeaderCell.children().css('maxWidth', groupWidth);
                columnsArea.groupWidth(groupWidth);
                columnsArea.processScrollBarSpacing(hasRowsScroll ? scrollBarWidth : 0);
                columnsArea.setColumnsWidth(resultWidths);

                rowsArea.groupHeight(that._hasHeight ? groupHeight : 'auto');
                rowsArea.processScrollBarSpacing(hasColumnsScroll ? scrollBarWidth : 0);
                // B232690
                rowsArea.setColumnsWidth(rowsAreaColumnWidths);
                rowsArea.setRowsHeight(resultHeights);

                dataArea.setColumnsWidth(resultWidths);
                dataArea.setRowsHeight(resultHeights);
                dataArea.groupWidth(groupWidth);
                dataArea.groupHeight(that._hasHeight ? groupHeight : 'auto');

                needSynchronizeFieldPanel && rowFieldsHeader.setColumnsWidth(rowsAreaColumnWidths);

                dataAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !hasRowsScroll);
                rowAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !hasRowsScroll);

                // T317921
                if(!that._hasHeight && (elementWidth !== that.$element().width())) {
                    const diff = elementWidth - that.$element().width();
                    if(!hasColumnsScroll) {
                        adjustSizeArray(resultWidths, diff);
                        columnsArea.setColumnsWidth(resultWidths);
                        dataArea.setColumnsWidth(resultWidths);
                    }

                    dataArea.groupWidth(groupWidth - diff);
                    columnsArea.groupWidth(groupWidth - diff);
                }

                if(that._hasHeight && that._filterFields.isVisible() &&
                    filterHeaderCell.height() !== filterAreaHeight) {
                    const diff = filterHeaderCell.height() - filterAreaHeight;
                    if(diff > 0) {
                        hasRowsScroll = calculateHasScroll(dataAreaHeight - diff, totalHeight);
                        const groupHeight = calculateGroupHeight(dataAreaHeight - diff, totalHeight, hasRowsScroll, hasColumnsScroll, scrollBarWidth);

                        dataArea.groupHeight(groupHeight);
                        rowsArea.groupHeight(groupHeight);
                    }
                }

                if(scrollingOptions.mode === 'virtual') {
                    const virtualContentParams = that._dataController.calculateVirtualContentParams({
                        virtualRowHeight: scrollingOptions.virtualRowHeight,
                        virtualColumnWidth: scrollingOptions.virtualColumnWidth,
                        itemWidths: resultWidths,
                        itemHeights: resultHeights,
                        rowCount: resultHeights.length,
                        columnCount: resultWidths.length,
                        viewportWidth: groupWidth,
                        viewportHeight: that._hasHeight ? groupHeight : $(window).outerHeight()
                    });

                    dataArea.setVirtualContentParams({
                        top: virtualContentParams.contentTop,
                        left: virtualContentParams.contentLeft,
                        width: virtualContentParams.width,
                        height: virtualContentParams.height
                    });

                    rowsArea.setVirtualContentParams({
                        top: virtualContentParams.contentTop,
                        width: rowsAreaWidth,
                        height: virtualContentParams.height
                    });

                    columnsArea.setVirtualContentParams({
                        left: virtualContentParams.contentLeft,
                        width: virtualContentParams.width,
                        height: columnsArea.groupElement().height()
                    });

                }

                const updateScrollableResults = [];

                dataArea.processScroll(scrollBarInfo.scrollBarUseNative, hasColumnsScroll, hasRowsScroll);
                each([columnsArea, rowsArea, dataArea], function(_, area) {
                    updateScrollableResults.push(area && area.updateScrollable());
                });

                that._updateLoading();
                that._renderNoDataText(dataAreaCell);

                ///#DEBUG
                that._testResultWidths = resultWidths;
                that._testResultHeights = resultHeights;
                ///#ENDDEBUG

                when.apply($, updateScrollableResults).done(function() {
                    that._updateScrollPosition(columnsArea, rowsArea, dataArea);
                    that._subscribeToEvents(columnsArea, rowsArea, dataArea);
                    d.resolve();
                });
            });
        });
        return d;
    },

    applyPartialDataSource: function(area, path, dataSource) {
        this._dataController.applyPartialDataSource(area, path, dataSource);
    }
})
    .inherit(ExportMixin)
    .include(chartIntegrationMixin);

registerComponent('dxPivotGrid', PivotGrid);

export default PivotGrid;

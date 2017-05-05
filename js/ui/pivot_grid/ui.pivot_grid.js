"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    stringUtils = require("../../core/utils/string"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    clickEvent = require("../../events/click"),
    messageLocalization = require("../../localization/message"),
    Widget = require("../widget/ui.widget"),
    eventUtils = require("../../events/utils"),
    gridCoreUtils = require("../grid_core/ui.grid_core.utils"),
    pivotGridUtils = require("./ui.pivot_grid.utils"),
    pivotGridDataController = require("./ui.pivot_grid.data_controller"),
    PivotGridDataSource = require("./data_source"),
    dataAreaNamespace = require("./ui.pivot_grid.data_area"),
    headersArea = require("./ui.pivot_grid.headers_area"),

    fieldsArea = require("./ui.pivot_grid.fields_area"),

    PivotGridFieldChooser = require("./ui.pivot_grid.field_chooser"),
    PivotGridFieldChooserBase = require("./ui.pivot_grid.field_chooser_base"),
    ExportMixin = require("./ui.pivot_grid.export").ExportMixin,
    chartIntegrationMixin = require("./ui.pivot_grid.chart_integration"),
    isDefined = commonUtils.isDefined,
    Popup = require("../popup"),
    ContextMenu = require("../context_menu"),
    when = require("../../integration/jquery/deferred").when,

    DATA_AREA_CELL_CLASS = "dx-area-data-cell",
    ROW_AREA_CELL_CLASS = "dx-area-row-cell",
    COLUMN_AREA_CELL_CLASS = "dx-area-column-cell",
    DESCRIPTION_AREA_CELL_CLASS = "dx-area-description-cell",
    BORDERS_CLASS = "dx-pivotgrid-border",
    PIVOTGRID_CLASS = "dx-pivotgrid",
    ROW_LINES_CLASS = "dx-row-lines",
    BOTTOM_ROW_CLASS = "dx-bottom-row",
    BOTTOM_BORDER_CLASS = "dx-bottom-border",
    FIELDS_CONTAINER_CLASS = "dx-pivotgrid-fields-container",
    FIELDS_CLASS = "dx-area-fields",
    FIELD_CHOOSER_POPUP_CLASS = "dx-fieldchooser-popup",
    INCOMPRESSIBLE_FIELDS_CLASS = "dx-incompressible-fields",
    OVERFLOW_HIDDEN_CLASS = "dx-overflow-hidden",

    TR = "<tr>",
    TD = "<td>",
    DIV = "<div>",
    TEST_HEIGHT = 66666;

function getArraySum(array) {
    var sum = 0;

    $.each(array, function(_, value) {
        sum += (value || 0);
    });

    return sum;
}

function adjustSizeArray(sizeArray, space) {
    var delta = space / sizeArray.length;

    for(var i = 0; i < sizeArray.length; i++) {
        sizeArray[i] -= delta;
    }
}

function subscribeToScrollEvent(area, handler) {
    area.off("scroll")
        .off("stop")
        .on('scroll', handler)
        .on("stop", handler);
}

var scrollBarInfoCache = {};

function getScrollBarInfo(rootElement, useNativeScrolling) {
    if(scrollBarInfoCache[useNativeScrolling]) {
        return scrollBarInfoCache[useNativeScrolling];
    }

    var scrollBarWidth = 0,
        scrollBarUseNative,
        options = {};

    var container = $(DIV).css({
        position: 'absolute',
        visibility: 'hidden',
        width: 100,
        height: 100
    }).appendTo(rootElement);

    var content = $('<p>').css({
        width: '100%',
        height: 200
    }).appendTo(container);

    if(useNativeScrolling !== 'auto') {
        options.useNative = !!useNativeScrolling;
        options.useSimulatedScrollbar = !useNativeScrolling;
    }

    container.dxScrollable(options);

    scrollBarUseNative = container.dxScrollable('instance').option('useNative');
    scrollBarWidth = scrollBarUseNative ? container.width() - content.width() : 0;

    container.remove();

    scrollBarInfoCache[useNativeScrolling] = {
        scrollBarWidth: scrollBarWidth,
        scrollBarUseNative: scrollBarUseNative
    };

    return scrollBarInfoCache[useNativeScrolling];
}

function getCommonBorderWidth(elements, direction) {
    var outerSize = direction === "width" ? "outerWidth" : "outerHeight",
        width = 0;

    $.each(elements, function(_, elem) {
        width += elem[outerSize]() - elem[direction]();
    });

    return width;
}

function clickedOnFieldsArea($targetElement) {
    return $targetElement.closest("." + FIELDS_CLASS).length || $targetElement.find("." + FIELDS_CLASS).length;
}

/**
* @name dxPivotGridOptions_onContentReady
* @publicName onContentReady
* @extends Action
* @hidden false
* @action
* @extend_doc
*/

/**
* @name dxPivotGridOptions_activeStateEnabled
* @publicName activeStateEnabled
* @hidden
* @extend_doc
*/

/**
 * @name dxPivotGridOptions_hoverStateEnabled
 * @publicName hoverStateEnabled
 * @hidden
* @extend_doc
*/

/**
 * @name dxPivotGridOptions_focusStateEnabled
 * @publicName hoverStateEnabled
 * @hidden
* @extend_doc
*/

/**
 * @name dxPivotGridOptions_accessKey
 * @publicName accessKey
 * @hidden
* @extend_doc
*/

var PivotGrid = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name dxPivotGridOptions_scrolling
             * @publicName scrolling
             * @type object
             */
            scrolling: {
                timeout: 300,
                renderingThreshold: 150,
                /**
                 * @name dxPivotGridOptions_scrolling_mode
                 * @publicName mode
                 * @type string
                 * @acceptValues "standard" | "virtual"
                 * @default "standard"
                 */
                mode: "standard",
                /**
                 * @name dxPivotGridOptions_scrolling_useNative
                 * @publicName useNative
                 * @type string|boolean
                 * @default "auto"
                 */
                useNative: "auto",

                removeInvisiblePages: true
            },
            encodeHtml: true,
            /**
             * @name dxPivotGridOptions_dataSource
             * @publicName dataSource
             * @type array|PivotGridDataSource|PivotGridDataSource configuration
             * @default null
             */
            dataSource: null,
            activeStateEnabled: false,
            /**
             * @name dxPivotGridOptions_fieldChooser
             * @publicName fieldChooser
             * @type object
             */
            fieldChooser: {
                minWidth: 250,
                minHeight: 250,
                /**
                 * @name dxPivotGridOptions_fieldChooser_enabled
                 * @publicName enabled
                 * @type boolean
                 * @default true
                 */
                enabled: true,
                /**
                 * @name dxPivotGridOptions_fieldChooser_layout
                 * @publicName layout
                 * @type number
                 * @acceptValues 0 | 1 | 2
                 * @default 0
                 */
                layout: 0,
                /**
                 * @name dxPivotGridOptions_fieldChooser_title
                 * @publicName title
                 * @type string
                 * @default "Field Chooser"
                 */
                title: messageLocalization.format("dxPivotGrid-fieldChooserTitle"),
                /**
                 * @name dxPivotGridOptions_fieldChooser_width
                 * @publicName width
                 * @type number
                 * @default 600
                 */
                width: 600,
                /**
                 * @name dxPivotGridOptions_fieldChooser_height
                 * @publicName height
                 * @type number
                 * @default 600
                 */
                height: 600
                /**
                 * @name dxPivotGridOptions_fieldChooser_texts
                 * @publicName texts
                 * @type object
                 */
                /**
                 * @name dxPivotGridOptions_fieldChooser_texts_columnFields
                 * @publicName columnFields
                 * @type string
                 * @default 'Column Fields'
                 */
                /**
                 * @name dxPivotGridOptions_fieldChooser_texts_rowFields
                 * @publicName rowFields
                 * @type string
                 * @default 'Row Fields'
                 */
                /**
                 * @name dxPivotGridOptions_fieldChooser_texts_dataFields
                 * @publicName dataFields
                 * @type string
                 * @default 'Data Fields'
                 */
                /**
                 * @name dxPivotGridOptions_fieldChooser_texts_filterFields
                 * @publicName filterFields
                 * @type string
                 * @default 'Filter Fields'
                 */
                /**
                 * @name dxPivotGridOptions_fieldChooser_texts_allFields
                 * @publicName allFields
                 * @type string
                 * @default 'All Fields'
                 */
            },
            /**
            * @name dxPivotGridOptions_onContextMenuPreparing
            * @publicName onContextMenuPreparing
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 items:array
            * @type_function_param1_field5 area:string
            * @type_function_param1_field6 cell:PivotGridCell
            * @type_function_param1_field7 cellElement:jQuery
            * @type_function_param1_field8 columnIndex:number
            * @type_function_param1_field9 rowIndex:number
            * @type_function_param1_field10 dataFields:array
            * @type_function_param1_field11 rowFields:array
            * @type_function_param1_field12 columnFields:array
            * @type_function_param1_field13 field:object
            * @extends Action
            * @action
            */
            onContextMenuPreparing: null,
            /**
             * @name dxPivotGridOptions_allowSorting
             * @publicName allowSorting
             * @type boolean
             * @default false
             */
            allowSorting: false,
            /**
             * @name dxPivotGridOptions_allowSortingBySummary
             * @publicName allowSortingBySummary
             * @type boolean
             * @default false
             */
            allowSortingBySummary: false,
            /**
             * @name dxPivotGridOptions_allowFiltering
             * @publicName allowFiltering
             * @type boolean
             * @default false
             */
            allowFiltering: false,
            /**
             * @name dxPivotGridOptions_allowExpandAll
             * @publicName allowExpandAll
             * @type boolean
             * @default false
             */
            allowExpandAll: false,
            /**
            * @name dxPivotGridOptions_wordWrapEnabled
            * @publicName wordWrapEnabled
            * @type boolean
            * @default true
            */
            wordWrapEnabled: true,
            /**
            * @name dxPivotGridOptions_fieldPanel
            * @publicName fieldPanel
            * @type object
            */
            fieldPanel: {
                /**
                * @name dxPivotGridOptions_fieldPanel_showColumnFields
                * @publicName showColumnFields
                * @type boolean
                * @default true
                */
                showColumnFields: true,
                /**
                * @name dxPivotGridOptions_fieldPanel_showFilterFields
                * @publicName showFilterFields
                * @type boolean
                * @default true
                */
                showFilterFields: true,

                /**
                * @name dxPivotGridOptions_fieldPanel_showDataFields
                * @publicName showDataFields
                * @type boolean
                * @default true
                */
                showDataFields: true,

                /**
                * @name dxPivotGridOptions_fieldPanel_showRowFields
                * @publicName showRowFields
                * @type boolean
                * @default true
                */
                showRowFields: true,
                /**
                * @name dxPivotGridOptions_fieldPanel_allowFieldDragging
                * @publicName allowFieldDragging
                * @type boolean
                * @default true
                */
                allowFieldDragging: true,
                /**
                * @name dxPivotGridOptions_fieldPanel_visible
                * @publicName visible
                * @type boolean
                * @default false
                */
                visible: false,

                /**
                * @name dxPivotGridOptions_fieldPanel_texts
                * @publicName texts
                * @type object
                */
                texts: {
                    /**
                    * @name dxPivotGridOptions_fieldPanel_texts_columnFieldArea
                    * @publicName columnFieldArea
                    * @type string
                    * @default "Drop Column Fields Here"
                    */
                    columnFieldArea: messageLocalization.format("dxPivotGrid-columnFieldArea"),
                    /**
                    * @name dxPivotGridOptions_fieldPanel_texts_rowFieldArea
                    * @publicName rowFieldArea
                    * @type string
                    * @default "Drop Row Fields Here"
                    */
                    rowFieldArea: messageLocalization.format("dxPivotGrid-rowFieldArea"),
                    /**
                    * @name dxPivotGridOptions_fieldPanel_texts_filterFieldArea
                    * @publicName filterFieldArea
                    * @type string
                    * @default "Drop Filter Fields Here"
                    */
                    filterFieldArea: messageLocalization.format("dxPivotGrid-filterFieldArea"),
                    /**
                    * @name dxPivotGridOptions_fieldPanel_texts_dataFieldArea
                    * @publicName dataFieldArea
                    * @type string
                    * @default "Drop Data Fields Here"
                    */
                    dataFieldArea: messageLocalization.format("dxPivotGrid-dataFieldArea")
                }
            },
            /**
            * @name dxPivotGridOptions_dataFieldArea
            * @publicName dataFieldArea
            * @type string
            * @acceptValues "row" | "column"
            * @default "column"
            */
            dataFieldArea: "column",

            /**
           * @name dxPivotGridOptions_export
           * @publicName export
           * @type object
           */
            "export": {
                /**
                 * @name dxPivotGridOptions_export_enabled
                 * @publicName enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxPivotGridOptions_export_fileName
                 * @publicName fileName
                 * @type string
                 * @default "PivotGrid"
                 */
                fileName: "PivotGrid",
                /**
                 * @name dxPivotGridOptions_export_proxyUrl
                 * @publicName proxyUrl
                 * @type string
                 * @default undefined
                 */
                proxyUrl: undefined
            },
            /**
             * @name dxPivotGridOptions_showRowTotals
             * @publicName showRowTotals
             * @type boolean
             * @default true
             */
            showRowTotals: true,
            /**
             * @name dxPivotGridOptions_showRowGrandTotals
             * @publicName showRowGrandTotals
             * @type boolean
             * @default true
             */
            showRowGrandTotals: true,
            /**
             * @name dxPivotGridOptions_showColumnTotals
             * @publicName showColumnTotals
             * @type boolean
             * @default true
             */
            showColumnTotals: true,
            /**
             * @name dxPivotGridOptions_showColumnGrandTotals
             * @publicName showColumnGrandTotals
             * @type boolean
             * @default true
             */
            showColumnGrandTotals: true,
            /**
            * @name dxPivotGridOptions_hideEmptySummaryCells
            * @publicName hideEmptySummaryCells
            * @type boolean
            * @default true
            */
            hideEmptySummaryCells: true,
            /**
             * @name dxPivotGridOptions_showTotalsPrior
             * @publicName showTotalsPrior
             * @type string
             * @acceptValues "rows" | "columns" | "both" | "none"
             * @default "none"
             */
            showTotalsPrior: "none",
            /**
            * @name dxPivotGridOptions_rowHeaderLayout
            * @publicName rowHeaderLayout
            * @type string
            * @acceptValues "standard" | "tree"
            * @default "standard"
            */
            rowHeaderLayout: "standard",

            /**
             * @name dxPivotGridOptions_loadPanel
             * @publicName loadPanel
             * @type object
             */
            loadPanel: {
                /**
                 * @name dxPivotGridOptions_loadPanel_enabled
                 * @publicName enabled
                 * @type boolean
                 * @default true
                 */
                enabled: true,
                /**
                 * @name dxPivotGridOptions_loadPanel_text
                 * @publicName text
                 * @type string
                 * @default 'Loading...'
                 */
                text: messageLocalization.format("Loading"),
                /**
                 * @name dxPivotGridOptions_loadPanel_width
                 * @publicName width
                 * @type number
                 * @default 200
                 */
                width: 200,
                /**
                 * @name dxPivotGridOptions_loadPanel_height
                 * @publicName height
                 * @type number
                 * @default 70
                 */
                height: 70,
                /**
                * @name dxPivotGridOptions_loadPanel_showIndicator
                * @publicName showIndicator
                * @type boolean
                * @default true
                */
                showIndicator: true,

                /**
                * @name dxPivotGridOptions_loadPanel_indicatorSrc
                * @publicName indicatorSrc
                * @type string
                * @default ""
                */
                indicatorSrc: "",

                /**
                * @name dxPivotGridOptions_loadPanel_showPane
                * @publicName showPane
                * @type boolean
                * @default true
                */
                showPane: true

            },
            /**
             * @name dxPivotGridOptions_texts
             * @publicName texts
             * @type object
             */
            texts: {
                /**
                 * @name dxPivotGridOptions_texts_grandTotal
                 * @publicName grandTotal
                 * @type string
                 * @default 'Grand Total'
                 */
                grandTotal: messageLocalization.format("dxPivotGrid-grandTotal"),
                /**
                 * @name dxPivotGridOptions_texts_total
                 * @publicName total
                 * @type string
                 * @default '{0} Total'
                 */
                total: messageLocalization.getFormatter("dxPivotGrid-total"),
                /**
                 * @name dxPivotGridOptions_texts_noData
                 * @publicName noData
                 * @type string
                 * @default 'No data'
                 */
                noData: messageLocalization.format("dxDataGrid-noDataText"),
                /**
                  * @name dxPivotGridOptions_texts_showFieldChooser
                  * @publicName showFieldChooser
                  * @type string
                  * @default 'Show Field Chooser'
                  */
                showFieldChooser: messageLocalization.format("dxPivotGrid-showFieldChooser"),
                /**
                 * @name dxPivotGridOptions_texts_expandAll
                 * @publicName expandAll
                 * @type string
                 * @default 'Expand All'
                 */
                expandAll: messageLocalization.format("dxPivotGrid-expandAll"),
                /**
                 * @name dxPivotGridOptions_texts_collapseAll
                 * @publicName collapseAll
                 * @type string
                 * @default 'Collapse All'
                 */
                collapseAll: messageLocalization.format("dxPivotGrid-collapseAll"),
                /**
                 * @name dxPivotGridOptions_texts_sortColumnBySummary
                 * @publicName sortColumnBySummary
                 * @type string
                 * @default 'Sort {0} by This Column'
                 */
                sortColumnBySummary: messageLocalization.getFormatter("dxPivotGrid-sortColumnBySummary"),
                /**
                 * @name dxPivotGridOptions_texts_sortRowBySummary
                 * @publicName sortRowBySummary
                 * @type string
                 * @default 'Sort {0} by This Row'
                 */
                sortRowBySummary: messageLocalization.getFormatter("dxPivotGrid-sortRowBySummary"),
                /**
                 * @name dxPivotGridOptions_texts_removeAllSorting
                 * @publicName removeAllSorting
                 * @type string
                 * @default 'Remove All Sorting'
                 */
                removeAllSorting: messageLocalization.format("dxPivotGrid-removeAllSorting"),
                /**
                 * @name dxPivotGridOptions_texts_exportToExcel
                 * @publicName exportToExcel
                 * @type string
                 * @default "Export to Excel file"
                 */
                exportToExcel: messageLocalization.format("dxDataGrid-exportToExcel"),
                /**
                 * @name dxPivotGridOptions_texts_dataNotAvailable
                 * @publicName dataNotAvailable
                 * @type string
                 * @default "N/A"
                 */
                dataNotAvailable: messageLocalization.format("dxPivotGrid-dataNotAvailable")
            },
            /**
            * @name dxPivotGridOptions_onCellClick
            * @publicName onCellClick
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 area:string
            * @type_function_param1_field5 cellElement:jQuery
            * @type_function_param1_field6 cell:PivotGridCell
            * @type_function_param1_field7 rowIndex:number
            * @type_function_param1_field8 columnIndex:number
            * @type_function_param1_field9 columnFields:Array
            * @type_function_param1_field10 rowFields:Array
            * @type_function_param1_field11 dataFields:Array
            * @type_function_param1_field12 jQueryEvent:jQueryEvent
            * @type_function_param1_field13 cancel:boolean
            * @extends Action
            * @action
            */
            onCellClick: null,
            /**
            * @name dxPivotGridOptions_onCellPrepared
            * @publicName onCellPrepared
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 area:string
            * @type_function_param1_field5 cellElement:jQuery
            * @type_function_param1_field6 cell:PivotGridCell
            * @type_function_param1_field7 rowIndex:number
            * @type_function_param1_field8 columnIndex:number
            * @extends Action
            * @action
            */
            onCellPrepared: null,
            /**
            * @name dxPivotGridOptions_showBorders
            * @publicName showBorders
            * @type boolean
            * @default false
            */
            showBorders: false,

            /**
            * @name dxPivotGridOptions_stateStoring
            * @publicName stateStoring
            * @type object
            */
            stateStoring: {
                /**
                 * @name dxPivotGridOptions_stateStoring_enabled
                 * @publicName enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxPivotGridOptions_stateStoring_storageKey
                 * @publicName storageKey
                 * @type string
                 * @default null
                 */
                storageKey: null,
                /**
                 * @name dxPivotGridOptions_stateStoring_type
                 * @publicName type
                 * @type string
                 * @acceptValues "localStorage" | "sessionStorage" | "custom"
                 * @default "localStorage"
                 */
                type: "localStorage",

                /**
                 * @name dxPivotGridOptions_stateStoring_customLoad
                 * @publicName customLoad
                 * @type function()
                 * @type_function_return deferred object
                 */
                customLoad: null,

                /**
                 * @name dxPivotGridOptions_stateStoring_customSave
                 * @publicName customSave
                 * @type function(state)
                 * @type_function_param1 state:object
                 */
                customSave: null,

                /**
                 * @name dxPivotGridOptions_stateStoring_savingTimeout
                 * @publicName savingTimeout
                 * @type number
                 * @default 2000
                 */
                savingTimeout: 2000
            },

            onExpandValueChanging: null,
            renderCellCountLimit: 20000,
            /**
             * @name dxPivotGridOptions_onExporting
             * @publicName onExporting
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 fileName:string
             * @type_function_param1_field5 cancel:boolean
             * @extends Action
             * @action
             */
            onExporting: null,
            /**
             * @name dxPivotGridOptions_onExported
             * @publicName onExported
             * @type function(e)
             * @type_function_param1 e:object
             * @extends Action
             * @action
             */
            onExported: null,
            /**
            * @name dxPivotGridOptions_onFileSaving
            * @publicName onFileSaving
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field3 fileName:string
            * @type_function_param1_field4 format:string
            * @type_function_param1_field5 data:blob
            * @type_function_param1_field6 cancel:boolean
            * @extends Action
            * @action
            */
            onFileSaving: null
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxPivotGridOptions_useNativeScrolling
            * @publicName useNativeScrolling
            * @deprecated dxPivotGridOptions_scrolling_useNative
            * @type string|boolean
            * @extend_doc
            */
            useNativeScrolling: { since: "15.2", alias: "scrolling.useNative" }
        });
    },

    _getDataControllerOptions: function() {
        var that = this;
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
            hideEmptySummaryCells: that.option("hideEmptySummaryCells"),

            onFieldsPrepared: function(fields) {
                $.each(fields, function(index, field) {
                    $.each(["allowSorting", "allowSortingBySummary", "allowFiltering", "allowExpandAll"], function(_, optionName) {
                        if(field[optionName] === undefined) {
                            pivotGridUtils.setFieldProperty(field, optionName, that.option(optionName));
                        }
                    });

                });
            }
        };
    },

    _initDataController: function() {
        var that = this;
        that._dataController && that._dataController.dispose();

        that._dataController = new pivotGridDataController.DataController(that._getDataControllerOptions());
        that._dataController.changed.add(function() {
            that._render();
        });

        that._dataController.scrollChanged.add(function(options) {
            that._scrollLeft = options.left;
            that._scrollTop = options.top;
        });

        that._dataController.loadingChanged.add(function(isLoading, progress) {
            that._updateLoading(progress);
        });

        that._dataController.dataSourceChanged.add(function() {
            that._trigger("onChanged");
        });

        var expandValueChanging = that.option('onExpandValueChanging');

        if(expandValueChanging) {
            that._dataController.expandValueChanging.add(function(e) {
                expandValueChanging(e);
            });
        }
    },

    _init: function() {
        var that = this;

        that.callBase();
        that._initDataController();

        that._scrollLeft = that._scrollTop = null;
        that._initActions();
    },

    _initActions: function() {
        var that = this;
        that._actions = {
            onChanged: that._createActionByOption("onChanged"),
            onContextMenuPreparing: that._createActionByOption("onContextMenuPreparing"),
            onCellClick: that._createActionByOption("onCellClick"),
            onExporting: that._createActionByOption("onExporting"),
            onExported: that._createActionByOption("onExported"),
            onFileSaving: that._createActionByOption("onFileSaving"),
            onCellPrepared: that._createActionByOption("onCellPrepared")
        };
    },

    _trigger: function(eventName, eventArg) {
        this._actions[eventName](eventArg);
    },

    _optionValuesEqual: function(name, oldValue, newValue) {
        //T266402
        if(name === "dataSource" && (newValue instanceof PivotGridDataSource) && (oldValue instanceof PivotGridDataSource)) {
            return newValue === oldValue;
        }
        return this.callBase.apply(this, arguments);
    },

    _optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "dataSource":
            case "allowSorting":
            case "allowFiltering":
            case "allowExpandAll":
            case "allowSortingBySummary":
            case "scrolling":
            case "stateStoring":
                that._initDataController();
                that._fieldChooserPopup.hide();
                that._renderFieldChooser();
                that._invalidate();
                break;
            case "texts":
            case "showTotalsPrior":
            case "showRowTotals":
            case "showRowGrandTotals":
            case "showColumnTotals":
            case "showColumnGrandTotals":
            case "hideEmptySummaryCells":
            case "dataFieldArea":
                that._dataController.updateViewOptions(that._getDataControllerOptions());
                break;
            case "useNativeScrolling":
            case "encodeHtml":
            case "renderCellCountLimit":
                break;
            case "rtlEnabled":
                that.callBase(args);
                that._renderFieldChooser();
                that._renderContextMenu();
                that._renderLoadPanel(that._dataArea.groupElement(), that.element());
                that._invalidate();
                break;
            case "export":
                that._renderDescriptionArea();
                break;
            case "onExpandValueChanging":
                break;
            case "onCellClick":
            case "onContextMenuPreparing":
            case "onExporting":
            case "onExported":
            case "onFileSaving":
            case "onCellPrepared":
                that._actions[args.name] = that._createActionByOption(args.name);
                break;
            case "fieldChooser":
                that._renderFieldChooser();
                that._renderDescriptionArea();
                break;
            case "loadPanel":
                that._renderLoadPanel(that._dataArea.groupElement(), that.element());
                that._invalidate();
                break;
            case "fieldPanel":
                that._renderDescriptionArea();
                that._invalidate();
                break;
            case "showBorders":
                that._tableElement().toggleClass(BORDERS_CLASS, !!args.value);
                that.updateDimensions();
                break;
            case "wordWrapEnabled":
                that._tableElement().toggleClass("dx-word-wrap", !!args.value);
                that.updateDimensions();
                break;
            case "rowHeaderLayout":
                that._tableElement().find("." + ROW_AREA_CELL_CLASS).toggleClass("dx-area-tree-view", args.value === "tree");
                that._dataController.updateViewOptions(that._getDataControllerOptions());
                break;
            case "height":
            case "width":
                that._hasHeight = null;
                that.callBase(args);
                that.resize();
                break;
            default:
                that.callBase(args);
        }
    },

    _updateScrollPosition: function(columnsArea, rowsArea, dataArea) {
        var that = this,
            scrollTop,
            scrollLeft,
            scrolled = that._scrollTop || that._scrollLeft;

        if(rowsArea && !rowsArea.hasScroll() && that._hasHeight) {
            that._scrollTop = null;
        }

        if(columnsArea && !columnsArea.hasScroll()) {
            that._scrollLeft = null;
        }
        if(that._scrollTop !== null || that._scrollLeft !== null || scrolled) {
            scrollTop = that._scrollTop || 0;
            scrollLeft = that._scrollLeft || 0;
            dataArea.scrollTo({ x: scrollLeft, y: scrollTop });
            columnsArea.scrollTo(scrollLeft);
            rowsArea.scrollTo(scrollTop);
            that._dataController.updateWindowScrollPosition(that._scrollTop);
        }
    },

    _subscribeToEvents: function(columnsArea, rowsArea, dataArea) {
        var that = this,
            scrollHandler = function(e) {
                var scrollOffset = e.scrollOffset,
                    leftOffset = isDefined(scrollOffset.left) ? scrollOffset.left : that._scrollLeft,
                    topOffset = isDefined(scrollOffset.top) && that._hasHeight ? scrollOffset.top : that._scrollTop;

                if((that._scrollLeft || 0) !== (leftOffset || 0) || (that._scrollTop || 0) !== (topOffset || 0)) {

                    that._scrollLeft = leftOffset;
                    that._scrollTop = topOffset;

                    that._updateScrollPosition(columnsArea, rowsArea, dataArea);

                    if(that.option("scrolling.mode") === "virtual") {
                        that._dataController.setViewportPosition(that._scrollLeft, that._scrollTop);
                    }
                }
            };

        $.each([columnsArea, rowsArea, dataArea], function(_, area) {
            subscribeToScrollEvent(area, scrollHandler);
        });

        !that._hasHeight && that._dataController.subscribeToWindowScrollEvents(dataArea.groupElement());
    },

    _clean: commonUtils.noop,

    _needDelayResizing: function(cellsInfo) {
        var cellsCount = cellsInfo.length * (cellsInfo.length ? cellsInfo[0].length : 0);
        return cellsCount > this.option("renderCellCountLimit");
    },

    _renderFieldChooser: function() {
        var that = this,
            container = that._pivotGridContainer,
            fieldChooserOptions = that.option("fieldChooser") || {},
            fieldChooserComponentOptions = {
                layout: fieldChooserOptions.layout,
                texts: fieldChooserOptions.texts || {},
                dataSource: that.getDataSource(),
                width: undefined,
                height: undefined
            },
            popupOptions = {
                shading: false,
                title: fieldChooserOptions.title,
                width: fieldChooserOptions.width,
                height: fieldChooserOptions.height,
                showCloseButton: true,
                resizeEnabled: true,
                minWidth: fieldChooserOptions.minWidth,
                minHeight: fieldChooserOptions.minHeight,
                onResize: function(e) {
                    e.component.content().dxPivotGridFieldChooser("updateDimensions");
                },
                onShown: function(e) {
                    that._createComponent(e.component.content(), PivotGridFieldChooser, fieldChooserComponentOptions);
                }
            };

        if(that._fieldChooserPopup) {
            that._fieldChooserPopup.option(popupOptions);
            that._fieldChooserPopup.content().dxPivotGridFieldChooser(fieldChooserComponentOptions);
        } else {
            that._fieldChooserPopup = that._createComponent($(DIV).addClass(FIELD_CHOOSER_POPUP_CLASS).appendTo(container), Popup, popupOptions);
        }
    },

    _renderContextMenu: function() {
        var that = this,
            $container = that._pivotGridContainer;

        if(that._contextMenu) {
            that._contextMenu.element().remove();
        }

        that._contextMenu = that._createComponent($(DIV).appendTo($container), ContextMenu, {
            onPositioning: function(actionArgs) {
                var event = actionArgs.jQueryEvent,
                    targetElement,
                    args,
                    items;

                actionArgs.cancel = true;

                if(!event) {
                    return;
                }

                targetElement = event.target.cellIndex >= 0 ? event.target : $(event.target).closest('td').get(0);
                if(!targetElement) {
                    return;
                }

                args = that._createEventArgs(targetElement, event);
                items = that._getContextMenuItems(args);
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
            target: that.element()
        });
    },

    _getContextMenuItems: function(e) {
        var that = this,
            items = [],
            texts = that.option("texts");

        if(e.area === "row" || e.area === "column") {
            var areaFields = e[e.area + "Fields"],
                oppositeAreaFields = e[e.area === "column" ? "rowFields" : "columnFields"],
                field = e.cell.path && areaFields[e.cell.path.length - 1],
                dataSource = that.getDataSource();

            if(field && field.allowExpandAll && e.cell.path.length < e[e.area + "Fields"].length) {
                items.push({
                    beginGroup: true,
                    icon: "none",
                    text: texts.expandAll,
                    onItemClick: function() {
                        dataSource.expandAll(field.index);
                    }
                });
                items.push({
                    text: texts.collapseAll,
                    icon: "none",
                    onItemClick: function() {
                        dataSource.collapseAll(field.index);
                    }
                });
            }

            if(e.cell.isLast) {
                var sortingBySummaryItemCount = 0;
                $.each(oppositeAreaFields, function(index, field) {
                    if(!field.allowSortingBySummary) {
                        return;
                    }

                    $.each(e.dataFields, function(dataIndex, dataField) {
                        if(isDefined(e.cell.dataIndex) && e.cell.dataIndex !== dataIndex) {
                            return;
                        }

                        var showDataFieldCaption = (!isDefined(e.cell.dataIndex) && e.dataFields.length > 1),
                            textFormat = e.area === "column" ? texts.sortColumnBySummary : texts.sortRowBySummary,
                            checked = pivotGridUtils.findField(e.dataFields, field.sortBySummaryField) === dataIndex && (e.cell.path || []).join("/") === (field.sortBySummaryPath || []).join("/"),
                            text = stringUtils.format(textFormat, showDataFieldCaption ? field.caption + " - " + dataField.caption : field.caption);

                        items.push({
                            beginGroup: sortingBySummaryItemCount === 0,
                            icon: checked ? (field.sortOrder === "desc" ? "sortdowntext" : "sortuptext") : "none",
                            text: text,
                            onItemClick: function() {
                                dataSource.field(field.index, {
                                    sortBySummaryField: dataField.caption || dataField.dataField,
                                    sortBySummaryPath: e.cell.path,
                                    sortOrder: field.sortOrder === "desc" ? "asc" : "desc"
                                });
                                dataSource.load();
                            }
                        });
                        sortingBySummaryItemCount++;
                    });

                });
                $.each(oppositeAreaFields, function(index, field) {
                    if(!field.allowSortingBySummary || !isDefined(field.sortBySummaryField)) {
                        return;
                    }
                    items.push({
                        beginGroup: sortingBySummaryItemCount === 0,
                        icon: "none",
                        text: texts.removeAllSorting,
                        onItemClick: function() {
                            $.each(oppositeAreaFields, function(index, field) {
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

        if(that.option("fieldChooser.enabled")) {
            items.push({
                beginGroup: true,
                icon: "columnchooser",
                text: texts.showFieldChooser,
                onItemClick: function() {
                    that._fieldChooserPopup.show();
                }
            });
        }

        if(that.option("export.enabled")) {
            items.push({
                beginGroup: true,
                icon: "exportxlsx",
                text: texts.exportToExcel,
                onItemClick: function() {
                    that.exportToExcel();
                }
            });
        }

        e.items = items;
        that._trigger("onContextMenuPreparing", e);
        items = e.items;

        if(items && items.length) {
            return items;
        }
    },

    _createEventArgs: function(targetElement, jQueryEvent) {
        var that = this,
            dataSource = that.getDataSource(),
            args = {
                rowFields: dataSource.getAreaFields("row"),
                columnFields: dataSource.getAreaFields("column"),
                dataFields: dataSource.getAreaFields("data"),
                jQueryEvent: jQueryEvent
            };

        if(clickedOnFieldsArea($(targetElement))) {
            return extend(that._createFieldArgs(targetElement), args);
        } else {
            return extend(that._createCellArgs(targetElement), args);
        }
    },

    _createFieldArgs: function(targetElement) {
        var field = $(targetElement).children().data("field"),
            args = {
                field: field
            };
        return commonUtils.isDefined(field) ? args : {};
    },

    _createCellArgs: function(cellElement) {
        var $cellElement = $(cellElement),
            columnIndex = cellElement.cellIndex,
            rowIndex = cellElement.parentElement.rowIndex,
            $table = $cellElement.closest('table'),
            data = $table.data("data"),
            cell = data && data[rowIndex] && data[rowIndex][columnIndex],
            args = {
                area: $table.data("area"),
                rowIndex: rowIndex,
                columnIndex: columnIndex,
                cellElement: $cellElement,
                cell: cell
            };
        return args;
    },

    _handleCellClick: function(e) {
        var that = this,
            args = that._createEventArgs(e.currentTarget, e),
            cell = args.cell;

        if(!cell || (!args.area && (args.rowIndex || args.columnIndex))) {
            return;
        }

        that._trigger("onCellClick", args);

        cell && !args.cancel && isDefined(cell.expanded) && setTimeout(function() {
            that._dataController[cell.expanded ? "collapseHeaderItem" : "expandHeaderItem"](args.area, cell.path);
        });
    },

    _getNoDataText: function() {
        return this.option("texts.noData");
    },

    _renderNoDataText: gridCoreUtils.renderNoDataText,

    _renderLoadPanel: gridCoreUtils.renderLoadPanel,

    _updateLoading: function(progress) {
        var that = this,
            isLoading = that._dataController.isLoading(),
            loadPanelVisible;

        if(!that._loadPanel) return;

        loadPanelVisible = that._loadPanel.option("visible");

        if(!loadPanelVisible) {
            that._startLoadingTime = new Date();
        }
        if(isLoading) {
            if(progress) {
                if(new Date() - that._startLoadingTime >= 1000) {
                    that._loadPanel.option("message", Math.floor(progress * 100) + "%");
                }
            } else {
                that._loadPanel.option("message", that.option("loadPanel.text"));
            }
        }
        clearTimeout(that._hideLoadingTimeoutID);
        if(loadPanelVisible && !isLoading) {
            that._hideLoadingTimeoutID = setTimeout(function() {
                that._loadPanel.option("visible", false);
                that.element().removeClass(OVERFLOW_HIDDEN_CLASS);
            });
        } else {
            that._loadPanel.option("visible", isLoading);
            that.element().toggleClass(OVERFLOW_HIDDEN_CLASS, !isLoading);
        }
    },

    _renderDescriptionArea: function() {
        var that = this,
            $element = that.element(),
            $descriptionCell = $element.find("." + DESCRIPTION_AREA_CELL_CLASS),
            $toolbarContainer = $(DIV).addClass("dx-pivotgrid-toolbar"),
            fieldPanel = that.option("fieldPanel"),
            $filterHeader = $element.find(".dx-filter-header"),
            $columnHeader = $element.find(".dx-column-header");

        var $targetContainer;

        if(fieldPanel.visible && fieldPanel.showFilterFields) {
            $targetContainer = $filterHeader;
        } else if(fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)) {
            $targetContainer = $columnHeader;
        } else {
            $targetContainer = $descriptionCell;
        }

        $columnHeader.toggleClass(BOTTOM_BORDER_CLASS, !!(fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)));
        $filterHeader.toggleClass(BOTTOM_BORDER_CLASS, !!(fieldPanel.visible && fieldPanel.showFilterFields));

        $descriptionCell.toggleClass("dx-pivotgrid-background", fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields || fieldPanel.showRowFields));

        that.element().find(".dx-pivotgrid-toolbar").remove();

        $toolbarContainer.prependTo($targetContainer);

        if(that.option("fieldChooser.enabled")) {
            that._createComponent($(DIV)
                .appendTo($toolbarContainer)
                .addClass("dx-pivotgrid-field-chooser-button"),
                "dxButton", {
                    icon: "columnchooser",
                    hint: that.option("texts.showFieldChooser"),
                    onClick: function() {
                        that.getFieldChooserPopup().show();
                    }
                });
        }

        if(that.option("export.enabled")) {
            that._createComponent($(DIV)
                .appendTo($toolbarContainer)
                .addClass("dx-pivotgrid-export-button"),
                "dxButton", {
                    icon: "exportxlsx",
                    hint: that.option("texts.exportToExcel"),
                    onClick: function() {
                        that.exportToExcel();
                    }
                });
        }
    },

    _detectHasContainerHeight: function() {
        var that = this,
            element = that.element(),
            testElement;

        if(commonUtils.isDefined(that._hasHeight) || element.is(":hidden")) {
            return;
        }

        that._pivotGridContainer.addClass("dx-hidden");
        testElement = $(DIV).height(TEST_HEIGHT);
        element.append(testElement);
        that._hasHeight = element.height() !== TEST_HEIGHT;
        that._pivotGridContainer.removeClass("dx-hidden");
        testElement.remove();
    },

    _renderHeaders: function(rowHeaderContainer, columnHeaderContainer, filterHeaderContainer, dataHeaderContainer) {
        var that = this,
            dataSource = that.getDataSource(),
            FieldsArea = fieldsArea.FieldsArea;

        that._rowFields = that._rowFields || new FieldsArea(that, "row");
        that._rowFields.render(rowHeaderContainer, dataSource.getAreaFields("row"));

        that._columnFields = that._columnFields || new FieldsArea(that, "column");
        that._columnFields.render(columnHeaderContainer, dataSource.getAreaFields("column"));

        that._filterFields = that._filterFields || new FieldsArea(that, "filter");
        that._filterFields.render(filterHeaderContainer, dataSource.getAreaFields("filter"));

        that._dataFields = that._dataFields || new FieldsArea(that, "data");
        that._dataFields.render(dataHeaderContainer, dataSource.getAreaFields("data"));

        that.element().dxPivotGridFieldChooserBase("instance").renderSortable();
    },

    _createTableElement: function() {
        var that = this;
        return $('<table>')
            .css({ width: "100%" })
            .toggleClass(BORDERS_CLASS, !!that.option("showBorders"))
            .toggleClass("dx-word-wrap", !!that.option("wordWrapEnabled"))
            .on(eventUtils.addNamespace(clickEvent.name, "dxPivotGrid"), 'td', that._handleCellClick.bind(that));
    },

    _renderDataArea: function(dataAreaElement) {
        var that = this,
            dataArea = that._dataArea || new dataAreaNamespace.DataArea(that);
        that._dataArea = dataArea;
        dataArea.render(dataAreaElement, that._dataController.getCellsInfo());

        return dataArea;
    },

    _renderRowsArea: function(rowsAreaElement) {
        var that = this,
            rowsArea = that._rowsArea || new headersArea.VerticalHeadersArea(that);
        that._rowsArea = rowsArea;
        rowsArea.render(rowsAreaElement, that._dataController.getRowsInfo());

        return rowsArea;
    },

    _renderColumnsArea: function(columnsAreaElement) {
        var that = this,
            columnsArea = that._columnsArea || new headersArea.HorizontalHeadersArea(that);
        that._columnsArea = columnsArea;
        columnsArea.render(columnsAreaElement, that._dataController.getColumnsInfo());

        return columnsArea;
    },

    _renderContentImpl: function() {
        var that = this,
            columnsAreaElement,
            rowsAreaElement,
            dataAreaElement,
            tableElement,
            dataArea,
            rowsArea,
            columnsArea,
            scrollBarInfo = getScrollBarInfo(that.element(), that.option("scrolling.useNative")),
            isFirstDrawing = !that._pivotGridContainer,
            rowHeaderContainer,
            columnHeaderContainer,
            filterHeaderContainer,
            dataHeaderContainer,
            updateHandler;

        that._scrollBarWidth = scrollBarInfo.scrollBarWidth;
        that._scrollBarUseNative = scrollBarInfo.scrollBarUseNative;

        tableElement = !isFirstDrawing && that._tableElement();

        if(!tableElement) {
            that.element().addClass(PIVOTGRID_CLASS)
                .addClass(ROW_LINES_CLASS)
                .addClass(FIELDS_CONTAINER_CLASS);

            that._pivotGridContainer = $(DIV).addClass("dx-pivotgrid-container");
            that._renderFieldChooser();
            that._renderContextMenu();

            columnsAreaElement = $(TD).addClass(COLUMN_AREA_CELL_CLASS);
            rowsAreaElement = $(TD).addClass(ROW_AREA_CELL_CLASS);
            dataAreaElement = $(TD).addClass(DATA_AREA_CELL_CLASS);

            tableElement = that._createTableElement();

            dataHeaderContainer = $(TD).addClass("dx-data-header");

            filterHeaderContainer = $("<td colspan='2'>").addClass("dx-filter-header");
            columnHeaderContainer = $(TD).addClass("dx-column-header");
            rowHeaderContainer = $(TD).addClass(DESCRIPTION_AREA_CELL_CLASS);

            $(TR)
                .append(filterHeaderContainer)
                .appendTo(tableElement);

            $(TR)
                .append(dataHeaderContainer)
                .append(columnHeaderContainer)
                .appendTo(tableElement);


            $(TR)
                .append(rowHeaderContainer)
                .append(columnsAreaElement)
                .appendTo(tableElement);

            $(TR)
                .addClass(BOTTOM_ROW_CLASS)
                .append(rowsAreaElement)
                .append(dataAreaElement)
                .appendTo(tableElement);

            that._pivotGridContainer.append(tableElement);
            that.element().append(that._pivotGridContainer);

            if(that.option("rowHeaderLayout") === "tree") {
                rowsAreaElement.addClass("dx-area-tree-view");
            }
        }

        that.element().addClass(OVERFLOW_HIDDEN_CLASS);

        that._createComponent(that.element(), PivotGridFieldChooserBase, {
            dataSource: that.getDataSource(),
            allowFieldDragging: that.option("fieldPanel.allowFieldDragging")
        });

        dataArea = that._renderDataArea(dataAreaElement);
        rowsArea = that._renderRowsArea(rowsAreaElement);
        columnsArea = that._renderColumnsArea(columnsAreaElement);

        dataArea.tableElement().prepend(columnsArea.headElement());

        if(isFirstDrawing) {
            that._renderLoadPanel(dataArea.groupElement().parent(), that.element());
            that._renderDescriptionArea();

            rowsArea.processScroll();
            columnsArea.processScroll();
        }

        updateHandler = function() {
            that.updateDimensions().done(function() {
                that._subscribeToEvents(columnsArea, rowsArea, dataArea);
            });
        };

        that._renderHeaders(rowHeaderContainer, columnHeaderContainer, filterHeaderContainer, dataHeaderContainer);
        if(that._needDelayResizing(that._dataController.getCellsInfo()) && isFirstDrawing) {
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
        var that = this;

        if(area === 'column') {
            return that._columnsArea.getScrollPath(that._scrollLeft);
        } else {
            return that._rowsArea.getScrollPath(that._scrollTop);
        }

    },

    /**
    * @name dxPivotGridMethods_getDataSource
    * @publicName getDataSource()
    * @return PivotGridDataSource
    */
    getDataSource: function() {
        return this._dataController.getDataSource();
    },

    /**
    * @name dxPivotGridMethods_getFieldChooserPopup
    * @publicName getFieldChooserPopup()
    * @return dxPopup
    */
    getFieldChooserPopup: function() {
        return this._fieldChooserPopup;
    },

    hasScroll: function(area) {
        var that = this;
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
        var that = this;
        clearTimeout(that._hideLoadingTimeoutID);
        that.callBase.apply(that, arguments);
        if(that._dataController) {
            that._dataController.dispose();
        }
    },

    _tableElement: function() {
        return this.element().find('table').first();
    },

    resize: function() {
        this.updateDimensions();
    },

    isReady: function() {
        return this.callBase() && !this._dataController.isLoading();
    },

    /**
    * @name dxPivotGridMethods_updateDimensions
    * @publicName updateDimensions()
    */
    updateDimensions: function() {
        var that = this,
            groupWidth,
            groupHeight,
            tableElement = that._tableElement(),
            rowsArea = that._rowsArea,
            columnsArea = that._columnsArea,
            dataArea = that._dataArea,
            dataAreaHeights,
            rowsAreaHeights,
            resultHeights,
            resultWidths,
            rowsAreaColumnWidths,
            bordersWidth,
            totalWidth = 0,
            totalHeight = 0,
            rowsAreaWidth = 0,
            hasRowsScroll,
            hasColumnsScroll,
            scrollBarWidth = that._scrollBarWidth || 0,
            dataAreaCell = tableElement.find("." + DATA_AREA_CELL_CLASS),
            rowAreaCell = tableElement.find("." + ROW_AREA_CELL_CLASS),
            columnAreaCell = tableElement.find("." + COLUMN_AREA_CELL_CLASS),
            descriptionCell = tableElement.find("." + DESCRIPTION_AREA_CELL_CLASS),
            filterHeaderCell = tableElement.find(".dx-filter-header"),
            elementWidth,
            columnsAreaHeight,
            descriptionCellHeight,
            columnsAreaRowHeights,
            rowHeights,
            rowFieldsHeader = that._rowFields,
            columnsAreaRowCount,
            needSynchronizeFieldPanel = rowFieldsHeader.isVisible() && that.option("rowHeaderLayout") !== "tree",
            d = $.Deferred();

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

        commonUtils.deferUpdate(function() {
            resultWidths = dataArea.getColumnsWidth();

            rowHeights = rowsArea.getRowsHeight();

            rowsAreaHeights = needSynchronizeFieldPanel ? rowHeights.slice(1) : rowHeights;
            dataAreaHeights = dataArea.getRowsHeight();

            descriptionCellHeight = descriptionCell.outerHeight() + (needSynchronizeFieldPanel ? rowHeights[0] : 0);

            columnsAreaRowCount = that._dataController.getColumnsInfo().length;

            resultHeights = pivotGridUtils.mergeArraysByMaxValue(rowsAreaHeights, dataAreaHeights.slice(columnsAreaRowCount));

            columnsAreaRowHeights = dataAreaHeights.slice(0, columnsAreaRowCount);
            columnsAreaHeight = getArraySum(columnsAreaRowHeights);

            rowsAreaColumnWidths = rowsArea.getColumnsWidth();

            if(that._hasHeight) {
                bordersWidth = getCommonBorderWidth([columnAreaCell, dataAreaCell, tableElement, tableElement.find(".dx-column-header"), filterHeaderCell], "height");
                groupHeight = that.element().height() - filterHeaderCell.height() - tableElement.find(".dx-data-header").height() - (Math.max(dataArea.headElement().height(), columnAreaCell.height(), descriptionCellHeight) + bordersWidth);
            }

            totalWidth = dataArea.tableElement().width();

            totalHeight = getArraySum(resultHeights);

            rowsAreaWidth = getArraySum(rowsAreaColumnWidths);

            elementWidth = that.element().width();

            bordersWidth = getCommonBorderWidth([rowAreaCell, dataAreaCell, tableElement], "width");
            groupWidth = elementWidth - rowsAreaWidth - bordersWidth;

            groupWidth = groupWidth > 0 ? groupWidth : totalWidth;

            hasRowsScroll = that._hasHeight && (totalHeight - groupHeight) >= 1;
            hasColumnsScroll = (totalWidth - groupWidth) >= 1;
            if(!hasRowsScroll) {
                groupHeight = totalHeight + (hasColumnsScroll ? scrollBarWidth : 0);
            }

            commonUtils.deferRender(function() {

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

                columnsArea.groupWidth(groupWidth);
                columnsArea.processScrollBarSpacing(hasRowsScroll ? scrollBarWidth : 0);
                columnsArea.setColumnsWidth(resultWidths);

                rowsArea.groupHeight(that._hasHeight ? groupHeight : "auto");
                rowsArea.processScrollBarSpacing(hasColumnsScroll ? scrollBarWidth : 0);
                //B232690
                rowsArea.setColumnsWidth(rowsAreaColumnWidths);
                rowsArea.setRowsHeight(resultHeights);

                dataArea.setColumnsWidth(resultWidths);
                dataArea.setRowsHeight(resultHeights);
                dataArea.groupWidth(groupWidth);
                dataArea.groupHeight(that._hasHeight ? groupHeight : "auto");

                needSynchronizeFieldPanel && rowFieldsHeader.setColumnsWidth(rowsAreaColumnWidths);

                dataAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !(hasRowsScroll || scrollBarWidth));
                rowAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !(hasRowsScroll && !scrollBarWidth));

                //T317921
                if(!that._hasHeight && (elementWidth !== that.element().width())) {
                    var diff = elementWidth - that.element().width();
                    if(!hasColumnsScroll) {
                        adjustSizeArray(resultWidths, diff);
                        columnsArea.setColumnsWidth(resultWidths);
                        dataArea.setColumnsWidth(resultWidths);
                    }

                    dataArea.groupWidth(groupWidth - diff);
                    columnsArea.groupWidth(groupWidth - diff);
                }

                if(that.option("scrolling.mode") === "virtual" && !that._dataController.isEmpty()) {

                    var virtualContentParams = that._dataController.calculateVirtualContentParams({
                        contentWidth: totalWidth,
                        contentHeight: totalHeight,
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

                var updateScrollableResults = [];

                $.each([columnsArea, rowsArea, dataArea], function(_, area) {
                    updateScrollableResults.push(area && area.updateScrollable());
                });

                dataArea.processScroll(that._scrollBarUseNative);

                that._updateLoading();
                that._renderNoDataText(dataAreaCell);


                ///#DEBUG
                that._testResultWidths = resultWidths;
                that._testResultHeights = resultHeights;
                ///#ENDDEBUG

                when.apply($, updateScrollableResults).done(function() {
                    that._updateScrollPosition(columnsArea, rowsArea, dataArea);
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

registerComponent("dxPivotGrid", PivotGrid);

module.exports = PivotGrid;

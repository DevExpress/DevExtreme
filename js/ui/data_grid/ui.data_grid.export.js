"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    isDefined = require("../../core/utils/type").isDefined,
    extend = require("../../core/utils/extend").extend,
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    arrayUtils = require("../../core/utils/array"),
    dataGridCore = require("./ui.data_grid.core"),
    exportMixin = require("../grid_core/ui.grid_core.export_mixin"),
    clientExporter = require("../../client_exporter"),
    messageLocalization = require("../../localization/message"),
    excelExporter = clientExporter.excel,
    Button = require("../button"),
    List = require("../list"),
    ContextMenu = require("../context_menu"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

var DATAGRID_EXPORT_MENU_CLASS = "dx-datagrid-export-menu",
    DATAGRID_EXPORT_BUTTON_CLASS = "dx-datagrid-export-button",
    DATAGRID_EXPORT_ICON = "export-to",
    DATAGRID_EXPORT_EXCEL_ICON = "exportxlsx",
    DATAGRID_EXPORT_SELECTED_ICON = "exportselected",
    DATAGRID_EXPORT_EXCEL_BUTTON_ICON = "export-excel-button",

    TOOLBAR_ITEM_AUTO_HIDE_CLASS = "dx-toolbar-item-auto-hide",
    TOOLBAR_HIDDEN_BUTTON_CLASS = "dx-toolbar-hidden-button",

    BUTTON_CLASS = "dx-button",

    DATA_STYLE_OFFSET = 3;

exports.DataProvider = Class.inherit({
    _getGroupValue: function(item) {
        var groupColumn = this._options.groupColumns[item.groupIndex],
            value = dataGridCore.getDisplayValue(groupColumn, item.key[item.groupIndex], item.data, item.rowType),
            result = groupColumn.caption + ": " + dataGridCore.formatValue(value, groupColumn);

        var summaryCells = item.summaryCells;
        if(summaryCells && summaryCells[0] && summaryCells[0].length) {
            result += " " + dataGridCore.getGroupRowSummaryText(summaryCells[0], this._options.summaryTexts);
        }

        return result;
    },

    _correctCellIndex: function(cellIndex) {
        return cellIndex;
    },

    _initOptions: function() {
        var exportController = this._exportController,
            groupColumns = exportController._columnsController.getGroupColumns(),
            excelWrapTextEnabled = exportController.option("export.excelWrapTextEnabled");

        this._options = {
            columns: exportController._getColumns(),
            groupColumns: groupColumns,
            items: !!exportController._selectionOnly ? exportController._getSelectedItems() : exportController._getAllItems(),
            getVisibleIndex: exportController._columnsController.getVisibleIndex.bind(exportController._columnsController),
            isHeadersVisible: exportController.option("showColumnHeaders"),
            summaryTexts: exportController.option("summary.texts"),
            customizeExportData: exportController.option("customizeExportData"),
            rtlEnabled: exportController.option("rtlEnabled"),
            wrapTextEnabled: isDefined(excelWrapTextEnabled) ? excelWrapTextEnabled : !!exportController.option("wordWrapEnabled"),
        };
    },

    ctor: function(exportController) {
        this._exportController = exportController;
    },

    getStyles: function() {
        var wrapTextEnabled = this._options.wrapTextEnabled,
            styles = ["center", "left", "right"].map(function(alignment) {
                return {
                    // Header, Total styles
                    bold: true,
                    alignment: alignment,
                    wrapText: true
                };
            });

        this.getColumns().forEach(function(column) {
            styles.push({
                // column styles
                alignment: column.alignment || "left",
                format: column.format,
                wrapText: wrapTextEnabled,
                dataType: column.dataType
            });
        });

        styles.push({
            // Group row style
            bold: true,
            wrapText: false,
            alignment: getDefaultAlignment(this._options.rtlEnabled)
        });

        return styles;
    },

    _getTotalCellStyleId: function(cellIndex) {
        var alignment = this.getColumns()[cellIndex] && this.getColumns()[cellIndex].alignment || "right";
        return ["center", "left", "right"].indexOf(alignment);
    },

    getStyleId: function(rowIndex, cellIndex) {
        if(rowIndex < this.getHeaderRowCount()) {
            return 0;
        } else if(this.isTotalCell(rowIndex - this.getHeaderRowCount(), cellIndex)) {
            return this._getTotalCellStyleId(cellIndex);
        } else if(this.isGroupRow(rowIndex - this.getHeaderRowCount())) {
            return DATA_STYLE_OFFSET + this.getColumns().length;
        } else {
            return cellIndex + DATA_STYLE_OFFSET;// header style offset
        }
    },

    getColumns: function(getColumnsByAllRows) {
        var columns = this._options.columns;

        return getColumnsByAllRows ? columns : columns[columns.length - 1];
    },

    getRowsCount: function() {
        return this._options.items.length + this.getHeaderRowCount();
    },

    getHeaderRowCount: function() {
        if(this.isHeadersVisible()) {
            return this._options.columns.length - 1;
        }
        return 0;
    },

    isGroupRow: function(rowIndex) {
        return rowIndex < this._options.items.length && this._options.items[rowIndex].rowType === "group";
    },

    getGroupLevel: function(rowIndex) {
        var item = this._options.items[rowIndex - this.getHeaderRowCount()],
            groupIndex = item && item.groupIndex;

        if(item && item.rowType === "totalFooter") {
            return 0;
        }
        return isDefined(groupIndex) ? groupIndex : this._options.groupColumns.length;
    },

    getCellType: function(rowIndex, cellIndex) {
        var columns = this.getColumns();

        if(rowIndex < this.getHeaderRowCount()) {
            return "string";
        } else {
            rowIndex -= this.getHeaderRowCount();
        }

        if(cellIndex < columns.length) {
            var item = this._options.items.length && this._options.items[rowIndex],
                column = columns[cellIndex];

            if(item && item.rowType === "data") {
                if(isFinite(item.values[this._correctCellIndex(cellIndex)]) && !isDefined(column.customizeText)) {
                    return isDefined(column.lookup) ? column.lookup.dataType : column.dataType;
                }
            }
            return "string";
        }
    },

    ready: function() {
        var that = this,
            options;

        that._initOptions();
        options = this._options;

        return when(options.items).done(function(items) {
            options.customizeExportData && options.customizeExportData(that.getColumns(that.getHeaderRowCount() > 1), items);
            options.items = items;
        }).fail(function() {
            options.items = [];
        });
    },

    _getHeaderCellValue: function(rowIndex, cellIndex) {
        var row = this.getColumns(true)[rowIndex];
        return row[cellIndex] && row[cellIndex].caption;
    },

    getCellValue: function(rowIndex, cellIndex) {
        var column,
            value,
            i,
            summaryItems,
            columns = this.getColumns(),
            correctedCellIndex = this._correctCellIndex(cellIndex),
            itemValues,
            item;

        if(rowIndex < this.getHeaderRowCount()) {
            return this._getHeaderCellValue(rowIndex, cellIndex);
        } else {
            rowIndex -= this.getHeaderRowCount();
        }

        item = this._options.items.length && this._options.items[rowIndex];

        if(item) {
            itemValues = item.values;
            switch(item.rowType) {
                case "groupFooter":
                case "totalFooter":
                    if(correctedCellIndex < itemValues.length) {
                        value = itemValues[correctedCellIndex];
                        if(isDefined(value)) {
                            return dataGridCore.getSummaryText(value, this._options.summaryTexts);
                        }
                    }
                    break;
                case "group":
                    if(cellIndex < 1) {
                        return this._getGroupValue(item);
                    } else {
                        summaryItems = item.values[correctedCellIndex];
                        if(Array.isArray(summaryItems)) {
                            value = "";
                            for(i = 0; i < summaryItems.length; i++) {
                                value += (i > 0 ? " \n " : "") + dataGridCore.getSummaryText(summaryItems[i], this._options.summaryTexts);
                            }
                            return value;
                        }
                    }
                    break;
                default:
                    column = columns[cellIndex];
                    if(column) {
                        value = dataGridCore.getDisplayValue(column, itemValues[correctedCellIndex], item.data, item.rowType);
                        return !isFinite(value) || column.customizeText ? dataGridCore.formatValue(value, column) : value;
                    }
            }
        }
    },

    isHeadersVisible: function() {
        return this._options.isHeadersVisible;
    },

    isTotalCell: function(rowIndex, cellIndex) {
        var items = this._options.items,
            item = items[rowIndex],
            correctCellIndex = this._correctCellIndex(cellIndex),
            isSummaryAlignByColumn = item.summaryCells && item.summaryCells[correctCellIndex] && item.summaryCells[correctCellIndex].length > 0 && item.summaryCells[correctCellIndex][0].alignByColumn;

        return item && item.rowType === "groupFooter" || item.rowType === "totalFooter" || isSummaryAlignByColumn;
    },

    getCellMerging: function(rowIndex, cellIndex) {
        var columns = this._options.columns,
            column = columns[rowIndex] && columns[rowIndex][cellIndex];

        return column ? {
            colspan: (column.colspan || 1) - 1,
            rowspan: (column.rowspan || 1) - 1
        } : { colspan: 0, rowspan: 0 };
    },

    getFrozenArea: function() {
        var that = this;

        return { x: 0, y: that.getHeaderRowCount() };
    }
});

exports.ExportController = dataGridCore.ViewController.inherit({}).include(exportMixin).inherit({
    _getEmptyCell: function() {
        return {
            caption: '',
            colspan: 1,
            rowspan: 1
        };
    },

    _updateColumnWidth: function(column, width) {
        column.width = width;
    },

    _getColumns: function() {
        var result = [],
            i,
            j,
            column,
            columns,
            columnsController = this._columnsController,
            rowCount = columnsController.getRowCount(),
            columnWidths = (this._headersView && this._headersView.isVisible()) ? this._headersView.getColumnWidths() : this._rowsView.getColumnWidths();

        for(i = 0; i <= rowCount; i++) {
            result.push([]);
            columns = columnsController.getVisibleColumns(i, true);
            for(j = 0; j < columns.length; j++) {
                column = extend({}, columns[j], {
                    dataType: columns[j].dataType === "datetime" ? "date" : columns[j].dataType
                });

                if(column.allowExporting && !column.command) {
                    if(i === rowCount && columnWidths && columnWidths.length) {
                        this._updateColumnWidth(column, columnWidths[j]);
                    }
                    result[i].push(column);
                }
            }
        }

        columns = result[rowCount];
        result = this._prepareItems(result.slice(0, -1));
        result.push(columns);

        return result;
    },

    _getFooterSummaryItems: function(summaryCells, isTotal) {
        var result = [],
            estimatedItemsCount = 1,
            values,
            itemsLength,
            summaryCell,
            j,
            i = 0;

        do {
            values = [];
            for(j = 0; j < summaryCells.length; j++) {
                summaryCell = summaryCells[j];
                itemsLength = summaryCell.length;
                if(estimatedItemsCount < itemsLength) {
                    estimatedItemsCount = itemsLength;
                }
                values.push(summaryCell[i]);
            }
            result.push({ values: values, rowType: isTotal ? "totalFooter" : "groupFooter" });
        } while(i++ < estimatedItemsCount - 1);

        return result;
    },

    _hasSummaryGroupFooters: function() {
        var i,
            groupItems = this.option("summary.groupItems");

        if(isDefined(groupItems)) {
            for(i = 0; i < groupItems.length; i++) {
                if(groupItems[i].showInGroupFooter) {
                    return true;
                }
            }
        }

        return false;
    },

    _getItemsWithSummaryGroupFooters: function(sourceItems) {
        var item,
            result = [],
            beforeGroupFooterItems = [],
            groupFooterItems = [],
            i;

        for(i = 0; i < sourceItems.length; i++) {
            item = sourceItems[i];
            if(item.rowType === "groupFooter") {
                groupFooterItems = this._getFooterSummaryItems(item.summaryCells);
                result = result.concat(beforeGroupFooterItems, groupFooterItems);
                beforeGroupFooterItems = [];
            } else {
                beforeGroupFooterItems.push(item);
            }
        }

        return result.length ? result : beforeGroupFooterItems;
    },

    _updateGroupValuesWithSummaryByColumn: function(sourceItems) {
        var item,
            summaryCells,
            summaryItem,
            summaryValues = [],
            groupColumnCount,
            k,
            j,
            i;

        for(i = 0; i < sourceItems.length; i++) {
            item = sourceItems[i];
            summaryCells = item.summaryCells;
            if(item.rowType === "group" && summaryCells && summaryCells.length > 1) {
                groupColumnCount = item.values.length;
                for(j = 1; j < summaryCells.length; j++) {
                    for(k = 0; k < summaryCells[j].length; k++) {
                        summaryItem = summaryCells[j][k];
                        if(summaryItem && summaryItem.alignByColumn) {
                            if(!Array.isArray(summaryValues[j - groupColumnCount])) {
                                summaryValues[j - groupColumnCount] = [];
                            }
                            summaryValues[j - groupColumnCount].push(summaryItem);
                        }
                    }
                }

                if(summaryValues.length > 0) {
                    arrayUtils.merge(item.values, summaryValues);
                    summaryValues = [];
                }
            }
        }
    },

    _processUnExportedItems: function(items) {
        var columns = this._columnsController.getVisibleColumns(null, true),
            groupColumns = this._columnsController.getGroupColumns(),
            item,
            column,
            values,
            summaryCells,
            i,
            j;

        for(i = 0; i < items.length; i++) {
            item = items[i];
            values = [];
            summaryCells = [];

            for(j = 0; j < columns.length; j++) {
                column = columns[j];
                if(!column.command && (column.allowExporting || item.rowType === "group")) {
                    if(item.values) {
                        if(item.rowType === "group" && !values.length) {
                            values.push(item.key[item.groupIndex]);
                        } else {
                            values.push(item.values[j]);
                        }
                    }
                    if(item.summaryCells) {
                        if(item.rowType === "group" && !summaryCells.length) {
                            summaryCells.push(item.summaryCells[j - groupColumns.length + item.groupIndex]);
                        } else {
                            summaryCells.push(item.summaryCells[j]);
                        }
                    }
                }
            }

            if(values.length) {
                item.values = values;
            }
            if(summaryCells.length) {
                item.summaryCells = summaryCells;
            }
        }
    },

    _getAllItems: function(data) {
        var that = this,
            d = new Deferred(),
            dataController = this.getController("data"),
            footerItems = dataController.footerItems(),
            totalItem = footerItems.length && footerItems[0],
            summaryTotalItems = that.option("summary.totalItems"),
            summaryCells,
            summaryItems;

        when(data).done(function(data) {
            dataController.loadAll(data).done(function(sourceItems, totalAggregates) {
                that._updateGroupValuesWithSummaryByColumn(sourceItems);

                if(that._hasSummaryGroupFooters()) {
                    sourceItems = that._getItemsWithSummaryGroupFooters(sourceItems);
                }

                summaryCells = totalItem && totalItem.summaryCells;

                if(isDefined(totalAggregates) && summaryTotalItems) {
                    summaryCells = dataController._getSummaryCells(summaryTotalItems, totalAggregates);
                }

                summaryItems = totalItem && that._getFooterSummaryItems(summaryCells, true);
                if(summaryItems) {
                    sourceItems = sourceItems.concat(summaryItems);
                }

                that._processUnExportedItems(sourceItems);
                d.resolve(sourceItems);
            }).fail(d.reject);
        }).fail(d.reject);

        return d;
    },

    _getSelectedItems: function() {
        var selectionController = this.getController("selection"),
            selectedRowData = selectionController.getSelectedRowsData();

        return this._getAllItems(selectedRowData);
    },

    init: function() {
        this._columnsController = this.getController("columns");
        this._rowsView = this.getView("rowsView");
        this._headersView = this.getView("columnHeadersView");

        this.createAction("onExporting", { excludeValidators: ["disabled", "readOnly"] });
        this.createAction("onExported", { excludeValidators: ["disabled", "readOnly"] });
        this.createAction("onFileSaving", { excludeValidators: ["disabled", "readOnly"] });
    },

    callbackNames: function() {
        return ["selectionOnlyChanged"];
    },

    getExportFormat: function() { return ["EXCEL"]; },

    getDataProvider: function() {
        return new exports.DataProvider(this);
    },
    /**
    * @name dxDataGridMethods.exportToExcel
    * @publicName exportToExcel(selectionOnly)
    * @param1 selectionOnly:boolean
    */
    exportToExcel: function(selectionOnly) {
        var that = this;

        that._selectionOnly = selectionOnly;

        clientExporter.export(that.component.getDataProvider(), {
            fileName: that.option("export.fileName"),
            proxyUrl: that.option("export.proxyUrl"),
            format: "EXCEL",
            autoFilterEnabled: !!that.option("export.excelFilterEnabled"),
            rtlEnabled: that.option("rtlEnabled"),
            ignoreErrors: that.option("export.ignoreExcelErrors"),
            exportingAction: that.getAction("onExporting"),
            exportedAction: that.getAction("onExported"),
            fileSavingAction: that.getAction("onFileSaving")
        }, excelExporter.getData);
    },

    publicMethods: function() {
        return ["getDataProvider", "getExportFormat", "exportToExcel"];
    },

    selectionOnly: function(value) {
        if(isDefined(value)) {
            this._isSelectedRows = value;
            this.selectionOnlyChanged.fire();
        } else {
            return this._isSelectedRows;
        }
    }
});

dataGridCore.registerModule("export", {
    defaultOptions: function() {
        return {
            /**
            * @name dxDataGridOptions.export
            * @type object
            */
            "export": {
                /**
                 * @name dxDataGridOptions.export.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxDataGridOptions.export.fileName
                 * @type string
                 * @default "DataGrid"
                 */
                fileName: "DataGrid",
                /**
                 * @name dxDataGridOptions.export.excelFilterEnabled
                 * @type boolean
                 * @default false
                 */
                excelFilterEnabled: false,
                /**
                 * @name dxDataGridOptions.export.excelWrapTextEnabled
                 * @type boolean
                 * @default undefined
                 */
                excelWrapTextEnabled: undefined,
                /**
                 * @name dxDataGridOptions.export.proxyUrl
                 * @type string
                 * @default undefined
                 */
                proxyUrl: undefined,
                /**
                 * @name dxDataGridOptions.export.allowExportSelectedData
                 * @type boolean
                 * @default false
                 */
                allowExportSelectedData: false,
                /**
                * @name dxDataGridOptions.export.ignoreExcelErrors
                * @type boolean
                * @default true
                */
                ignoreExcelErrors: true,
                /**
                 * @name dxDataGridOptions.export.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name dxDataGridOptions.export.texts.exportTo
                     * @type string
                     * @default "Export"
                     */
                    exportTo: messageLocalization.format("dxDataGrid-exportTo"),
                    /**
                     * @name dxDataGridOptions.export.texts.exportAll
                     * @type string
                     * @default "Export all data"
                     */
                    exportAll: messageLocalization.format("dxDataGrid-exportAll"),
                    /**
                     * @name dxDataGridOptions.export.texts.exportSelectedRows
                     * @type string
                     * @default "Export selected rows"
                     */
                    exportSelectedRows: messageLocalization.format("dxDataGrid-exportSelectedRows")
                }
            }
            /**
             * @name dxDataGridOptions.onExporting
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 fileName:string
             * @type_function_param1_field5 cancel:boolean
             * @extends Action
             * @action
             */
            /**
            @name dxDataGridOptions.onFileSaving
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field3 fileName:string
            * @type_function_param1_field4 format:string
            * @type_function_param1_field5 data:BLOB
            * @type_function_param1_field6 cancel:boolean
            * @extends Action
            * @action
            */
            /**
             * @name dxDataGridOptions.onExported
             * @extends Action
             * @action
             */
            /**
             * @name dxDataGridOptions.customizeExportData
             * @type function(columns, rows)
             * @type_function_param1 columns:Array<dxDataGridColumn>
             * @type_function_param2 rows:Array<dxDataGridRowObject>
             */
        };
    },
    controllers: {
        "export": exports.ExportController
    },
    extenders: {
        controllers: {
            editing: {
                callbackNames: function() {
                    var callbackList = this.callBase();
                    return isDefined(callbackList) ? callbackList.push("editingChanged") : ["editingChanged"];
                },

                _updateEditButtons: function() {
                    this.callBase();
                    this.editingChanged.fire(this.hasChanges());
                }
            }
        },
        views: {
            headerPanel: {
                _getToolbarItems: function() {
                    var items = this.callBase();

                    return this._appendExportItems(items);
                },

                _appendExportItems: function(items) {
                    var that = this,
                        exportOptions = that.option("export");

                    if(exportOptions.enabled) {
                        var exportItems = [];

                        if(exportOptions.allowExportSelectedData) {
                            exportItems.push({
                                template: function(data, index, container) {
                                    var $container = $(container);
                                    that._renderButton(data, $container);
                                    that._renderExportMenu($container);
                                },
                                menuItemTemplate: function(data, index, container) {
                                    that._renderList(data, $(container));
                                },
                                name: "exportButton",
                                allowExportSelected: true,
                                location: "after",
                                locateInMenu: "auto",
                                sortIndex: 30
                            });

                        } else {
                            exportItems.push({
                                template: function(data, index, container) {
                                    that._renderButton(data, $(container));
                                },
                                menuItemTemplate: function(data, index, container) {
                                    that._renderButton(data, $(container), true);
                                },
                                name: "exportButton",
                                location: "after",
                                locateInMenu: "auto",
                                sortIndex: 30
                            });
                        }
                        items = items.concat(exportItems);
                        that._correctItemsPosition(items);
                    }

                    return items;
                },

                _renderButton: function(data, $container, withText) {
                    var that = this,
                        buttonOptions = that._getButtonOptions(data.allowExportSelected),
                        $buttonContainer = that._getButtonContainer()
                            .addClass(DATAGRID_EXPORT_BUTTON_CLASS)
                            .appendTo($container);

                    if(withText) {
                        var wrapperNode = $("<div>").addClass(TOOLBAR_ITEM_AUTO_HIDE_CLASS);
                        $container
                            .wrapInner(wrapperNode)
                            .parent()
                            .addClass("dx-toolbar-menu-action dx-toolbar-menu-button " + TOOLBAR_HIDDEN_BUTTON_CLASS);
                        buttonOptions.text = buttonOptions.hint;
                    }

                    that._createComponent(
                        $buttonContainer,
                        Button,
                        buttonOptions
                    );
                },

                _renderList: function(data, $container) {
                    var that = this,
                        texts = that.option("export.texts"),
                        items = [{
                            template: function(data, index, container) {
                                that._renderFakeButton(data, $(container), DATAGRID_EXPORT_EXCEL_ICON);
                            },
                            text: texts.exportAll
                        }, {
                            template: function(data, index, container) {
                                that._renderFakeButton(data, $(container), DATAGRID_EXPORT_SELECTED_ICON);
                            },
                            text: texts.exportSelectedRows,
                            exportSelected: true
                        }];

                    that._createComponent(
                        $container,
                        List,
                        {
                            items: items,
                            onItemClick: function(e) {
                                that._exportController.exportToExcel(e.itemData.exportSelected);
                            },
                            scrollingEnabled: false
                        }
                    );
                },

                _renderFakeButton: function(data, $container, iconName) {
                    var $icon = $("<div>")
                            .addClass("dx-icon dx-icon-" + iconName),
                        $text = $("<span>")
                            .addClass("dx-button-text")
                            .text(data.text),
                        $content = $("<div>")
                            .addClass("dx-button-content")
                            .append($icon)
                            .append($text),
                        $button = $("<div>")
                            .addClass(BUTTON_CLASS + " dx-button-has-text dx-button-has-icon dx-datagrid-toolbar-button")
                            .append($content),
                        $toolbarItem = $("<div>")
                            .addClass(TOOLBAR_ITEM_AUTO_HIDE_CLASS)
                            .append($button);

                    $container
                        .append($toolbarItem)
                        .parent()
                        .addClass("dx-toolbar-menu-custom " + TOOLBAR_HIDDEN_BUTTON_CLASS);
                },

                _correctItemsPosition: function(items) {
                    items.sort(function(itemA, itemB) {
                        return itemA.sortIndex - itemB.sortIndex;
                    });
                },

                _renderExportMenu: function($buttonContainer) {
                    var that = this,
                        $button = $buttonContainer.find("." + BUTTON_CLASS),
                        texts = that.option("export.texts"),
                        menuItems = [
                            {
                                text: texts.exportAll,
                                icon: DATAGRID_EXPORT_EXCEL_ICON
                            },
                            {
                                text: texts.exportSelectedRows,
                                exportSelected: true,
                                icon: DATAGRID_EXPORT_SELECTED_ICON
                            }
                        ],
                        $menuContainer = $("<div>").appendTo($buttonContainer);

                    that._contextMenu = that._createComponent($menuContainer, ContextMenu, {
                        showEvent: "dxclick",
                        items: menuItems,
                        cssClass: DATAGRID_EXPORT_MENU_CLASS,
                        onItemClick: function(e) {
                            that._exportController.exportToExcel(e.itemData.exportSelected);
                        },
                        target: $button,
                        position: {
                            at: "left bottom",
                            my: "left top",
                            offset: "0 3",
                            collision: "fit",
                            boundary: that._$parent,
                            boundaryOffset: "1 1"
                        }
                    });
                },

                _isExportButtonVisible: function() {
                    return this.option("export.enabled");
                },

                _getButtonOptions: function(allowExportSelected) {
                    var that = this,
                        texts = that.option("export.texts"),
                        options;

                    if(allowExportSelected) {
                        options = {
                            hint: texts.exportTo,
                            icon: DATAGRID_EXPORT_ICON
                        };
                    } else {
                        options = {
                            hint: texts.exportAll,
                            icon: DATAGRID_EXPORT_EXCEL_BUTTON_ICON,
                            onClick: function() {
                                that._exportController.exportToExcel();
                            }
                        };
                    }

                    return options;
                },

                optionChanged: function(args) {
                    this.callBase(args);
                    if(args.name === "export") {
                        args.handled = true;
                        this._invalidate();
                    }
                },

                init: function() {
                    var that = this;
                    this.callBase();
                    this._exportController = this.getController("export");
                    this._editingController = this.getController("editing");
                    this._editingController.editingChanged.add(function(hasChanges) {
                        that.setToolbarItemDisabled("exportButton", hasChanges);
                    });
                },

                isVisible: function() {
                    return this.callBase() || this._isExportButtonVisible();
                }
            }
        }
    }
});

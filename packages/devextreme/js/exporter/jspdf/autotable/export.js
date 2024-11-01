import { isDate, isDefined, isObject, isFunction, isNumeric } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import dateLocalization from '../../../common/core/localization/date';
import numberLocalization from '../../../common/core/localization/number';
import messageLocalization from '../../../common/core/localization/message';
import { ExportLoadPanel } from '../../common/export_load_panel';
import { hasWindow } from '../../../core/utils/window';

export const Export = {
    getFullOptions: function(options) {
        const fullOptions = extend({}, options);
        if(!(isDefined(fullOptions.jsPDFDocument) && isObject(fullOptions.jsPDFDocument))) {
            throw Error('The "jsPDFDocument" field must contain a jsPDF instance.');
        }
        if(!(isDefined(fullOptions.jsPDFDocument.autoTable) && isFunction(fullOptions.jsPDFDocument.autoTable))) {
            throw Error('The "exportDataGrid" method requires a autoTable plugin for jsPDF object.');
        }
        if(!isDefined(fullOptions.keepColumnWidths)) {
            fullOptions.keepColumnWidths = true;
        }
        if(!isDefined(fullOptions.autoTableOptions)) {
            fullOptions.autoTableOptions = this._getDefaultAutoTableOptions();
        } else {
            if(!isObject(fullOptions.autoTableOptions)) {
                throw Error('The "autoTableOptions" option must be of object type.');
            }
            fullOptions.autoTableOptions = extend(true, {}, this._getDefaultAutoTableOptions(), fullOptions.autoTableOptions);
        }
        if(!isDefined(fullOptions.loadPanel)) {
            fullOptions.loadPanel = {};
        }
        if(!isDefined(fullOptions.loadPanel.enabled)) {
            fullOptions.loadPanel.enabled = true;
        }
        if(!isDefined(fullOptions.loadPanel.text)) {
            fullOptions.loadPanel.text = messageLocalization.format('dxDataGrid-exporting');
        }

        return fullOptions;
    },

    _getDefaultAutoTableOptions: function() {
        return {
            theme: 'plain',
            tableLineColor: 149,
            tableLineWidth: 0.1,
            styles: {
                textColor: 51,
                lineColor: 149,
                lineWidth: 0
            },
            columnStyles: {},
            headStyles: {
                fontStyle: 'normal',
                textColor: 149,
                lineWidth: 0.1
            },
            bodyStyles: {
                lineWidth: 0.1
            },
            head: [],
            body: []
        };
    },

    export: function(options) {
        const {
            jsPDFDocument,
            autoTableOptions,
            component,
            customizeCell,
            keepColumnWidths,
            selectedRowsOnly,
            loadPanel
        } = options;

        const internalComponent = component._getInternalInstance?.() || component;
        const initialLoadPanelEnabledOption = internalComponent.option('loadPanel') && internalComponent.option('loadPanel').enabled;


        if(initialLoadPanelEnabledOption) {
            component.option('loadPanel.enabled', false);
        }

        let exportLoadPanel;
        if(loadPanel.enabled && hasWindow()) {
            const rowsView = component.getView('rowsView');

            exportLoadPanel = new ExportLoadPanel(component, rowsView.element(), rowsView.element().parent(), loadPanel);
            exportLoadPanel.show();
        }

        const dataProvider = component.getDataProvider(selectedRowsOnly);
        const wrapText = !!component.option('wordWrapEnabled');

        return new Promise((resolve) => {
            dataProvider.ready().done(() => {
                const columns = dataProvider.getColumns();
                const styles = dataProvider.getStyles();
                const dataRowsCount = dataProvider.getRowsCount();
                const headerRowCount = dataProvider.getHeaderRowCount();
                const mergedCells = [];

                if(keepColumnWidths) {
                    const pdfColumnWidths = this._tryGetPdfColumnWidths(autoTableOptions.tableWidth, dataProvider.getColumnsWidths());

                    if(isDefined(pdfColumnWidths) && isDefined(autoTableOptions.columnStyles)) {
                        this._setColumnWidths(autoTableOptions.columnStyles, pdfColumnWidths);
                    }
                }

                for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                    const row = [];

                    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {

                        const { value, cellSourceData: gridCell } = dataProvider.getCellData(rowIndex, cellIndex, true);
                        const cellStyle = styles[dataProvider.getStyleId(rowIndex, cellIndex)];

                        const pdfCell = {
                            content: this._getFormattedValue(value, cellStyle.format),
                            styles: this._getPDFCellStyles(gridCell.rowType, columns[cellIndex].alignment, cellStyle, wrapText)
                        };

                        if(gridCell.rowType === 'header') {
                            const mergedRange = this._tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider);
                            if(mergedRange && mergedRange.rowSpan > 0) {
                                pdfCell.rowSpan = mergedRange.rowSpan + 1;
                            }
                            if(mergedRange && mergedRange.colSpan > 0) {
                                pdfCell.colSpan = mergedRange.colSpan + 1;
                            }
                            const isMergedCell = mergedCells[rowIndex] && mergedCells[rowIndex][cellIndex];
                            if(!isMergedCell || pdfCell.rowSpan > 1 || pdfCell.colSpan > 1) {
                                if(isFunction(customizeCell)) {
                                    customizeCell({ gridCell, pdfCell });
                                }
                                row.push(pdfCell);
                            }
                        } else if(gridCell.rowType === 'group' && !isDefined(pdfCell.content) && row.length === 1) {
                            row[0].colSpan = row[0].colSpan ?? 1;
                            row[0].colSpan++;
                        } else {
                            pdfCell.content = pdfCell.content ?? '';
                            if(isFunction(customizeCell)) {
                                customizeCell({ gridCell, pdfCell });
                            }
                            row.push(pdfCell);
                        }
                    }

                    if(rowIndex < headerRowCount) {
                        autoTableOptions.head.push(row);
                    } else {
                        autoTableOptions.body.push(row);
                    }
                }

                jsPDFDocument.autoTable(autoTableOptions);
                ///#DEBUG
                jsPDFDocument.autoTable.__autoTableOptions = autoTableOptions;
                ///#ENDDEBUG

                resolve();
            }).always(() => {
                if(initialLoadPanelEnabledOption) {
                    component.option('loadPanel.enabled', initialLoadPanelEnabledOption);
                }

                if(loadPanel.enabled && hasWindow()) {
                    exportLoadPanel.dispose();
                }
            });
        });
    },

    _getFormattedValue: function(value, format) {
        if(isDefined(format)) {
            if(isDate(value)) {
                return dateLocalization.format(value, format);
            }
            if(isNumeric(value)) {
                return numberLocalization.format(value, format);
            }
        }
        return value;
    },

    _getPDFCellStyles: function(rowType, columnAlignment, cellStyle, wrapText) {
        const { alignment: cellAlignment, bold } = cellStyle;
        const align = (rowType === 'header') ? columnAlignment : cellAlignment;
        const pdfCellStyle = {};

        if(align) {
            pdfCellStyle['halign'] = align;
        }
        if(bold && rowType !== 'header') {
            pdfCellStyle.fontStyle = 'bold';
        }
        if(wrapText) {
            pdfCellStyle.cellWidth = 'wrap';
        }

        return pdfCellStyle;
    },

    _tryGetMergeRange: function(rowIndex, cellIndex, mergedCells, dataProvider) {
        if(!mergedCells[rowIndex] || !mergedCells[rowIndex][cellIndex]) {
            const { colspan, rowspan } = dataProvider.getCellMerging(rowIndex, cellIndex);
            if(colspan || rowspan) {
                for(let i = rowIndex; i <= rowIndex + rowspan || 0; i++) {
                    for(let j = cellIndex; j <= cellIndex + colspan || 0; j++) {
                        if(!mergedCells[i]) {
                            mergedCells[i] = [];
                        }
                        mergedCells[i][j] = true;
                    }
                }
                return { rowSpan: rowspan, colSpan: colspan };
            }
        }
    },

    _tryGetPdfColumnWidths(autoTableWidth, columnWidths) {
        if(isNumeric(autoTableWidth) && isDefined(columnWidths)) {
            const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
            return columnWidths.map((columnWidth) => autoTableWidth * columnWidth / tableWidth);
        }
    },

    _setColumnWidths: function(autoTableColumnStyles, pdfColumnWidths) {
        pdfColumnWidths.forEach((width, index) => {
            autoTableColumnStyles[index] = autoTableColumnStyles[index] || {};
            autoTableColumnStyles[index].cellWidth = width;
        });
    }
};

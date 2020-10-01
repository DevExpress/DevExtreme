import { isDate, isDefined, isObject, isFunction, isNumeric } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import dateLocalization from '../../localization/date';
import numberLocalization from '../../localization/number';

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
            keepColumnWidths,
            selectedRowsOnly
        } = options;
        const dataProvider = component.getDataProvider(selectedRowsOnly);

        return new Promise((resolve) => {
            dataProvider.ready().done(() => {
                const columns = dataProvider.getColumns();
                const styles = dataProvider.getStyles();
                const dataRowsCount = dataProvider.getRowsCount();
                const headerRowCount = dataProvider.getHeaderRowCount();

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
                            styles: this._getPDFCellStyles(gridCell.rowType, columns[cellIndex].alignment, cellStyle)
                        };

                        if(gridCell.rowType === 'group' && !isDefined(pdfCell.content) && row.length === 1) {
                            row[0].colSpan = row[0].colSpan ?? 1;
                            row[0].colSpan++;
                        } else {
                            pdfCell.content = pdfCell.content ?? '';
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

                resolve(jsPDFDocument); // Do we need to return the Promise with jsPDFDocument param?
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

    _getPDFCellStyles: function(rowType, columnAlignment, cellStyle) {
        const { alignment: cellAlignment, bold, wrapText } = cellStyle;
        const align = (rowType === 'header') ? columnAlignment : cellAlignment;
        const pdfCellStyle = {};

        if(align) {
            pdfCellStyle['halign'] = align;
        }
        if(rowType !== 'header') {
            if(bold) {
                pdfCellStyle.fontStyle = 'bold';
            }
            if(wrapText) {
                pdfCellStyle.cellWidth = 'wrap';
            }
        }

        return pdfCellStyle;
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

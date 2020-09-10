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
            fullOptions.autoTableOptions = this.getDefaultAutoTableOptions();
        } else {
            if(!isObject(fullOptions.autoTableOptions)) {
                throw Error('The "autoTableOptions" option must be of object type.');
            }
            fullOptions.autoTableOptions = extend(true, {}, this.getDefaultAutoTableOptions(), fullOptions.autoTableOptions);
        }

        return fullOptions;
    },

    getDefaultAutoTableOptions: function() {
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

                if(keepColumnWidths) {
                    const pdfColumnWidths = this.getDefaultPdfColumnWidths(autoTableOptions.tableWidth, dataProvider.getColumnsWidths());
                    this.setColumnWidths(autoTableOptions, pdfColumnWidths);
                }

                for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {

                    let rowType = null;
                    const row = [];

                    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {

                        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                        const cellStyle = styles[dataProvider.getStyleId(rowIndex, cellIndex)];
                        const gridCell = cellData.cellSourceData;
                        const pdfCell = {
                            content: cellData.value,
                            styles: {}
                        };

                        this.applyCellDataFormat(pdfCell, gridCell, cellStyle);
                        this.assignCellStyle(pdfCell, gridCell, columns[cellIndex], cellStyle);

                        if(!isDefined(rowType)) { rowType = gridCell.rowType; }

                        if(rowType === 'group' && !isDefined(pdfCell.content) && row.length === 1) {
                            if(!isDefined(row[0].colSpan)) {
                                row[0].colSpan = 1;
                            }
                            row[0].colSpan += 1;
                        } else {
                            row.push(pdfCell);
                        }
                    }

                    if(isDefined(rowType)) {
                        if(rowType === 'header') {
                            autoTableOptions.head.push(row);
                        } else {
                            autoTableOptions.body.push(row);
                        }
                    }
                }

                jsPDFDocument.autoTable(autoTableOptions);
                ///#DEBUG
                jsPDFDocument.autoTable.__autoTableOptions = autoTableOptions;
                ///#ENDDEBUG

                resolve(jsPDFDocument);
            });
        });
    },

    applyCellDataFormat: function(pdfCell, gridCell, cellStyle) {
        if(gridCell.rowType === 'data' && isDefined(cellStyle) && isDefined(cellStyle.format)) {
            if(isDate(pdfCell.content) && (cellStyle.dataType === 'date' || cellStyle.dataType === 'datetime')) {
                pdfCell.content = dateLocalization.format(new Date(pdfCell.content), cellStyle.format);
            }
            if(isNumeric(pdfCell.content) && cellStyle.dataType === 'number') {
                pdfCell.content = numberLocalization.format(pdfCell.content, cellStyle.format);
            }
        }
    },

    assignCellStyle: function(pdfCell, gridCell, column, cellStyle) {
        if(gridCell.rowType === 'header') {
            // eslint-disable-next-line spellcheck/spell-checker
            if(column.alignment) { pdfCell.styles.halign = column.alignment; }
        } else {
            if(isDefined(cellStyle)) {
                // eslint-disable-next-line spellcheck/spell-checker
                if(cellStyle.alignment) { pdfCell.styles.halign = cellStyle.alignment; }
                if(cellStyle.bold) { pdfCell.styles.fontStyle = 'bold'; }
                if(cellStyle.wrapText) { pdfCell.styles.cellWidth = 'wrap'; }
            }
        }
    },

    getDefaultPdfColumnWidths(autoTableWidth, columnWidths) {
        if(!isNumeric(autoTableWidth) || !isDefined(columnWidths)) {
            return;
        }
        const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
        return columnWidths.map((columnWidth) => autoTableWidth * columnWidth / tableWidth);
    },

    setColumnWidths: function(autoTableOptions, pdfColumnWidths) {
        if(!pdfColumnWidths) {
            return;
        }
        const columnStyles = autoTableOptions.columnStyles;
        for(let i = 0; i < pdfColumnWidths.length; i++) {
            columnStyles[i] = columnStyles[i] || {};
            columnStyles[i].cellWidth = pdfColumnWidths[i];
        }
    }
};

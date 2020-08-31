import { isDefined, isObject, isFunction, isNumeric } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import dateLocalization from '../../localization/date';

export const Export = {
    _getFullOptions: function(options) {
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

                if(keepColumnWidths) {
                    const pdfColumnWidths = this._getDefaultPdfColumnWidths(autoTableOptions.tableWidth, dataProvider.getColumnsWidths());
                    this._setColumnWidths(autoTableOptions, pdfColumnWidths);
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

                        this._assignCellStyle(pdfCell, gridCell, columns[cellIndex], cellStyle);

                        if(!isDefined(rowType)) { rowType = gridCell.rowType; }

                        row.push(pdfCell);
                    }

                    if(rowType === 'header') { autoTableOptions.head.push(row); }
                    if(rowType === 'data') { autoTableOptions.body.push(row); }
                }

                jsPDFDocument.autoTable(autoTableOptions);
                ///#DEBUG
                jsPDFDocument.autoTable.__autoTableOptions = autoTableOptions;
                ///#ENDDEBUG

                resolve(jsPDFDocument);
            });
        });
    },

    _assignCellStyle: function(pdfCell, gridCell, column, cellStyle) {
        if(gridCell.rowType === 'header') {
            // eslint-disable-next-line spellcheck/spell-checker
            if(column.alignment) { pdfCell.styles.halign = column.alignment; }
        } else {
            if(cellStyle) {
                // eslint-disable-next-line spellcheck/spell-checker
                if(cellStyle.alignment) { pdfCell.styles.halign = cellStyle.alignment; }
                if(cellStyle.bold) { pdfCell.styles.fontStyle = 'bold'; }
                if(cellStyle.wrapText) { pdfCell.styles.cellWidth = 'wrap'; }
                if(cellStyle.dataType === 'date') { pdfCell.content = dateLocalization.format(new Date(pdfCell.content), cellStyle.format); }
            }
        }
    },

    _getDefaultPdfColumnWidths(autoTableWidth, columnWidths) {
        if(isNumeric(autoTableWidth)) {
            const tableWidth = columnWidths.reduce((a, b) => { return a + b; });
            return columnWidths.map((columnWidth) => {
                return autoTableWidth * columnWidth / tableWidth;
            });
        }
    },

    _setColumnWidths: function(autoTableOptions, pdfColumnWidths) {
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

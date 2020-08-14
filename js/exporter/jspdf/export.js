import { isDefined, isObject, isFunction } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import dateLocalization from '../../localization/date';

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

    export: function(options, privateOptions) {
        const {
            jsPDFDocument,
            autoTableOptions,
            component,
            keepColumnWidths,
            selectedRowsOnly
        } = options;

        const tableWidth = component.option('width');
        const dataProvider = component.getDataProvider(selectedRowsOnly);

        return new Promise((resolve) => {
            dataProvider.ready().done(() => {
                const columns = dataProvider.getColumns();
                const styles = dataProvider.getStyles();
                const dataRowsCount = dataProvider.getRowsCount();

                this.setTableWidth(autoTableOptions, tableWidth);
                this.setColumnWidths(autoTableOptions, columns, keepColumnWidths);

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

                        this.assignCellStyle(pdfCell, gridCell, columns[cellIndex], cellStyle);

                        rowType = rowType || gridCell.rowType;
                        if(rowType === 'header') {
                            if(pdfCell.content !== '') { row.push(pdfCell); }
                        } else {
                            row.push(pdfCell);
                        }
                    }

                    this.addRow(autoTableOptions, rowType, row);
                }

                jsPDFDocument.autoTable(autoTableOptions);

                resolve(autoTableOptions);
            }).always(() => {

            });
        });
    },

    addRow: function(autoTableOptions, rowType, row) {
        if(rowType === 'header') { autoTableOptions.head.push(row); }
        if(rowType === 'data') { autoTableOptions.body.push(row); }
    },

    assignCellStyle: function(pdfCell, gridCell, column, cellStyle) {
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

    setTableWidth: function(autoTableOptions, width) {
        if(width) { autoTableOptions.tableWidth = this.convertUnitToPoints(width, 'px'); }
    },

    setColumnWidths: function(autoTableOptions, columns, keepColumnWidths) {
        const columnStyles = autoTableOptions.columnStyles;

        for(let i = 0; i < columns.length; i++) {
            columnStyles[i] = columnStyles[i] || {};

            const columnWidth = columns[i].gridColumn.width;
            if(keepColumnWidths && (typeof columnWidth === 'number') && isFinite(columnWidth)) {
                columnStyles[i].cellWidth = this.convertUnitToPoints(columnWidth, 'px');
            } else {
                columnStyles[i].cellWidth = 'auto';
            }
        }
    },

    getRelativeProportionsToPt: function(unit) {
        // Unit table from https://github.com/MrRio/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L791
        let k = 1;
        switch(unit) {
            case 'pt': k = 1; break;
            case 'mm': k = 72 / 25.4; break;
            case 'cm': k = 72 / 2.54; break;
            case 'in': k = 72; break;
            case 'px': k = 96 / 72; break;
            case 'pc': k = 12; break;
            case 'em': k = 12; break;
            case 'ex': k = 6; break;
            default:
                throw ('Invalid unit: ' + unit);
        }
        return k;
    },

    convertUnitToPoints: function(value, unit) {
        const k = this.getRelativeProportionsToPt(unit);
        return value / k;
    },

    convertPointsToUnit: function(points, unit) {
        const k = this.getRelativeProportionsToPt(unit);
        return points * k;
    }
};

//#DEBUG
Export.__internals = { };
//#ENDDEBUG
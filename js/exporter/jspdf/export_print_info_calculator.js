import { isDefined, isNumeric } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';

export const ExportPrintInfoCalculator = {
    _defaultMinCellHeight: 10,

    _getDefaultOptions: function() {
        return {
            margin: {
                all: 10
            },
            columnStyles: { },
            cells: []
        };
    },

    calculate: function(options) {
        options = extend(true, {}, this._getDefaultOptions(), options);

        const {
            jsPDFDocument,
            margin,
            startX,
            startY,
            cells,
            tableWidth,
            columnStyles
        } = options;

        margin.top = margin.top ?? margin.all;
        margin.right = margin.right ?? margin.all;
        margin.bottom = margin.bottom ?? margin.all;
        margin.left = margin.left ?? margin.all;

        const x = startX ?? margin.left;
        const y = startY ?? margin.top;
        const width = isNumeric(tableWidth)
            ? tableWidth
            : this._calculateTableWidth(jsPDFDocument, x, margin.right);

        this._calculateColumnsStyles(width, columnStyles, cells);
        this._calculateCellsCoordinates(x, y, cells, columnStyles);

        return extend(true, {}, options, {
            startX: x,
            startY: y,
            tableWidth: width
        });
    },

    _calculateTableWidth: function(jsPDFDocument, leftIndent, rightIndent) {
        const pageSize = jsPDFDocument.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        return pageWidth - (leftIndent + rightIndent);
    },

    _calculateColumnsStyles: function(tableWidth, columnStyles, cells) {
        let columnCount = 0;
        cells[0]?.forEach((cell, _) => {
            columnCount += cell.colSpan ?? 1;
        });

        let unAllocatedWidth = tableWidth;
        const columnsWithAssignedWidth = [];

        for(let i = 0; i < columnCount; i++) {
            if(isNumeric(columnStyles[i]?.width)) {
                columnsWithAssignedWidth.push(i);
                unAllocatedWidth -= columnStyles[i].width;
            }
        }

        let columnAutoWidth = 0;
        if(unAllocatedWidth > 0) {
            columnAutoWidth = unAllocatedWidth / (columnCount - columnsWithAssignedWidth.length);
        }

        for(let i = 0; i < columnCount; i++) {
            if(!isDefined(columnStyles[i])) {
                columnStyles[i] = {};
            }
            if(!isNumeric(columnStyles[i]?.minCellHeight)) {
                columnStyles[i].minCellHeight = this._defaultMinCellHeight;
            }
            if(!isNumeric(columnStyles[i]?.width)) {
                columnStyles[i].width = columnAutoWidth;
            }
        }
    },

    _calculateCellsCoordinates: function(x, y, cells, columnStyles) {
        let lastRowYPos = y;
        for(let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
            let rowHeight = 0;
            const getRowHeight = () => {
                return rowHeight;
            };

            for(let colIndex = 0; colIndex < cells[rowIndex].length; colIndex++) {
                const prevCellCoordinates = (colIndex > 0) ? cells[rowIndex][colIndex - 1].getCoordinates() : null;
                const colStyles = columnStyles[colIndex];

                const xPos = isDefined(prevCellCoordinates) ? prevCellCoordinates.x + prevCellCoordinates.width : x;
                const yPos = lastRowYPos;
                const width = colStyles.width;

                if(colStyles.minCellHeight > rowHeight) {
                    rowHeight = colStyles.minCellHeight;
                }

                cells[rowIndex][colIndex].getCoordinates = () => {
                    return {
                        x: xPos,
                        y: yPos,
                        width: width,
                        height: getRowHeight()
                    };
                };
            }
            lastRowYPos += rowHeight;
        }
    }
};

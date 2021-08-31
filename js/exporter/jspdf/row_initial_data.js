function getRowsInitialData(dataProvider, dataGrid, options) {
    // customizeCell will be processed there
    return [{
        rowType: 'header',
        indentLevel: 0,
        rowIndex: 0,
        cellsInfo: [
            {
                gridCell: undefined,
                pdfCell: {
                    text: '',
                    colSpan: undefined,
                    rowSpan: undefined,
                    drawLeftBorder: true,
                    drawTopBorder: true,
                    drawRightBorder: true,
                    drawBottomBorder: true,
                    backgroundColor: true,
                    wordWrapEnabled: true,
                }
            }
        ],
    }];
}

export { getRowsInitialData };

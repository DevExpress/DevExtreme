function getRowsSizedData(rowsInitialData, options) {
    // onRowExporting will be processed there
    return [{
        rowType: 'header',
        indentLevel: 0,
        rowIndex: 0,
        height: 0,
        cellsInfo: [
            {
                gridCell: undefined,
                pdfCell: {
                    text: '',
                    width: 0,
                    height: 0,
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

export { getRowsSizedData };

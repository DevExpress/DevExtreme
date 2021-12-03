import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import { normalizeRowsInfo } from './normalizeOptions';
import { initializeCellsWidth, applyColSpans, applyRowSpans, applyBordersConfig, calculateHeights, calculateCoordinates, calculateTableSize, resizeFirstColumnByIndentLevel } from './row_utils';
import { updateRowsAndCellsHeights } from './height_updater';
import { generateRowsInfo } from './rows_generator';
import { splitRowsInfosHorizontally } from './rows_splitting';
import { drawCellsContent, drawCellsLines, drawGridLines, getDocumentStyles, setDocumentStyles } from './draw_utils';

// TODO: check names with techwritters
// IPDFExportOptions: {
//    topLeft: {x: number, y: number},
//    indent: number,
//    margin: { top:number, left:number, right:number, bottom:number } | number
//    customizeCell: (IPdfRowInfo): void
//    customDrawCell: (rect, pdfCell, gridCell, cancel): void (similar to the https://docs.devexpress.com/WindowsForms/DevExpress.XtraGrid.Views.Grid.GridView.CustomDrawCell)
// }
function _getFullOptions(options) {
    const fullOptions = extend({}, options);
    if(!isDefined(fullOptions.topLeft)) {
        throw 'options.topLeft is required';
    }
    if(!isDefined(fullOptions.indent)) {
        fullOptions.indent = 10;
    }

    return fullOptions;
}

function exportDataGrid(doc, dataGrid, options) {
    options = extend({}, _getFullOptions(options));

    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {

            // TODO: pass rowOptions: { headerStyles: { backgroundColor }, groupStyles: {...}, totalStyles: {...} }
            const rowsInfo = generateRowsInfo(dataProvider, dataGrid, options.rowOptions?.headerStyles?.backgroundColor);

            if(options.customizeCell) {
                rowsInfo.forEach(rowInfo => rowInfo.cells.forEach(cellInfo =>
                    // In 'customizeCell' callback you can change values of these properties:
                    // - e.pdfCell.height - will be used instead of a calculated height
                    // - e.pdfCell.text - the text that will be printed
                    // - e.pdfCell.customDrawContent - will be called at the drawing stage
                    //     you can introduce new properties to 'e.pdfCell' and use them in your callback
                    //     TODO: e.pdfRow + e.gridCell ???
                    // - e.pdfCell.wordWrapEnabled - will be used to split cell text by the width of its cell
                    //
                    // And, you can read values of these properties ('readonly'):
                    // - e.gridCell (TODO: list of properties)
                    // - e.pdfRowInfo (TODO: list of properties)
                    options.customizeCell(cellInfo)
                ));
            }

            normalizeRowsInfo(rowsInfo);

            // computes withs of the cells depending of the options
            initializeCellsWidth(doc, dataProvider, rowsInfo, options);

            // apply intends for correctly set width and colSpan for grouped rows
            resizeFirstColumnByIndentLevel(rowsInfo, options);

            // apply colSpans + recalculate cellsWidth
            applyColSpans(rowsInfo);

            // set/update/initCellHeight - autocalculate by text+width+wordWrapEnabled+padding or use value from customizeCell
            calculateHeights(doc, rowsInfo, options);

            // apply rowSpans + recalculate cells height
            applyRowSpans(rowsInfo);

            // when we know all rowSpans we can recalculate rowsHeight
            updateRowsAndCellsHeights(doc, rowsInfo);

            const docStyles = getDocumentStyles(doc);

            // splitting to pages, split 'rowsInfo' into multiple 'rowsInfo's
            let rowsInfosByPages = [ rowsInfo ];
            rowsInfosByPages = splitRowsInfosHorizontally(rowsInfosByPages, options.splitByColumns);
            // TODO: reinitialize cells widths ???
            // TODO: splitRowsInfosVertically

            rowsInfosByPages.forEach((pageRowsInfo) => {

                const isFirstPage = rowsInfosByPages.indexOf(pageRowsInfo) === 0;
                if(!isFirstPage) {
                    doc.addPage();
                }

                // when we known all sizes we can calculate all coordinates
                calculateCoordinates(doc, pageRowsInfo, options); // set/init/update 'pdfCell.top/left'

                applyBordersConfig(pageRowsInfo);

                const pdfCellsInfo = [].concat.apply([],
                    pageRowsInfo.map(rowInfo => {
                        return rowInfo.cells
                            .filter(cell => !isDefined(cell.pdfCell.isMerged))
                            .map(cellInfo => {
                                return { ...cellInfo.pdfCell, gridCell: cellInfo.gridCell, pdfRowInfo: cellInfo.pdfRowInfo };
                            });
                    })
                );

                drawCellsContent(doc, options.customDrawCell, pdfCellsInfo, docStyles);
                drawCellsLines(doc, pdfCellsInfo, docStyles);

                const isDrawTableBorderSpecified = options.drawTableBorder === true;
                const isEmptyPdfCellsInfoSpecified = isDefined(pdfCellsInfo) && pdfCellsInfo.length === 0;
                if(isDrawTableBorderSpecified || isEmptyPdfCellsInfoSpecified) {
                    const tableRect = calculateTableSize(doc, pageRowsInfo, options); // TODO: after splitting to pages we need get 'rowsInfo' for selected table in the page
                    drawGridLines(doc, tableRect, docStyles);
                }
            });

            setDocumentStyles(doc, docStyles);

            resolve();
        });
    });
}

export { exportDataGrid };

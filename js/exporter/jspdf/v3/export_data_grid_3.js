import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import { normalizeRowsInfo, normalizeBoundaryValue } from './normalizeOptions';
import { initializeCellsWidth, applyColSpans, applyRowSpans, applyBordersConfig, calculateHeights, calculateCoordinates, calculateTableSize, resizeFirstColumnByIndentLevel } from './row_utils';
import { updateRowsAndCellsHeights } from './height_updater';
import { generateRowsInfo } from './rows_generator';
import { splitRectsByPages } from './rows_splitting';
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
    fullOptions.margin = normalizeBoundaryValue(fullOptions.margin);
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

            // when we known all sizes we can calculate all coordinates
            calculateCoordinates(doc, rowsInfo, options); // set/init/update 'pdfCell.top/left'

            // recalculate for grouped rows
            // TODO: applyGroupIndents()

            applyBordersConfig(rowsInfo);

            // splitting to pages
            // ?? TODO: Does split a cell which have an attribute 'colSpan/rowSpan > 0' into two cells and place the first cell on the first page and second cell on the second page. And show initial 'text' in the both new cells ??
            // TODO: applySplitting()

            const pdfCellsInfo = [].concat.apply([],
                rowsInfo.map(rowInfo => {
                    return rowInfo.cells
                        .filter(cell => !isDefined(cell.pdfCell.isMerged))
                        .map(cellInfo => {
                            return { ...cellInfo.pdfCell, gridCell: cellInfo.gridCell, pdfRowInfo: cellInfo.pdfRowInfo };
                        });
                })
            );

            const docStyles = getDocumentStyles(doc);

            const rects = pdfCellsInfo.map(cellInfo => Object.assign({}, cellInfo._rect, { sourceCellInfo: cellInfo }));
            const maxBottomRight = {
                x: doc.internal.pageSize.getWidth() - options.margin.right
            };
            const onSplitRectHorizontally = (sourceRect, leftRect, rightRect) => {
                const newRectCellInfo = Object.assign({}, sourceRect.sourceCellInfo, { text: '', debugSourceCellInfo: sourceRect.sourceCellInfo });
                return {
                    left: Object.assign({}, leftRect, { sourceCellInfo: sourceRect.sourceCellInfo }),
                    right: Object.assign({}, rightRect, { sourceCellInfo: newRectCellInfo })
                };
            };
            const rectsByPages = splitRectsByPages(rects, options.margin, options.topLeft, maxBottomRight, onSplitRectHorizontally);
            const pdfCellsInfoByPages = rectsByPages.map(rects => {
                return rects.map(rect => Object.assign({}, rect.sourceCellInfo, { _rect: rect }));
            });

            pdfCellsInfoByPages.forEach((pdfCellsInfo, index) => {
                if(index > 0) {
                    doc.addPage();
                }

                drawCellsContent(doc, options.customDrawCell, pdfCellsInfo, docStyles);
                drawCellsLines(doc, pdfCellsInfo, docStyles);

                const isDrawTableBorderSpecified = options.drawTableBorder === true;
                const isEmptyPdfCellsInfoSpecified = isDefined(pdfCellsInfo) && pdfCellsInfo.length === 0;
                if(isDrawTableBorderSpecified || isEmptyPdfCellsInfoSpecified) {
                    const tableRect = calculateTableSize(doc, pdfCellsInfo, options); // TODO: after splitting to pages we need get 'rowsInfo' for selected table in the page
                    drawGridLines(doc, tableRect, docStyles);
                }
            });

            setDocumentStyles(doc, docStyles);

            resolve();
        });
    });
}

export { exportDataGrid };

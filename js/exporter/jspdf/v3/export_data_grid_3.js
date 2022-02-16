import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import { normalizeRowsInfo, normalizeBoundaryValue } from './normalizeOptions';
import { initializeCellsWidth, applyColSpans, applyRowSpans, applyBordersConfig, calculateHeights, calculateCoordinates, calculateTableSize, resizeFirstColumnByIndentLevel } from './row_utils';
import { updateRowsAndCellsHeights } from './height_updater';
import { generateRowsInfo, getBaseTableStyle } from './rows_generator';
import { splitByPages } from './rows_splitting';
import { drawCellsContent, drawCellsLines, drawGridLines, getDocumentStyles, setDocumentStyles, addNewPage } from './draw_utils';
import { applyRtl, applyWordWrap, toPdfUnit } from './pdf_utils_v3';

// TODO: check names with techwritters
// IPDFExportOptions: {
//    repeatHeaders: false,
//    topLeft: {x: number, y: number},
//    indent: number,
//    margin: { top:number, left:number, right:number, bottom:number } | number
//    customizeCell: ({ gridCell, pdfCell }): void
//    customDrawCell: ({ rect, pdfCell, gridCell, cancel }): void (similar to the https://docs.devexpress.com/WindowsForms/DevExpress.XtraGrid.Views.Grid.GridView.CustomDrawCell)
// }
function _getFullOptions(doc, options) {
    const fullOptions = extend({}, options);
    if(!isDefined(fullOptions.topLeft)) {
        throw 'options.topLeft is required';
    }
    if(!isDefined(fullOptions.indent)) {
        fullOptions.indent = 0;
    }
    if(!isDefined(fullOptions.repeatHeaders)) {
        fullOptions.repeatHeaders = true;
    }
    if(!isDefined(fullOptions.margin)) {
        fullOptions.margin = toPdfUnit(doc, 40);
    }
    fullOptions.margin = normalizeBoundaryValue(fullOptions.margin);

    const tableStyle = getBaseTableStyle();
    fullOptions.tableBorderWidth = fullOptions.tableBorderWidth ?? tableStyle.borderWidth;
    fullOptions.tableBorderColor = fullOptions.tableBorderColor ?? tableStyle.borderColor;

    return fullOptions;
}

function exportDataGrid(doc, dataGrid, options) {
    options = extend({}, _getFullOptions(doc, options));

    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {

            // TODO: pass rowOptions: { headerStyles: { backgroundColor }, groupStyles: {...}, totalStyles: {...} }
            const rowsInfo = generateRowsInfo(doc, dataProvider, dataGrid, options.rowOptions?.headerStyles?.backgroundColor);

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
                    // - e.pdfCell (TODO: list of properties)
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

            applyWordWrap(doc, rowsInfo);

            // splitting to pages
            // ?? TODO: Does split a cell which have an attribute 'colSpan/rowSpan > 0' into two cells and place the first cell on the first page and second cell on the second page. And show initial 'text' in the both new cells ??
            // TODO: applySplitting()

            const docStyles = getDocumentStyles(doc);
            const rtlEnabled = !!dataGrid.option('rtlEnabled');
            const onSeparateRectHorizontally = ({ sourceRect, leftRect, rightRect }) => {
                let leftRectTextOptions = {};
                let rightRectTextOptions = {};
                const isTextNotEmpty = sourceRect.sourceCellInfo.text?.length > 0;
                if(isTextNotEmpty) {
                    if(rtlEnabled) {
                        const isTextWidthGreaterThanRect = doc.getTextWidth(sourceRect.sourceCellInfo.text) > leftRect.w;
                        const isTextRightAlignment = !isDefined(sourceRect.sourceCellInfo.horizontalAlign) || sourceRect.sourceCellInfo.horizontalAlign === 'right';
                        if(isTextWidthGreaterThanRect || !isTextRightAlignment) {
                            let rightRectTextOffset;
                            let leftRectTextOffset;
                            if(sourceRect.sourceCellInfo?.horizontalAlign === 'right') {
                                rightRectTextOffset = sourceRect.sourceCellInfo._textLeftOffset ?? 0;
                                leftRectTextOffset = rightRectTextOffset + leftRect.w;
                            } else if(sourceRect.sourceCellInfo?.horizontalAlign === 'center') {
                                leftRectTextOffset = (sourceRect.x + sourceRect.w) - (rightRect.x + rightRect.w) + sourceRect.sourceCellInfo._rect.w / 2 - leftRect.w / 2;
                                rightRectTextOffset = leftRectTextOffset - rightRect.w;
                            } else if(sourceRect.sourceCellInfo?.horizontalAlign === 'left') {
                                leftRectTextOffset = (sourceRect.x + sourceRect.w) - (rightRect.x + rightRect.w);
                                rightRectTextOffset = leftRectTextOffset - rightRect.w;
                            }

                            leftRectTextOptions = Object.assign({}, { _textLeftOffset: rightRectTextOffset });
                            rightRectTextOptions = Object.assign({}, { _textLeftOffset: leftRectTextOffset });
                        } else {
                            rightRectTextOptions = Object.assign({}, { text: '' });
                        }
                    } else {
                        const isTextWidthGreaterThanRect = doc.getTextWidth(sourceRect.sourceCellInfo.text) > leftRect.w;
                        const isTextLeftAlignment = !isDefined(sourceRect.sourceCellInfo.horizontalAlign) || sourceRect.sourceCellInfo.horizontalAlign === 'left';
                        if(isTextWidthGreaterThanRect || !isTextLeftAlignment) {
                            let leftTextLeftOffset;
                            let rightTextLeftOffset;
                            if(sourceRect.sourceCellInfo?.horizontalAlign === 'left') {
                                leftTextLeftOffset = sourceRect.sourceCellInfo._textLeftOffset ?? 0;
                                rightTextLeftOffset = leftTextLeftOffset - leftRect.w;
                            } else if(sourceRect.sourceCellInfo?.horizontalAlign === 'center') {
                                const offset = sourceRect.sourceCellInfo._textLeftOffset ?? 0;
                                leftTextLeftOffset = offset + (sourceRect.x + sourceRect.w / 2) - (leftRect.x + leftRect.w / 2);
                                rightTextLeftOffset = offset + (sourceRect.x + sourceRect.w / 2) - (rightRect.x + rightRect.w / 2);
                            } else if(sourceRect.sourceCellInfo?.horizontalAlign === 'right') {
                                leftTextLeftOffset = (sourceRect.x + sourceRect.w) - (leftRect.x + leftRect.w);
                                rightTextLeftOffset = (sourceRect.x + sourceRect.w) - (rightRect.x + rightRect.w);
                            }

                            leftRectTextOptions = Object.assign({}, { _textLeftOffset: leftTextLeftOffset });
                            rightRectTextOptions = Object.assign({}, { _textLeftOffset: rightTextLeftOffset });
                        } else {
                            rightRectTextOptions = Object.assign({}, { text: '' });
                        }
                    }
                }

                leftRect.sourceCellInfo = Object.assign({}, sourceRect.sourceCellInfo, { debugSourceCellInfo: sourceRect.sourceCellInfo }, leftRectTextOptions);
                rightRect.sourceCellInfo = Object.assign({}, sourceRect.sourceCellInfo, { debugSourceCellInfo: sourceRect.sourceCellInfo }, rightRectTextOptions);
            };

            const onSeparateRectVertically = ({ sourceRect, topRect, bottomRect }) => {
                let topRectTextOptions = {};
                let bottomRectTextOptions = {};
                const isTextNotEmpty = sourceRect.sourceCellInfo.text?.length > 0;
                if(isTextNotEmpty) {
                    const isTextHeightGreaterThanRect = doc.getTextDimensions(sourceRect.sourceCellInfo.text).h > topRect.h;
                    const isTextTopAlignment = sourceRect.sourceCellInfo?.verticalAlign === 'top';
                    if(isTextHeightGreaterThanRect || !isTextTopAlignment) {
                        let topTextTopOffset;
                        let bottomTextTopOffset;
                        if(sourceRect.sourceCellInfo?.verticalAlign === 'top') {
                            topTextTopOffset = sourceRect.sourceCellInfo._textTopOffset ?? 0;
                            bottomTextTopOffset = topTextTopOffset - topRect.h;
                        } else if(sourceRect.sourceCellInfo?.verticalAlign === 'middle') {
                            const offset = sourceRect.sourceCellInfo._textTopOffset ?? 0;
                            topTextTopOffset = offset + (sourceRect.y + sourceRect.h / 2) - (topRect.y + topRect.h / 2);
                            bottomTextTopOffset = offset + (sourceRect.y + sourceRect.h / 2) - (bottomRect.y + bottomRect.h / 2);
                        } else if(sourceRect.sourceCellInfo?.verticalAlign === 'bottom') {
                            topTextTopOffset = (sourceRect.y + sourceRect.h) - (topRect.y + topRect.h);
                            bottomTextTopOffset = (sourceRect.y + sourceRect.h) - (bottomRect.y + bottomRect.h);
                        }

                        topRectTextOptions = Object.assign({}, { _textTopOffset: topTextTopOffset });
                        bottomRectTextOptions = Object.assign({}, { _textTopOffset: bottomTextTopOffset });
                    } else {
                        bottomRectTextOptions = Object.assign({}, { text: '' });
                    }
                }

                topRect.sourceCellInfo = Object.assign({}, sourceRect.sourceCellInfo, { debugSourceCellInfo: sourceRect.sourceCellInfo }, topRectTextOptions);
                bottomRect.sourceCellInfo = Object.assign({}, sourceRect.sourceCellInfo, { debugSourceCellInfo: sourceRect.sourceCellInfo }, bottomRectTextOptions);
            };

            const rectsByPages = splitByPages(doc, rowsInfo, options, onSeparateRectHorizontally, onSeparateRectVertically);
            if(rtlEnabled) {
                applyRtl(doc, rectsByPages, options);
            }

            rectsByPages.forEach((pdfCellsInfo, index) => {
                if(index > 0) {
                    addNewPage(doc);
                }

                drawCellsContent(doc, options.customDrawCell, pdfCellsInfo, docStyles);
                drawCellsLines(doc, pdfCellsInfo, docStyles);

                const isDrawTableBorderSpecified = options.drawTableBorder === true;
                const isEmptyPdfCellsInfoSpecified = isDefined(pdfCellsInfo) && pdfCellsInfo.length === 0;
                if(isDrawTableBorderSpecified || isEmptyPdfCellsInfoSpecified) {
                    const tableRect = calculateTableSize(doc, pdfCellsInfo, options); // TODO: after splitting to pages we need get 'rowsInfo' for selected table in the page
                    const borderWidth = options.tableBorderWidth;
                    const borderColor = options.tableBorderColor;
                    drawGridLines(doc, tableRect, { borderWidth, borderColor }, docStyles);
                }
            });

            setDocumentStyles(doc, docStyles);

            resolve();
        });
    });
}

export { exportDataGrid };

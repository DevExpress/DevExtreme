/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @stylistic/max-len */
import messageLocalization from '@js/common/core/localization/message';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';

import { ExportLoadPanel } from '../../common/export_load_panel';
import {
  addNewPage, drawCellsContent, drawCellsLines, drawGridLines, getDocumentStyles, setDocumentStyles,
} from './draw_utils';
import { updateRowsAndCellsHeights } from './height_updater';
import { normalizeBoundaryValue, normalizeRowsInfo } from './normalizeOptions';
import { applyRtl, applyWordWrap, toPdfUnit } from './pdf_utils';
import {
  applyBordersConfig, applyColSpans, applyRowSpans, calculateCoordinates, calculateHeights, calculateTableSize, initializeCellsWidth, resizeFirstColumnByIndentLevel,
} from './row_utils';
import { generateRowsInfo, getBaseTableStyle } from './rows_generator';
import { splitByPages } from './rows_splitting';

function _getFullOptions(options) {
  const { jsPDFDocument } = options;
  const fullOptions = extend({}, options);
  if (!isDefined(fullOptions.topLeft)) {
    fullOptions.topLeft = { x: 0, y: 0 };
  }
  if (!isDefined(fullOptions.indent)) {
    fullOptions.indent = 0;
  }
  if (!isDefined(fullOptions.repeatHeaders)) {
    fullOptions.repeatHeaders = true;
  }
  if (!isDefined(fullOptions.margin)) {
    fullOptions.margin = toPdfUnit(jsPDFDocument, 40);
  }
  fullOptions.margin = normalizeBoundaryValue(fullOptions.margin);
  if (!Array.isArray(fullOptions.columnWidths)) {
    fullOptions.columnWidths = [];
  }
  if (!isDefined(fullOptions.loadPanel)) {
    fullOptions.loadPanel = {};
  }
  if (!isDefined(fullOptions.loadPanel.enabled)) {
    fullOptions.loadPanel.enabled = true;
  }
  if (!isDefined(fullOptions.loadPanel.text)) {
    fullOptions.loadPanel.text = messageLocalization.format('dxDataGrid-exporting');
  }

  return fullOptions;
}

function exportDataGrid(options) {
  const {
    jsPDFDocument,
    component,
    selectedRowsOnly,
    loadPanel,
  } = options;

  const internalComponent = component._getInternalInstance?.() || component;
  const initialLoadPanelEnabledOption = internalComponent.option('loadPanel')?.enabled;

  if (initialLoadPanelEnabledOption) {
    component.option('loadPanel.enabled', false);
  }

  let exportLoadPanel;
  if (loadPanel.enabled && hasWindow()) {
    const rowsView = component.getView('rowsView');

    exportLoadPanel = new ExportLoadPanel(component, rowsView.element(), rowsView.element().parent(), loadPanel);
    exportLoadPanel.show();
  }

  const dataProvider = component.getDataProvider(selectedRowsOnly);
  return new Promise<void>((resolve) => {
    dataProvider.ready().done(() => {
      // TODO: pass rowOptions: { headerStyles: { backgroundColor }, groupStyles: {...}, totalStyles: {...} }
      const rowsInfo = generateRowsInfo(jsPDFDocument, dataProvider, component, options.rowOptions?.headerStyles?.backgroundColor);

      if (options.customizeCell) {
        // @ts-expect-error
        rowsInfo.forEach((rowInfo) => rowInfo.cells.forEach((cellInfo) => options.customizeCell(cellInfo)));
      }

      normalizeRowsInfo(rowsInfo);

      // computes withs of the cells depending of the fullOptions
      initializeCellsWidth(jsPDFDocument, dataProvider, rowsInfo, options);

      // apply intends for correctly set width and colSpan for grouped rows
      resizeFirstColumnByIndentLevel(rowsInfo, options);

      // apply colSpans + recalculate cellsWidth
      applyColSpans(rowsInfo);

      // set/update/initCellHeight - autocalculate by text+width+wordWrapEnabled+padding or use value from customizeCell
      calculateHeights(jsPDFDocument, rowsInfo, options);

      // apply rowSpans + recalculate cells height
      applyRowSpans(rowsInfo);

      // when we know all rowSpans we can recalculate rowsHeight
      updateRowsAndCellsHeights(jsPDFDocument, rowsInfo);

      // when we known all sizes we can calculate all coordinates
      calculateCoordinates(jsPDFDocument, rowsInfo, options); // set/init/update 'pdfCell.top/left'

      // recalculate for grouped rows
      // TODO: applyGroupIndents()

      applyBordersConfig(rowsInfo);

      applyWordWrap(jsPDFDocument, rowsInfo);

      // splitting to pages
      // ?? TODO: Does split a cell which have an attribute 'colSpan/rowSpan > 0' into two cells and place the first cell on the first page and second cell on the second page. And show initial 'text' in the both new cells ??
      // TODO: applySplitting()

      const docStyles = getDocumentStyles(jsPDFDocument);
      const rtlEnabled = !!component.option('rtlEnabled');
      const onSeparateRectHorizontally = ({ sourceRect, leftRect, rightRect }) => {
        let leftRectTextOptions = {};
        let rightRectTextOptions = {};
        const isTextNotEmpty = sourceRect.sourceCellInfo.text?.length > 0;
        if (isTextNotEmpty) {
          if (rtlEnabled) {
            const isTextWidthGreaterThanRect = jsPDFDocument.getTextWidth(sourceRect.sourceCellInfo.text) > leftRect.w;
            const isTextRightAlignment = !isDefined(sourceRect.sourceCellInfo.horizontalAlign) || sourceRect.sourceCellInfo.horizontalAlign === 'right';
            if (isTextWidthGreaterThanRect || !isTextRightAlignment) {
              let rightRectTextOffset;
              let leftRectTextOffset;
              if (sourceRect.sourceCellInfo?.horizontalAlign === 'right') {
                rightRectTextOffset = sourceRect.sourceCellInfo._textLeftOffset ?? 0;
                leftRectTextOffset = rightRectTextOffset + leftRect.w;
              } else if (sourceRect.sourceCellInfo?.horizontalAlign === 'center') {
                leftRectTextOffset = (sourceRect.x + sourceRect.w) - (rightRect.x + rightRect.w) + sourceRect.sourceCellInfo._rect.w / 2 - leftRect.w / 2;
                rightRectTextOffset = leftRectTextOffset - rightRect.w;
              } else if (sourceRect.sourceCellInfo?.horizontalAlign === 'left') {
                leftRectTextOffset = (sourceRect.x + sourceRect.w) - (rightRect.x + rightRect.w);
                rightRectTextOffset = leftRectTextOffset - rightRect.w;
              }

              leftRectTextOptions = { _textLeftOffset: rightRectTextOffset };
              rightRectTextOptions = { _textLeftOffset: leftRectTextOffset };
            } else {
              rightRectTextOptions = { text: '' };
            }
          } else {
            const isTextWidthGreaterThanRect = jsPDFDocument.getTextWidth(sourceRect.sourceCellInfo.text) > leftRect.w;
            const isTextLeftAlignment = !isDefined(sourceRect.sourceCellInfo.horizontalAlign) || sourceRect.sourceCellInfo.horizontalAlign === 'left';
            if (isTextWidthGreaterThanRect || !isTextLeftAlignment) {
              let leftTextLeftOffset;
              let rightTextLeftOffset;
              if (sourceRect.sourceCellInfo?.horizontalAlign === 'left') {
                leftTextLeftOffset = sourceRect.sourceCellInfo._textLeftOffset ?? 0;
                rightTextLeftOffset = leftTextLeftOffset - leftRect.w;
              } else if (sourceRect.sourceCellInfo?.horizontalAlign === 'center') {
                const offset = sourceRect.sourceCellInfo._textLeftOffset ?? 0;
                leftTextLeftOffset = offset + (sourceRect.x + sourceRect.w / 2) - (leftRect.x + leftRect.w / 2);
                rightTextLeftOffset = offset + (sourceRect.x + sourceRect.w / 2) - (rightRect.x + rightRect.w / 2);
              } else if (sourceRect.sourceCellInfo?.horizontalAlign === 'right') {
                leftTextLeftOffset = (sourceRect.x + sourceRect.w) - (leftRect.x + leftRect.w);
                rightTextLeftOffset = (sourceRect.x + sourceRect.w) - (rightRect.x + rightRect.w);
              }

              leftRectTextOptions = { _textLeftOffset: leftTextLeftOffset };
              rightRectTextOptions = { _textLeftOffset: rightTextLeftOffset };
            } else {
              rightRectTextOptions = { text: '' };
            }
          }
        }

        leftRect.sourceCellInfo = { ...sourceRect.sourceCellInfo, debugSourceCellInfo: sourceRect.sourceCellInfo, ...leftRectTextOptions };
        rightRect.sourceCellInfo = { ...sourceRect.sourceCellInfo, debugSourceCellInfo: sourceRect.sourceCellInfo, ...rightRectTextOptions };
      };

      const onSeparateRectVertically = ({ sourceRect, topRect, bottomRect }) => {
        let topRectTextOptions = {};
        let bottomRectTextOptions = {};
        const isTextNotEmpty = sourceRect.sourceCellInfo.text?.length > 0;
        if (isTextNotEmpty) {
          const isTextHeightGreaterThanRect = jsPDFDocument.getTextDimensions(sourceRect.sourceCellInfo.text).h > topRect.h;
          const isTextTopAlignment = sourceRect.sourceCellInfo?.verticalAlign === 'top';
          if (isTextHeightGreaterThanRect || !isTextTopAlignment) {
            let topTextTopOffset;
            let bottomTextTopOffset;
            if (sourceRect.sourceCellInfo?.verticalAlign === 'top') {
              topTextTopOffset = sourceRect.sourceCellInfo._textTopOffset ?? 0;
              bottomTextTopOffset = topTextTopOffset - topRect.h;
            } else if (sourceRect.sourceCellInfo?.verticalAlign === 'middle') {
              const offset = sourceRect.sourceCellInfo._textTopOffset ?? 0;
              topTextTopOffset = offset + (sourceRect.y + sourceRect.h / 2) - (topRect.y + topRect.h / 2);
              bottomTextTopOffset = offset + (sourceRect.y + sourceRect.h / 2) - (bottomRect.y + bottomRect.h / 2);
            } else if (sourceRect.sourceCellInfo?.verticalAlign === 'bottom') {
              topTextTopOffset = (sourceRect.y + sourceRect.h) - (topRect.y + topRect.h);
              bottomTextTopOffset = (sourceRect.y + sourceRect.h) - (bottomRect.y + bottomRect.h);
            }

            topRectTextOptions = { _textTopOffset: topTextTopOffset };
            bottomRectTextOptions = { _textTopOffset: bottomTextTopOffset };
          } else {
            bottomRectTextOptions = { text: '' };
          }
        }

        topRect.sourceCellInfo = { ...sourceRect.sourceCellInfo, debugSourceCellInfo: sourceRect.sourceCellInfo, ...topRectTextOptions };
        bottomRect.sourceCellInfo = { ...sourceRect.sourceCellInfo, debugSourceCellInfo: sourceRect.sourceCellInfo, ...bottomRectTextOptions };
      };

      const rectsByPages = splitByPages(jsPDFDocument, rowsInfo, options, onSeparateRectHorizontally, onSeparateRectVertically);
      if (rtlEnabled) {
        applyRtl(jsPDFDocument, rectsByPages, options);
      }

      rectsByPages.forEach((pdfCellsInfo, index) => {
        if (index > 0) {
          addNewPage(jsPDFDocument);
        }

        drawCellsContent(jsPDFDocument, options.customDrawCell, pdfCellsInfo, docStyles);
        drawCellsLines(jsPDFDocument, pdfCellsInfo, docStyles);

        const isEmptyPdfCellsInfoSpecified = isDefined(pdfCellsInfo) && pdfCellsInfo.length === 0;
        if (isEmptyPdfCellsInfoSpecified) {
          const tableRect = calculateTableSize(jsPDFDocument, pdfCellsInfo, options); // TODO: after splitting to pages we need get 'rowsInfo' for selected table in the page
          const baseStyle = getBaseTableStyle();
          drawGridLines(jsPDFDocument, tableRect, baseStyle, docStyles);
        }
      });

      setDocumentStyles(jsPDFDocument, docStyles);

      resolve();
    }).always(() => {
      if (initialLoadPanelEnabledOption) {
        component.option('loadPanel.enabled', initialLoadPanelEnabledOption);
      }

      if (loadPanel.enabled && hasWindow()) {
        exportLoadPanel.dispose();
      }
    });
  });
}

export const Export = {
  getFullOptions: _getFullOptions,
  export: exportDataGrid,
};

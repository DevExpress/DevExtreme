import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

function applySplitting(pdfCellsInfo, options) {
    if(!isDefined(options.horizontalSplitWidth)) {
        return [ pdfCellsInfo ];
    }

    const pdfCellsInfoByPage = [
        [] // Empty Page
    ];

    pdfCellsInfo
        .forEach(pdfCellInfo => {
            const { _rect, pdfRowInfo, gridCell, ...pdfCell } = pdfCellInfo;
            const _newRect = extend({}, pdfCellInfo._rect);
            const splitWidth = options.horizontalSplitWidth;

            let pageIndex = 0;
            if((_rect.x + _rect.w) > splitWidth) {
                const moveToPage = Math.floor((_rect.x + _rect.w) / splitWidth);
                pageIndex += moveToPage;
                _newRect.x = options?.topLeft?.x ?? 0;
            }

            const newPdfCellInfo = {
                _rect: _newRect,
                pdfRowInfo,
                gridCell,
                ...pdfCell
            };

            pdfCellsInfoByPage[pageIndex] = pdfCellsInfoByPage[pageIndex] ?? [];
            pdfCellsInfoByPage[pageIndex].push(newPdfCellInfo);
        });

    return pdfCellsInfoByPage;
}

export { applySplitting };

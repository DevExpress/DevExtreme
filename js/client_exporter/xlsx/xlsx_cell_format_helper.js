import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxCellAlignmentHelper from './xlsx_cell_alignment_helper';

const xlsxCellFormatHelper = {
    tryCreateTag: function(sourceObj, sharedItemsContainer) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            let numberFormatId;
            if(typeUtils.isDefined(sourceObj.numberFormat) && typeof sourceObj.numberFormat === 'number') {
                numberFormatId = sourceObj.numberFormat;
            } else {
                numberFormatId = sharedItemsContainer.registerNumberFormat(sourceObj.numberFormat);
            }

            result = {
                numberFormatId,
                alignment: xlsxCellAlignmentHelper.tryCreateTag(sourceObj.alignment),
                fontId: sharedItemsContainer.registerFont(sourceObj.font),
                fillId: sharedItemsContainer.registerFill(sourceObj.fill),
            };
            if(xlsxCellFormatHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxCellFormatHelper.isEmpty(leftTag) && xlsxCellFormatHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.fontId === rightTag.fontId &&
                leftTag.numberFormatId === rightTag.numberFormatId &&
                leftTag.fillId === rightTag.fillId &&
                xlsxCellAlignmentHelper.areEqual(leftTag.alignment, rightTag.alignment)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.fontId) &&
            !typeUtils.isDefined(tag.numberFormatId) &&
            !typeUtils.isDefined(tag.fillId) &&
            xlsxCellAlignmentHelper.isEmpty(tag.alignment);
    },

    toXml: function(tag) {
        const isAlignmentEmpty = xlsxCellAlignmentHelper.isEmpty(tag.alignment);
        let applyNumberFormat;
        if(typeUtils.isDefined(tag.numberFormatId)) {
            applyNumberFormat = tag.numberFormatId > 0 ? 1 : 0;
        }

        // §18.8.45 xf (Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(
            "xf",
            {
                'xfId': 0,
                applyAlignment: isAlignmentEmpty ? null : 1,
                fontId: tag.fontId,
                applyNumberFormat,
                fillId: tag.fillId,
                'numFmtId': tag.numberFormatId,
            },
            isAlignmentEmpty ? null : xlsxCellAlignmentHelper.toXml(tag.alignment)
        );
    }
};

export default xlsxCellFormatHelper;

import typeUtils from "../../core/utils/type";
import XlsxTagHelper from './xlsx_tag_helper';
import XlsxCellAlignmentHelper from './xlsx_cell_alignment_helper';

const XlsxCellFormatHelper = {
    tryCreateTag: function(sourceObj, xlsxFile) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                fontId: sourceObj.fontId,
                numberFormatId: sourceObj.numberFormatId,
                alignment: XlsxCellAlignmentHelper.tryCreateTag(sourceObj.alignment),
                fillId: xlsxFile.registerFill(sourceObj.fill),
            };
            if(XlsxCellFormatHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return XlsxCellFormatHelper.isEmpty(leftTag) && XlsxCellFormatHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.fontId === rightTag.fontId &&
                leftTag.numberFormatId === rightTag.numberFormatId &&
                leftTag.fillId === rightTag.fillId &&
                XlsxCellAlignmentHelper.areEqual(leftTag.alignment, rightTag.alignment)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.fontId) &&
            !typeUtils.isDefined(tag.numberFormatId) &&
            !typeUtils.isDefined(tag.fillId) &&
            XlsxCellAlignmentHelper.isEmpty(tag.alignment);
    },

    toXml: function(tag) {
        if(XlsxCellFormatHelper.isEmpty(tag)) {
            return '';
        } else {
            const isAlignmentEmpty = XlsxCellAlignmentHelper.isEmpty(tag.alignment);
            let applyNumberFormat;
            if(tag.numberFormatId === 0) {
                applyNumberFormat = 0;
            } else if(typeUtils.isDefined(tag.numberFormatId)) {
                applyNumberFormat = 1;
            }

            // §18.8.45 xf (Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            return XlsxTagHelper.toXml(
                "xf",
                {
                    'xfId': 0,
                    applyAlignment: isAlignmentEmpty ? null : 1,
                    fontId: tag.fontId,
                    applyNumberFormat: applyNumberFormat,
                    fillId: tag.fillId,
                    'numFmtId': tag.numberFormatId,
                },
                isAlignmentEmpty ? null : XlsxCellAlignmentHelper.toXml(tag.alignment)
            );
        }
    }
};

export default XlsxCellFormatHelper;

import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';
import XlsxCellAlignmentUtils from './xlsx_cell_alignment';

const XlsxCellFormatUtils = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                fontId: sourceObj.fontId,
                numberFormatId: sourceObj.numberFormatId,
                alignment: XlsxCellAlignmentUtils.tryCreateTag(sourceObj.alignment)
            };
            if(XlsxCellFormatUtils.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return XlsxCellFormatUtils.isEmpty(leftTag) && XlsxCellFormatUtils.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.fontId === rightTag.fontId &&
                leftTag.numberFormatId === rightTag.numberFormatId &&
                XlsxCellAlignmentUtils.areEqual(leftTag.alignment, rightTag.alignment)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.fontId) &&
            !typeUtils.isDefined(tag.numberFormatId) &&
            XlsxCellAlignmentUtils.isEmpty(tag.alignment);
    },

    toXml: function(tag) {
        if(XlsxCellFormatUtils.isEmpty(tag)) {
            return '';
        } else {
            const isAlignmentEmpty = XlsxCellAlignmentUtils.isEmpty(tag.alignment);
            let applyNumberFormat;
            if(tag.numberFormatId === 0) {
                applyNumberFormat = 0;
            } else if(typeUtils.isDefined(tag.numberFormatId)) {
                applyNumberFormat = 1;
            }

            // §18.8.45 xf (Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            return XlsxTagUtils.toXml(
                "xf",
                [
                    { name: "xfId", value: 0 },
                    { name: "applyAlignment", value: isAlignmentEmpty ? null : 1 },
                    { name: "fontId", value: tag.fontId },
                    { name: "applyNumberFormat", value: applyNumberFormat },
                    { name: "numFmtId", value: tag.numberFormatId },
                ],
                isAlignmentEmpty ? null : XlsxCellAlignmentUtils.toXml(tag.alignment)
            );
        }
    }
};

export default XlsxCellFormatUtils;

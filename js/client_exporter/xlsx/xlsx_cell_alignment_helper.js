import typeUtils from "../../core/utils/type";
import XlsxTagHelper from './xlsx_tag_helper';

const XlsxCellAlignmentHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                vertical: sourceObj.vertical,
                wrapText: sourceObj.wrapText,
                horizontal: sourceObj.horizontal,
            };
            if(XlsxCellAlignmentHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return XlsxCellAlignmentHelper.isEmpty(leftTag) && XlsxCellAlignmentHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.vertical === rightTag.vertical &&
                leftTag.wrapText === rightTag.wrapText &&
                leftTag.horizontal === rightTag.horizontal
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.vertical) && !typeUtils.isDefined(tag.wrapText) && !typeUtils.isDefined(tag.horizontal);
    },

    toXml: function(tag) {
        if(XlsxCellAlignmentHelper.isEmpty(tag)) {
            return '';
        } else {
            // §18.8.1 alignment (Alignment), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            return XlsxTagHelper.toXml(
                "alignment",
                {
                    vertical: tag.vertical,
                    wrapText: tag.wrapText,
                    horizontal: tag.horizontal
                }
            );
        }
    }
};

export default XlsxCellAlignmentHelper;

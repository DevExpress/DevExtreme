import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';

const XlsxCellAlignmentUtils = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                vertical: sourceObj.vertical,
                wrapText: sourceObj.wrapText,
                horizontal: sourceObj.horizontal,
            };
            if(XlsxCellAlignmentUtils.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return XlsxCellAlignmentUtils.isEmpty(leftTag) && XlsxCellAlignmentUtils.isEmpty(rightTag) ||
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
        if(XlsxCellAlignmentUtils.isEmpty(tag)) {
            return '';
        } else {
            // §18.8.1 alignment (Alignment), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            return XlsxTagUtils.toXml(
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

export default XlsxCellAlignmentUtils;

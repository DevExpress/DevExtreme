import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';

const xlsxCellAlignmentHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                vertical: sourceObj.vertical,
                wrapText: sourceObj.wrapText,
                horizontal: sourceObj.horizontal,
            };
            if(xlsxCellAlignmentHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxCellAlignmentHelper.isEmpty(leftTag) && xlsxCellAlignmentHelper.isEmpty(rightTag) ||
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
        // §18.8.1 alignment (Alignment), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(
            "alignment",
            {
                vertical: tag.vertical,
                wrapText: tag.wrapText,
                horizontal: tag.horizontal
            }
        );
    }
};

export default xlsxCellAlignmentHelper;

import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';

const XlsxCellAlignmentUtils = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj) && !XlsxCellAlignmentUtils.isEmpty(sourceObj)) {
            result = Object.assign(
                {},
                sourceObj
            );
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

    toXmlString: function(tag) {
        if(XlsxCellAlignmentUtils.isEmpty(tag)) {
            return '';
        } else {
            // §18.8.1 alignment (Alignment), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            return XlsxTagUtils.toXmlString(
                "alignment",
                [
                    { name: "vertical", value: tag.vertical },
                    { name: "wrapText", value: tag.wrapText },
                    { name: "horizontal", value: tag.horizontal }
                ]
            );
        }
    }
};

export default XlsxCellAlignmentUtils;

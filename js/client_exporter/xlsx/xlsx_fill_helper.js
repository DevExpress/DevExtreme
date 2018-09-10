import typeUtils from "../../core/utils/type";
import XlsxTagHelper from './xlsx_tag_helper';
import XlsxPatternFillHelper from './xlsx_pattern_fill_helper';

const XlsxFillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = { patternFill: sourceObj.patternFill };
            if(XlsxFillHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return XlsxFillHelper.isEmpty(leftTag) && XlsxFillHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                XlsxPatternFillHelper.areEqual(leftTag.patternFill, rightTag.patternFill)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) || XlsxPatternFillHelper.isEmpty(tag.patternFill);
    },

    toXml: function(tag) {
        if(XlsxFillHelper.isEmpty(tag)) {
            return '';
        } else {
            // §18.8.20 fill (Fill), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            return XlsxTagHelper.toXml(
                "fill",
                {},
                XlsxPatternFillHelper.toXml(tag.patternFill)
            );
        }
    }
};

export default XlsxFillHelper;

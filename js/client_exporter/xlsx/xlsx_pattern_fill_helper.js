import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';

const xlsxPatternFillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                patternType: sourceObj.patternType,
                backgroundColor_RGB: sourceObj.backgroundColor_RGB,
                foregroundColor_RGB: sourceObj.foregroundColor_RGB
            };
            if(xlsxPatternFillHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxPatternFillHelper.isEmpty(leftTag) && xlsxPatternFillHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.patternType === rightTag.patternType && leftTag.backgroundColor_RGB === rightTag.backgroundColor_RGB && leftTag.foregroundColor_RGB === rightTag.foregroundColor_RGB
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) || !typeUtils.isDefined(tag.patternType);
    },

    toXml: function(tag) {
        const content =
            [
                (tag.backgroundColor_RGB) ? xlsxTagHelper.toXml("bgColor", { rgb: tag.backgroundColor_RGB }) : "", // §18.8.3 bgColor (Background Color), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
                (tag.foregroundColor_RGB) ? xlsxTagHelper.toXml("fgColor", { rgb: tag.foregroundColor_RGB }) : "", // §18.8.19 fgColor (Foreground Color), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            ].join("");

        // §18.8.32 patternFill (Pattern), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(
            "patternFill",
            { patternType: tag.patternType },
            content
        );
    }
};

export default xlsxPatternFillHelper;

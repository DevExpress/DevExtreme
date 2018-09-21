import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxColorHelper from './xlsx_color_helper';

const xlsxPatternFillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                patternType: sourceObj.patternType,
                backgroundColor: xlsxColorHelper.tryCreateTag(sourceObj.backgroundColor),
                foregroundColor: xlsxColorHelper.tryCreateTag(sourceObj.foregroundColor),
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
                leftTag.patternType === rightTag.patternType &&
                xlsxColorHelper.areEqual(leftTag.backgroundColor, rightTag.backgroundColor) &&
                xlsxColorHelper.areEqual(leftTag.foregroundColor, rightTag.foregroundColor)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) || !typeUtils.isDefined(tag.patternType);
    },

    toXml: function(tag) {
        const content =
            [
                typeUtils.isDefined(tag.foregroundColor) ? xlsxColorHelper.toXml("fgColor", tag.foregroundColor) : '',
                typeUtils.isDefined(tag.backgroundColor) ? xlsxColorHelper.toXml("bgColor", tag.backgroundColor) : '',
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

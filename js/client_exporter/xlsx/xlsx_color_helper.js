import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';

const xlsxColorHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                rgb: sourceObj.rgb,
                theme: sourceObj.theme,
            };
            if(xlsxColorHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.rgb) &&
            !typeUtils.isDefined(tag.theme);
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxColorHelper.isEmpty(leftTag) && xlsxColorHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.rgb === rightTag.rgb &&
                leftTag.theme === rightTag.theme
            );
    },

    toXml: function(tag) {
         // 'CT_Color', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml("color",
            {
                rgb: tag.rgb,
                theme: tag.theme
            });
    },
};

export default xlsxColorHelper;

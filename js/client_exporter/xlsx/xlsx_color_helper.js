import { isDefined } from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';

const xlsxColorHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
            if(typeof sourceObj === 'string') {
                result = {
                    rgb: sourceObj
                };
            } else {
                result = {
                    rgb: sourceObj.rgb,
                    theme: sourceObj.theme,
                };
            }
            if(xlsxColorHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    copy: function(source) {
        let result = null;
        if(isDefined(source)) {
            if(typeof source === 'string') {
                result = source;
            } else {
                result = {};
                if(source.rgb !== undefined) {
                    result.rgb = source.rgb;
                }
                if(source.theme !== undefined) {
                    result.theme = source.theme;
                }
            }
        }
        return result;
    },

    isEmpty: function(tag) {
        return !isDefined(tag) ||
            !isDefined(tag.rgb) &&
            !isDefined(tag.theme);
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxColorHelper.isEmpty(leftTag) && xlsxColorHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                leftTag.rgb === rightTag.rgb &&
                leftTag.theme === rightTag.theme
            );
    },

    toXml: function(tagName, tag) {
        // 'CT_Color', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(tagName,
            {
                rgb: tag.rgb,
                theme: tag.theme
            });
    },
};

export default xlsxColorHelper;

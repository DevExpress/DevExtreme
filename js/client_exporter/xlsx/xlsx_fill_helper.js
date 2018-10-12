import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxPatternFillHelper from './xlsx_pattern_fill_helper';

const xlsxFillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = { patternFill: xlsxPatternFillHelper.tryCreateTag(sourceObj.patternFill) };
            if(xlsxFillHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },
    tryCreateFillFromSimpleFormat: function({ backgroundColor, patternStyle, patternColor } = {}) {
        if(typeUtils.isDefined(backgroundColor) && !(typeUtils.isDefined(patternStyle) && typeUtils.isDefined(patternColor))) {
            return {
                patternFill: {
                    patternType: 'solid',
                    foregroundColor: {
                        rgb: backgroundColor
                    }
                }
            };
        } else if(typeUtils.isDefined(patternStyle) && typeUtils.isDefined(patternColor)) {
            return {
                patternFill: {
                    patternType: patternStyle,
                    foregroundColor: {
                        rgb: patternColor
                    },
                    backgroundColor: {
                        rgb: backgroundColor
                    },
                }
            };
        }
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxFillHelper.isEmpty(leftTag) && xlsxFillHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                xlsxPatternFillHelper.areEqual(leftTag.patternFill, rightTag.patternFill)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) || xlsxPatternFillHelper.isEmpty(tag.patternFill);
    },

    toXml: function(tag) {
        // §18.8.20 fill (Fill), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(
            "fill",
            {},
            xlsxPatternFillHelper.toXml(tag.patternFill)
        );
    }
};

export default xlsxFillHelper;

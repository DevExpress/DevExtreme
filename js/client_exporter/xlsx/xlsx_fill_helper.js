import { isDefined } from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxPatternFillHelper from './xlsx_pattern_fill_helper';

const xlsxFillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
            result = { patternFill: xlsxPatternFillHelper.tryCreateTag(sourceObj.patternFill) };
            if(xlsxFillHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    tryCreateFillFromSimpleFormat: function({ backgroundColor, patternStyle, patternColor } = {}) {
        if(isDefined(backgroundColor) && !(isDefined(patternStyle) && isDefined(patternColor))) {
            return {
                patternFill: {
                    patternType: 'solid',
                    foregroundColor: {
                        rgb: backgroundColor
                    }
                }
            };
        } else if(isDefined(patternStyle) && isDefined(patternColor)) {
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

    copySimpleFormat: function(source, target) {
        if(source.backgroundColor !== undefined) {
            target.backgroundColor = source.backgroundColor;
        }
        if(source.patternStyle !== undefined) {
            target.patternStyle = source.patternStyle;
        }
        if(source.patternColor !== undefined) {
            target.patternColor = source.patternColor;
        }
    },

    copy: function(source) {
        let result = null;
        if(isDefined(source)) {
            result = {};
            if(source.patternFill !== undefined) {
                result.patternFill = xlsxPatternFillHelper.copy(source.patternFill);
            };
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxFillHelper.isEmpty(leftTag) && xlsxFillHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                xlsxPatternFillHelper.areEqual(leftTag.patternFill, rightTag.patternFill)
            );
    },

    isEmpty: function(tag) {
        return !isDefined(tag) || xlsxPatternFillHelper.isEmpty(tag.patternFill);
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

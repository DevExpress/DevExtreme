import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';
import patternFillHelper from './excel.pattern_fill_helper';

const fillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
            result = { patternFill: patternFillHelper.tryCreateTag(sourceObj.patternFill) };
            if(fillHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    tryCreateFillFromSimpleFormat: function({ backgroundColor, fillPatternType, fillPatternColor } = {}) {
        if(isDefined(backgroundColor) && !(isDefined(fillPatternType) && isDefined(fillPatternColor))) {
            return {
                patternFill: {
                    patternType: 'solid',
                    foregroundColor: {
                        rgb: backgroundColor
                    }
                }
            };
        } else if(isDefined(fillPatternType) && isDefined(fillPatternColor)) {
            return {
                patternFill: {
                    patternType: fillPatternType,
                    foregroundColor: {
                        rgb: fillPatternColor
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
        if(source.fillPatternType !== undefined) {
            target.fillPatternType = source.fillPatternType;
        }
        if(source.fillPatternColor !== undefined) {
            target.fillPatternColor = source.fillPatternColor;
        }
    },

    copy: function(source) {
        let result = null;
        if(isDefined(source)) {
            result = {};
            if(source.patternFill !== undefined) {
                result.patternFill = patternFillHelper.copy(source.patternFill);
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return fillHelper.isEmpty(leftTag) && fillHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                patternFillHelper.areEqual(leftTag.patternFill, rightTag.patternFill)
            );
    },

    isEmpty: function(tag) {
        return !isDefined(tag) || patternFillHelper.isEmpty(tag.patternFill);
    },

    toXml: function(tag) {
        // §18.8.20 fill (Fill), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return tagHelper.toXml(
            'fill',
            {},
            patternFillHelper.toXml(tag.patternFill)
        );
    }
};

export default fillHelper;

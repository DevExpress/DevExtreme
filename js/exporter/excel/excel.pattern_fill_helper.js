import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';
import colorHelper from './excel.color_helper';

const patternFillHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
            result = {
                patternType: sourceObj.patternType,
                backgroundColor: colorHelper.tryCreateTag(sourceObj.backgroundColor),
                foregroundColor: colorHelper.tryCreateTag(sourceObj.foregroundColor),
            };
            if(patternFillHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    copy: function(source) {
        let result = null;
        if(isDefined(source)) {
            result = {};
            if(source.patternType !== undefined) {
                result.patternType = source.patternType;
            }
            if(source.backgroundColor !== undefined) {
                result.backgroundColor = colorHelper.copy(source.backgroundColor);
            }
            if(source.foregroundColor !== undefined) {
                result.foregroundColor = colorHelper.copy(source.foregroundColor);
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return patternFillHelper.isEmpty(leftTag) && patternFillHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                leftTag.patternType === rightTag.patternType &&
                colorHelper.areEqual(leftTag.backgroundColor, rightTag.backgroundColor) &&
                colorHelper.areEqual(leftTag.foregroundColor, rightTag.foregroundColor)
            );
    },

    isEmpty: function(tag) {
        return !isDefined(tag) || !isDefined(tag.patternType);
    },

    toXml: function(tag) {
        const content =
            [
                isDefined(tag.foregroundColor) ? colorHelper.toXml('fgColor', tag.foregroundColor) : '', // 18.8.19 fgColor (Foreground Color)
                isDefined(tag.backgroundColor) ? colorHelper.toXml('bgColor', tag.backgroundColor) : '', // 18.8.3 bgColor (Background Color)
            ].join('');

        // §18.8.32 patternFill (Pattern), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return tagHelper.toXml(
            'patternFill',
            { patternType: tag.patternType }, // 18.18.55 ST_PatternType (Pattern Type)
            content
        );
    }
};

export default patternFillHelper;

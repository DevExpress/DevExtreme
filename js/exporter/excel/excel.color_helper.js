import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';

const colorHelper = {
    _tryConvertColor: function(source) {
        if(typeof source !== 'string') {
            return source;
        }
        let result;
        if(source.length > 0 && source[0] === '#') {
            const colorCode = source.substr(1, source.length);
            if(colorCode.length === 6) { // RRGGBB
                result = 'FF' + colorCode;
            } else if(colorCode.length === 8) { // RRGGBBAA
                result = colorCode[6] + colorCode[7] + colorCode.substr(0, 6);
            } else {
                result = colorCode;
            }
        } else {
            result = source;
        }

        return result;
    },

    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
            if(typeof sourceObj === 'string') {
                result = {
                    rgb: this._tryConvertColor(sourceObj)
                };
            } else {
                result = {
                    rgb: this._tryConvertColor(sourceObj.rgb),
                    theme: sourceObj.theme,
                };
            }
            if(colorHelper.isEmpty(result)) {
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
        return colorHelper.isEmpty(leftTag) && colorHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                leftTag.rgb === rightTag.rgb &&
                leftTag.theme === rightTag.theme
            );
    },

    toXml: function(tagName, tag) {
        // 'CT_Color', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return tagHelper.toXml(tagName,
            {
                rgb: tag.rgb,
                theme: tag.theme
            });
    },
};

export default colorHelper;

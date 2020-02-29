import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';

const cellAlignmentHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
            result = {
                vertical: sourceObj.vertical,
                wrapText: sourceObj.wrapText,
                horizontal: sourceObj.horizontal,
            };
            if(cellAlignmentHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    copy: function(source) {
        let result = null;
        if(isDefined(source)) {
            result = {};
            if(source.horizontal !== undefined) {
                result.horizontal = source.horizontal;
            }
            if(source.vertical !== undefined) {
                result.vertical = source.vertical;
            }
            if(source.wrapText !== undefined) {
                result.wrapText = source.wrapText;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return cellAlignmentHelper.isEmpty(leftTag) && cellAlignmentHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                leftTag.vertical === rightTag.vertical &&
                leftTag.wrapText === rightTag.wrapText &&
                leftTag.horizontal === rightTag.horizontal
            );
    },

    isEmpty: function(tag) {
        return !isDefined(tag) ||
            !isDefined(tag.vertical) && !isDefined(tag.wrapText) && !isDefined(tag.horizontal);
    },

    toXml: function(tag) {
        // §18.8.1 alignment (Alignment), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return tagHelper.toXml(
            'alignment',
            {
                vertical: tag.vertical, // 18.18.88 ST_VerticalAlignment (Vertical Alignment Types)
                wrapText: isDefined(tag.wrapText) ? Number(tag.wrapText) : undefined,
                horizontal: tag.horizontal // 18.18.40 ST_HorizontalAlignment (Horizontal Alignment Type)
            }
        );
    }
};

export default cellAlignmentHelper;

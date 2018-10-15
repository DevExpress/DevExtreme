import { isDefined } from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';

const xlsxNumberFormatHelper = {
    ID_PROPERTY_NAME: 'id',

    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeof sourceObj === 'string') {
            result = { formatCode: sourceObj };

            if(xlsxNumberFormatHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxNumberFormatHelper.isEmpty(leftTag) && xlsxNumberFormatHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                leftTag.formatCode === rightTag.formatCode
            );
    },

    isEmpty: function(tag) {
        return !isDefined(tag) || !isDefined(tag.formatCode) || tag.formatCode === '';
    },

    toXml: function(tag) {
        // §18.8.30 numFmt (Number Format)
        return xlsxTagHelper.toXml(
            "numFmt",
            {
                'numFmtId': tag[xlsxNumberFormatHelper.ID_PROPERTY_NAME],
                formatCode: tag.formatCode // §21.2.2.71 formatCode (Format Code), §18.8.31 numFmts (Number Formats)
            }
        );
    }
};

export default xlsxNumberFormatHelper;

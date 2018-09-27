import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';

const xlsxNumberFormatHelper = {
    ID_PROPERTY_NAME: 'id',

    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                formatCode: sourceObj.formatCode,
            };
            if(xlsxNumberFormatHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxNumberFormatHelper.isEmpty(leftTag) && xlsxNumberFormatHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.formatCode === rightTag.formatCode
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) || !typeUtils.isDefined(tag.formatCode) || tag.formatCode === '';
    },

    toXml: function(tag, addCustomAttributesCallback) {
        // §18.8.30 numFmt (Number Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const attributes = {};
        addCustomAttributesCallback(attributes);
        attributes.formatCode = tag.formatCode; // §21.2.2.71 formatCode (Format Code), §18.8.31 numFmts (Number Formats)
        return xlsxTagHelper.toXml("numFmt", attributes);
    }
};

export default xlsxNumberFormatHelper;

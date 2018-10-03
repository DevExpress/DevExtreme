import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxColorHelper from './xlsx_color_helper';


const xlsxFontHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj)) {
            result = {
                size: sourceObj.size,
                name: sourceObj.name,
                family: sourceObj.family,
                scheme: sourceObj.scheme,
                bold: sourceObj.bold,
                italic: sourceObj.italic,
                underline: sourceObj.underline,
                color: xlsxColorHelper.tryCreateTag(sourceObj.color),
            };
            if(xlsxFontHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxFontHelper.isEmpty(leftTag) && xlsxFontHelper.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.size === rightTag.size &&
                leftTag.name === rightTag.name &&
                leftTag.family === rightTag.family &&
                leftTag.scheme === rightTag.scheme &&
                (leftTag.bold === rightTag.bold || !leftTag.bold === !rightTag.bold) &&
                (leftTag.italic === rightTag.italic || !leftTag.italic === !rightTag.italic) &&
                leftTag.underline === rightTag.underline &&
                xlsxColorHelper.areEqual(leftTag.color, rightTag.color)
            );
    },

    isEmpty: function(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.size) &&
            !typeUtils.isDefined(tag.name) &&
            !typeUtils.isDefined(tag.family) &&
            !typeUtils.isDefined(tag.scheme) &&
            (!typeUtils.isDefined(tag.bold) || !tag.bold) &&
            (!typeUtils.isDefined(tag.italic) || !tag.italic) &&
            !typeUtils.isDefined(tag.underline) &&
            xlsxColorHelper.isEmpty(tag.color);
    },

    toXml: function(tag) {
        const content = [
            typeUtils.isDefined(tag.bold) && tag.bold ? xlsxTagHelper.toXml('b', {}) : '', // 18.8.2 b (Bold)
            typeUtils.isDefined(tag.size) ? xlsxTagHelper.toXml('sz', { 'val': tag.size }) : '', // 18.4.11 sz (Font Size)
            typeUtils.isDefined(tag.color) ? xlsxColorHelper.toXml('color', tag.color) : '',
            typeUtils.isDefined(tag.name) ? xlsxTagHelper.toXml('name', { 'val': tag.name }) : '', // 18.8.29 name (Font Name)
            typeUtils.isDefined(tag.family) ? xlsxTagHelper.toXml('family', { 'val': tag.family }) : '', // 18.8.18 family (Font Family)
            typeUtils.isDefined(tag.scheme) ? xlsxTagHelper.toXml('scheme', { 'val': tag.scheme }) : '', // 18.8.35 scheme (Scheme)
            typeUtils.isDefined(tag.italic) && tag.italic ? xlsxTagHelper.toXml('i', {}) : '', // 18.8.26 i (Italic)
            typeUtils.isDefined(tag.underline) ? xlsxTagHelper.toXml('u', { 'val': tag.underline }) : '', // 18.4.13 u (Underline)
        ].join('');

        // §18.8.22, 'font (Font)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(
            "font",
            {},
            content
        );
    }
};

export default xlsxFontHelper;

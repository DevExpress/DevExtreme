import { isDefined } from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxColorHelper from './xlsx_color_helper';


const xlsxFontHelper = {
    tryCreateTag: function(sourceObj) {
        let result = null;
        if(isDefined(sourceObj)) {
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

    copy: function(source) {
        let result = null;
        if(isDefined(source)) {
            result = {};
            if(source.size !== undefined) {
                result.size = source.size;
            }
            if(source.name !== undefined) {
                result.name = source.name;
            }
            if(source.family !== undefined) {
                result.family = source.family;
            }
            if(source.scheme !== undefined) {
                result.scheme = source.scheme;
            }
            if(source.bold !== undefined) {
                result.bold = source.bold;
            }
            if(source.italic !== undefined) {
                result.italic = source.italic;
            }
            if(source.underline !== undefined) {
                result.underline = source.underline;
            }
            if(source.color !== undefined) {
                result.color = xlsxColorHelper.copy(source.color);
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxFontHelper.isEmpty(leftTag) && xlsxFontHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
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
        return !isDefined(tag) ||
            !isDefined(tag.size) &&
            !isDefined(tag.name) &&
            !isDefined(tag.family) &&
            !isDefined(tag.scheme) &&
            (!isDefined(tag.bold) || !tag.bold) &&
            (!isDefined(tag.italic) || !tag.italic) &&
            !isDefined(tag.underline) &&
            xlsxColorHelper.isEmpty(tag.color);
    },

    toXml: function(tag) {
        const content = [
            isDefined(tag.bold) && tag.bold ? xlsxTagHelper.toXml('b', {}) : '', // 18.8.2 b (Bold)
            isDefined(tag.size) ? xlsxTagHelper.toXml('sz', { 'val': tag.size }) : '', // 18.4.11 sz (Font Size)
            isDefined(tag.color) ? xlsxColorHelper.toXml('color', tag.color) : '',
            isDefined(tag.name) ? xlsxTagHelper.toXml('name', { 'val': tag.name }) : '', // 18.8.29 name (Font Name)
            isDefined(tag.family) ? xlsxTagHelper.toXml('family', { 'val': tag.family }) : '', // 18.8.18 family (Font Family)
            isDefined(tag.scheme) ? xlsxTagHelper.toXml('scheme', { 'val': tag.scheme }) : '', // 18.8.35 scheme (Scheme)
            isDefined(tag.italic) && tag.italic ? xlsxTagHelper.toXml('i', {}) : '', // 18.8.26 i (Italic)
            isDefined(tag.underline) ? xlsxTagHelper.toXml('u', { 'val': tag.underline }) : '', // 18.4.13 u (Underline)
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

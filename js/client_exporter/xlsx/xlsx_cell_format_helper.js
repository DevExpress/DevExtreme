import { isDefined } from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxCellAlignmentHelper from './xlsx_cell_alignment_helper';
import xlsxFillHelper from './xlsx_fill_helper';
import xlsxFontHelper from './xlsx_font_helper';

const xlsxCellFormatHelper = {
    tryCreateTag: function(sourceObj, sharedItemsContainer) {
        let result = null;
        if(isDefined(sourceObj)) {
            let numberFormatId;
            if(typeof sourceObj.numberFormat === 'number') {
                numberFormatId = sourceObj.numberFormat;
            } else {
                numberFormatId = sharedItemsContainer.registerNumberFormat(sourceObj.numberFormat);
            }

            let fill = sourceObj.fill;
            if(!isDefined(fill)) {
                fill = xlsxFillHelper.tryCreateFillFromSimpleFormat(sourceObj);
            }

            result = {
                numberFormatId,
                alignment: xlsxCellAlignmentHelper.tryCreateTag(sourceObj.alignment),
                fontId: sharedItemsContainer.registerFont(sourceObj.font),
                fillId: sharedItemsContainer.registerFill(fill),
            };
            if(xlsxCellFormatHelper.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    },

    copy: function(source) {
        let result;
        if(source === null) {
            result = null;
        } else if(isDefined(source)) {
            result = {};

            if(source.numberFormat !== undefined) {
                result.numberFormat = source.numberFormat;
            }

            if(source.fill !== undefined) {
                result.fill = xlsxFillHelper.copy(source.fill);
            } else {
                xlsxFillHelper.copySimpleFormat(source, result);
            }

            if(source.alignment !== undefined) {
                result.alignment = xlsxCellAlignmentHelper.copy(source.alignment);
            }
            if(source.font !== undefined) {
                result.font = xlsxFontHelper.copy(source.font);
            }
        }
        return result;
    },

    areEqual: function(leftTag, rightTag) {
        return xlsxCellFormatHelper.isEmpty(leftTag) && xlsxCellFormatHelper.isEmpty(rightTag) ||
            (
                isDefined(leftTag) && isDefined(rightTag) &&
                leftTag.fontId === rightTag.fontId &&
                leftTag.numberFormatId === rightTag.numberFormatId &&
                leftTag.fillId === rightTag.fillId &&
                xlsxCellAlignmentHelper.areEqual(leftTag.alignment, rightTag.alignment)
            );
    },

    isEmpty: function(tag) {
        return !isDefined(tag) ||
            !isDefined(tag.fontId) &&
            !isDefined(tag.numberFormatId) &&
            !isDefined(tag.fillId) &&
            xlsxCellAlignmentHelper.isEmpty(tag.alignment);
    },

    toXml: function(tag) {
        const isAlignmentEmpty = xlsxCellAlignmentHelper.isEmpty(tag.alignment);
        let applyNumberFormat;
        if(isDefined(tag.numberFormatId)) {
            applyNumberFormat = tag.numberFormatId > 0 ? 1 : 0;
        }

        // §18.8.45 xf (Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml(
            "xf",
            {
                'xfId': 0,
                applyAlignment: isAlignmentEmpty ? null : 1,
                fontId: tag.fontId,
                applyNumberFormat,
                fillId: tag.fillId,
                'numFmtId': tag.numberFormatId,
            },
            isAlignmentEmpty ? null : xlsxCellAlignmentHelper.toXml(tag.alignment)
        );
    }
};

export default xlsxCellFormatHelper;

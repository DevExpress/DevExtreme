import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';
import XlsxCellAlignment from './xlsx_cell_alignment';

//
// This class represents '§18.8.45 xf (Format)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
//
export default class XlsxCellFormat {

    static tryCreateTag(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj) && !XlsxCellFormat.isEmpty(sourceObj)) {
            result = Object.assign(
                {},
                sourceObj,
                { alignment: XlsxCellAlignment.tryCreateTag(sourceObj.alignment) }
            );
        }
        return result;
    }

    static areEqual(leftTag, rightTag) {
        return XlsxCellFormat.isEmpty(leftTag) && XlsxCellFormat.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.fontId === rightTag.fontId &&
                leftTag.numberFormatId === rightTag.numberFormatId &&
                XlsxCellAlignment.areEqual(leftTag.alignment, rightTag.alignment)
            );
    }

    static isEmpty(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.fontId) &&
            !typeUtils.isDefined(tag.numberFormatId) &&
            XlsxCellAlignment.isEmpty(tag.alignment);
    }

    static toXmlString(tag) {
        if(XlsxCellFormat.isEmpty(tag)) {
            return '';
        } else {
            const isAlignmentEmpty = XlsxCellAlignment.isEmpty(tag.alignment);
            let applyNumberFormat;
            if(tag.numberFormatId === 0) {
                applyNumberFormat = 0;
            } else if(typeUtils.isDefined(tag.numberFormatId)) {
                applyNumberFormat = 1;
            }
            return XlsxTagUtils.toXmlString(
                "xf",
                [
                    { name: "xfId", value: 0 },
                    { name: "applyAlignment", value: isAlignmentEmpty ? null : 1 },
                    { name: "fontId", value: tag.fontId },
                    { name: "applyNumberFormat", value: applyNumberFormat },
                    { name: "numFmtId", value: tag.numberFormatId },
                ],
                isAlignmentEmpty ? null : XlsxCellAlignment.toXmlString(tag.alignment)
            );
        }
    }
}

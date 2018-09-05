import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';
import { XlsxCellAlignment, XlsxCellAlignmentTag } from './xlsx_cell_alignment';

//
// This class represents a denormalized '§18.8.45 xf (Format)' structure
//
class XlsxCellFormat {
    constructor({ fontId, numberFormatId, alignment = new XlsxCellAlignment() } = {}) {
        this.fontId = fontId;
        this.numberFormatId = numberFormatId;
        this.alignment = alignment; // an object with properties like in 'XlsxCellAlignment' is expected
        // fill, border
    }
    static tryCreateTag(cellFormat) {
        let result = null;
        if(typeUtils.isDefined(cellFormat)) {
            result = new XlsxCellFormatTag(Object.assign({ alignmentTag: XlsxCellAlignment.tryCreateTag(cellFormat.alignment) }, cellFormat));
            if(XlsxCellFormatTag.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    }
}

//
// For internal use.
// This class represents a '§18.8.45 xf (Format)' structure
//
class XlsxCellFormatTag {
    constructor({ fontId, numberFormatId, alignmentTag = new XlsxCellAlignmentTag() } = {}) {
        this._fontId = fontId;
        this._numberFormatId = numberFormatId;
        this._alignment = alignmentTag; // a XlsxCellAlignmentTag object is expected
    }
    static areEqual(left, right) {
        return XlsxCellFormatTag.isEmpty(left) && XlsxCellFormatTag.isEmpty(right) ||
            (
                typeUtils.isDefined(left) && typeUtils.isDefined(right) &&
                left._fontId === right._fontId &&
                left._numberFormatId === right._numberFormatId &&
                XlsxCellAlignmentTag.areEqual(left._alignment, right._alignment)
            );
    }
    static isEmpty(obj) {
        return !typeUtils.isDefined(obj) ||
            !typeUtils.isDefined(obj._fontId) &&
            !typeUtils.isDefined(obj._numberFormatId) &&
            XlsxCellAlignmentTag.isEmpty(obj._alignment);
    }
    toXmlString() {
        const isAlignmentEmpty = XlsxCellAlignmentTag.areEqual(this._alignment, null);
        let applyNumberFormat;
        if(this._numberFormatId === 0) {
            applyNumberFormat = 0;
        } else if(typeUtils.isDefined(this._numberFormatId)) {
            applyNumberFormat = 1;
        }
        return XlsxTagUtils.toXmlString(
            "xf",
            [
                { name: "xfId", value: 0 },
                { name: "applyAlignment", value: isAlignmentEmpty ? null : 1 },
                { name: "fontId", value: this._fontId },
                { name: "applyNumberFormat", value: applyNumberFormat },
                { name: "numFmtId", value: this._numberFormatId },
            ],
            isAlignmentEmpty ? null : this._alignment.toXmlString()
        );
    }
}

module.exports.XlsxCellFormat = XlsxCellFormat;
module.exports.XlsxCellFormatTag = XlsxCellFormatTag;

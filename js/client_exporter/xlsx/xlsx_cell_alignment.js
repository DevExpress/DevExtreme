import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';

//
// This class represents a denormalized '§18.8.1 alignment (Alignment)' structure
//
class XlsxCellAlignment {
    constructor({ vertical, wrapText, horizontal } = {}) {
        this.vertical = vertical;
        this.wrapText = wrapText;
        this.horizontal = horizontal;
    }
    static tryCreateTag(alignment) {
        let result = null;
        if(typeUtils.isDefined(alignment)) {
            result = new XlsxCellAlignmentTag(alignment);
            if(XlsxCellAlignmentTag.isEmpty(result)) {
                result = null;
            }
        }
        return result;
    }
}

//
// For internal use.
// This class represents a '§18.8.1 alignment (Alignment)' structure
//
class XlsxCellAlignmentTag {
    constructor({ vertical, wrapText, horizontal } = {}) {
        this._vertical = vertical;
        this._wrapText = wrapText;
        this._horizontal = horizontal;
    }
    static areEqual(left, right) {
        return XlsxCellAlignmentTag.isEmpty(left) && XlsxCellAlignmentTag.isEmpty(right) ||
            (
                typeUtils.isDefined(left) && typeUtils.isDefined(right) &&
                left._vertical === right._vertical &&
                left._wrapText === right._wrapText &&
                left._horizontal === right._horizontal
            );
    }
    static isEmpty(obj) {
        return !typeUtils.isDefined(obj) ||
            !typeUtils.isDefined(obj._vertical) && !typeUtils.isDefined(obj._wrapText) && !typeUtils.isDefined(obj._horizontal);
    }
    toXmlString() {
        return XlsxTagUtils.toXmlString(
            "alignment",  // §18.8.1 alignment (Alignment)
            [
                { name: "vertical", value: this._vertical },
                { name: "wrapText", value: this._wrapText },
                { name: "horizontal", value: this._horizontal }
            ]
        );
    }
}

module.exports.XlsxCellAlignment = XlsxCellAlignment;
module.exports.XlsxCellAlignmentTag = XlsxCellAlignmentTag;

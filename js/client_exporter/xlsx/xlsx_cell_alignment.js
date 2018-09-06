import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';

//
// This class represents '§18.8.1 alignment (Alignment)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
//
export default class XlsxCellAlignment {

    static tryCreateTag(sourceObj) {
        let result = null;
        if(typeUtils.isDefined(sourceObj) && !XlsxCellAlignment.isEmpty(sourceObj)) {
            result = Object.assign(
                {},
                sourceObj
            );
        }
        return result;
    }

    static areEqual(leftTag, rightTag) {
        return XlsxCellAlignment.isEmpty(leftTag) && XlsxCellAlignment.isEmpty(rightTag) ||
            (
                typeUtils.isDefined(leftTag) && typeUtils.isDefined(rightTag) &&
                leftTag.vertical === rightTag.vertical &&
                leftTag.wrapText === rightTag.wrapText &&
                leftTag.horizontal === rightTag.horizontal
            );
    }

    static isEmpty(tag) {
        return !typeUtils.isDefined(tag) ||
            !typeUtils.isDefined(tag.vertical) && !typeUtils.isDefined(tag.wrapText) && !typeUtils.isDefined(tag.horizontal);
    }

    static toXmlString(tag) {
        if(XlsxCellAlignment.isEmpty(tag)) {
            return '';
        } else {
            return XlsxTagUtils.toXmlString(
                "alignment",  // §18.8.1 alignment (Alignment)
                [
                    { name: "vertical", value: tag.vertical },
                    { name: "wrapText", value: tag.wrapText },
                    { name: "horizontal", value: tag.horizontal }
                ]
            );
        }
    }
}

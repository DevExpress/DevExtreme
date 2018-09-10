import typeUtils from "../../core/utils/type";
import XlsxTagHelper from './xlsx_tag_helper';
import XlsxCellFormatHelper from './xlsx_cell_format_helper';

export default class XlsxFile {

    constructor() {
        this._cellFormatTags = [];
    }

    registerCellFormat(cellFormat) {
        let result;
        const cellFormatTag = XlsxCellFormatHelper.tryCreateTag(cellFormat);
        if(typeUtils.isDefined(cellFormatTag)) {
            for(let i = 0; i < this._cellFormatTags.length; i++) {
                if(XlsxCellFormatHelper.areEqual(this._cellFormatTags[i], cellFormatTag)) {
                    result = i;
                    break;
                }
            }
            if(result === undefined) {
                result = this._cellFormatTags.push(cellFormatTag) - 1;
            }
        }
        return result;
    }

    generateCellFormatsXml() {
        const cellFormatTagsAsXmlStringsArray = this._cellFormatTags.map(tag => XlsxCellFormatHelper.toXml(tag));
        // §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return XlsxTagHelper.toXml("cellXfs", { count: cellFormatTagsAsXmlStringsArray.length }, cellFormatTagsAsXmlStringsArray.join(""));
    }
}

module.exports = XlsxFile;

import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';
import XlsxCellFormatUtils from './xlsx_cell_format';

export default class XlsxFile {

    constructor() {
        this._cellFormatTags = [];
    }

    registerCellFormat(cellFormat) {
        let result;
        const cellFormatTag = XlsxCellFormatUtils.tryCreateTag(cellFormat);
        if(typeUtils.isDefined(cellFormatTag)) {
            result = this._cellFormatTags.findIndex(item => XlsxCellFormatUtils.areEqual(item, cellFormatTag));
            if(result < 0) {
                result = this._cellFormatTags.push(cellFormatTag) - 1;
            }
        }
        return result;
    }

    generateCellFormatsXml() {
        const cellFormatTagsAsXmlStringsArray = this._cellFormatTags.map(tag => XlsxCellFormatUtils.toXml(tag));
        // §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return XlsxTagUtils.toXml("cellXfs", { count: cellFormatTagsAsXmlStringsArray.length }, cellFormatTagsAsXmlStringsArray.join(""));
    }
}

module.exports = XlsxFile;

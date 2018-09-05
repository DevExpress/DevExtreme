import typeUtils from "../../core/utils/type";
import XlsxTagUtils from './xlsx_tag_utils';
import { XlsxCellFormat, XlsxCellFormatTag } from './xlsx_cell_format';

class XlsxFile {

    constructor() {
        this._cellFormatTags = [];
    }

    registerCellFormat(cellFormat = new XlsxCellFormat()) {
        let result;
        const cellFormatTag = XlsxCellFormat.tryCreateTag(cellFormat);
        if(typeUtils.isDefined(cellFormatTag)) {
            result = this._cellFormatTags.findIndex(item => XlsxCellFormatTag.areEqual(item, cellFormatTag));
            if(result < 0) {
                result = this._cellFormatTags.push(cellFormatTag) - 1;
            }
        }
        return result;
    }

    //
    // returns a string that represents §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    //
    generateCellFormatsXmlString() {
        const cellFormatTagsAsXmlStringsArray = XlsxTagUtils.toXmlStringArray(this._cellFormatTags);
        return XlsxTagUtils.toXmlString("cellXfs", [{ name: "count", value: cellFormatTagsAsXmlStringsArray.length }], cellFormatTagsAsXmlStringsArray.join("")); // XtraPrinting: void GenerateCellFormatsContent()
    }
}

module.exports = XlsxFile;

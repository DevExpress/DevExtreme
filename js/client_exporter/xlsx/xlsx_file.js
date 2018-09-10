import typeUtils from "../../core/utils/type";
import XlsxTagHelper from './xlsx_tag_helper';
import XlsxCellFormatHelper from './xlsx_cell_format_helper';
import XlsxFillHelper from "./xlsx_fill_helper";

export default class XlsxFile {

    constructor() {
        this._cellFormatTags = [];
        this._fillTags = [];

        // the [0, 1] indexes are reserved:
        // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
        // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
        this._fillTags.push(XlsxFillHelper.tryCreateTag({ patternFill: { patternType: 'none' } }));
    }

    registerCellFormat(cellFormat) {
        let result;
        const cellFormatTag = XlsxCellFormatHelper.tryCreateTag(cellFormat, { registerFill: this.registerFill.bind(this) });
        if(typeUtils.isDefined(cellFormatTag)) {
            result = this._cellFormatTags.findIndex(item => XlsxCellFormatHelper.areEqual(item, cellFormatTag));
            if(result < 0) {
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

    registerFill(fill) {
        let result;
        const fillTag = XlsxFillHelper.tryCreateTag(fill);
        if(typeUtils.isDefined(fillTag)) {
            result = this._fillTags.findIndex(item => XlsxFillHelper.areEqual(item, fillTag));
            if(result < 0) {
                if(this._fillTags.length < 2) {
                    // the [0, 1] indexes are reserved:
                    // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
                    // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
                    this._fillTags.push(XlsxFillHelper.tryCreateTag({ patternFill: { patternType: "Gray125" } })); // Index 1 - reserved
                }
                result = this._fillTags.push(fillTag) - 1;
            }
        }
        return result;
    }

    generateFillsXml() {
        const tagsAsXmlStringsArray = this._fillTags.map(tag => XlsxFillHelper.toXml(tag));
        // §18.8.21, 'fills (Fills)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return XlsxTagHelper.toXml("fills", { count: tagsAsXmlStringsArray.length }, tagsAsXmlStringsArray.join(""));
    }
}

module.exports = XlsxFile;

import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxCellFormatHelper from './xlsx_cell_format_helper';
import xlsxFillHelper from "./xlsx_fill_helper";

export default class XlsxFile {

    constructor() {
        this._cellFormatTags = [];
        this._fillTags = [];

        // the [0, 1] indexes are reserved:
        // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
        // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
        this._fillTags.push(xlsxFillHelper.tryCreateTag({ patternFill: { patternType: 'none' } }));
    }

    registerCellFormat(cellFormat) {
        let result;
        const cellFormatTag = xlsxCellFormatHelper.tryCreateTag(cellFormat, { registerFill: this.registerFill.bind(this) });
        if(typeUtils.isDefined(cellFormatTag)) {
            for(let i = 0; i < this._cellFormatTags.length; i++) {
                if(xlsxCellFormatHelper.areEqual(this._cellFormatTags[i], cellFormatTag)) {
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
        const cellFormatTagsAsXmlStringsArray = this._cellFormatTags.map(tag => xlsxCellFormatHelper.toXml(tag));
        // §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml("cellXfs", { count: cellFormatTagsAsXmlStringsArray.length }, cellFormatTagsAsXmlStringsArray.join(""));
    }

    registerFill(fill) {
        let result;
        const fillTag = xlsxFillHelper.tryCreateTag(fill);
        if(typeUtils.isDefined(fillTag)) {
            for(let i = 0; i < this._fillTags.length; i++) {
                if(xlsxFillHelper.areEqual(this._fillTags[i], fillTag)) {
                    result = i;
                    break;
                }
            }
            if(result === undefined) {
                if(this._fillTags.length < 2) {
                    // the [0, 1] indexes are reserved:
                    // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
                    // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
                    this._fillTags.push(xlsxFillHelper.tryCreateTag({ patternFill: { patternType: "Gray125" } })); // Index 1 - reserved
                }
                result = this._fillTags.push(fillTag) - 1;
            }
        }
        return result;
    }

    generateFillsXml() {
        const tagsAsXmlStringsArray = this._fillTags.map(tag => xlsxFillHelper.toXml(tag));
        // §18.8.21, 'fills (Fills)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        return xlsxTagHelper.toXml("fills", { count: tagsAsXmlStringsArray.length }, tagsAsXmlStringsArray.join(""));
    }
}

module.exports = XlsxFile;

import typeUtils from "../../core/utils/type";
import xlsxTagHelper from './xlsx_tag_helper';
import xlsxCellFormatHelper from './xlsx_cell_format_helper';
import xlsxFillHelper from "./xlsx_fill_helper";
import xlsxFontHelper from "./xlsx_font_helper";
import xlsxNumberFormatHelper from "./xlsx_number_format_helper";

export default class XlsxFile {

    constructor() {
        this._cellFormatTags = [];
        this._fillTags = [];
        this._fontTags = [];
        this._numberFormatTags = [];

        // the [0, 1] indexes are reserved:
        // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
        // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
        this._fillTags.push(xlsxFillHelper.tryCreateTag({ patternFill: { patternType: 'none' } }));
    }

    registerCellFormat(cellFormat) {
        let result;
        const cellFormatTag = xlsxCellFormatHelper.tryCreateTag(
            cellFormat,
            {
                registerFill: this.registerFill.bind(this),
                registerFont: this.registerFont.bind(this),
                registerNumberFormat: this.registerNumberFormat.bind(this)
            });
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
        // §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const cellFormatTagsAsXmlStringsArray = this._cellFormatTags.map(tag => xlsxCellFormatHelper.toXml(tag));
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
        // §18.8.21, 'fills (Fills)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const tagsAsXmlStringsArray = this._fillTags.map(tag => xlsxFillHelper.toXml(tag));
        return xlsxTagHelper.toXml("fills", { count: tagsAsXmlStringsArray.length }, tagsAsXmlStringsArray.join(""));
    }

    registerFont(font) {
        let result;
        const fontTag = xlsxFontHelper.tryCreateTag(font);
        if(typeUtils.isDefined(fontTag)) {
            for(let i = 0; i < this._fontTags.length; i++) {
                if(xlsxFontHelper.areEqual(this._fontTags[i], fontTag)) {
                    result = i;
                    break;
                }
            }
            if(result === undefined) {
                result = this._fontTags.push(fontTag) - 1;
            }
        }
        return result;
    }

    generateFontsXml() {
        // §18.8.23, 'fonts (Fonts)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const xmlStringsArray = this._fontTags.map(tag => xlsxFontHelper.toXml(tag));
        return xlsxTagHelper.toXml("fonts", { count: xmlStringsArray.length }, xmlStringsArray.join(""));
    }

    _convertNumberFormatIndexToId(index) {
        // Number format ids less than 164 (magic const) represent builtin formats.
        // §18.8.30 numFmt (Number Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const CUSTOM_FORMAT_ID_START_VALUE = 165;
        return CUSTOM_FORMAT_ID_START_VALUE + index;
    }

    registerNumberFormat(numberFormat) {
        let result;
        const tag = xlsxNumberFormatHelper.tryCreateTag(numberFormat);
        if(typeUtils.isDefined(tag)) {
            for(let i = 0; i < this._numberFormatTags.length; i++) {
                if(xlsxNumberFormatHelper.areEqual(this._numberFormatTags[i], tag)) {
                    result = this._numberFormatTags[i][xlsxNumberFormatHelper.ID_PROPERTY_NAME];
                    break;
                }
            }
            if(result === undefined) {
                tag[xlsxNumberFormatHelper.ID_PROPERTY_NAME] = this._convertNumberFormatIndexToId(this._numberFormatTags.length);
                result = tag[xlsxNumberFormatHelper.ID_PROPERTY_NAME];
                this._numberFormatTags.push(tag);
            }
        }

        return result;
    }

    generateNumberFormatsXml() {
        if(this._numberFormatTags.length > 0) {
            // §18.8.31 numFmts (Number Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
            const xmlStringsArray = this._numberFormatTags.map((tag, index) => {
                return xlsxNumberFormatHelper.toXml(tag, attributes => attributes['numFmtId'] = this._convertNumberFormatIndexToId(index));
            });
            return xlsxTagHelper.toXml("numFmts", { count: xmlStringsArray.length }, xmlStringsArray.join(""));
        } else {
            return '';
        }
    }
}

module.exports = XlsxFile;

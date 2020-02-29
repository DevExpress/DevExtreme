import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';
import cellFormatHelper from './excel.cell_format_helper';
import fillHelper from './excel.fill_helper';
import fontHelper from './excel.font_helper';
import numberFormatHelper from './excel.number_format_helper';

export default class ExcelFile {

    constructor() {
        this._cellFormatTags = [];
        this._fillTags = [];
        this._fontTags = [];
        this._numberFormatTags = [];

        // the [0, 1] indexes are reserved:
        // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
        // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
        this._fillTags.push(fillHelper.tryCreateTag({ patternFill: { patternType: 'none' } }));
    }

    registerCellFormat(cellFormat) {
        let result;
        const cellFormatTag = cellFormatHelper.tryCreateTag(
            cellFormat,
            {
                registerFill: this.registerFill.bind(this),
                registerFont: this.registerFont.bind(this),
                registerNumberFormat: this.registerNumberFormat.bind(this)
            });
        if(isDefined(cellFormatTag)) {
            for(let i = 0; i < this._cellFormatTags.length; i++) {
                if(cellFormatHelper.areEqual(this._cellFormatTags[i], cellFormatTag)) {
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

    static copyCellFormat(source) {
        return cellFormatHelper.copy(source);
    }

    generateCellFormatsXml() {
        // §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const cellFormatTagsAsXmlStringsArray = this._cellFormatTags.map(tag => cellFormatHelper.toXml(tag));
        return tagHelper.toXml('cellXfs', { count: cellFormatTagsAsXmlStringsArray.length }, cellFormatTagsAsXmlStringsArray.join(''));
    }

    registerFill(fill) {
        let result;
        const fillTag = fillHelper.tryCreateTag(fill);
        if(isDefined(fillTag)) {
            for(let i = 0; i < this._fillTags.length; i++) {
                if(fillHelper.areEqual(this._fillTags[i], fillTag)) {
                    result = i;
                    break;
                }
            }
            if(result === undefined) {
                if(this._fillTags.length < 2) {
                    // the [0, 1] indexes are reserved:
                    // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
                    // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
                    this._fillTags.push(fillHelper.tryCreateTag({ patternFill: { patternType: 'Gray125' } })); // Index 1 - reserved
                }
                result = this._fillTags.push(fillTag) - 1;
            }
        }
        return result;
    }

    generateFillsXml() {
        // §18.8.21, 'fills (Fills)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const tagsAsXmlStringsArray = this._fillTags.map(tag => fillHelper.toXml(tag));
        return tagHelper.toXml('fills', { count: tagsAsXmlStringsArray.length }, tagsAsXmlStringsArray.join(''));
    }

    registerFont(font) {
        let result;
        const fontTag = fontHelper.tryCreateTag(font);
        if(isDefined(fontTag)) {
            for(let i = 0; i < this._fontTags.length; i++) {
                if(fontHelper.areEqual(this._fontTags[i], fontTag)) {
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
        const xmlStringsArray = this._fontTags.map(tag => fontHelper.toXml(tag));
        return tagHelper.toXml('fonts', { count: xmlStringsArray.length }, xmlStringsArray.join(''));
    }

    _convertNumberFormatIndexToId(index) {
        // Number format ids less than 164 (magic const) represent builtin formats.
        // §18.8.30 numFmt (Number Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
        const CUSTOM_FORMAT_ID_START_VALUE = 165;
        return CUSTOM_FORMAT_ID_START_VALUE + index;
    }

    registerNumberFormat(numberFormat) {
        let result;
        const tag = numberFormatHelper.tryCreateTag(numberFormat);
        if(isDefined(tag)) {
            for(let i = 0; i < this._numberFormatTags.length; i++) {
                if(numberFormatHelper.areEqual(this._numberFormatTags[i], tag)) {
                    result = this._numberFormatTags[i][numberFormatHelper.ID_PROPERTY_NAME];
                    break;
                }
            }
            if(result === undefined) {
                tag[numberFormatHelper.ID_PROPERTY_NAME] = this._convertNumberFormatIndexToId(this._numberFormatTags.length);
                result = tag[numberFormatHelper.ID_PROPERTY_NAME];
                this._numberFormatTags.push(tag);
            }
        }

        return result;
    }

    generateNumberFormatsXml() {
        if(this._numberFormatTags.length > 0) {
            // §18.8.31 numFmts (Number Formats)
            const xmlStringsArray = this._numberFormatTags.map((tag) => numberFormatHelper.toXml(tag));
            return tagHelper.toXml('numFmts', { count: xmlStringsArray.length }, xmlStringsArray.join(''));
        } else {
            return '';
        }
    }
}

module.exports = ExcelFile;

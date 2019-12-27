import Class from '../core/class';
import { getWindow } from '../core/utils/window';
import { isDefined, isString, isDate, isBoolean, isObject, isFunction } from '../core/utils/type';
import { extend } from '../core/utils/extend';
import errors from '../ui/widget/ui.errors';
import stringUtils from '../core/utils/string';
import JSZip from 'jszip';
import fileSaver from './file_saver';
import excelFormatConverter from './excel_format_converter';
import ExcelFile from './excel/excel.file';
import { Deferred } from '../core/utils/deferred';

const XML_TAG = '<?xml version="1.0" encoding="utf-8"?>';
const GROUP_SHEET_PR_XML = '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>';
const SINGLE_SHEET_PR_XML = '<sheetPr/>';
const BASE_STYLE_XML2 = '<borders count="1"><border><left style="thin"><color rgb="FFD3D3D3"/></left><right style="thin">' +
                     '<color rgb="FFD3D3D3"/></right><top style="thin"><color rgb="FFD3D3D3"/></top><bottom style="thin"><color rgb="FFD3D3D3"/>' +
                     '</bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
const OPEN_XML_FORMAT_URL = 'http://schemas.openxmlformats.org';
const RELATIONSHIP_PART_NAME = 'rels';
const XL_FOLDER_NAME = 'xl';
const WORKBOOK_FILE_NAME = 'workbook.xml';
const CONTENTTYPES_FILE_NAME = '[Content_Types].xml';
const SHAREDSTRING_FILE_NAME = 'sharedStrings.xml';
const STYLE_FILE_NAME = 'styles.xml';
const WORKSHEETS_FOLDER = 'worksheets';
const WORKSHEET_FILE_NAME = 'sheet1.xml';
const WORKSHEET_HEADER_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
        'mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">';
const VALID_TYPES = {
    // §18.18.11, ST_CellType (Cell Type)
    'boolean': 'b',
    'date': 'd',
    'number': 'n',
    'string': 's'
};
const EXCEL_START_TIME = Date.UTC(1899, 11, 30);
const DAYS_COUNT_BEFORE_29_FEB_1900 = 60;

const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size
const UNSUPPORTED_FORMAT_MAPPING = {
    quarter: 'shortDate',
    quarterAndYear: 'shortDate',
    minute: 'longTime',
    millisecond: 'longTime'
};

const ExcelCreator = Class.inherit({
    _getXMLTag: function(tagName, attributes, content) {
        let result = '<' + tagName;
        let i;
        const length = attributes.length;
        let attr;

        for(i = 0; i < length; i++) {
            attr = attributes[i];
            if(attr.value !== undefined) {
                result = result + ' ' + attr.name + '="' + attr.value + '"';
            }
        }

        return isDefined(content) ? result + '>' + content + '</' + tagName + '>' : result + ' />';
    },

    _convertToExcelCellRef: function(zeroBasedRowIndex, zeroBasedCellIndex) {
        // pass (0, 0) to get 'A1'
        let columnName = '';
        const max = 26;
        let charCode;
        let isCellIndexFound;

        while(!isCellIndexFound) {
            charCode = 65 + ((zeroBasedCellIndex >= max) ? (zeroBasedCellIndex % max) : Math.ceil(zeroBasedCellIndex));
            columnName = String.fromCharCode(charCode) + columnName;

            if(zeroBasedCellIndex >= max) {
                zeroBasedCellIndex = Math.floor(zeroBasedCellIndex / max) - 1;
            } else {
                isCellIndexFound = true;
            }
        }

        return columnName + (zeroBasedRowIndex + 1);
    },

    _convertToExcelCellRefAndTrackMaxIndex: function(rowIndex, cellIndex) {
        if(this._maxRowIndex < Number(rowIndex)) {
            this._maxRowIndex = Number(rowIndex);
        }

        if(this._maxColumnIndex < Number(cellIndex)) {
            this._maxColumnIndex = Number(cellIndex);
        }

        return this._convertToExcelCellRef(rowIndex, cellIndex);
    },

    _getDataType: function(dataType) {
        return VALID_TYPES[dataType] || VALID_TYPES.string;
    },

    _tryGetExcelCellDataType: function(object) {
        if(isDefined(object)) {
            if((typeof object === 'number')) {
                if(isFinite(object)) {
                    return VALID_TYPES['number'];
                } else {
                    return VALID_TYPES['string'];
                }
            } else if(isString(object)) {
                return VALID_TYPES['string'];
            } else if(isDate(object)) {
                return VALID_TYPES['number'];
            } else if(isBoolean(object)) {
                return VALID_TYPES['boolean'];
            }
        }
    },

    _formatObjectConverter: function(format, dataType) {
        const result = {
            format: format,
            precision: format && format.precision,
            dataType: dataType
        };

        if(isObject(format)) {
            return extend(result, format, {
                format: format.formatter || format.type,
                currency: format.currency
            });
        }

        return result;
    },
    _tryConvertToExcelNumberFormat: function(format, dataType) {
        let currency;
        const newFormat = this._formatObjectConverter(format, dataType);

        format = newFormat.format;
        currency = newFormat.currency;
        dataType = newFormat.dataType;

        if(isDefined(format) && dataType === 'date') {
            format = UNSUPPORTED_FORMAT_MAPPING[format && format.type || format] || format;
        }

        return excelFormatConverter.convertFormat(format, newFormat.precision, dataType, currency);
    },

    _appendString: function(value) {
        if(isDefined(value)) {
            value = String(value);
            if(value.length) {
                value = stringUtils.encodeHtml(value);
                if(this._stringHash[value] === undefined) {
                    this._stringHash[value] = this._stringArray.length;
                    this._stringArray.push(value);
                }
                return this._stringHash[value];
            }
        }
    },

    _tryGetExcelDateValue: function(date) {
        let days;
        let totalTime;

        if(isDate(date)) {
            days = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - EXCEL_START_TIME) / (1000 * 60 * 60 * 24));
            if(days < DAYS_COUNT_BEFORE_29_FEB_1900) {
                days--;
            }

            totalTime = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / (24 * 3600);
            return days + totalTime;
        }
    },

    _prepareValue: function(rowIndex, cellIndex) {
        const dataProvider = this._dataProvider;
        let { value, cellSourceData } = dataProvider.getCellData(rowIndex, cellIndex) || {};
        let sourceValue;
        let type = this._getDataType(dataProvider.getCellType(rowIndex, cellIndex));

        if(type === VALID_TYPES.date && !isDate(value)) {
            type = VALID_TYPES.string;
        }

        switch(type) {
            case VALID_TYPES.string:
                sourceValue = value;
                value = this._appendString(value);
                break;

            case VALID_TYPES.date:
                sourceValue = value;
                value = this._tryGetExcelDateValue(value);
                type = VALID_TYPES.number;
                break;
        }

        return {
            value: value,
            type: type,
            sourceValue,
            cellSourceData: cellSourceData
        };
    },

    _callCustomizeExcelCell: function({ dataProvider, value, style, sourceData }) {
        const styleCopy = ExcelFile.copyCellFormat(style);

        const args = {
            value: value,
            numberFormat: styleCopy.numberFormat,
            clearStyle: function() {
                this.horizontalAlignment = null;
                this.verticalAlignment = null;
                this.wrapTextEnabled = null;
                this.font = null;
                this.numberFormat = null;
            }
        };

        if(isDefined(styleCopy)) {
            if(isDefined(styleCopy.alignment)) {
                args.horizontalAlignment = styleCopy.alignment.horizontal;
                args.verticalAlignment = styleCopy.alignment.vertical;
                args.wrapTextEnabled = styleCopy.alignment.wrapText;
            }
            args.backgroundColor = styleCopy.backgroundColor;
            args.fillPatternType = styleCopy.fillPatternType;
            args.fillPatternColor = styleCopy.fillPatternColor;
            args.font = styleCopy.font;
        }

        dataProvider.customizeExcelCell(args, sourceData);

        const newStyle = styleCopy || {};

        newStyle.font = args.font;

        newStyle.alignment = newStyle.alignment || {};
        newStyle.alignment.horizontal = args.horizontalAlignment;
        newStyle.alignment.vertical = args.verticalAlignment;
        newStyle.alignment.wrapText = args.wrapTextEnabled;

        newStyle.backgroundColor = args.backgroundColor;
        newStyle.fillPatternType = args.fillPatternType;
        newStyle.fillPatternColor = args.fillPatternColor;

        newStyle.numberFormat = args.numberFormat;

        return {
            value: args.value,
            style: newStyle,
        };
    },

    _getDataArray: function() {
        const that = this;
        let rowIndex;
        let cellIndex;
        let cellsArray;
        let cellData;
        const result = [];
        const dataProvider = that._dataProvider;
        const rowsLength = dataProvider.getRowsCount();
        const columns = dataProvider.getColumns();
        let cellsLength;

        for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            cellsArray = [];
            cellsLength = columns.length;

            for(cellIndex = 0; cellIndex !== cellsLength; cellIndex++) {
                cellData = that._prepareValue(rowIndex, cellIndex);
                const styleArrayIndex = dataProvider.getStyleId(rowIndex, cellIndex);
                let cellStyleId = this._styleArrayIndexToCellStyleIdMap[styleArrayIndex];
                if(dataProvider.hasCustomizeExcelCell && dataProvider.hasCustomizeExcelCell()) {
                    const value = cellData.sourceValue || cellData.value;
                    const modifiedExcelCell = this._callCustomizeExcelCell({
                        dataProvider: dataProvider,
                        value: value,
                        style: that._styleArray[styleArrayIndex],
                        sourceData: cellData.cellSourceData,
                    });

                    if(modifiedExcelCell.value !== value) {
                        if(typeof modifiedExcelCell.value !== typeof value || (typeof modifiedExcelCell.value === 'number') && !isFinite(modifiedExcelCell.value)) {
                            const cellDataType = this._tryGetExcelCellDataType(modifiedExcelCell.value);
                            if(isDefined(cellDataType)) {
                                cellData.type = cellDataType;
                            }
                        }
                        // 18.18.11 ST_CellType (Cell Type)
                        switch(cellData.type) {
                            case VALID_TYPES.string:
                                cellData.value = this._appendString(modifiedExcelCell.value);
                                break;
                            case VALID_TYPES.date:
                                cellData.value = modifiedExcelCell.value;
                                break;
                            case VALID_TYPES.number: {
                                let newValue = modifiedExcelCell.value;
                                const excelDateValue = this._tryGetExcelDateValue(newValue);
                                if(isDefined(excelDateValue)) {
                                    newValue = excelDateValue;
                                }
                                cellData.value = newValue;
                                break;
                            }
                            default:
                                cellData.value = modifiedExcelCell.value;
                        }
                    }
                    cellStyleId = this._excelFile.registerCellFormat(modifiedExcelCell.style);
                }
                cellsArray.push({
                    style: cellStyleId,
                    value: cellData.value,
                    type: cellData.type
                });
            }

            if(!that._needSheetPr && dataProvider.getGroupLevel(rowIndex) > 0) {
                that._needSheetPr = true;
            }

            result.push(cellsArray);
        }

        return result;
    },

    _calculateWidth: function(pixelsWidth) {
        pixelsWidth = parseInt(pixelsWidth, 10);
        if(!pixelsWidth || pixelsWidth < 5) pixelsWidth = 100;
        return Math.min(255, Math.floor((pixelsWidth - 5) / MAX_DIGIT_WIDTH_IN_PIXELS * 100 + 0.5) / 100);
    },

    _prepareStyleData: function() {
        const that = this;
        const styles = that._dataProvider.getStyles();

        that._dataProvider.getColumns().forEach(function(column) {
            that._colsArray.push(that._calculateWidth(column.width));
        });

        const fonts = [
            { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor', bold: false },
            { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor', bold: true }
        ];
        this._excelFile.registerFont(fonts[0]);
        this._excelFile.registerFont(fonts[1]);

        styles.forEach(function(style) {
            let numberFormat = that._tryConvertToExcelNumberFormat(style.format, style.dataType);
            if(!isDefined(numberFormat)) {
                numberFormat = 0;
            }
            that._styleArray.push({
                font: fonts[Number(!!style.bold)],
                numberFormat,
                alignment: {
                    vertical: 'top',
                    wrapText: !!style.wrapText,
                    horizontal: style.alignment || 'left'
                }
            });
        });
        that._styleArrayIndexToCellStyleIdMap = that._styleArray.map(item => this._excelFile.registerCellFormat(item));
    },

    _prepareCellData: function() {
        this._cellsArray = this._getDataArray();
    },

    _createXMLRelationships: function(xmlRelationships) {
        return this._getXMLTag('Relationships', [{
            name: 'xmlns',
            value: OPEN_XML_FORMAT_URL + '/package/2006/relationships'
        }], xmlRelationships);
    },

    _createXMLRelationship: function(id, type, target) {
        return this._getXMLTag('Relationship', [
            { name: 'Id', value: 'rId' + id },
            { name: 'Type', value: OPEN_XML_FORMAT_URL + '/officeDocument/2006/relationships/' + type },
            { name: 'Target', value: target }
        ]);
    },

    _getWorkbookContent: function() {
        const content = '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="0" windowHeight="0"/>' +
                      '</bookViews><sheets><sheet name="Sheet" sheetId="1" r:id="rId1" /></sheets><definedNames>' +
                      '<definedName name="_xlnm.Print_Titles" localSheetId="0">Sheet!$1:$1</definedName>' +
                      '<definedName name="_xlnm._FilterDatabase" hidden="0" localSheetId="0">Sheet!$A$1:$F$6332</definedName></definedNames>';
        return XML_TAG + this._getXMLTag('workbook', [{
            name: 'xmlns:r',
            value: OPEN_XML_FORMAT_URL + '/officeDocument/2006/relationships'
        }, {
            name: 'xmlns',
            value: OPEN_XML_FORMAT_URL + '/spreadsheetml/2006/main'
        }], content);
    },

    _getContentTypesContent: function() {
        return XML_TAG + '<Types xmlns="' + OPEN_XML_FORMAT_URL + '/package/2006/content-types"><Default Extension="rels" ' +
                         'ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="xml" ' +
                         'ContentType="application/xml" /><Override PartName="/xl/worksheets/sheet1.xml" ' +
                         'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />' +
                         '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />' +
                         '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" />' +
                         '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /></Types>';
    },

    _generateStylesXML: function() {
        const that = this;
        const folder = that._zip.folder(XL_FOLDER_NAME);
        let XML = '';

        XML = XML + this._excelFile.generateNumberFormatsXml();
        XML = XML + this._excelFile.generateFontsXml();
        XML = XML + this._excelFile.generateFillsXml();
        XML = XML + BASE_STYLE_XML2;

        XML = XML + this._excelFile.generateCellFormatsXml();

        XML = XML + that._getXMLTag('cellStyles', [{ name: 'count', value: 1 }], that._getXMLTag('cellStyle', [
            { name: 'name', value: 'Normal' },
            { name: 'xfId', value: 0 },
            { name: 'builtinId', value: 0 }
        ]));

        XML = XML_TAG + that._getXMLTag('styleSheet', [{ name: 'xmlns', value: OPEN_XML_FORMAT_URL + '/spreadsheetml/2006/main' }], XML);
        folder.file(STYLE_FILE_NAME, XML);

        that._styleArray = [];
    },

    _generateStringsXML: function() {
        const folder = this._zip.folder(XL_FOLDER_NAME);
        let stringIndex;
        const stringsLength = this._stringArray.length;
        let sharedStringXml = XML_TAG;

        for(stringIndex = 0; stringIndex < stringsLength; stringIndex++) {
            this._stringArray[stringIndex] = this._getXMLTag('si', [], this._getXMLTag('t', [], this._stringArray[stringIndex]));
        }
        sharedStringXml = sharedStringXml + this._getXMLTag('sst', [
            { name: 'xmlns', value: OPEN_XML_FORMAT_URL + '/spreadsheetml/2006/main' },
            { name: 'count', value: this._stringArray.length },
            { name: 'uniqueCount', value: this._stringArray.length }
        ], this._stringArray.join(''));

        folder.file(SHAREDSTRING_FILE_NAME, sharedStringXml);

        this._stringArray = [];
    },

    _getPaneXML: function() {
        const attributes = [{ name: 'activePane', value: 'bottomLeft' }, { name: 'state', value: 'frozen' }];
        const frozenArea = this._dataProvider.getFrozenArea();

        if(!(frozenArea.x || frozenArea.y)) return '';

        if(frozenArea.x) {
            attributes.push({ name: 'xSplit', value: frozenArea.x });
        }
        if(frozenArea.y) {
            attributes.push({ name: 'ySplit', value: frozenArea.y });
        }

        attributes.push({ name: 'topLeftCell', value: this._convertToExcelCellRefAndTrackMaxIndex(frozenArea.y, frozenArea.x) });

        return this._getXMLTag('pane', attributes);
    },

    _getAutoFilterXML: function(maxCellIndex) {
        if(this._options.autoFilterEnabled) {
            // 18.3.1.2 autoFilter (AutoFilter Settings)
            return '<autoFilter ref="A' + this._dataProvider.getHeaderRowCount() + ':' + maxCellIndex + '" />';
        }

        return '';
    },

    _getIgnoredErrorsXML: function(maxCellIndex) {
        if(this._options.ignoreErrors) {
            return '<ignoredErrors><ignoredError sqref="A1:' + maxCellIndex + '" numberStoredAsText="1" /></ignoredErrors>';
        }

        return '';
    },

    _generateWorksheetXML: function() {
        let colIndex;
        let rowIndex;
        let cellData;
        let xmlCells;
        let rightBottomCellRef;
        let xmlRows = [];
        const rowsLength = this._cellsArray.length;
        let cellsLength;
        const colsLength = this._colsArray.length;
        const rSpans = '1:' + colsLength;
        const headerRowCount = this._dataProvider.getHeaderRowCount ? this._dataProvider.getHeaderRowCount() : 1;
        let xmlResult = [WORKSHEET_HEADER_XML];

        xmlResult.push((this._needSheetPr) ? GROUP_SHEET_PR_XML : SINGLE_SHEET_PR_XML);
        xmlResult.push('<dimension ref="A1:C1"/>'); // 18.3.1.35 dimension (Worksheet Dimensions)
        xmlResult.push('<sheetViews><sheetView ');
        xmlResult.push(this._rtlEnabled ? 'rightToLeft="1" ' : '');
        xmlResult.push('tabSelected="1" workbookViewId="0">');
        xmlResult.push(this._getPaneXML());
        xmlResult.push('</sheetView></sheetViews>');
        xmlResult.push('<sheetFormatPr defaultRowHeight="15"');
        xmlResult.push(' outlineLevelRow="' + ((this._dataProvider.getRowsCount() > 0) ? this._dataProvider.getGroupLevel(0) : 0) + '"');
        xmlResult.push(' x14ac:dyDescent="0.25"/>');

        for(colIndex = 0; colIndex < colsLength; colIndex++) {
            this._colsArray[colIndex] = this._getXMLTag('col', [
                { name: 'width', value: this._colsArray[colIndex] },
                { name: 'min', value: Number(colIndex) + 1 },
                { name: 'max', value: Number(colIndex) + 1 }
            ]);
        }

        xmlResult.push(this._getXMLTag('cols', [], this._colsArray.join('')) + '<sheetData>');

        for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            xmlCells = [];
            cellsLength = this._cellsArray[rowIndex].length;

            for(colIndex = 0; colIndex < cellsLength; colIndex++) {
                rowIndex = Number(rowIndex);
                cellData = this._cellsArray[rowIndex][colIndex];

                xmlCells.push(this._getXMLTag('c', [ // 18.3.1.4 c (Cell)
                    { name: 'r', value: this._convertToExcelCellRefAndTrackMaxIndex(rowIndex, colIndex) },
                    { name: 's', value: cellData.style },
                    { name: 't', value: cellData.type } // 18.18.11 ST_CellType (Cell Type)
                ], (isDefined(cellData.value)) ? this._getXMLTag('v', [], cellData.value) : null));
            }
            xmlRows.push(this._getXMLTag('row', [
                { name: 'r', value: Number(rowIndex) + 1 },
                { name: 'spans', value: rSpans },
                {
                    name: 'outlineLevel',
                    value: (rowIndex >= headerRowCount) ? this._dataProvider.getGroupLevel(rowIndex) : 0
                },
                { name: 'x14ac:dyDescent', value: '0.25' }
            ], xmlCells.join('')));

            this._cellsArray[rowIndex] = null;
            if(xmlRows.length > 10000) {
                xmlResult.push(xmlRows.join(''));
                xmlRows = [];
            }
        }

        xmlResult.push(xmlRows.join(''));
        xmlRows = [];

        rightBottomCellRef = this._convertToExcelCellRef(this._maxRowIndex, this._maxColumnIndex);
        xmlResult.push(
            '</sheetData>' +
            this._getAutoFilterXML(rightBottomCellRef) +
            this._generateMergingXML() +
            this._getIgnoredErrorsXML(rightBottomCellRef) +
            '</worksheet>');

        this._zip.folder(XL_FOLDER_NAME).folder(WORKSHEETS_FOLDER).file(WORKSHEET_FILE_NAME, xmlResult.join(''));

        this._colsArray = [];
        this._cellsArray = [];
        xmlResult = [];
    },

    _generateMergingXML: function() {
        let k;
        let l;
        let cellIndex;
        let rowIndex;
        const rowsLength = isDefined(this._dataProvider.getHeaderRowCount) ? this._dataProvider.getHeaderRowCount() : this._dataProvider.getRowsCount();
        const columnsLength = this._dataProvider.getColumns().length;
        const usedArea = [];
        const mergeArray = [];
        let mergeArrayLength;
        let mergeIndex;
        let mergeXML = '';

        for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            for(cellIndex = 0; cellIndex !== columnsLength; cellIndex++) {
                if(!isDefined(usedArea[rowIndex]) || !isDefined(usedArea[rowIndex][cellIndex])) {
                    const cellMerge = this._dataProvider.getCellMerging(rowIndex, cellIndex);
                    if(cellMerge.colspan || cellMerge.rowspan) {
                        mergeArray.push({
                            start: this._convertToExcelCellRefAndTrackMaxIndex(rowIndex, cellIndex),
                            end: this._convertToExcelCellRefAndTrackMaxIndex(rowIndex + (cellMerge.rowspan || 0), cellIndex + (cellMerge.colspan || 0))
                        });
                        for(k = rowIndex; k <= rowIndex + cellMerge.rowspan || 0; k++) {
                            for(l = cellIndex; l <= cellIndex + cellMerge.colspan || 0; l++) {
                                if(!isDefined(usedArea[k])) {
                                    usedArea[k] = [];
                                }
                                usedArea[k][l] = true;
                            }
                        }
                    }
                }
            }
        }

        mergeArrayLength = mergeArray.length;
        for(mergeIndex = 0; mergeIndex < mergeArrayLength; mergeIndex++) {
            mergeXML = mergeXML + this._getXMLTag('mergeCell', [{ name: 'ref', value: mergeArray[mergeIndex].start + ':' + mergeArray[mergeIndex].end }]);
        }

        return mergeXML.length ? this._getXMLTag('mergeCells', [{ name: 'count', value: mergeArrayLength }], mergeXML) : '';
    },

    _generateCommonXML: function() {
        const relsFileContent = XML_TAG + this._createXMLRelationships(this._createXMLRelationship(1, 'officeDocument', 'xl/' + WORKBOOK_FILE_NAME));
        let xmlRelationships;
        const folder = this._zip.folder(XL_FOLDER_NAME);
        let relsXML = XML_TAG;

        this._zip.folder('_' + RELATIONSHIP_PART_NAME).file('.' + RELATIONSHIP_PART_NAME, relsFileContent);
        xmlRelationships = this._createXMLRelationship(1, 'worksheet', 'worksheets/' + WORKSHEET_FILE_NAME) + this._createXMLRelationship(2, 'styles', STYLE_FILE_NAME) + this._createXMLRelationship(3, 'sharedStrings', SHAREDSTRING_FILE_NAME);
        relsXML = relsXML + this._createXMLRelationships(xmlRelationships);

        folder.folder('_' + RELATIONSHIP_PART_NAME).file(WORKBOOK_FILE_NAME + '.rels', relsXML);
        folder.file(WORKBOOK_FILE_NAME, this._getWorkbookContent());

        this._zip.file(CONTENTTYPES_FILE_NAME, this._getContentTypesContent());
    },

    _generateContent: function() {
        this._prepareStyleData();
        this._prepareCellData();
        this._generateWorkXML();
        this._generateCommonXML();
    },

    _generateWorkXML: function() {
        this._generateStylesXML();
        this._generateStringsXML();
        this._generateWorksheetXML();
    },

    ctor: function(dataProvider, options) {
        this._rtlEnabled = options && !!options.rtlEnabled;
        this._options = options;
        this._maxRowIndex = 0;
        this._maxColumnIndex = 0;
        this._stringArray = [];
        this._stringHash = {};
        this._styleArray = [];
        this._colsArray = [];
        this._cellsArray = [];
        this._needSheetPr = false;
        this._dataProvider = dataProvider;
        this._excelFile = new ExcelFile();

        if(isDefined(ExcelCreator.JSZip)) {
            this._zip = new ExcelCreator.JSZip();
        } else {
            this._zip = null;
        }
    },

    _checkZipState: function() {
        if(!this._zip) {
            throw errors.Error('E1041', 'JSZip');
        }
    },

    ready: function() {
        return this._dataProvider.ready();
    },

    getData: function(isBlob) {
        const options = {
            type: isBlob ? 'blob' : 'base64',
            compression: 'DEFLATE',
            mimeType: fileSaver.MIME_TYPES['EXCEL']
        };
        const deferred = new Deferred();

        this._checkZipState();
        this._generateContent();

        if(this._zip.generateAsync) {
            this._zip.generateAsync(options).then(deferred.resolve);
        } else {
            deferred.resolve(this._zip.generate(options));
        }
        return deferred;
    }
});

ExcelCreator.JSZip = JSZip;

exports.ExcelCreator = ExcelCreator;

exports.getData = function(data, options) {
    // TODO: Looks like there is no need to export ExcelCreator any more?
    const excelCreator = new exports.ExcelCreator(data, options);

    excelCreator._checkZipState();

    return excelCreator.ready().then(() => excelCreator.getData(isFunction(getWindow().Blob)));
};

///#DEBUG
exports.__internals = {
    CONTENTTYPES_FILE_NAME: CONTENTTYPES_FILE_NAME,
    RELATIONSHIP_PART_NAME: RELATIONSHIP_PART_NAME,
    XL_FOLDER_NAME: XL_FOLDER_NAME,
    WORKBOOK_FILE_NAME: WORKBOOK_FILE_NAME,
    STYLE_FILE_NAME: STYLE_FILE_NAME,
    WORKSHEET_FILE_NAME: WORKSHEET_FILE_NAME,
    WORKSHEETS_FOLDER: WORKSHEETS_FOLDER,
    WORKSHEET_HEADER_XML: WORKSHEET_HEADER_XML,
    SHAREDSTRING_FILE_NAME: SHAREDSTRING_FILE_NAME,
    GROUP_SHEET_PR_XML: GROUP_SHEET_PR_XML,
    SINGLE_SHEET_PR_XML: SINGLE_SHEET_PR_XML,
    BASE_STYLE_XML2: BASE_STYLE_XML2,
    XML_TAG: XML_TAG
};
///#ENDDEBUG

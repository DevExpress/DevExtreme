var Class = require("../core/class"),
    window = require("../core/utils/window").getWindow(),
    typeUtils = require("../core/utils/type"),
    extend = require("../core/utils/extend").extend,
    errors = require("../ui/widget/ui.errors"),
    stringUtils = require("../core/utils/string"),
    JSZip = require("jszip"),
    fileSaver = require("./file_saver"),
    excelFormatConverter = require("./excel_format_converter"),
    XlsxFile = require("./xlsx/xlsx_file"),
    isDefined = typeUtils.isDefined,
    XML_TAG = "<?xml version=\"1.0\" encoding=\"utf-8\"?>",
    GROUP_SHEET_PR_XML = "<sheetPr><outlinePr summaryBelow=\"0\"/></sheetPr>",
    SINGLE_SHEET_PR_XML = "<sheetPr/>",
    BASE_STYLE_XML2 = "<borders count=\"1\"><border><left style=\"thin\"><color rgb=\"FFD3D3D3\"/></left><right style=\"thin\">" +
                     "<color rgb=\"FFD3D3D3\"/></right><top style=\"thin\"><color rgb=\"FFD3D3D3\"/></top><bottom style=\"thin\"><color rgb=\"FFD3D3D3\"/>" +
                     "</bottom></border></borders><cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>",
    OPEN_XML_FORMAT_URL = "http://schemas.openxmlformats.org",
    RELATIONSHIP_PART_NAME = "rels",
    XL_FOLDER_NAME = "xl",
    WORKBOOK_FILE_NAME = "workbook.xml",
    CONTENTTYPES_FILE_NAME = "[Content_Types].xml",
    SHAREDSTRING_FILE_NAME = "sharedStrings.xml",
    STYLE_FILE_NAME = "styles.xml",
    WORKSHEETS_FOLDER = "worksheets",
    WORKSHEET_FILE_NAME = "sheet1.xml",
    WORKSHEET_HEADER_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
        'mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">',
    VALID_TYPES = {
        // §18.18.11, ST_CellType (Cell Type)
        "boolean": "b",
        "date": "d",
        "number": "n",
        "string": "s"
    },
    EXCEL_START_TIME = Date.UTC(1899, 11, 30),
    DAYS_COUNT_BEFORE_29_FEB_1900 = 60,

    MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

var ExcelCreator = Class.inherit({
    _getXMLTag: function(tagName, attributes, content) {
        var result = "<" + tagName,
            i,
            length = attributes.length,
            attr;

        for(i = 0; i < length; i++) {
            attr = attributes[i];
            if(attr.value !== undefined) {
                result = result + " " + attr.name + "=\"" + attr.value + "\"";
            }
        }

        return typeUtils.isDefined(content) ? result + ">" + content + "</" + tagName + ">" : result + " />";
    },

    _getCellIndex: function(rowIndex, cellIndex) {
        var sheetIndex = '',
            max = 26,
            charCode;

        if(this._maxIndex[0] < Number(rowIndex)) {
            this._maxIndex[0] = Number(rowIndex);
        }

        if(this._maxIndex[1] < Number(cellIndex)) {
            this._maxIndex[1] = Number(cellIndex);
        }

        while(true) {
            charCode = 65 + ((cellIndex >= max) ? (cellIndex % max) : Math.ceil(cellIndex));
            sheetIndex = String.fromCharCode(charCode) + sheetIndex;

            if(cellIndex >= max) {
                cellIndex = Math.floor(cellIndex / max) - 1;
            } else {
                break;
            }
        }

        return sheetIndex + rowIndex;
    },

    _getDataType: function(dataType) {
        return VALID_TYPES[dataType] || "s";
    },

    _formatObjectConverter: function(format, dataType) {
        var result = {
            format: format,
            precision: format && format.precision,
            dataType: dataType
        };

        if(typeUtils.isObject(format)) {
            return extend(result, format, {
                format: format.formatter || format.type,
                currency: format.currency
            });
        }

        return result;
    },
    _tryConvertToXlsxNumberFormat: function(format, dataType) {
        var currency,
            newFormat = this._formatObjectConverter(format, dataType);

        format = newFormat.format;
        currency = newFormat.currency;
        dataType = newFormat.dataType;

        return excelFormatConverter.convertFormat(format, newFormat.precision, dataType, currency);
    },

    _appendString: function(value) {
        if(typeUtils.isDefined(value)) {
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
        var days,
            totalTime;

        if(typeUtils.isDate(date)) {
            days = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - EXCEL_START_TIME) / (1000 * 60 * 60 * 24));
            if(days < DAYS_COUNT_BEFORE_29_FEB_1900) {
                days--;
            }

            totalTime = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / (24 * 3600);
            return days + totalTime;
        }
    },

    _prepareValue: function(rowIndex, cellIndex) {
        var dataProvider = this._dataProvider,
            { value, cellSourceData } = dataProvider.getCellData(rowIndex, cellIndex) || {},
            sourceValue,
            type = this._getDataType(dataProvider.getCellType(rowIndex, cellIndex));

        if(type === "d" && !typeUtils.isDate(value)) {
            type = "s";
        }

        switch(type) {
            case "s":
                sourceValue = value;
                value = this._appendString(value);
                break;

            case "d":
                sourceValue = value;
                value = this._tryGetExcelDateValue(value);
                type = "n";
                break;
        }

        return {
            value: value,
            type: type,
            sourceValue,
            cellSourceData: cellSourceData
        };
    },

    _callCustomizeExcelCell: function({ dataProvider, value, dataType, style, sourceData }) {
        const styleCopy = XlsxFile.copyCellFormat(style);

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
            args.patternStyle = styleCopy.patternStyle;
            args.patternColor = styleCopy.patternColor;
            args.font = styleCopy.font;
        }

        dataProvider.customizeExcelCell(args, sourceData);

        let newStyle = styleCopy || {};

        newStyle.font = args.font;

        newStyle.alignment = newStyle.alignment || {};
        newStyle.alignment.horizontal = args.horizontalAlignment;
        newStyle.alignment.vertical = args.verticalAlignment;
        newStyle.alignment.wrapText = args.wrapTextEnabled;

        newStyle.backgroundColor = args.backgroundColor;
        newStyle.patternStyle = args.patternStyle;
        newStyle.patternColor = args.patternColor;

        newStyle.numberFormat = args.numberFormat;

        return {
            value: args.value,
            dataType: dataType,
            style: newStyle,
        };
    },

    _getDataArray: function() {
        var that = this,
            rowIndex,
            cellIndex,
            cellsArray,
            cellData,
            result = [],
            dataProvider = that._dataProvider,
            rowsLength = dataProvider.getRowsCount(),
            columns = dataProvider.getColumns(),
            cellsLength;

        for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            cellsArray = [];
            cellsLength = columns.length;

            for(cellIndex = 0; cellIndex !== cellsLength; cellIndex++) {
                cellData = that._prepareValue(rowIndex, cellIndex);
                let cellStyleId = this._styleIdToRegisteredStyleIdMap[dataProvider.getStyleId(rowIndex, cellIndex)];
                if(dataProvider.hasCustomizeExcelCell && dataProvider.hasCustomizeExcelCell()) {
                    const value = cellData.sourceValue || cellData.value;
                    const modifiedXlsxCell = this._callCustomizeExcelCell({
                        dataProvider: dataProvider,
                        value: value,
                        dataType: cellData.type,
                        style: that._styleArray[cellStyleId],
                        sourceData: cellData.cellSourceData,
                    });

                    cellData.type = modifiedXlsxCell.dataType;
                    if(modifiedXlsxCell.value !== value) {
                        // 18.18.11 ST_CellType (Cell Type)
                        switch(cellData.type) {
                            case 's':
                                cellData.value = this._appendString(modifiedXlsxCell.value);
                                break;
                            case 'd':
                                cellData.value = modifiedXlsxCell.value;
                                break;
                            case 'n':
                                let newValue = modifiedXlsxCell.value;
                                const excelDateValue = this._tryGetExcelDateValue(newValue);
                                if(typeUtils.isDefined(excelDateValue)) {
                                    newValue = excelDateValue;
                                }
                                cellData.value = newValue;
                                break;
                            default:
                                cellData.value = modifiedXlsxCell.value;
                        }
                    }
                    cellStyleId = this._xlsxFile.registerCellFormat(modifiedXlsxCell.style);
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
        var that = this,
            styles = that._dataProvider.getStyles();

        that._dataProvider.getColumns().forEach(function(column) {
            that._colsArray.push(that._calculateWidth(column.width));
        });

        const fonts = [
            { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor', bold: false },
            { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor', bold: true }
        ];
        this._xlsxFile.registerFont(fonts[0]);
        this._xlsxFile.registerFont(fonts[1]);

        styles.forEach(function(style) {
            let numberFormat = that._tryConvertToXlsxNumberFormat(style.format, style.dataType);
            if(!typeUtils.isDefined(numberFormat)) {
                numberFormat = 0;
            }
            that._styleArray.push({
                font: fonts[Number(!!style.bold)],
                numberFormat,
                alignment: {
                    vertical: "top",
                    wrapText: !!style.wrapText,
                    horizontal: style.alignment || "left"
                }
            });
        });
        that._styleIdToRegisteredStyleIdMap = that._styleArray.map(item => this._xlsxFile.registerCellFormat(item));
    },

    _prepareCellData: function() {
        this._cellsArray = this._getDataArray();
    },

    _createXMLRelationships: function(xmlRelationships) {
        return this._getXMLTag("Relationships", [{
            name: "xmlns",
            value: OPEN_XML_FORMAT_URL + "/package/2006/relationships"
        }], xmlRelationships);
    },

    _createXMLRelationship: function(id, type, target) {
        return this._getXMLTag("Relationship", [
            { name: "Id", value: "rId" + id },
            { name: "Type", value: OPEN_XML_FORMAT_URL + "/officeDocument/2006/relationships/" + type },
            { name: "Target", value: target }
        ]);
    },

    _getWorkbookContent: function() {
        var content = "<bookViews><workbookView xWindow=\"0\" yWindow=\"0\" windowWidth=\"0\" windowHeight=\"0\"/>" +
                      "</bookViews><sheets><sheet name=\"Sheet\" sheetId=\"1\" r:id=\"rId1\" /></sheets><definedNames>" +
                      "<definedName name=\"_xlnm.Print_Titles\" localSheetId=\"0\">Sheet!$1:$1</definedName>" +
                      "<definedName name=\"_xlnm._FilterDatabase\" hidden=\"0\" localSheetId=\"0\">Sheet!$A$1:$F$6332</definedName></definedNames>";
        return XML_TAG + this._getXMLTag("workbook", [{
            name: "xmlns:r",
            value: OPEN_XML_FORMAT_URL + "/officeDocument/2006/relationships"
        }, {
            name: "xmlns",
            value: OPEN_XML_FORMAT_URL + "/spreadsheetml/2006/main"
        }], content);
    },

    _getContentTypesContent: function() {
        return XML_TAG + "<Types xmlns=\"" + OPEN_XML_FORMAT_URL + "/package/2006/content-types\"><Default Extension=\"rels\" " +
                         "ContentType=\"application/vnd.openxmlformats-package.relationships+xml\" /><Default Extension=\"xml\" " +
                         "ContentType=\"application/xml\" /><Override PartName=\"/xl/worksheets/sheet1.xml\" " +
                         "ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\" />" +
                         "<Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\" />" +
                         "<Override PartName=\"/xl/sharedStrings.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml\" />" +
                         "<Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\" /></Types>";
    },

    _generateStylesXML: function() {
        var that = this,
            folder = that._zip.folder(XL_FOLDER_NAME),
            XML = "";

        XML = XML + this._xlsxFile.generateNumberFormatsXml();
        XML = XML + this._xlsxFile.generateFontsXml();
        XML = XML + this._xlsxFile.generateFillsXml();
        XML = XML + BASE_STYLE_XML2;

        XML = XML + this._xlsxFile.generateCellFormatsXml();

        XML = XML + that._getXMLTag("cellStyles", [{ name: "count", value: 1 }], that._getXMLTag("cellStyle", [
            { name: "name", value: "Normal" },
            { name: "xfId", value: 0 },
            { name: "builtinId", value: 0 }
        ]));

        XML = XML_TAG + that._getXMLTag("styleSheet", [{ name: "xmlns", value: OPEN_XML_FORMAT_URL + "/spreadsheetml/2006/main" }], XML);
        folder.file(STYLE_FILE_NAME, XML);

        that._styleArray = [];
    },

    _generateStringsXML: function() {
        var folder = this._zip.folder(XL_FOLDER_NAME),
            stringIndex,
            stringsLength = this._stringArray.length,
            sharedStringXml = XML_TAG;

        for(stringIndex = 0; stringIndex < stringsLength; stringIndex++) {
            this._stringArray[stringIndex] = this._getXMLTag("si", [], this._getXMLTag("t", [], this._stringArray[stringIndex]));
        }
        sharedStringXml = sharedStringXml + this._getXMLTag("sst", [
            { name: "xmlns", value: OPEN_XML_FORMAT_URL + "/spreadsheetml/2006/main" },
            { name: "count", value: this._stringArray.length },
            { name: "uniqueCount", value: this._stringArray.length }
        ], this._stringArray.join(""));

        folder.file(SHAREDSTRING_FILE_NAME, sharedStringXml);

        this._stringArray = [];
    },

    _getPaneXML: function() {
        var attributes = [{ name: "activePane", value: "bottomLeft" }, { name: "state", value: "frozen" }],
            frozenArea = this._dataProvider.getFrozenArea();

        if(!(frozenArea.x || frozenArea.y)) return "";

        if(frozenArea.x) {
            attributes.push({ name: "xSplit", value: frozenArea.x });
        }
        if(frozenArea.y) {
            attributes.push({ name: "ySplit", value: frozenArea.y });
        }

        attributes.push({ name: "topLeftCell", value: this._getCellIndex(frozenArea.y + 1, frozenArea.x) });

        return this._getXMLTag("pane", attributes);
    },

    _getAutoFilterXML: function(maxCellIndex) {
        if(this._options.autoFilterEnabled) {
            return "<autoFilter ref=\"A" + this._dataProvider.getHeaderRowCount() + ":" + maxCellIndex + "\" />";
        }

        return "";
    },

    _getIgnoredErrorsXML: function(maxCellIndex) {
        if(this._options.ignoreErrors) {
            return "<ignoredErrors><ignoredError sqref=\"A1:" + maxCellIndex + "\" numberStoredAsText=\"1\" /></ignoredErrors>";
        }

        return "";
    },

    _generateWorksheetXML: function() {
        var colIndex,
            rowIndex,
            cellData,
            xmlCells,
            maxCellIndex,
            counter = 0,
            xmlRows = [],
            rowsLength = this._cellsArray.length,
            cellsLength,
            colsLength = this._colsArray.length,
            rSpans = "1:" + colsLength,
            headerRowCount = this._dataProvider.getHeaderRowCount ? this._dataProvider.getHeaderRowCount() : 1,
            xmlResult = [[WORKSHEET_HEADER_XML,
                ((this._needSheetPr) ? GROUP_SHEET_PR_XML : SINGLE_SHEET_PR_XML), "<dimension ref=\"A1:", this._getCellIndex(this._maxIndex[0], this._maxIndex[1]) + "\"/><sheetViews><sheetView " +
            (this._rtlEnabled ? "rightToLeft=\"1\" " : "") + "tabSelected=\"1\" workbookViewId=\"0\">" + this._getPaneXML() + "</sheetView></sheetViews><sheetFormatPr defaultRowHeight=\"15\" outlineLevelRow=\"",
                ((this._dataProvider.getRowsCount() > 0) ? this._dataProvider.getGroupLevel(0) : 0), "\" x14ac:dyDescent=\"0.25\"/>"].join("")];

        for(colIndex = 0; colIndex < colsLength; colIndex++) {
            this._colsArray[colIndex] = this._getXMLTag("col", [
                { name: "width", value: this._colsArray[colIndex] },
                { name: "min", value: Number(colIndex) + 1 },
                { name: "max", value: Number(colIndex) + 1 }
            ]);
        }

        xmlResult.push(this._getXMLTag("cols", [], this._colsArray.join("")) + "<sheetData>");

        for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            xmlCells = [];
            cellsLength = this._cellsArray[rowIndex].length;

            for(colIndex = 0; colIndex < cellsLength; colIndex++) {
                rowIndex = Number(rowIndex);
                cellData = this._cellsArray[rowIndex][colIndex];

                xmlCells.push(this._getXMLTag("c", [ // 18.3.1.4 c (Cell)
                    { name: "r", value: this._getCellIndex(rowIndex + 1, colIndex) },
                    { name: "s", value: cellData.style },
                    { name: "t", value: cellData.type } // 18.18.11 ST_CellType (Cell Type)
                ], (typeUtils.isDefined(cellData.value)) ? this._getXMLTag("v", [], cellData.value) : null));
            }
            xmlRows.push(this._getXMLTag("row", [
                { name: "r", value: Number(rowIndex) + 1 },
                { name: "spans", value: rSpans },
                {
                    name: "outlineLevel",
                    value: (rowIndex >= headerRowCount) ? this._dataProvider.getGroupLevel(rowIndex) : 0
                },
                { name: "x14ac:dyDescent", value: "0.25" }
            ], xmlCells.join("")));

            this._cellsArray[rowIndex] = null;
            if(counter++ > 10000) {
                xmlResult.push(xmlRows.join(""));
                xmlRows = [];
                counter = 0;
            }
        }

        xmlResult.push(xmlRows.join(""));
        xmlRows = [];

        maxCellIndex = this._getCellIndex(this._maxIndex[0], this._maxIndex[1]);
        xmlResult.push("</sheetData>" + this._getAutoFilterXML(maxCellIndex) + this._generateMergingXML() + this._getIgnoredErrorsXML(maxCellIndex) + "</worksheet>");


        this._zip.folder(XL_FOLDER_NAME).folder(WORKSHEETS_FOLDER).file(WORKSHEET_FILE_NAME, xmlResult.join(""));

        this._colsArray = [];
        this._cellsArray = [];
        xmlResult = [];
    },

    _generateMergingXML: function() {
        var k,
            l,
            cellIndex,
            rowIndex,
            rowsLength = typeUtils.isDefined(this._dataProvider.getHeaderRowCount) ? this._dataProvider.getHeaderRowCount() : this._dataProvider.getRowsCount(),
            columnsLength = this._dataProvider.getColumns().length,
            usedArea = [],
            mergeArray = [],
            mergeArrayLength,
            mergeIndex,
            mergeXML = '';

        for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            for(cellIndex = 0; cellIndex !== columnsLength; cellIndex++) {
                if(!typeUtils.isDefined(usedArea[rowIndex]) || !typeUtils.isDefined(usedArea[rowIndex][cellIndex])) {
                    var cellMerge = this._dataProvider.getCellMerging(rowIndex, cellIndex);
                    if(cellMerge.colspan || cellMerge.rowspan) {
                        mergeArray.push({
                            start: this._getCellIndex(rowIndex + 1, cellIndex),
                            end: this._getCellIndex(rowIndex + 1 + (cellMerge.rowspan || 0), cellIndex + (cellMerge.colspan || 0))
                        });
                        for(k = rowIndex; k <= rowIndex + cellMerge.rowspan || 0; k++) {
                            for(l = cellIndex; l <= cellIndex + cellMerge.colspan || 0; l++) {
                                if(!typeUtils.isDefined(usedArea[k])) {
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
            mergeXML = mergeXML + this._getXMLTag("mergeCell", [{ name: "ref", value: mergeArray[mergeIndex].start + ":" + mergeArray[mergeIndex].end }]);
        }

        return mergeXML.length ? this._getXMLTag("mergeCells", [{ name: "count", value: mergeArrayLength }], mergeXML) : "";
    },

    _generateCommonXML: function() {
        var relsFileContent = XML_TAG + this._createXMLRelationships(this._createXMLRelationship(1, "officeDocument", "xl/" + WORKBOOK_FILE_NAME)),
            xmlRelationships,
            folder = this._zip.folder(XL_FOLDER_NAME),
            relsXML = XML_TAG;

        this._zip.folder("_" + RELATIONSHIP_PART_NAME).file("." + RELATIONSHIP_PART_NAME, relsFileContent);
        xmlRelationships = this._createXMLRelationship(1, "worksheet", "worksheets/" + WORKSHEET_FILE_NAME) + this._createXMLRelationship(2, "styles", STYLE_FILE_NAME) + this._createXMLRelationship(3, "sharedStrings", SHAREDSTRING_FILE_NAME);
        relsXML = relsXML + this._createXMLRelationships(xmlRelationships);

        folder.folder("_" + RELATIONSHIP_PART_NAME).file(WORKBOOK_FILE_NAME + ".rels", relsXML);
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
        this._maxIndex = [1, 2];
        this._stringArray = [];
        this._stringHash = {};
        this._styleArray = [];
        this._colsArray = [];
        this._cellsArray = [];
        this._needSheetPr = false;
        this._dataProvider = dataProvider;
        this._xlsxFile = new XlsxFile();

        if(typeUtils.isDefined(ExcelCreator.JSZip)) {
            this._zip = new ExcelCreator.JSZip();
        } else {
            this._zip = null;
        }
    },

    _checkZipState: function() {
        if(!this._zip) {
            throw errors.Error("E1041", "JSZip");
        }
    },

    ready: function() {
        return this._dataProvider.ready();
    },

    getData: function(isBlob) {
        var options = {
            type: isBlob ? "blob" : "base64",
            compression: "DEFLATE",
            mimeType: fileSaver.MIME_TYPES["EXCEL"]
        };

        this._checkZipState();
        this._generateContent();
        return this._zip.generateAsync ?
            this._zip.generateAsync(options) :
            this._zip.generate(options);
    }
});

ExcelCreator.JSZip = JSZip;

exports.ExcelCreator = ExcelCreator;

exports.getData = function(data, options, callback) {
    // TODO: Looks like there is no need to export ExcelCreator any more?
    var excelCreator = new exports.ExcelCreator(data, options);

    excelCreator._checkZipState();

    excelCreator.ready().done(function() {
        if(excelCreator._zip.generateAsync) {
            excelCreator.getData(typeUtils.isFunction(window.Blob)).then(callback);
        } else {
            callback(excelCreator.getData(typeUtils.isFunction(window.Blob)));
        }
    });
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

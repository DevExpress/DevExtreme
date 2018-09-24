import $ from "jquery";
import helper from '../../helpers/dataGridExportTestsHelper.js';
import { extend } from "core/utils/extend";

QUnit.testStart(function() {
    var markup = '<div id="dataGrid"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("DataGrid export.onXlsxCellPrepared tests", {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test("Change horizontal alignment in all xlsx cells", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="7">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" fontId="1" applyNumberFormat="0" numFmtId="0" />' +
        '<xf xfId="0" fontId="0" applyNumberFormat="0" numFmtId="0" />' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="6" t="s"><v>1</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>str1_1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            export: {
                enabled: true,
                onXlsxCellPrepared: e => extend(true, e.xlsxCell, { style: { alignment: null } }),
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change horizontal alignment by a property value of source object", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment horizontal="center" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>1</v></c><c r="B1" s="3" t="n"><v>1</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>2</v></c><c r="B2" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: ['data1', 'data2'],
            dataSource: [
                { data1: 1, data2: 1, alignment: 'center' },
                { data1: 2, data2: 2, alignment: 'right' },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    if(e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'data1' && e.gridCell.value === 1 && e.gridCell.row.data.data1 === 1) {
                        extend(e.xlsxCell.style, { alignment: { horizontal: e.gridCell.row.data.alignment } });
                    }
                },
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change fill in all xlsx cells", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML1 +
        '<fills count="3">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '<fill><patternFill patternType="Gray125" /></fill>' +
        '<fill><patternFill patternType="darkVertical"><fgColor rgb="FF20FF60" /></patternFill></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" fillId="2" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>str1_1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e =>
                    extend(true, e.xlsxCell, {
                        style: {
                            fill: {
                                patternFill: {
                                    patternType: 'darkVertical',
                                    foregroundColor: {
                                        rgb: 'FF20FF60'
                                    }
                                }
                            }
                        }
                    }),
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change fill by a property value of source object", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML1 +
        '<fills count="3">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '<fill><patternFill patternType="Gray125" /></fill>' +
        '<fill><patternFill patternType="darkVertical"><fgColor rgb="FF00FF00" /></patternFill></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" fillId="2" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>1</v></c><c r="B1" s="3" t="n"><v>1</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>2</v></c><c r="B2" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: ['data1', 'data2'],
            dataSource: [
                { data1: 1, data2: 1, fillPattern: 'darkVertical', fillColor: 'FF00FF00' },
                { data1: 2, data2: 2, fillPattern: 'darkHorizontal', fillColor: 'FF0000FF' },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    if(e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'data1' && e.gridCell.value === 1 && e.gridCell.row.data.data1 === 1) {
                        extend(e.xlsxCell.style, {
                            fill: {
                                patternFill: {
                                    patternType: e.gridCell.row.data.fillPattern,
                                    foregroundColor: {
                                        rgb: e.gridCell.row.data.fillColor
                                    }
                                }
                            }
                        });
                    }
                }
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change font in all xlsx cells", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        '<fonts count="3">' +
        '<font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><b /><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><sz val="22" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '</fonts>' +
        '<fills count="1">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="2" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>str1_1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => e.xlsxCell.style.font.size = 22
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Check event arguments for data row cell with various data types", function(assert) {
    const configurations = [
        { dataType: "number", values: [undefined, null, 0, 1], expectedTexts: ['', '', '0', '1' ] },
        { dataType: "string", values: [undefined, null, '', 's'], expectedTexts: ['', '', '', 's' ] },
        { dataType: "date", values: [undefined, null, new Date(2018, 11, 1)], expectedTexts: ['', '', '12/1/2018' ] },
        { dataType: "datetime", values: [undefined, null, new Date(2018, 11, 1, 16, 10)], expectedTexts: ['', '', '12/1/2018, 4:10 PM' ] },
        { dataType: "boolean", values: [undefined, null, false, true], expectedTexts: ['', '', 'false', 'true' ] },
        {
            dataType: "lookup", values: [undefined, null, 1], expectedDisplayValues: [undefined, undefined, 'name1' ], expectedTexts: ['', '', 'name1' ],
            lookup: {
                dataSource: {
                    store: { type: 'array', data: [{ id: 1, name: 'name1' }] },
                    key: 'id'
                },
                valueExpr: 'id',
                displayExpr: 'name'
            }
        },
    ];
    configurations.forEach(config => {
        const column = { dataField: 'f1', dataType: config.dataType, lookup: config.lookup },
            ds = config.values.map(item => { return { f1: item }; });

        helper.runXlsxCellPreparedTest(assert,
            {
                columns: [column],
                dataSource: ds,
                showColumnHeaders: false,
            },
            (grid) => {
                const result = [];
                for(let i = 0; i < config.values.length; i++) {
                    result.push({
                        rowType: 'data',
                        row: { data: ds[i], rowType: 'data' },
                        column: grid.columnOption(0),
                        value: config.values[i],
                        displayValue: config.expectedDisplayValues ? config.expectedDisplayValues[i] : config.values[i],
                        text: config.expectedTexts ? config.expectedTexts[i] : config.values[i] }
                    );
                }
                return result;
            }
        );
    });
});

QUnit.test("Check event arguments for data row cell with formatting", function(assert) {
    const ds = [{ f1: 1 }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "number", format: "currency" }],
            dataSource: ds,
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: ds[0].f1, displayValue: ds[0].f1, text: '$1' },
        ]
    );
});

QUnit.test("Check event arguments for header", function(assert) {
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [{ dataField: "f1" }],
            dataSource: [],
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(0) },
        ]
    );
});

QUnit.test("Check event arguments for bands", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3' }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [
                { dataField: "f1" },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2" },
                        { dataField: "f3" },
                    ]
                }
            ],
            dataSource: ds,
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(0) },
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'header', column: grid.columnOption(0) },
            { rowType: 'header', column: grid.columnOption(2) },
            { rowType: 'header', column: grid.columnOption(3) },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: ds[0].f1, displayValue: ds[0].f1, text: 'f1' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: 'f2' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: 'f3' },
        ]
    );
});

QUnit.test("Check event arguments for groupping 1 level", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2' }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2" },
            ],
            dataSource: ds,
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'group', column: grid.columnOption(0) },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: 'f2' },
        ]
    );
});

QUnit.test("Check event arguments for groupping 2 levels", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3' }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2", groupIndex: 1 },
                { dataField: "f3" },
            ],
            dataSource: ds,
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(2) },
            { rowType: 'group', column: grid.columnOption(0) },
            { rowType: 'group', column: grid.columnOption(1) },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: 'f3' },
        ]
    );
});

QUnit.test("Check event arguments for group summary", function(assert) {
    const ds = [{ f1: 'str1', f2: 1 }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2", },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ column: 'f2', summaryType: 'sum' }]
            },
        },
        (grid) => [
            { column: grid.columnOption(1), rowType: 'header' },
            { column: grid.columnOption(0), rowType: 'group' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: '1' },
        ]
    );
});

QUnit.test("Check event arguments for group summary with alignByColumn", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2", groupIndex: 1 },
                { dataField: "f3" },
                { dataField: "f4" },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ column: 'f3', summaryType: 'count' }, { column: 'f4', summaryType: 'count', alignByColumn: true }]
            },
        },
        (grid) => [
            { column: grid.columnOption(2), rowType: 'header' },
            { column: grid.columnOption(3), rowType: 'header' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(1), rowType: 'group' },
            { column: grid.columnOption(1), rowType: 'group' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: 'f3' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[0].f4, displayValue: ds[0].f4, text: 'f4' },

        ]
    );
});

QUnit.test("Check event arguments for group summary with showInGroupFooter", function(assert) {
    const ds = [
        { f1: '1_f1', f2: '1_f2', f3: '1_f3', f4: '1_f4' },
        { f1: '2_f1', f2: '2_f2', f3: '2_f3', f4: '2_f4' }
    ];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2" },
                { dataField: "f3" },
                { dataField: "f4" },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ column: 'f3', summaryType: 'count', showInGroupFooter: true }, { column: 'f4', summaryType: 'count', showInGroupFooter: true }]
            },
        },
        (grid) => [
            { column: grid.columnOption(1), rowType: 'header' },
            { column: grid.columnOption(2), rowType: 'header' },
            { column: grid.columnOption(3), rowType: 'header' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: '1_f2' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: '1_f3' },
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[0].f4, displayValue: ds[0].f4, text: '1_f4' },
            { column: grid.columnOption(1), rowType: 'groupfooter' },
            { column: grid.columnOption(2), rowType: 'groupfooter' },
            { column: grid.columnOption(3), rowType: 'groupfooter' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { row: { data: ds[1], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[1].f2, displayValue: ds[1].f2, text: '2_f2' },
            { row: { data: ds[1], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[1].f3, displayValue: ds[1].f3, text: '2_f3' },
            { row: { data: ds[1], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[1].f4, displayValue: ds[1].f4, text: '2_f4' },
            { column: grid.columnOption(1), rowType: 'groupfooter' },
            { column: grid.columnOption(2), rowType: 'groupfooter' },
            { column: grid.columnOption(3), rowType: 'groupfooter' },
        ]
    );
});

QUnit.test("Check event arguments for total summary", function(assert) {
    const ds = [{ f1: 1 }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "number" }],
            dataSource: ds,
            summary: {
                totalItems: [{ column: 'f1', summaryType: 'sum' }]
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: ds[0].f1, displayValue: ds[0].f1, text: '1' },
            { column: grid.columnOption(0), rowType: 'totalFooter' },
        ]
    );
});

QUnit.test("Check event arguments for changes from customizeExportData", function(assert) {
    const ds = [{ f1: 'f1' }];
    helper.runXlsxCellPreparedTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "string" }],
            dataSource: ds,
            customizeExportData: (columns, rows) => {
                rows.forEach(row => row.values.forEach((value, valueIndex) => row.values[valueIndex] += '+'));
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: 'f1+', displayValue: 'f1+', text: 'f1+' },
        ]
    );
});

QUnit.test("Changes in 'e.xlsxCell.style' shouldn't modify a shared style object", function(assert) {
    const done = assert.async();
    let counter = 1;
    const gridOptions = {
        columns: [{ dataField: "f1" }],
        dataSource: [{ f1: 1 }, { f1: 2 }, { f1: 3 }],
        showColumnHeaders: false,
        loadingTimeout: undefined,
        export: {
            onXlsxCellPrepared: e => {
                assert.step(e.xlsxCell.style.alignment.horizontal);
                e.xlsxCell.style.alignment.horizontal = counter++;
            },
        },
        onFileSaving: e => {
            assert.verifySteps(['right', 'right', 'right']);
            done();
            e.cancel = true;
        },
    };
    const dataGrid = $("#dataGrid").dxDataGrid(gridOptions).dxDataGrid("instance");
    dataGrid.exportToExcel();
});

QUnit.test("Change string value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>b</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    assert.strictEqual(e.xlsxCell.value, 'a');
                    e.xlsxCell.value = 'b';
                }
            }
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change number value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    assert.strictEqual(e.xlsxCell.value, 42);
                    e.xlsxCell.value = 43;
                }
            }
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change date value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43122.70486111111</v></c>' +
        '</row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="3" t="n"><v>43487.70486111111</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: new Date(2018, 0, 21, 16, 55) }, { f1: new Date(2019, 0, 21, 16, 55) }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    if(e.xlsxCell.value.getTime() === new Date(2018, 0, 21, 16, 55).getTime()) {
                        e.xlsxCell.value = new Date(2018, 0, 22, 16, 55);
                    } else {
                        e.xlsxCell.value = 43487.70486111111; // new Date(2019, 0, 22, 16, 55)
                    }
                }
            }
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change boolean value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>true</t></si>' +
        '<si><t>false</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [{ f1: true }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    assert.strictEqual(e.xlsxCell.value, 'true');
                    e.xlsxCell.value = 'false';
                }
            }
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change cell value data type", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="n"><v>1</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="n"><v>1</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:D1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>one</t></si>' +
        '<si><t>my date</t></si>' +
        '<si><t>true</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'stringToNumber', dataType: 'string' },
                { dataField: 'numberToString', dataType: 'number' },
                { dataField: 'dateToString', dataType: 'date' },
                { dataField: 'boolToNumber', dataType: 'boolean' }
            ],
            dataSource: [{ stringToNumber: 'a', numberToString: 1, dateToString: new Date(2018, 0, 20), boolToNumber: true }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                onXlsxCellPrepared: e => {
                    if(e.gridCell.column.dataField === 'stringToNumber') {
                        e.xlsxCell.value = 1;
                        e.xlsxCell.dataType = 'n';
                        e.xlsxCell.style = null;
                    } else if(e.gridCell.column.dataField === 'numberToString') {
                        e.xlsxCell.value = 'one';
                        e.xlsxCell.dataType = 's';
                        e.xlsxCell.style = null;
                    } else if(e.gridCell.column.dataField === 'dateToString') {
                        e.xlsxCell.value = 'my date';
                        e.xlsxCell.dataType = 's';
                        e.xlsxCell.style = null;
                    } else if(e.gridCell.column.dataField === 'boolToNumber') {
                        e.xlsxCell.value = 1;
                        e.xlsxCell.dataType = 'n';
                        e.xlsxCell.style = null;
                    }
                }
            }
        },
        { worksheet, sharedStrings }
    );
});

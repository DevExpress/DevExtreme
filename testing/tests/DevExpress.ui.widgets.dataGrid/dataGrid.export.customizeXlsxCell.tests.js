import $ from "jquery";
import helper from '../../helpers/dataGridExportTestsHelper.js';
import { extend } from "core/utils/extend";

QUnit.testStart(function() {
    var markup = '<div id="dataGrid"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("DataGrid export.customizeXlsxCell tests", {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test("Clear alignment in all xlsx cells", function(assert) {
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

    helper.runTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            export: {
                customizeXlsxCell: e => extend(true, e.xlsxCell, { style: { alignment: null } }),
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Set fill in all xlsx cells", function(assert) {
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
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>str1_1</t></si>' +
        '</sst>';

    helper.runTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            showColumnHeaders: false,
            export: {
                customizeXlsxCell: e =>
                    extend(true, e.xlsxCell, {
                        style: {
                            fill: {
                                patternFill: {
                                    patternType: 'darkVertical',
                                    foregroundColor_RGB: 'FF20FF60'
                                }
                            }
                        }
                    }),
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Check event arguments for data row cell with various data types", function(assert) {
    const testConfigArray = [
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
    testConfigArray.forEach(config => {
        const column = { dataField: 'f1', dataType: config.dataType, lookup: config.lookup },
            ds = config.values.map(item => { return { f1: item }; });

        helper.runCustomizeXlsxCellTest(assert,
            {
                columns: [column],
                dataSource: ds,
                showColumnHeaders: false,
            },
            (grid) => {
                const result = [];
                for(let i = 0; i < config.values.length; i++) {
                    result.push({
                        row: { data: ds[i], key: ds[i], rowType: 'data' },
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
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "number", format: "currency" }],
            dataSource: ds,
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: ds[0].f1, displayValue: ds[0].f1, text: '$1' },
        ]
    );
});

QUnit.test("Check event arguments for header", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
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
    helper.runCustomizeXlsxCellTest(assert,
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
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: ds[0].f1, displayValue: ds[0].f1, text: 'f1' },
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: 'f2' },
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: 'f3' },
        ]
    );
});

QUnit.test("Check event arguments for groupping 1 level", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2' }];
    helper.runCustomizeXlsxCellTest(assert,
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
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: 'f2' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with groupping 2 levels", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3' }];
    helper.runCustomizeXlsxCellTest(assert,
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
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: 'f3' },
        ]
    );
});

QUnit.test("Check event arguments for group summary", function(assert) {
    const ds = [{ f1: 'str1', f2: 1 }];
    helper.runCustomizeXlsxCellTest(assert,
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
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: '1' },
        ]
    );
});

QUnit.test("Check event arguments for group summary with alignByColumn", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }];
    helper.runCustomizeXlsxCellTest(assert,
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
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: 'f3' },
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[0].f4, displayValue: ds[0].f4, text: 'f4' },

        ]
    );
});

QUnit.test("Check event arguments for group summary with showInGroupFooter", function(assert) {
    const ds = [
        { f1: '1_f1', f2: '1_f2', f3: '1_f3', f4: '1_f4' },
        { f1: '2_f1', f2: '2_f2', f3: '2_f3', f4: '2_f4' }
    ];
    helper.runCustomizeXlsxCellTest(assert,
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
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[0].f2, displayValue: ds[0].f2, text: '1_f2' },
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[0].f3, displayValue: ds[0].f3, text: '1_f3' },
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[0].f4, displayValue: ds[0].f4, text: '1_f4' },
            { column: grid.columnOption(1), rowType: 'groupfooter' },
            { column: grid.columnOption(2), rowType: 'groupfooter' },
            { column: grid.columnOption(3), rowType: 'groupfooter' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { row: { data: ds[1], key: ds[1], rowType: 'data' }, column: grid.columnOption(1), rowType: 'data', value: ds[1].f2, displayValue: ds[1].f2, text: '2_f2' },
            { row: { data: ds[1], key: ds[1], rowType: 'data' }, column: grid.columnOption(2), rowType: 'data', value: ds[1].f3, displayValue: ds[1].f3, text: '2_f3' },
            { row: { data: ds[1], key: ds[1], rowType: 'data' }, column: grid.columnOption(3), rowType: 'data', value: ds[1].f4, displayValue: ds[1].f4, text: '2_f4' },
            { column: grid.columnOption(1), rowType: 'groupfooter' },
            { column: grid.columnOption(2), rowType: 'groupfooter' },
            { column: grid.columnOption(3), rowType: 'groupfooter' },
        ]
    );
});

QUnit.test("Check event arguments for total summary", function(assert) {
    const ds = [{ f1: 1 }];
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "number" }],
            dataSource: ds,
            summary: {
                totalItems: [{ column: 'f1', summaryType: 'sum' }]
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: ds[0].f1, displayValue: ds[0].f1, text: '1' },
            { column: grid.columnOption(0), rowType: 'totalFooter' },
        ]
    );
});

QUnit.test("Check event arguments for changes from customizeExportData", function(assert) {
    const ds = [{ f1: 'f1' }];
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "string" }],
            dataSource: ds,
            customizeExportData: (columns, rows) => {
                rows.forEach(row => row.values.forEach((value, valueIndex) => row.values[valueIndex] += '+'));
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], key: ds[0], rowType: 'data' }, column: grid.columnOption(0), rowType: 'data', value: 'f1+', displayValue: 'f1+', text: 'f1+' },
        ]
    );
});

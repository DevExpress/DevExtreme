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

QUnit.test("Check event arguments for various data types", function(assert) {
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
                        row: { data: ds[i], key: ds[i], rowIndex: i, rowType: 'data' },
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

QUnit.test("Check event arguments for DataGrid with data row with number cell value with formatting", function(assert) {
    const ds = [
        { field1: 1 }
    ];
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "field1", dataType: "number", format: "currency" }],
            dataSource: ds,
            showColumnHeaders: false,
        },
        (grid) => [
            { row: { data: ds[0], key: ds[0], rowIndex: 0, rowType: 'data' }, column: grid.columnOption(0), value: ds[0].field1, displayValue: ds[0].field1, text: '$1' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with header row", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "field1", caption: "Field1" }],
            dataSource: [],
        },
        (grid) => [{ value: 'Field1', column: grid.columnOption(0) }]
    );
});

QUnit.test("Check e.XXX for DataGrid with bands", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [
                { dataField: "field1", caption: "Field1" },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "field2", caption: "Field2" },
                        { dataField: "field3", caption: "Field3" },
                    ]
                }
            ],
            dataSource: [{ field1: 'f1', field2: 'f2', field3: 'f3' }],
        },
        (grid) => [
            { value: 'Field1', column: 'check cellPrepared' },
            { value: 'Band1', column: 'check cellPrepared' },
            { value: '', column: 'check cellPrepared' },
            { value: '', column: 'check cellPrepared' },
            { value: 'Field2', column: 'check cellPrepared' },
            { value: 'Field3', column: 'check cellPrepared' },
            { value: 'f1', column: 'check cellPrepared' },
            { value: 'f2', column: 'check cellPrepared' },
            { value: 'f3', column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with groupping 1 level", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [
                { dataField: "field1", caption: "Field1", groupIndex: 0 },
                { dataField: "field2", caption: "Field2" },
            ],
            dataSource: [{ field1: 'f1', field2: 'f2' }],
        },
        (grid) => [
            { value: 'Field2', column: 'check cellPrepared' },
            { value: 'Field1: f1', column: 'check cellPrepared' },
            { value: 'f2', column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with groupping 2 levels", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [
                { dataField: "field1", caption: "Field1", groupIndex: 0 },
                { dataField: "field2", caption: "Field2", groupIndex: 1 },
                { dataField: "field3", caption: "Field3" },
            ],
            dataSource: [{ field1: 'f1', field2: 'f2', field3: 'f3' }],
        },
        (grid) => [
            { value: 'Field3', column: 'check cellPrepared' },
            { value: 'Field1: f1', column: 'check cellPrepared' },
            { value: 'Field2: f2', column: 'check cellPrepared' },
            { value: 'f3', column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with group summary", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [
                { dataField: "field1", caption: "Field1", groupIndex: 0 },
                { dataField: "field2", caption: "Field2" },
            ],
            dataSource: [{ field1: 'str1', field2: 1 }],
            summary: {
                groupItems: [{ column: 'field2', summaryType: 'sum' }]
            },
        },
        (grid) => [
            { value: 'Field2', column: 'check cellPrepared' },
            { value: 'Field1: str1 (Sum of Field2 is 1)', column: 'check cellPrepared' },
            { value: 1, column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with group summary with alignByColumn", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [
                { dataField: "field1", caption: "Field1", groupIndex: 0 },
                { dataField: "field2", caption: "Field2", groupIndex: 1 },
                { dataField: "field3", caption: "Field3" },
                { dataField: "field4", caption: "Field4" },
            ],
            dataSource: [{ field1: 'f1', field2: 'f2', field3: 'f3', field4: 'f4' }],
            summary: {
                groupItems: [{ column: 'field3', summaryType: 'count' }, { column: 'field4', summaryType: 'count', alignByColumn: true }]
            },
        },
        (grid) => [
            { value: 'Field3', column: 'check cellPrepared' },
            { value: 'Field4', column: 'check cellPrepared' },
            { value: 'Field1: f1 (Count: 1)', column: 'check cellPrepared' },
            { value: 'Count: 1', column: 'check cellPrepared' },
            { value: 'Field2: f2 (Count: 1)', column: 'check cellPrepared' },
            { value: 'Count: 1', column: 'check cellPrepared' },
            { value: 'f3', column: 'check cellPrepared' },
            { value: 'f4', column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with group summary with showInGroupFooter", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [
                { dataField: "field1", caption: "Field1", groupIndex: 0 },
                { dataField: "field2", caption: "Field2" },
                { dataField: "field3", caption: "Field3" },
                { dataField: "field4", caption: "Field4" },
            ],
            dataSource: [
                { field1: '1_f1', field2: '1_f2', field3: '1_f3', field4: '1_f4' },
                { field1: '2_f1', field2: '2_f2', field3: '2_f3', field4: '2_f4' }
            ],
            summary: {
                groupItems: [{ column: 'field3', summaryType: 'count', showInGroupFooter: true }, { column: 'field4', summaryType: 'count', showInGroupFooter: true }]
            },
        },
        (grid) => [
            { value: 'Field2', column: grid.columnOption(1) },
            { value: 'Field3', column: grid.columnOption(2) },
            { value: 'Field4', column: grid.columnOption(3) },
            { value: 'Field1: 1_f1', column: 'check cellPrepared' },
            { value: undefined, column: 'check cellPrepared' },
            { value: undefined, column: 'check cellPrepared' },
            { value: '1_f2', column: grid.columnOption(1) },
            { value: '1_f3', column: grid.columnOption(2) },
            { value: '1_f4', column: grid.columnOption(3) },
            { value: undefined, column: 'check cellPrepared' },
            { value: 'Count: 1', column: 'check cellPrepared' },
            { value: 'Count: 1', column: 'check cellPrepared' },
            { value: 'Field1: 2_f1', column: grid.columnOption(0) },
            { value: undefined, column: 'check cellPrepared' },
            { value: undefined, column: 'check cellPrepared' },
            { value: '2_f2', column: grid.columnOption(1) },
            { value: '2_f3', column: grid.columnOption(2) },
            { value: '2_f4', column: grid.columnOption(3) },
            { value: undefined, column: 'check cellPrepared' },
            { value: 'Count: 1', column: 'check cellPrepared' },
            { value: 'Count: 1', column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX for DataGrid with total summary", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "field1", dataType: "number" }],
            dataSource: [{ field1: 1 }],
            summary: {
                totalItems: [{ column: 'field1', summaryType: 'sum' }]
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { value: 1, column: grid.columnOption(0) },
            { value: 'Sum: 1', column: 'check cellPrepared' },
        ]
    );
});

QUnit.test("Check e.XXX with customizeExportData changes", function(assert) {
    helper.runCustomizeXlsxCellTest(assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            dataSource: [{ field1: 'f1' }],
            customizeExportData: (columns, rows) => {
                rows.forEach(row => {
                    for(let i = 0; i < row.values.length; i++) {
                        row.values[i] += '_customize';
                    }
                });
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { value: 'f1_customize', column: grid.columnOption(0) },
        ]
    );
});

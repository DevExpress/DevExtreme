define(function(require) {
    if('callPhantom' in window) return;

    if(!window.INTRANET) {
        QUnit.skip("[non-intranet environment]");
        return;
    }

    var browser = require("core/utils/browser");

    if(browser.msie && parseInt(browser.version) >= 17) return;

    var $ = require("jquery"),
        DATA_SOURCE_URL = "http://teamdashboard.corp.devexpress.com/MSOLAP2008/msmdpump.dll",
        pivotGridUtils = require("ui/pivot_grid/ui.pivot_grid.utils"),
        pivotGridDataSource = require("ui/pivot_grid/data_source"),
        Store = require("ui/pivot_grid/xmla_store"),
        errors = require("data/errors").errors,
        ajax = require("core/utils/ajax"),
        languageId = require("localization/language_codes").getLanguageId(),
        testEnvironment = {
            beforeEach: function() {
                this.store = new Store(this.dataSource);

                this.load = function(options) {
                    return this.store.load(options).done(function(data) {
                        pivotGridDataSource.sort(options, data);
                    });
                };

            },
            dataSource: {
                url: DATA_SOURCE_URL,
                catalog: "Adventure Works DW Standard Edition",
                cube: "Adventure Works"
            }
        },

        CATEGORIES_DATA = [
            { key: "[Product].[Category].&[4]", value: "Accessories", text: "Accessories", index: 1 },
            { key: "[Product].[Category].&[1]", value: "Bikes", text: "Bikes", index: 2 },
            { key: "[Product].[Category].&[3]", value: "Clothing", text: "Clothing", index: 3 }
        ],

        CATEGORIES_HIERARCHY_DATA = [
            { key: "[Product].[Product Categories].[Category].&[4]", value: "Accessories", text: "Accessories", index: 1 },
            { key: "[Product].[Product Categories].[Category].&[1]", value: "Bikes", text: "Bikes", index: 2 },
            { key: "[Product].[Product Categories].[Category].&[3]", value: "Clothing", text: "Clothing", index: 3 }
        ],

        CATEGORIES_DATA_WITH_COMPONENTS = CATEGORIES_DATA.concat({
            index: 4,
            text: "Components",
            value: "Components",
            key: "[Product].[Category].&[2]"
        }),

        BIKES_SUBCATEGORY_DATA = [{
            index: 1,
            key: "[Product].[Product Categories].[Subcategory].&[1]",
            text: "Mountain Bikes",
            value: "Mountain Bikes"
        },
        {
            index: 2,
            key: "[Product].[Product Categories].[Subcategory].&[2]",
            text: "Road Bikes",
            value: "Road Bikes"
        },
        {
            index: 3,
            key: "[Product].[Product Categories].[Subcategory].&[3]",
            text: "Touring Bikes",
            value: "Touring Bikes"
        }],

        CALENDAR_YEAR_DATA = [{
            index: 1,
            text: "CY 2001",
            value: 2001,
            key: "[Ship Date].[Calendar Year].&[2001]"
        }, {
            index: 2,
            text: "CY 2002",
            value: 2002,
            key: "[Ship Date].[Calendar Year].&[2002]"
        }, {
            index: 3,
            text: "CY 2003",
            value: 2003,
            key: "[Ship Date].[Calendar Year].&[2003]"
        }, {
            index: 4,
            text: "CY 2004",
            value: 2004,
            key: "[Ship Date].[Calendar Year].&[2004]"
        }],

        CALENDAR_HIERARCHY_YEAR_DATA = [{
            index: 1,
            text: "CY 2001",
            value: 2001,
            key: "[Ship Date].[Calendar].[Calendar Year].&[2001]"
        }, {
            index: 2,
            text: "CY 2002",
            value: 2002,
            key: "[Ship Date].[Calendar].[Calendar Year].&[2002]"
        }, {
            index: 3,
            text: "CY 2003",
            value: 2003,
            key: "[Ship Date].[Calendar].[Calendar Year].&[2003]"
        }, {
            index: 4,
            text: "CY 2004",
            value: 2004,
            key: "[Ship Date].[Calendar].[Calendar Year].&[2004]"
        }],

        ERROR_RESPONCE = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><soap:Fault xmlns="http://schemas.xmlsoap.org/soap/envelope/"><faultcode>XMLAnalysisError.0xc10a004d</faultcode><faultstring>Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function.</faultstring><detail><Error ErrorCode="3238658125" Description="Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function." Source="Microsoft SQL Server 2008 R2 Analysis Services" HelpFile=""><Location xmlns="http://schemas.microsoft.com/analysisservices/2003/engine" xmlns:ddl2="http://schemas.microsoft.com/analysisservices/2003/engine/2" xmlns:ddl2_2="http://schemas.microsoft.com/analysisservices/2003/engine/2/2" xmlns:ddl100="http://schemas.microsoft.com/analysisservices/2008/engine/100" xmlns:ddl100_100="http://schemas.microsoft.com/analysisservices/2008/engine/100/100" xmlns:ddl200="http://schemas.microsoft.com/analysisservices/2010/engine/200" xmlns:ddl200_200="http://schemas.microsoft.com/analysisservices/2010/engine/200/200"><Start><Line>1</Line><Column>77</Column></Start><End><Line>1</Line><Column>203</Column></End><LineOffset>0</LineOffset><TextLength>127</TextLength></Location></Error></detail></soap:Fault></soap:Body></soap:Envelope>',

        stubsEnvironment = {
            beforeEach: function() {
                var that = this;
                sinon.spy(errors, "log");
                sinon.spy(errors, "Error");

                testEnvironment.beforeEach.call(that);
                that.sendDeferred = $.Deferred();

                that.sendRequest = sinon.stub(pivotGridUtils, "sendRequest", function() {
                    return that.sendDeferred;
                });
            },
            afterEach: function() {
                this.sendRequest.restore();
                errors.log.restore();
                errors.Error.restore();
                // testEnvironment.afterEach.call(this);
            },
            dataSource: testEnvironment.dataSource,

            getRequest: function(num) {
                var call = num === undefined ? this.sendRequest.lastCall : this.sendRequest.getCall(num);
                return call.args[0].data;
            },

            getQuery: function(num) {
                var query = $(this.getRequest(num)).find("Statement").text();
                return query;
            }
        };

    function findItems(data, field, value) {
        var result = [];
        $.each(data, function(_, item) {
            if(item[field] === value) {
                result.push(item);
            }
        });

        return result;
    }

    function getColumnByIndex(data, index) {
        return $.map(data, function(items) {
            return items[index];
        });
    }

    function getFailCallBack(assert) {
        return function(e, textStatus) {
            e = e || {};
            assert.ok(false, e.statusText);
            assert.ok(false, e.stack);
        };
    }

    function getValue(data, rowItem, columnItem, measureIndex) {
        var columnIndex = columnItem ? columnItem.index : data.grandTotalColumnIndex,
            rowIndex = rowItem ? rowItem.index : data.grandTotalRowIndex;

        return data.values[rowIndex][columnIndex][measureIndex || 0];
    }

    function removeIndexesAndValue(data) {
        pivotGridUtils.foreachTree(data, function(items) {
            delete items[0].index;
            delete items[0].value;
            delete items[0].key;
        });
        return data;
    }

    QUnit.module("Adventure Works", testEnvironment);

    QUnit.test("XMLA store have filter, key methods", function(assert) {
        assert.strictEqual(this.store.filter(), undefined);
        assert.strictEqual(this.store.key(), undefined);
    });

    QUnit.test("incorrect dataSource", function(assert) {
        var done = assert.async();
        new Store({
            url: "",
            catalog: "Adventure Works DW Standard Edition",
            cube: "Adventure Works"
        }).load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).fail(function(error) {
            assert.ok(error.statusText.indexOf("E4023") > -1);
            done();
        });
    });

    QUnit.test("not defined data in description", function(assert) {
        var done = assert.async();
        this.store.load({}).done(function(data) {
            assert.ok(data);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.ok(!data.rows.length);
            assert.ok(!data.columns.length);
            assert.deepEqual(data.values, [[[80450596.9823]]]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Adventure Works", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484], [15114], [9132], [6852]],
                [[962], [null], [962], [null]],
                [[2665], [null], [2665], [null]],
                [[9002], [6470], [4756], [2717]],
                [[11753], [9745], [5646], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Adventure Works. Expand item", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }, { dataField: "[Ship Date].[Month Of Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: [CALENDAR_YEAR_DATA[2].key]
        }).done(function(data) {

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.strictEqual(data.rows.length, 12);

            assert.strictEqual(data.rows[0].text, "January");

            assert.strictEqual(data.rows[6].text, "July");
            assert.strictEqual(data.rows[7].text, "August");

            assert.strictEqual(data.rows[11].text, "December");
            assert.deepEqual(data.rows[11].value, 12);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[6]), 462, "GT - 2003 July");

            assert.strictEqual(getValue(data, data.rows[7]), 1262, "GT - 2003 August");

            assert.strictEqual(getValue(data, data.rows[7], data.columns[1]), 492), "Bikes - 2003 August";

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Adventure Works. Expand column & row", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }, { dataField: "[Ship Date].[Month Of Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "columns",
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key]],
            path: [CATEGORIES_DATA[1].key]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, "Mountain Bikes");
            assert.strictEqual(data.columns[1].text, "Road Bikes");
            assert.strictEqual(data.columns[2].text, "Touring Bikes");

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "CY 2003");
            assert.strictEqual(data.rows[2].index, 3, "expanded row");
            assert.ok(data.rows[2].children, "expanded row should has children");
            assert.strictEqual(data.rows[2].children.length, 12);
            assert.strictEqual(data.rows[2].children[0].text, "January");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0, "GT row index");

            assert.strictEqual(getValue(data, data.rows[2], data.columns[0]), 1896, "Mounain Bikes - 2003");

            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[0]), 98, "Mounain Bikes - 2003 January");

            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[2]), null, "Touring Bikes - 2003 January");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Load with expand column & row", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }, { dataField: "[Ship Date].[Month Of Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],

            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key]],
            columnExpandedPaths: [[CATEGORIES_DATA[1].key]]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, "Accessories");
            assert.ok(!data.columns[0].children, "Accessories doesn't have children");

            assert.strictEqual(data.columns[1].text, "Bikes");
            assert.strictEqual(data.columns[1].children[0].text, "Mountain Bikes");
            assert.strictEqual(data.columns[1].children[1].text, "Road Bikes");
            assert.strictEqual(data.columns[1].children[2].text, "Touring Bikes");

            assert.strictEqual(data.columns[2].text, "Clothing");
            assert.ok(!data.columns[2].children, "Clothing doesn't have children");

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "CY 2003");
            assert.strictEqual(data.rows[2].index, 3, "expanded row: CY 2003 index ");
            assert.ok(data.rows[2].children, "expanded row should has children");
            assert.strictEqual(data.rows[2].children.length, 12);
            assert.strictEqual(data.rows[2].children[0].text, "January");

            assert.strictEqual(data.rows[2].children[7].text, "August");

            assert.strictEqual(data.grandTotalColumnIndex, 0);

            assert.strictEqual(data.grandTotalRowIndex, 0, "GT row index");

            assert.strictEqual(getValue(data), 18484, "Grand Total");

            assert.strictEqual(getValue(data, data.rows[2], data.columns[1].children[0]), 1896, "Mounain Bikes - 2003");

            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[1].children[0]), 98, "Mounain Bikes - 2003 January");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Adventure Works. Expand second level child", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }, { dataField: "[Ship Date].[Month Of Year]" }, { dataField: "[Ship Date].[Day Of Month]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: [CALENDAR_YEAR_DATA[2].key, "[Ship Date].[Month Of Year].&[8]"]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.strictEqual(data.rows.length, 31);

            assert.deepEqual(data.rows[0].value, 1);
            assert.strictEqual(data.rows[0].text, "1");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "3");
            assert.strictEqual(data.rows[3].text, "4");

            assert.ok(!data.rows[2].children, "expanded row should has children");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[0]), 15, "GT - August1");

            assert.strictEqual(getValue(data, data.rows[0], data.columns[1]), 15, "Bikes - August1");
            assert.strictEqual(getValue(data, data.rows[3], data.columns[2]), 5, "Clothing - August4");

            assert.strictEqual(getValue(data, data.rows[3]), 16, "GT - August4");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Adventure Works. Expand child when opposite axis expanded on several levels", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }, { dataField: "[Ship Date].[Month Of Year]" }, { dataField: "[Ship Date].[Day Of Month]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "columns",
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key], [CALENDAR_YEAR_DATA[2].key, "[Ship Date].[Month Of Year].&[8]"]],
            path: [CATEGORIES_DATA[1].key]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, "Mountain Bikes");
            assert.strictEqual(data.columns[1].text, "Road Bikes");
            assert.strictEqual(data.columns[2].text, "Touring Bikes");

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "CY 2003");
            assert.equal(data.rows[2].children.length, 12, "expanded year's children");

            assert.equal(data.rows[2].children[7].text, "August", "expanded month value");
            assert.ok(data.rows[2].children[7].children, "children exist");
            assert.equal(data.rows[2].children[7].children.length, 31, "expanded month's childern");
            assert.equal(data.rows[2].children[7].children[3].value, "4", "August 4 value");

            assert.strictEqual(data.rows[2].text, "CY 2003", "expanded row value");
            assert.ok(data.rows[2].children, "expanded row should has children");
            assert.strictEqual(data.rows[2].children.length, 12, "expanded row children");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[2].children[7], data.columns[0]), 184, "GT - Mountain Bikes - August");
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], data.columns[0]), 5, "Mountain Bikes - August4");
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], data.columns[1]), 9, "Road Bikes - August4");
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], data.columns[2]), 2, "Touring Bikes - August4");

            done();
        }).fail(function() {
            assert.ok(false, "failed");
            done();
        });
    });

    QUnit.test("Load expanded axis", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]", expanded: true }, { dataField: "[Product].[Subcategory]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, "GT");
            done();
        }).fail(function() {
            assert.ok(false, "failed");
            done();
        });
    });

    QUnit.test("Load with expanded hidden level item", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]", expanded: true }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[2].children);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, "GT");
            done();
        }).fail(function() {
            assert.ok(false, "failed");
            done();
        });
    });

    QUnit.test("Expanded all items", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]", expanded: true }, {
                dataField: "[Product].[Subcategory]",
                expanded: true
            }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", expanded: true }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, "GT");
            done();
        }).fail(function() {
            assert.ok(false, "failed");
            done();
        });
    });

    QUnit.test("Loaded with two level expanded items", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]", expanded: true },
                { dataField: "[Ship Date].[Calendar Quarter of Year]", expanded: true },
                { dataField: "[Ship Date].[Month of Year]" },
                { dataField: "[Ship Date].[Day Name]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 4);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, "row[" + i + "] -should has children");

                $.each(row.children, function(j, row) {
                    assert.ok(row.children, "row[" + i + "][" + j + "] -should has children");
                });
            });

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].text, "CY Q3");
            assert.strictEqual(data.rows[0].children[1].text, "CY Q4");
            assert.strictEqual(data.rows[1].text, "CY 2002");

            assert.strictEqual(data.rows[3].children[2].text, "CY Q3");

            assert.strictEqual(getValue(data, data.rows[2].children[0]), 792, "2003 CY Q1 -> Total");
            assert.strictEqual(getValue(data, data.rows[1].children[1]), 627, "2002 CY Q2 -> Total");
            assert.strictEqual(getValue(data, data.rows[3].children[1]), 5973, "2004 CY Q2 -> Total");

            assert.strictEqual(getValue(data), 18484, "GT");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Expand item with expanded children", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]" },
                { dataField: "[Ship Date].[Calendar Quarter of Year]", expanded: true },
                { dataField: "[Ship Date].[Month of Year]" },
                { dataField: "[Ship Date].[Day Name]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: [CALENDAR_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 4);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, "row[" + i + "] -should has children");
            });

            assert.strictEqual(data.rows[0].text, "CY Q1");
            assert.deepEqual(data.rows[0].value, "CY Q1");
            assert.strictEqual(data.rows[0].children.length, 3);
            assert.strictEqual(data.rows[0].children[0].text, "January");
            assert.strictEqual(data.rows[0].children[2].text, "March");
            assert.strictEqual(data.rows[1].text, "CY Q2");

            assert.strictEqual(data.rows[data.rows.length - 1].text, "CY Q4");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(getValue(data, data.rows[0]), 792, "CY Q1 Total");
            assert.strictEqual(getValue(data, data.rows[1]), 938, "CY Q2 Total");
            assert.strictEqual(getValue(data, data.rows[data.rows.length - 1]), 4968, "CY Q4 Total");

            assert.strictEqual(getValue(data, data.rows[0].children[2]), 271, "CY Q1->March Total");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("defined only cells", function(assert) {
        var done = assert.async();
        this.store.load({
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.ok(data);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.rows, []);
            assert.deepEqual(data.columns, []);
            assert.deepEqual(data.values, [
                [[18484]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("defined columns and cells", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            values: [{ dataField: "[Measures].[Internet Sales Amount]", caption: 'Count' }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.columns, CATEGORIES_DATA, "columns");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[29358677.2207], [700759.96], [28318144.6507], [339772.61]]
            ], "cells");

            assert.ok(!data.rows.length, "rows");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("defined cells and rows", function(assert) {
        var done = assert.async();
        this.store.load({
            rows: [{ dataField: "[Product].[Category]" }],
            values: [{ dataField: "[Measures].[Internet Sales Amount]", caption: 'Count' }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.rows, CATEGORIES_DATA, "rows");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[29358677.2207]],
                [[700759.96]],
                [[28318144.6507]],
                [[339772.61]]
            ], "cells");

            assert.ok(!data.columns.length, "rows");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("defined columns and rows", function(assert) {
        var done = assert.async();
        this.store.load({
            rows: [{ dataField: "[Product].[Category]" }],
            columns: [{ dataField: "[Ship Date].[Calendar Year]" }]
        }).done(function(data) {
            assert.deepEqual(data.rows, CATEGORIES_DATA_WITH_COMPONENTS, "rows");

            assert.deepEqual(data.columns, CALENDAR_YEAR_DATA, "columns");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[80450596.9823], [8065435.3053], [24144429.654], [32202669.4252], [16038062.5978]],
                [[571297.9278], [20235.3646], [92735.3534], [296532.8766], [161794.3332]],
                [[66302381.557], [7395348.6266], [19956014.6741], [25551775.0727], [13399243.1836]],
                [[1777840.8391], [34376.3353], [485587.1546], [871864.1866], [386013.1626]],
                [[11799076.6584], [615474.9788], [3610092.4719], [5482497.2893], [2091011.9184]]
            ], "cells");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("defined columns only", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Ship Date].[Calendar Year]" }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.rows, [], "rows");

            assert.deepEqual(data.columns, CALENDAR_YEAR_DATA, "columns");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[80450596.9823], [8065435.3053], [24144429.654], [32202669.4252], [16038062.5978]]
            ], "cells");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("defined rows only", function(assert) {
        var done = assert.async();
        this.store.load({
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);

            assert.deepEqual(data.columns, [], "columns");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[80450596.9823]],
                [[8065435.3053]],
                [[24144429.654]],
                [[32202669.4252]],
                [[16038062.5978]]
            ], "cells");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Load with two measures", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [
                { dataField: "[Measures].[Customer Count]", caption: 'Count' },
                { dataField: "[Measures].[Order Count]", caption: 'Count' }
            ]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA_WITH_COMPONENTS);
            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484, 31455], [15114, 19523], [9132, 18358], [6852, 9871], [null, 2646]],
                [[962, 1328], [null, 135], [962, 1307], [null, 242], [null, 205]],
                [[2665, 3680], [null, 356], [2665, 3515], [null, 644], [null, 702]],
                [[9002, 12027], [6470, 7701], [4756, 6772], [2717, 3816], [null, 1138]],
                [[11753, 14420], [9745, 11331], [5646, 6764], [4340, 5169], [null, 601]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("T321308: dxPivotGrid with XMLA store - uncaught exception occurs when all field cells are empty", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Internet Sales Order Details].[Carrier Tracking Number]" }],
            rows: [],
            values: [
                { dataField: "[Measures].[Customer Count]", caption: 'Count' }
            ]
        }).done(function(data) {
            assert.ok(data);
            assert.ok(data.values.length);
            assert.strictEqual(getValue(data), 18484);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("T566739. Get All field values without load values", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [],
            values: [
                { dataField: "[Measures].[Internet Order Count]", caption: 'Data1' },
                { dataField: "[Measures].[Growth in Customer Base]", caption: 'Data2' },
                { dataField: "[Measures].[Customer Count]", caption: 'Data3' }
            ],
            skipValues: true
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA_WITH_COMPONENTS);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("T677334. Correct parse result with empty member value", function(assert) {
        var send = pivotGridUtils.sendRequest;
        sinon.stub(pivotGridUtils, "sendRequest", function() {
            var deferred = $.Deferred();
            send.apply(this, arguments)
                .then(function() {
                    arguments[0] = arguments[0].replace(/<MEMBER_VALUE xsi:type="xsd:short">2001<\/MEMBER_VALUE>/g, "<MEMBER_VALUE/>");
                    deferred.resolve.apply(deferred, arguments);
                })
                .fail(deferred.reject);

            return deferred.promise();
        });

        var done = assert.async();

        this.store
            .load({
                columns: [],
                rows: [{ dataField: "[Ship Date].[Calendar Year]", filterValues: [CALENDAR_YEAR_DATA[0].key] }, { dataField: "[Ship Date].[Month Of Year]" }],
                values: [{ dataField: "[Measures].[Customer Count]" }],
                headerName: "columns",
                rowExpandedPaths: [[CALENDAR_YEAR_DATA[0].key]]
            })
            .done(function(data) {
                assert.strictEqual(data.rows.length, 1);
                assert.strictEqual(data.rows[0].value, "");
                assert.strictEqual(getValue(data, data.rows[0], data.columns[0]), 962);
            })
            .fail(getFailCallBack(assert))
            .always(function() {
                pivotGridUtils.sendRequest.restore();
                done();
            });
    });

    QUnit.module("Hierarchies", testEnvironment);

    QUnit.test("Load from hierachy", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [{
                dataField: "[Ship Date].[Calendar].[Calendar Year]",
                hierarchyName: "[Ship Date].[Calendar]"
            }, { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);
            assert.deepEqual(data.rows, CALENDAR_HIERARCHY_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484], [15114], [9132], [6852]],
                [[962], [null], [962], [null]],
                [[2665], [null], [2665], [null]],
                [[9002], [6470], [4756], [2717]],
                [[11753], [9745], [5646], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expand item", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);

            assert.strictEqual(data.rows.length, 12);

            assert.strictEqual(data.rows[0].text, "January 2003");
            assert.deepEqual(data.rows[0].value, "2003-01-01 00:00:00");
            assert.strictEqual(data.rows[0].index, 3, "January 2003 index");

            assert.deepEqual(data.rows[11].value, "2003-12-01 00:00:00");
            assert.strictEqual(data.rows[11].text, "December 2003");
            assert.strictEqual(data.rows[11].index, 18, "December 2003 index");

            assert.strictEqual(data.grandTotalColumnIndex, 0, "grandTotalColumnIndex");
            assert.strictEqual(data.grandTotalRowIndex, undefined, "grandTotalRowIndex");

            assert.strictEqual(data.values[12][0][0], 462, "GT - 2003 July");

            assert.strictEqual(data.values[13][0][0], 1262, "GT - 2003 August");

            assert.strictEqual(data.values[13][2][0], 492), "Bikes - 2003 August";
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expand column & row", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            },
            {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }
            ],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],

            headerName: "columns",
            rowExpandedPaths: [[CALENDAR_HIERARCHY_YEAR_DATA[2].key]],
            path: [CATEGORIES_HIERARCHY_DATA[1].key]
        }).done(function(data) {
            assert.deepEqual(data.columns, BIKES_SUBCATEGORY_DATA);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "CY 2003");
            assert.strictEqual(data.rows[2].index, 3, "expanded row");
            assert.ok(data.rows[2].children, "expanded row should has children");
            assert.strictEqual(data.rows[2].children.length, 12);
            assert.strictEqual(data.rows[2].children[0].text, "January 2003");
            assert.deepEqual(data.rows[2].children[0].value, "2003-01-01 00:00:00");
            assert.strictEqual(data.rows[2].children[0].index, 7, "January 2003 index");

            assert.strictEqual(data.grandTotalColumnIndex, undefined);
            assert.strictEqual(data.grandTotalRowIndex, 0, "GT row index");

            assert.strictEqual(data.values[3][1][0], 1896, "Mounain Bikes - 2003");

            assert.strictEqual(data.values[7][1][0], 98, "Mounain Bikes - 2003 January");

            assert.strictEqual(data.values[13][3][0], null, "Touring Bikes - 2003 June");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expand second level child", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }, {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Date]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: ["&[2003]", "[Ship Date].[Calendar].[Month].&[2003]&[8]"]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);
            assert.strictEqual(data.rows.length, 31);

            assert.strictEqual(data.rows[0].text, "August 1, 2003");
            assert.deepEqual(data.rows[0].value, "2003-08-01T00:00:00");
            assert.strictEqual(data.rows[0].index, 1, "August 1, 2003 index");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "August 3, 2003");
            assert.strictEqual(data.rows[2].index, 3, "expanded row index");

            assert.strictEqual(data.rows[3].text, "August 4, 2003");
            assert.strictEqual(data.rows[3].index, 4, "August 4, 2003 index");

            assert.ok(!data.rows[2].children, "expanded row should has children");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, undefined);

            assert.strictEqual(data.values[1][0][0], 15, "GT - August1");
            assert.strictEqual(data.values[1][1][0], 12, "Bikes - August1");
            assert.strictEqual(data.values[4][3][0], 5, "Clothing - August4");

            assert.strictEqual(data.values[4][0][0], 16, "GT - August4");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expand child when opposite axis expanded on several levels", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }, {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Date]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "columns",
            rowExpandedPaths: [
                [CALENDAR_HIERARCHY_YEAR_DATA[2].key],
                [CALENDAR_HIERARCHY_YEAR_DATA[2].key, "[Ship Date].[Calendar].[Month].&[2003]&[8]"]
            ],
            path: [CATEGORIES_HIERARCHY_DATA[1].key]
        }).done(function(data) {
            assert.deepEqual(data.columns, BIKES_SUBCATEGORY_DATA);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, "CY 2003");

            assert.equal(data.rows[2].children.length, 12, "expanded year's children");

            assert.equal(data.rows[2].children[7].text, "August 2003", "expanded month value");
            assert.ok(data.rows[2].children[7].children, "children exist");
            assert.equal(data.rows[2].children[7].children.length, 31, "expanded month's childern");
            assert.equal(data.rows[2].children[7].children[3].index, 26, "August 4 index");
            assert.equal(data.rows[2].children[7].children[3].text, "August 4, 2003", "August 4 value");

            assert.strictEqual(data.rows[2].index, 3, "expanded row index");
            assert.strictEqual(data.rows[2].text, "CY 2003", "expanded row value");
            assert.ok(data.rows[2].children, "expanded row should has children");
            assert.strictEqual(data.rows[2].children.length, 12, "expanded row children");

            assert.strictEqual(data.grandTotalColumnIndex, undefined);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(data.values[17][1][0], 184, "GT - Mountain Bikes - August");
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], BIKES_SUBCATEGORY_DATA[0]), 5, "Mountain Bikes - August4");
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], BIKES_SUBCATEGORY_DATA[1]), 9, "Road Bikes - August4");
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], BIKES_SUBCATEGORY_DATA[2]), 2, "Touring Bikes - August4");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy Load expanded axis", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]"
                }
            ],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, "GT");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Load with expanded hidden level item", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]"
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                }
            ],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[2].children);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, "GT");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expanded all items", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                }
            ],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, "GT");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierachy. Loaded with two level expanded items", function(assert) {
        assert.expect(30);

        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }, {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Quarter]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 4);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, "row[" + i + "] -should has children");

                $.each(row.children, function(j, row) {
                    assert.ok(row.children, "row[" + i + "][" + j + "] -should has children");
                });
            });

            assert.strictEqual(data.rows[0].text, "CY 2001");
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].text, "Q3 CY 2001");
            assert.strictEqual(data.rows[0].children[1].text, "Q4 CY 2001");
            assert.deepEqual(data.rows[0].children[1].value, "Q4 CY 2001");
            assert.strictEqual(data.rows[1].text, "CY 2002");

            assert.strictEqual(data.rows[3].children[2].text, "Q3 CY 2004");

            assert.strictEqual(getValue(data, data.rows[2].children[0]), 792, "2003 CY Q1 -> Total");
            assert.strictEqual(getValue(data, data.rows[1].children[1]), 627, "2002 CY Q2 -> Total");
            assert.strictEqual(getValue(data, data.rows[3].children[1]), 5973, "2004 CY Q2 -> Total");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expand item with expanded children", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }, {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Semester]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                { dataField: "[Ship Date].[Calendar].[Calendar Quarter]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 2);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, "row[" + i + "] -should has children");
            });

            assert.strictEqual(data.rows[0].text, "H1 CY 2003");
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].text, "Q1 CY 2003");
            assert.strictEqual(data.rows[0].children[1].text, "Q2 CY 2003");
            assert.strictEqual(data.rows[1].text, "H2 CY 2003");

            assert.strictEqual(data.rows[data.rows.length - 1].text, "H2 CY 2003");
            assert.strictEqual(data.rows[data.rows.length - 1].index, 2);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, undefined);
            assert.strictEqual(getValue(data, data.rows[0]), 1730, "H1 CY 2003 Total");
            assert.strictEqual(getValue(data, data.rows[0].children[1]), 938, "Q2 CY 2003 Total");
            assert.strictEqual(getValue(data, data.rows[1]), 7839, "H2 CY 2003 Total");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy. Expand item with two expanded children", function(assert) {
        assert.expect(22);

        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }, {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Semester]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Quarter]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 2);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, "row[" + i + "] -should has children");
                $.each(row.children, function(j, row) {
                    assert.ok(row.children, "row[" + i + "][" + j + "] -should has children");
                });
            });

            assert.strictEqual(data.rows[0].index, 1);
            assert.strictEqual(data.rows[0].text, "H1 CY 2003");
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].index, 3);
            assert.strictEqual(data.rows[0].children[0].text, "Q1 CY 2003");
            assert.strictEqual(data.rows[0].children[0].children.length, 3);
            assert.strictEqual(data.rows[0].children[0].children[0].index, 7);
            assert.strictEqual(data.rows[0].children[0].children[0].text, "January 2003");
            assert.strictEqual(data.rows[0].children[0].children[1].text, "February 2003");
            assert.strictEqual(data.rows[0].children[1].index, 4);
            assert.strictEqual(data.rows[0].children[1].text, "Q2 CY 2003");
            assert.strictEqual(data.rows[1].index, 2);
            assert.strictEqual(data.rows[1].text, "H2 CY 2003");
        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Expand item", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Product].[Category]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "columns",
            path: ["&[2003]"]
        }).done(function(data) {
            assert.deepEqual(data.rows, []);
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, undefined, data.columns[0]), 6470, "GT - Accessories");
            assert.strictEqual(getValue(data, undefined, data.columns[1]), 4756, "GT - Bikes");
            assert.strictEqual(getValue(data, undefined, data.columns[2]), 2717, "GT - Clothing");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Not hierarchy & hierarchy. Expand item", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Product].[Category]" },
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "columns",
            path: ["&[1]"]
        }).done(function(data) {
            var calendarYearData = $.map(CALENDAR_HIERARCHY_YEAR_DATA, function(item) {
                return $.extend({}, item, { index: item.index - 1 });
            });

            assert.deepEqual(data.rows, []);
            assert.deepEqual(data.columns, calendarYearData);

            assert.strictEqual(data.grandTotalColumnIndex, undefined);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 962, "GT - CY 2001");
            assert.strictEqual(data.values[0][1][0], 2665, "GT - CY 2002");
            assert.strictEqual(data.values[0][2][0], 4756, "GT - CY 2003");
            assert.strictEqual(data.values[0][3][0], 5646, "GT - CY 2004");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Not hierarchy & hierarchy. expanded not hierarchy level", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Ship Date].[Calendar Year]", expanded: true },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]" }]
        })
            .done(function(data) {
                assert.strictEqual(data.columns.length, 4);

                assert.strictEqual(data.columns[0].text, "CY 2001");
                assert.deepEqual(removeIndexesAndValue(data.columns[0].children), [
                    {
                        text: "July 2001"
                    },
                    {
                        text: "August 2001"
                    },
                    {
                        text: "September 2001"
                    },
                    {
                        text: "October 2001"
                    },
                    {
                        text: "November 2001"
                    },
                    {
                        text: "December 2001"
                    }
                ]);

            }).fail(getFailCallBack(assert)).always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Load expanded axis", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                { dataField: "[Product].[Category]" }
            ],

            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {

            assert.strictEqual(getValue(data), 18484, "GT");

            assert.strictEqual(getValue(data, undefined, data.columns[0].children[0]), 962, "GT Bikes 2001");
            assert.strictEqual(getValue(data, undefined, data.columns[0].children[0]), 962, "GT -  CY 2001 Total");
            assert.strictEqual(getValue(data, undefined, data.columns[2]), 9002, "GT -  CY 2003 Total");

            assert.strictEqual(data.columns.length, 4);

            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                children: [
                    {
                        text: "Bikes"
                    }
                ],
                text: "CY 2001"
            },
            {
                children: [
                    {
                        text: "Bikes"
                    }
                ],
                text: "CY 2002"
            },
            {
                children: [
                    {
                        text: "Accessories"
                    },
                    {
                        text: "Bikes"
                    },
                    {
                        text: "Clothing"
                    }
                ],
                text: "CY 2003"
            },
            {
                children: [
                    {
                        text: "Accessories"
                    },
                    {
                        text: "Bikes"
                    },
                    {
                        text: "Clothing"
                    }
                ],
                text: "CY 2004"
            }]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Load expanded axis. With filter", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value",
                    groupIndex: 0
                },
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value",
                    groupIndex: 0
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "value",
                    groupIndex: 1
                }
            ],
            filters: [
                {
                    dataField: "[Product].[Product Categories]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "desc",
                    sortBy: "value",
                    area: "column",
                    filterValues: ["Clothing"],
                    filterType: "include"
                },
                {
                    dataField: "[Ship Date].[Calendar]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "value",
                    area: "column",
                    filterValues: ["CY 2003"],
                    filterType: "include"
                }
            ],

            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {

            assert.strictEqual(data.columns[0].text, "Clothing");
            assert.strictEqual(data.columns[0].index, 1);
            assert.strictEqual(data.columns[0].children[0].text, "CY 2003");
            assert.strictEqual(data.columns[0].children[0].index, 2);

            assert.strictEqual(data.columns[0].children[0].children[0].text, "December 2003");
            assert.strictEqual(data.columns[0].children[0].children[0].index, 11);

            assert.strictEqual(data.grandTotalColumnIndex, 0);

            assert.deepEqual(data.values, [[[2717], [2717], [2717], [2717], [1064], [122], [426], [532], [1704], [547], [530], [655]]]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Load expanded axis with expanded not hirarchy children", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                { dataField: "[Product].[Category]", expanded: true },
                { dataField: "[Product].[Subcategory]" }
            ],

            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 4);
            assert.strictEqual(data.columns[2].text, "CY 2003");
            assert.strictEqual(data.columns[2].children.length, 3);
            assert.strictEqual(data.columns[2].children[1].children.length, 3);
            assert.strictEqual(data.columns[2].children[1].children[1].text, "Road Bikes");
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(getValue(data), 18484, "GT");
            assert.strictEqual(getValue(data, undefined, data.columns[0].children[0]), 962, "GT Bikes 2001");
            assert.strictEqual(getValue(data, undefined, data.columns[0]), 962, "GT -  CY 2001 Total");
            assert.strictEqual(getValue(data, undefined, data.columns[2].children[1].children[1]), 2513, "CY 2003 Road Bikes Total");

            assert.strictEqual(data.values[0][3][0], 9002, "GT -  CY 2003 Total");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Expand hierarchy item with expanded not hirarchy children", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Product].[Category]", expanded: true },
                { dataField: "[Product].[Subcategory]" }
            ],

            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "columns",
            path: ["&[2003]"]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[1].children.length, 3);
            assert.strictEqual(data.columns[1].children[1].text, "Road Bikes");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(getValue(data, undefined, data.columns[0]), 6470, "GT - Asscessories");
            assert.strictEqual(getValue(data, undefined, data.columns[1].children[1]), 2513, "GT - Bikes - Road Bikes");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Expand column & row.", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Product].[Color]" }
            ],
            rows: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],

            headerName: "rows",
            columnExpandedPaths: [["[Ship Date].[Calendar].[Calendar Year].&[2002]"], ["[Ship Date].[Calendar].[Calendar Year].&[2003]"]],
            path: [CATEGORIES_DATA[1].key]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[0], data.columns[1].children[2]), 278, "Mountain Bikes - CY2002->Silver");
            assert.strictEqual(getValue(data, data.rows[2], data.columns[2].children[4]), 295, "Touring Bikes - CY2003->Yellow");
            assert.strictEqual(getValue(data, data.rows[2], data.columns[2].children[2]), null, "Touring Bikes - CY2003->Yellow");
            assert.strictEqual(getValue(data, data.rows[2], data.columns[3]), 1394, "Touring Bikes - CY2004");

            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                text: "CY 2001"
            }, {
                text: "CY 2002",
                children: [{
                    text: "Black"
                }, {
                    text: "Red"
                }, {
                    text: "Silver"
                }, {
                    text: "Yellow"
                }]
            }, {
                children: [{
                    text: "Black"
                }, {
                    text: "Blue"
                }, {
                    text: "Red"
                }, {
                    text: "Silver"
                }, {
                    text: "Yellow"
                }],
                text: "CY 2003"
            },
            {
                text: "CY 2004"
            }
            ]);

            assert.deepEqual(removeIndexesAndValue(data.rows), [{
                text: "Mountain Bikes"
            }, {
                text: "Road Bikes"
            }, {
                text: "Touring Bikes"
            }]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0, "GT row index");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. Expand row & column.", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Product].[Color]" }
            ],
            rows: [{ dataField: "[Product].[Category]" }, { dataField: "[Product].[Subcategory]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],

            headerName: "columns",
            rowExpandedPaths: [[CATEGORIES_DATA[1].key]],
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {

            assert.strictEqual(getValue(data, data.rows[1].children[1], data.columns[0]), 1291, "Road Bikes - Black");
            assert.strictEqual(getValue(data, data.rows[1].children[2], data.columns[7]), 295, "Touring Bikes - Yellow");
            assert.strictEqual(getValue(data, data.rows[0], data.columns[5]), 286, "Accesories - Silver");

            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                text: "Black"
            }, {
                text: "Blue"
            }, {
                text: "Multi"
            }, {
                text: "NA"
            }, {
                text: "Red"
            }, {
                text: "Silver"
            }, {
                text: "White"
            }, {
                text: "Yellow"
            }]);

            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: "Accessories"
                }, {
                    children: [{
                        text: "Mountain Bikes"
                    }, {
                        text: "Road Bikes"
                    }, {
                        text: "Touring Bikes"
                    }],
                    text: "Bikes"
                }, {
                    text: "Clothing"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0, "GT row index");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & not hierarchy. expanded hierarchy level", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                { dataField: "[Product].[Category]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 38);
            assert.strictEqual(data.columns[4].text, "November 2001");
            assert.deepEqual(removeIndexesAndValue(data.columns[4].children), [{
                text: "Bikes"
            }]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & hierarchy. expanded hierarchy level", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]"
                }
            ],

            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 4);
            assert.deepEqual(removeIndexesAndValue(data.columns)[3], {
                children: [{
                    children: [{
                        text: "Bike Racks"
                    }, {
                        text: "Bike Stands"
                    }, {
                        text: "Bottles and Cages"
                    }, {
                        text: "Cleaners"
                    }, {
                        text: "Fenders"
                    }, {
                        text: "Helmets"
                    }, {
                        text: "Hydration Packs"
                    }, {
                        text: "Tires and Tubes"
                    }],
                    text: "Accessories"
                }, {
                    children: [{
                        text: "Mountain Bikes"
                    }, {
                        text: "Road Bikes"
                    }, {
                        text: "Touring Bikes"
                    }],
                    text: "Bikes"
                }, {
                    children: [{
                        text: "Caps"
                    }, {
                        text: "Gloves"
                    }, {
                        text: "Jerseys"
                    }, {
                        text: "Shorts"
                    }, {
                        text: "Socks"
                    }, {
                        text: "Vests"
                    }],
                    text: "Clothing"
                }],
                text: "CY 2004"
            });

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Hierarchy & hierarchy. Expand item with expanded next hierarchy level", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [
                { dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" },
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]"
                }
            ],
            headerName: "columns",
            path: [CALENDAR_HIERARCHY_YEAR_DATA[3].key],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                children: [{
                    text: "Bike Racks"
                }, {
                    text: "Bike Stands"
                }, {
                    text: "Bottles and Cages"
                }, {
                    text: "Cleaners"
                }, {
                    text: "Fenders"
                }, {
                    text: "Helmets"
                }, {
                    text: "Hydration Packs"
                }, {
                    text: "Tires and Tubes"
                }],
                text: "Accessories"
            }, {
                children: [{
                    text: "Mountain Bikes"
                }, {
                    text: "Road Bikes"
                }, {
                    text: "Touring Bikes"
                }],
                text: "Bikes"
            }, {
                children: [{
                    text: "Caps"
                }, {
                    text: "Gloves"
                }, {
                    text: "Jerseys"
                }, {
                    text: "Shorts"
                }, {
                    text: "Socks"
                }, {
                    text: "Vests"
                }],
                text: "Clothing"
            }]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module("Discover", testEnvironment);

    QUnit.test("Discover. Incorrect dataSource url", function(assert) {
        var done = assert.async();
        new Store({
            url: "",
            catalog: "Adventure Works DW Standard Edition",
            cube: "Adventure Works"
        }).getFields().fail(function() {
            assert.ok(true);
            done();
        });
    });

    QUnit.test("Discover. Incorrect dataSource cube", function(assert) {
        var done = assert.async();
        new Store($.extend({}, this.dataSource, {
            cube: "cube"
        })).getFields()
            .done(function(data) {
                assert.ok(!data.length);
            }).fail(getFailCallBack(assert)).always(done);
    });

    QUnit.test("Discover. Incorrect dataSource catalog", function(assert) {
        var done = assert.async();
        new Store($.extend({}, this.dataSource, {
            catalog: "catalog"
        })).getFields()
            .done(function(data) {
                assert.equal(data.length, 0);
            }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Discover", function(assert) {
        var done = assert.async();

        this.store.getFields().done(function(data) {
            assert.ok(data);
            assert.equal(data.length, 302);

            assert.deepEqual(findItems(data, "dataField", "[Measures].[Internet Sales Amount]"), [{
                caption: "Internet Sales Amount",
                displayFolder: "Internet Sales",
                dataField: "[Measures].[Internet Sales Amount]",
                dimension: "Measures",
                groupIndex: undefined,
                hierarchyName: undefined,
                groupName: undefined,
                isMeasure: true,
                isDefault: false
            }], "Measure item");

            assert.strictEqual(findItems(data, "isMeasure", true).length, 47, "Measures count");

            assert.deepEqual(findItems(data, "dataField", "[Customer].[Yearly Income]"), [{
                dataField: "[Customer].[Yearly Income]",
                caption: "Yearly Income",
                displayFolder: "Demographic",
                dimension: "Customer",
                hierarchyName: undefined,
                groupName: undefined,
                groupIndex: undefined,
                isMeasure: false,
                isDefault: false
            }], "not Hierarchy");

            assert.deepEqual(findItems(data, "dataField", "[Date].[Calendar].[Calendar Year]"), [{
                caption: "Calendar Year",
                dataField: "[Date].[Calendar].[Calendar Year]",
                dimension: "Date",
                groupIndex: 0,
                hierarchyName: "[Date].[Calendar]",
                groupName: "[Date].[Calendar]",
                displayFolder: "",
                isMeasure: false,
                isDefault: false
            }], "hierarchy level");

            assert.deepEqual(findItems(data, "hierarchyName", "[Date].[Calendar]"), [
                {
                    caption: "Date.Calendar",
                    dataField: "[Date].[Calendar]",
                    dimension: "Date",
                    groupIndex: undefined,
                    hierarchyName: "[Date].[Calendar]",
                    groupName: "[Date].[Calendar]",
                    displayFolder: "Calendar",
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: "Calendar Year",
                    dataField: "[Date].[Calendar].[Calendar Year]",
                    dimension: "Date",
                    groupIndex: 0,
                    hierarchyName: "[Date].[Calendar]",
                    groupName: "[Date].[Calendar]",
                    displayFolder: "",
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: "Calendar Semester",
                    dataField: "[Date].[Calendar].[Calendar Semester]",
                    dimension: "Date",
                    groupIndex: 1,
                    hierarchyName: "[Date].[Calendar]",
                    groupName: "[Date].[Calendar]",
                    displayFolder: "",
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: "Calendar Quarter",
                    dataField: "[Date].[Calendar].[Calendar Quarter]",
                    dimension: "Date",
                    groupIndex: 2,
                    hierarchyName: "[Date].[Calendar]",
                    groupName: "[Date].[Calendar]",
                    displayFolder: "",
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: "Month",
                    dataField: "[Date].[Calendar].[Month]",
                    dimension: "Date",
                    groupIndex: 3,
                    hierarchyName: "[Date].[Calendar]",
                    groupName: "[Date].[Calendar]",
                    displayFolder: "",
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: "Date",
                    dataField: "[Date].[Calendar].[Date]",
                    dimension: "Date",
                    groupIndex: 4,
                    hierarchyName: "[Date].[Calendar]",
                    groupName: "[Date].[Calendar]",
                    displayFolder: "",
                    isMeasure: false,
                    isDefault: false
                }
            ], "Hierarchy item, with levels");

            assert.deepEqual(findItems(data, "dataField", "[Customer].[Customer Geography]")[0].isDefault, true, "default hierarchy");
            assert.deepEqual(findItems(data, "isDefault", true).length, 16, "Default fields count");

            assert.strictEqual(findItems(data, "groupIndex", -1).length, 0, "all level not exists");

            assert.strictEqual(findItems(data, "dataField", "[Measures]").length, 0, "Measure Hieararchy doesn't exist");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module("Filtering", testEnvironment);

    QUnit.test("FilterValues in row and column fields. Include filter", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Category]",
                filterValues: ["Bikes", "Accessories"],
                filterType: "include"
            }],
            rows: [{
                dataField: "[Ship Date].[Calendar Year]",
                filterValues: ["CY 2002", "CY 2003"],
                filterType: "include"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: "Accessories" },
                { text: "Bikes" }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2002" },
                { text: "CY 2003" }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[10054], [6470], [6246]],
                [[2665], [null], [2665]],
                [[8564], [6470], [4756]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("FilterValues in row and column fields. Exclude Filter", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Category]",
                filterValues: ["Bikes", "Accessories"],
                filterType: "exclude"
            }],
            rows: [{
                dataField: "[Ship Date].[Calendar Year]",
                filterValues: ["CY 2002", "CY 2003"],
                filterType: "exclude"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: "Clothing" }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2004" }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[4340], [4340]],
                [[4340], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("FilterValues in columns field", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Category]",
                filterValues: ["Bikes", "Accessories"],
                filterType: "include"
            }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: "Accessories" },
                { text: "Bikes" }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2001" },
                { text: "CY 2002" },
                { text: "CY 2003" },
                { text: "CY 2004" }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [[[17719], [15114], [9132]],
                [[962], [null], [962]],
                [[2665], [null], [2665]],
                [[8564], [6470], [4756]],
                [[11182], [9745], [5646]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("FilterValues in rows field", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar Year]",
                    filterValues: ["CY 2001", "CY 2002"],
                    filterType: "exclude"
                },
                {
                    dataField: "[Ship Date].[Month Of Year]",
                    filterValues: ["January", "February"],
                    filterType: "include"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: "Accessories" },
                { text: "Bikes" },
                { text: "Clothing" }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2003" },
                { text: "CY 2004" }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[3908], [2918], [2005], [1272]],
                [[521], [null], [521], [null]],
                [[3538], [2918], [1635], [1272]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Filter field. Include type", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [{
                dataField: "[Ship Date].[Month Of Year]",
                filterValues: ["January", "February"],
                filterType: "include"
            }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2002" },
                { text: "CY 2003" },
                { text: "CY 2004" }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[4201], [2918], [2298], [1272]],
                [[361], [null], [361], [null]],
                [[521], [null], [521], [null]],
                [[3538], [2918], [1635], [1272]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Filter field. Exclude type", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [{
                dataField: "[Ship Date].[Month Of Year]",
                filterValues: ["January", "February"],
                filterType: "exclude"
            }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[16439], [12860], [8375], [5741]],
                [[962], [null], [962], [null]],
                [[2304], [null], [2304], [null]],
                [[8695], [6470], [4449], [2717]],
                [[8790], [7220], [4192], [3164]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Filter field. Include and exclude filters", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [
                {
                    dataField: "[Ship Date].[Month Of Year]",
                    filterValues: ["January", "February"],
                    filterType: "include"
                },
                {
                    dataField: "[Customer].[Country]",
                    filterValues: ["Australia", "United Kingdom", "United States"],
                    filterType: "exclude"
                }
            ]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2002" },
                { text: "CY 2003" },
                { text: "CY 2004" }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[1231], [901], [608], [398]],
                [[92], [null], [92], [null]],
                [[121], [null], [121], [null]],
                [[1057], [901], [434], [398]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Ignore filterValues for hierarchyLevel field", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]",
                filterValues: ["Bikes"],
                groupIndex: 1
            }],
            rows: [{ dataField: "[Ship Date].[Calendar].[Calendar Year]", hierarchyName: "[Ship Date].[Calendar]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);
            assert.deepEqual(data.rows, CALENDAR_HIERARCHY_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484], [15114], [9132], [6852]],
                [[962], [null], [962], [null]],
                [[2665], [null], [2665], [null]],
                [[9002], [6470], [4756], [2717]],
                [[11753], [9745], [5646], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Filter hierarchyLevel field. Include type", function(assert) {
        var done = assert.async();
        this.store.load({
            "columns": [
                { "dimension": "Ship Date", "dataField": "[Ship Date].[Calendar Year]" }
            ],
            "values": [
                { "dimension": "Measures", "dataField": "[Measures].[Customer Count]" }
            ],

            "filters": [{
                "dataField": "[Ship Date].[Calendar]",
                "hierarchyName": "[Ship Date].[Calendar]",
                "groupName": "[Ship Date].[Calendar]",
                "filterValues": [
                    "H2 CY 2002",
                    ["CY 2003"],
                    ["CY 2004", "H1 CY 2004"],
                    ["CY 2004", "H2 CY 2004", "Q3 CY 2004", "August 2004"],
                    []
                ]
            }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: "CY 2002" },
                { text: "CY 2003" },
                { text: "CY 2004" }
            ]);
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [[[17498], [1468], [9002], [10834]]]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Filter hierarchyLevel field. Exclude type", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [
                {
                    dataField: "[Product].[Product Categories]",
                    hierarchyName: "[Product].[Product Categories]",
                    filterValues: ["Clothing", "Mountain Bikes"],
                    filterType: "exclude"
                }
            ]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: "Accessories" },
                { text: "Bikes" }
            ]);
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[17366], [15114], [7990]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("FilterValues using full key value in row and column fields. Include filter", function(assert) {
        var done = assert.async();
        this.store.load({
            columns: [],
            rows: [{
                dataField: "[Ship Date].[Calendar Year]",
                filterValues: [CALENDAR_YEAR_DATA[1].key, CALENDAR_YEAR_DATA[2].key],
                filterType: "include"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: "CY 2002" },
                { text: "CY 2003" }
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module("Sorting", testEnvironment);

    QUnit.test("Sorting by value", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]", sortOrder: "desc", sortBy: "value" }],
            rows: [{ dataField: "[Ship Date].[Month of Year]", sortOrder: "desc", sortBy: "value" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "value" }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA.slice().reverse());
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: "December"
                },
                {
                    text: "November"
                },
                {
                    text: "October"
                },
                {
                    text: "September"
                },
                {
                    text: "August"
                },
                {
                    text: "July"
                },
                {
                    text: "June"
                },
                {
                    text: "May"
                },
                {
                    text: "April"
                },
                {
                    text: "March"
                },
                {
                    text: "February"
                },
                {
                    text: "January"
                }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by display text", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]", sortOrder: "desc", sortBy: "displayText" }],
            rows: [{ dataField: "[Ship Date].[Month of Year]", sortOrder: "desc", sortBy: "displayText" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc" }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA.slice().reverse());
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: "September"
                },
                {
                    text: "October"
                },
                {
                    text: "November"
                },
                {
                    text: "May"
                },
                {
                    text: "March"
                },
                {
                    text: "June"
                },
                {
                    text: "July"
                },
                {
                    text: "January"
                },
                {
                    text: "February"
                },
                {
                    text: "December"
                },
                {
                    text: "August"
                },
                {
                    text: "April"
                }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by display text. Default sorting when sortOrder is undefined", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Ship Date].[Month of Year]", sortBy: "displayText" }]
        }).done(function(data) {
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.columns[0].text, "April");
            assert.strictEqual(data.columns[1].text, "August");
            assert.strictEqual(data.columns[11].text, "September");

        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test("Sorting by none", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]", sortOrder: "asc", sortBy: "none" }],
            rows: [{ dataField: "[Ship Date].[Month of Year]", sortOrder: "desc", sortBy: "none" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "none" }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: "December"
                },
                {
                    text: "November"
                },
                {
                    text: "October"
                },
                {
                    text: "September"
                },
                {
                    text: "August"
                },
                {
                    text: "July"
                },
                {
                    text: "June"
                },
                {
                    text: "May"
                },
                {
                    text: "April"
                },
                {
                    text: "March"
                },
                {
                    text: "February"
                },
                {
                    text: "January"
                }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by none two dimension on axis and expanded item", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Product].[Category]",
                    "caption": "Category",
                    "displayFolder": "",
                    "isMeasure": false,
                    "area": "row",
                    "index": 131,
                    "sortOrder": "asc",
                    "areaIndex": 0
                },
                {
                    dataField: "[Product].[Subcategory]",
                    "caption": "Subcategory",
                    "displayFolder": "",
                    "isMeasure": false,
                    "area": "row",
                    "index": 156,
                    "sortOrder": "desc",
                    "areaIndex": 1
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "none" }],
            columnExpandedPaths: [["&[1]"]]
        }).done(function(data) {
            assert.deepEqual(data.columns[0].text, "Accessories");

            assert.deepEqual(data.columns[1].text, "Bikes");
            assert.deepEqual(removeIndexesAndValue(data.columns[1].children), [
                {
                    text: "Touring Bikes"
                },
                {
                    text: "Road Bikes"
                },
                {
                    text: "Mountain Bikes"
                }
            ]);
            assert.deepEqual(data.columns[2].text, "Clothing");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting group by none", function(assert) {
        var done = assert.async();
        this.load({
            rows: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "none"
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "none"
                }
            ],
            columns: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true,
                    sortOrder: "asc",
                    sortBy: "none"
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "asc",
                    sortBy: "none"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "none" }]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2004");
            assert.strictEqual(data.rows[1].text, "CY 2003");

            assert.strictEqual(data.rows[1].children[0].text, "December 2003");
            assert.strictEqual(data.rows[1].children[11].text, "January 2003");

            assert.strictEqual(data.columns.length, 3);

            assert.strictEqual(data.columns[0].text, "Accessories");
            assert.strictEqual(data.columns[1].text, "Bikes");

            assert.strictEqual(data.columns[2].children[0].text, "Caps");
            assert.strictEqual(data.columns[2].children[1].text, "Gloves");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]", expanded: true },
                {
                    dataField: "[Ship Date].[Month of Year]",
                    sortOrder: "desc",
                    sortBySummaryField: "[Measures].[Customer Count]"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[2].children[5]), 462, "GT - 2003 July");
            assert.strictEqual(getValue(data, data.rows[2].children[4]), 1262, "GT - 2003 August");
            assert.strictEqual(getValue(data, data.rows[2].children[4], data.columns[1]), 492), "Bikes - 2003 August";

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2001");
            assert.deepEqual(data.rows[1].text, "CY 2002");
            assert.deepEqual(data.rows[2].text, "CY 2003");
            assert.deepEqual(data.rows[3].text, "CY 2004");

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "December"
                },
                {
                    text: "October"
                },
                {
                    text: "November"
                },
                {
                    text: "September"
                },
                {
                    text: "August"
                },
                {
                    text: "July"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "April"
                },
                {
                    text: "March"
                },
                {
                    text: "January"
                },
                {
                    text: "February"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field when expanded items", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]" },
                {
                    dataField: "[Ship Date].[Month of Year]",
                    sortOrder: "desc",
                    sortBySummaryField: "[Measures].[Customer Count]"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            rowExpandedPaths: [["&[2003]"], ["&[2002]"]]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2001");
            assert.deepEqual(data.rows[1].text, "CY 2002");
            assert.deepEqual(data.rows[2].text, "CY 2003");
            assert.deepEqual(data.rows[3].text, "CY 2004");

            assert.deepEqual(removeIndexesAndValue(data.rows[1].children), [
                {
                    text: "December"
                },
                {
                    text: "August"
                },
                {
                    text: "July"
                },
                {
                    text: "May"
                },
                {
                    text: "October"
                },
                {
                    text: "September"
                },
                {
                    text: "March"
                },
                {
                    text: "June"
                },
                {
                    text: "January"
                },
                {
                    text: "April"
                },
                {
                    text: "November"
                },
                {
                    text: "February"
                }
            ]);

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "December"
                },
                {
                    text: "October"
                },
                {
                    text: "November"
                },
                {
                    text: "September"
                },
                {
                    text: "August"
                },
                {
                    text: "July"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "April"
                },
                {
                    text: "March"
                },
                {
                    text: "January"
                },
                {
                    text: "February"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field when expanded items with expanded", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]", filterValues: ["CY 2002", "CY 2003"] },
                {
                    dataField: "[Ship Date].[Month of Year]",
                    sortOrder: "desc",
                    sortBySummaryField: "[Measures].[Customer Count]",
                    expanded: true
                },

                { dataField: "[Ship Date].[Day of Month]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            rowExpandedPaths: [["&[2002]"]]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 2);

            assert.deepEqual(data.rows[0].text, "CY 2002");
            assert.deepEqual(data.rows[1].text, "CY 2003");

            assert.strictEqual(data.rows[0].children[0].text, "December");
            assert.strictEqual(data.rows[0].children[1].text, "August");
            assert.strictEqual(data.rows[0].children[11].text, "February");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field by caption", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]", expanded: true },
                { dataField: "[Ship Date].[Month of Year]", sortOrder: "desc", sortBySummaryField: 'Count' }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[2].children[5]), 462, "GT - 2003 July");
            assert.strictEqual(getValue(data, data.rows[2].children[4]), 1262, "GT - 2003 August");
            assert.strictEqual(getValue(data, data.rows[2].children[4], data.columns[1]), 492), "Bikes - 2003 August";

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2001");
            assert.deepEqual(data.rows[1].text, "CY 2002");
            assert.deepEqual(data.rows[2].text, "CY 2003");
            assert.deepEqual(data.rows[3].text, "CY 2004");

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "December"
                },
                {
                    text: "October"
                },
                {
                    text: "November"
                },
                {
                    text: "September"
                },
                {
                    text: "August"
                },
                {
                    text: "July"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "April"
                },
                {
                    text: "March"
                },
                {
                    text: "January"
                },
                {
                    text: "February"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test("Sorting group by Summary field", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBySummaryField: "[Measures].[Customer Count]"
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBySummaryField: "[Measures].[Customer Count]"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2004");
            assert.deepEqual(data.rows[1].text, "CY 2003");
            assert.deepEqual(data.rows[2].text, "CY 2002");
            assert.deepEqual(data.rows[3].text, "CY 2001");

            assert.deepEqual(removeIndexesAndValue(data.rows[1].children), [
                {
                    text: "December 2003"
                },
                {
                    text: "October 2003"
                },
                {
                    text: "November 2003"
                },
                {
                    text: "September 2003"
                },
                {
                    text: "August 2003"
                },
                {
                    text: "July 2003"
                },
                {
                    text: "May 2003"
                },
                {
                    text: "June 2003"
                },
                {
                    text: "April 2003"
                },
                {
                    text: "March 2003"
                },
                {
                    text: "January 2003"
                },
                {
                    text: "February 2003"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field in first field on axis", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar Year]",
                    expanded: true,
                    sortBySummaryField: "[Measures].[Customer Count]"
                },
                { dataField: "[Ship Date].[Month of Year]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "value" }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[2].children[6]), 462, "GT - 2003 July");
            assert.strictEqual(getValue(data, data.rows[2].children[7]), 1262, "GT - 2003 August");
            assert.strictEqual(getValue(data, data.rows[2].children[7], data.columns[1]), 492), "Bikes - 2003 August";

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2001");
            assert.deepEqual(data.rows[1].text, "CY 2002");
            assert.deepEqual(data.rows[2].text, "CY 2003");
            assert.deepEqual(data.rows[3].text, "CY 2004");

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "January"
                },
                {
                    text: "February"
                },
                {
                    text: "March"
                },
                {
                    text: "April"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "July"
                },
                {
                    text: "August"
                },
                {
                    text: "September"
                },
                {
                    text: "October"
                },
                {
                    text: "November"
                },
                {
                    text: "December"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field in first field on axis with path", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{
                dataField: "[Product].[Category]",
                expanded: true,
                filterValues: ["Bikes"]
            }, { dataField: "[Product].[Subcategory]" }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar Year]",
                    expanded: true,
                    sortOrder: "asc",
                    sortBySummaryField: "[Measures].[Customer Count]",
                    sortBySummaryPath: ["Bikes", "Road Bikes"]
                },
                { dataField: "[Ship Date].[Month of Year]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "value" }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[3].children[6]), 462, "GT - 2003 July");
            assert.strictEqual(getValue(data, data.rows[3].children[7]), 492, "GT - 2003 August");
            assert.strictEqual(getValue(data, data.rows[3].children[7], data.columns[0]), 492), "Bikes - 2003 August";

            assert.deepEqual(data.columns[0].children[1].text, "Road Bikes");

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2001");
            assert.deepEqual(data.rows[1].text, "CY 2002");
            assert.deepEqual(data.rows[2].text, "CY 2004");
            assert.deepEqual(data.rows[3].text, "CY 2003");

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "January"
                },
                {
                    text: "February"
                },
                {
                    text: "March"
                },
                {
                    text: "April"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "July"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting columns by row", function(assert) {
        var done = assert.async();
        this.load({
            rows: [
                { dataField: "[Product].[Category]", expanded: true, filterValues: ["Bikes"] },
                { dataField: "[Product].[Subcategory]" }
            ],
            columns: [
                {
                    dataField: "[Ship Date].[Calendar Year]",
                    expanded: true,
                    sortOrder: "asc",
                    sortBySummaryField: "[Measures].[Customer Count]",
                    sortBySummaryPath: ["Bikes", "Road Bikes"]
                },
                { dataField: "[Ship Date].[Month of Year]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]" }]
        }).done(function(data) {

            assert.deepEqual(data.rows[0].children[1].text, "Road Bikes");

            assert.deepEqual(data.columns.length, 4);

            assert.deepEqual(data.columns[0].text, "CY 2001");
            assert.deepEqual(data.columns[1].text, "CY 2002");
            assert.deepEqual(data.columns[2].text, "CY 2004");
            assert.deepEqual(data.columns[3].text, "CY 2003");

            assert.deepEqual(removeIndexesAndValue(data.columns[2].children), [
                {
                    text: "January"
                },
                {
                    text: "February"
                },
                {
                    text: "March"
                },
                {
                    text: "April"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "July"
                }
            ]);

            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test("Sorting by Summary field in with path with length greater then columns count", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]", filterValues: ["Bikes"] }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar Year]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBySummaryField: "[Measures].[Customer Count]",
                    sortBySummaryPath: ["Bikes", "Road Bikes"]
                },
                { dataField: "[Ship Date].[Month of Year]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "value" }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[1].children[6]), 462, "GT - 2003 July");
            assert.strictEqual(getValue(data, data.rows[1].children[7]), 492, "GT - 2003 August");
            assert.strictEqual(getValue(data, data.rows[1].children[7], data.columns[0]), 492), "Bikes - 2003 August";

            assert.deepEqual(data.columns[0].text, "Bikes");

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2004");
            assert.deepEqual(data.rows[1].text, "CY 2003");
            assert.deepEqual(data.rows[2].text, "CY 2002");
            assert.deepEqual(data.rows[3].text, "CY 2001");

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "January"
                },
                {
                    text: "February"
                },
                {
                    text: "March"
                },
                {
                    text: "April"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "July"
                },
                {
                    text: "August"
                },
                {
                    text: "September"
                },
                {
                    text: "October"
                },
                {
                    text: "November"
                },
                {
                    text: "December"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary two dimension on axis", function(assert) {
        var done = assert.async();
        this.load({
            "rows": [
                {
                    "dimension": "[Product]",
                    "dataField": "[Product].[Category]",
                    "caption": "Category",
                    "displayFolder": "",
                    "isMeasure": false,
                    "area": "row",
                    "index": 0,
                    "allowSorting": true,
                    "allowFiltering": true,
                    "allowExpandAll": true,
                    "sortBySummaryField": "[Measures].[Customer Count]",
                    "sortBySummaryPath": ["CY 2004"],
                    "sortOrder": "desc",
                    "areaIndex": 0
                },
                {
                    "dimension": "[Product]",
                    "dataField": "[Product].[Subcategory]",
                    "caption": "Subcategory",
                    "displayFolder": "",
                    "isMeasure": false,
                    "area": "row",
                    "index": 1,
                    "allowSorting": true,
                    "allowFiltering": true,
                    "allowExpandAll": true,
                    "sortBySummaryField": "[Measures].[Customer Count]",
                    "sortBySummaryPath": ["CY 2004"],
                    "sortOrder": "desc",
                    "areaIndex": 1
                }
            ],
            "columns": [
                {
                    "dimension": "[Ship Date]",
                    "dataField": "[Ship Date].[Calendar Year]",
                    "caption": "Ship Date.Calendar Year",
                    "displayFolder": "Calendar",
                    "isMeasure": false,
                    "area": "column",
                    "index": 2,
                    "allowSorting": true,
                    "allowFiltering": true,
                    "allowExpandAll": true,
                    "expanded": false,
                    "areaIndex": 0
                },
                {
                    "dimension": "[Ship Date]",
                    "dataField": "[Ship Date].[Month of Year]",
                    "caption": "Ship Date.Month of Year",
                    "displayFolder": "",
                    "isMeasure": false,
                    "area": "column",
                    "index": 3,
                    "allowSorting": true,
                    "allowFiltering": true,
                    "allowExpandAll": true,
                    "areaIndex": 1
                }],

            "values": [{
                "dimension": "[Measures]",
                "dataField": "[Measures].[Customer Count]",
                "caption": "Customer Count",
                "displayFolder": "Internet Customers",
                "isMeasure": true,
                "area": "data",
                "index": 4,
                "allowSorting": true,
                "allowFiltering": true,
                "allowExpandAll": true,
                "areaIndex": 0
            }],
            "rowExpandedPaths": [["&[3]"]]
        }).done(function(data) {
            assert.strictEqual(data.columns[3].text, "CY 2004");
            assert.strictEqual(data.columns[3].index, 4);

            assert.strictEqual(data.rows[0].text, "Accessories");
            assert.strictEqual(data.rows[0].index, 1);

            assert.strictEqual(data.rows[1].text, "Bikes");
            assert.strictEqual(data.rows[1].index, 2);

            assert.strictEqual(data.rows[2].text, "Clothing");
            assert.strictEqual(data.rows[2].index, 3);

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [{
                text: "Jerseys"
            },
            {
                text: "Caps"
            },
            {
                text: "Gloves"
            },
            {
                text: "Shorts"
            },
            {
                text: "Vests"
            },
            {
                text: "Socks"
            }]);

            var column = getColumnByIndex(data.values, 4);

            assert.strictEqual(column[1], 9745, "Accessories - CY 2004");
            assert.strictEqual(column[2], 5646, "Bikes - CY 2004");
            assert.strictEqual(column[3], 4340, "Clothing - CY 2004");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting by Summary field when hierarchy in column", function(assert) {
        var done = assert.async();
        this.load({

            columns: [{
                dataField: "[Product].[Product Categories].[Category]",
                hierarchyName: "[Product].[Product Categories]",
                expanded: true,
                filterValues: ["Bikes"]
            }, {
                dataField: "[Product].[Product Categories].[Subcategory]",
                hierarchyName: "[Product].[Product Categories]"
            }],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar Year]",
                    expanded: true,
                    sortOrder: "asc",
                    sortBySummaryField: "[Measures].[Customer Count]",
                    sortBySummaryPath: ["Bikes", "Road Bikes"]
                },
                { dataField: "[Ship Date].[Month of Year]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count', sortOrder: "desc", sortBy: "value" }]
        }).done(function(data) {

            assert.strictEqual(getValue(data, data.rows[3].children[6]), 462, "GT - 2003 July");
            assert.strictEqual(getValue(data, data.rows[3].children[7]), 492, "GT - 2003 August");
            assert.strictEqual(getValue(data, data.rows[3].children[7], data.columns[0]), 492), "Bikes - 2003 August";

            assert.deepEqual(data.columns[0].children[1].text, "Road Bikes");

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, "CY 2001");
            assert.deepEqual(data.rows[1].text, "CY 2002");
            assert.deepEqual(data.rows[2].text, "CY 2004");
            assert.deepEqual(data.rows[3].text, "CY 2003");

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: "January"
                },
                {
                    text: "February"
                },
                {
                    text: "March"
                },
                {
                    text: "April"
                },
                {
                    text: "May"
                },
                {
                    text: "June"
                },
                {
                    text: "July"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sort fields with several expanded levels when expanded item", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]", sortOrder: "desc", sortBy: "value" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]" },
                {
                    dataField: "[Ship Date].[Calendar Quarter of Year]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                { dataField: "[Ship Date].[Month of Year]", sortOrder: "desc", sortBy: "value" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: ["&[2003]"]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, "Clothing");
            assert.strictEqual(data.columns[1].text, "Bikes");
            assert.strictEqual(data.columns[2].text, "Accessories");

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY Q4");

            assert.strictEqual(data.rows[0].children.length, 3);
            assert.strictEqual(data.rows[0].children[0].text, "December");
            assert.strictEqual(data.rows[0].children[2].text, "October");

            assert.strictEqual(data.rows[0].text, "CY Q4");
            assert.strictEqual(data.rows[2].text, "CY Q2");
            assert.strictEqual(data.rows[3].text, "CY Q1");

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[3]), 792, "CY Q1 Total");
            assert.strictEqual(getValue(data, data.rows[2]), 938, "CY Q2 Total");
            assert.strictEqual(getValue(data, data.rows[0]), 4968, "CY Q4 Total");
            assert.strictEqual(getValue(data, data.rows[3].children[0]), 271, "CY Q1->March Total");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sort fields with several expanded levels", function(assert) {
        var done = assert.async();
        this.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [
                { dataField: "[Ship Date].[Calendar Year]", expanded: true },
                {
                    dataField: "[Ship Date].[Calendar Quarter of Year]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                { dataField: "[Ship Date].[Month of Year]", sortOrder: "desc", sortBy: "value" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, "CY 2001");

            assert.strictEqual(data.rows[0].children.length, 2);

            assert.strictEqual(data.rows[0].children[0].text, "CY Q4");
            assert.strictEqual(data.rows[0].children[1].text, "CY Q3");

            assert.strictEqual(data.rows[0].children[0].children.length, 3);

            assert.strictEqual(data.rows[0].children[0].children[0].text, "December");
            assert.strictEqual(data.rows[0].children[0].children[2].text, "October");

            assert.strictEqual(data.rows[3].text, "CY 2004");
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sort group when expanded item", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            rows: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            path: [CALENDAR_HIERARCHY_YEAR_DATA[3].key],
            headerName: "rows",
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, "Clothing");
            assert.strictEqual(data.columns[1].text, "Bikes");
            assert.strictEqual(data.columns[2].text, "Accessories");

            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: "August 2004"
                },
                {
                    text: "July 2004"
                },
                {
                    text: "June 2004"
                },
                {
                    text: "May 2004"
                },
                {
                    text: "April 2004"
                },
                {
                    text: "March 2004"
                },
                {
                    text: "February 2004"
                },
                {
                    text: "January 2004"
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, undefined);

            // assert.deepEqual(getColumnByIndex(data.values, 0), [11753, 1414, 1414, 209, 1229, 10682, 5973, 2119, 2142, 1909, 5271, 1870, 1795, 1834]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sort when several groups on axis. Expand item", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            headerName: "columns",
            path: ["&[2004]"],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);

            assert.strictEqual(data.columns[0].text, "Clothing");
            assert.strictEqual(data.columns[0].children[0].text, "Vests");
            assert.strictEqual(data.columns[0].children[4].text, "Gloves");
            assert.strictEqual(data.columns[2].text, "Accessories");
            assert.strictEqual(data.columns[2].children[0].text, "Tires and Tubes");
            assert.strictEqual(data.columns[2].children[1].text, "Hydration Packs");
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sort when several expanded groups on axis", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [
                {
                    dataField: "[Ship Date].[Calendar]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    filterValues: ["CY 2003", "CY 2002"],
                    filterType: "include"
                }
            ]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 2);

            assert.strictEqual(data.columns[0].text, "CY 2003");
            assert.strictEqual(data.columns[0].children[0].text, "December 2003");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sort last group on axis", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },

                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [
                {
                    dataField: "[Ship Date].[Calendar]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    filterValues: ["CY 2003", "CY 2002"],
                    filterType: "include"
                }
            ]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 2);

            assert.strictEqual(data.columns[0].text, "CY 2002");
            assert.strictEqual(data.columns[0].children[0].text, "January 2002");
            assert.strictEqual(data.columns[0].children[1].children[0].text, "Bikes");
            assert.strictEqual(data.columns[0].children[1].children[0].children[0].text, "Road Bikes");

            assert.strictEqual(data.columns[1].text, "CY 2003");

            assert.strictEqual(data.columns[1].children.length, 12);
            assert.strictEqual(data.columns[1].children[0].text, "January 2003");
            assert.strictEqual(data.columns[1].children[11].text, "December 2003");

            assert.strictEqual(data.columns[1].children[11].children[0].text, "Clothing");
            assert.strictEqual(data.columns[1].children[11].children[0].children[0].text, "Vests");
            assert.strictEqual(data.columns[1].children[11].children[0].children[1].text, "Socks");
            assert.strictEqual(data.columns[1].children[11].children[1].text, "Bikes");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test("Sorting group in two dimension", function(assert) {
        var done = assert.async();
        this.load({
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Ship Date].[Calendar].[Month]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            rows: [
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true,
                    sortOrder: "desc",
                    sortBy: "value"
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]",
                    sortOrder: "desc",
                    sortBy: "value"
                }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [
                {
                    dataField: "[Ship Date].[Calendar]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    filterValues: ["CY 2003", "CY 2002"],
                    filterType: "include"
                },
                {
                    dataField: "[Product].[Product Categories]",
                    hierarchyName: "[Product].[Product Categories]",
                    filterValues: ["Bikes", "Clothing"],
                    filterType: "include"
                }
            ]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 2);

            assert.strictEqual(data.columns[0].text, "CY 2003");
            assert.strictEqual(data.columns[1].text, "CY 2002");

            assert.strictEqual(data.columns[0].children[0].text, "December 2003");
            assert.strictEqual(data.columns[0].children[11].text, "January 2003");

            assert.strictEqual(data.rows.length, 2);

            assert.strictEqual(data.rows[0].text, "Clothing");
            assert.strictEqual(data.rows[1].text, "Bikes");

            assert.strictEqual(data.rows[0].children[0].value, "Vests");
            assert.strictEqual(data.rows[0].children[1].value, "Socks");

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module("XMLA Store with another cubes");

    QUnit.test("T248791. Dimension with zero level members", function(assert) {
        var done = assert.async(),
            store = new Store({
                url: DATA_SOURCE_URL,
                catalog: "Q380421",
                cube: "CubeMobile"
            });

        store.load({
            columns: [
                { dataField: "[Агрегация по дате].[Агрегация по дате]", area: "column" }
            ],
            values: [{ dataField: "[Measures].[Опер_Колво]" }]
        }).done(function(data) {
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.grandTotalColumnIndex, undefined);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [[[1836], [1836], [1836]]]);

        }).always(done);

    });

    QUnit.test("T248791. Dimension with zero level members. Expand All level", function(assert) {
        var done = assert.async(),
            store = new Store({
                url: DATA_SOURCE_URL,
                catalog: "Q380421",
                cube: "CubeMobile"
            });
        store.load({
            columns: [
                { dataField: "[Агрегация по дате].[Агрегация по дате]", area: "column", expanded: true },
                { dataField: "[Дата].[Год]" }
            ],
            values: [{ dataField: "[Measures].[Опер_Колво]" }]
        }).done(function(data) {
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.grandTotalColumnIndex, undefined);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [[[1836], [1836], [1836], [1503], [333], [1503], [333], [1503], [333]]]);
        }).always(done);
    });

    QUnit.module("Send Request", {
        beforeEach: function() {
            sinon.stub(ajax, "sendRequest");
            ajax.sendRequest.returns($.Deferred().reject());
            this.dataSource = $.extend(true, {}, testEnvironment.dataSource);
        },

        afterEach: function() {
            ajax.sendRequest.restore();
        },

        loadOptions: {
            columns: [
                { dataField: "DimensionField" }
            ],
            values: [{ dataField: "MeasureField" }]
        }

    });

    QUnit.test("send ajax request on load", function(assert) {
        var store = new Store(this.dataSource),
            ajaxArg;

        store.load(this.loadOptions);

        assert.ok(ajax.sendRequest.calledOnce);
        ajaxArg = ajax.sendRequest.lastCall.args[0];

        assert.strictEqual(ajaxArg.url, this.dataSource.url, "url");
        assert.strictEqual(ajaxArg.method, "POST", "method");
        assert.ok(ajaxArg.data, "data");
        assert.deepEqual(ajaxArg.xhrFields, {}, "xhrFields");
        assert.deepEqual(ajaxArg.headers, { "Content-Type": "text/xml" }, "headers");
        assert.strictEqual(ajaxArg.beforeSend, undefined);
    });

    QUnit.test("send ajax request with before send callback", function(assert) {
        var dataSource = this.dataSource,
            beforeSend = function(settings) {
                // assert beforeSend argument
                assert.strictEqual(settings.url, dataSource.url, "url");
                assert.strictEqual(settings.method, "POST", "method");
                assert.ok(settings.data, "data");
                assert.deepEqual(settings.xhrFields, {}, "xhrFields");
                assert.deepEqual(settings.headers, { "Content-Type": "text/xml" }, "headers");
                assert.strictEqual(settings.beforeSend, undefined);

                // act
                settings.headers["my-header"] = "my-header-value";
            };
        dataSource.beforeSend = beforeSend;

        var store = new Store(dataSource),
            ajaxArg;

        store.load(this.loadOptions);
        // assert
        assert.ok(ajax.sendRequest.calledOnce);
        ajaxArg = ajax.sendRequest.lastCall.args[0];

        assert.strictEqual(ajaxArg.url, dataSource.url, "url");
        assert.strictEqual(ajaxArg.method, "POST", "method");
        assert.ok(ajaxArg.data, "data");
        assert.deepEqual(ajaxArg.xhrFields, {}, "xhrFields");
        assert.deepEqual(ajaxArg.headers, {
            "Content-Type": "text/xml",
            "my-header": "my-header-value"
        }, "headers");
        assert.strictEqual(ajaxArg.beforeSend, undefined);
    });

    QUnit.module("Tests with Mocks", stubsEnvironment);

    QUnit.test("Use fields with expression", function(assert) {
        this.store.load({
            columns: [{
                dataField: "[Product].[My_Category]",
                expression: "[Poduct].[Category]+[Poduct].[Subcategory]"
            }],
            rows: [{ dataField: "[Ship_Date].[Calendar_Year]" }],
            values: [{ dataField: "[Measures].[My_Measure]", expression: "[Measures].[Customer_Count]*100" }]
        });

        var query = this.getQuery(),
            declarations = query.match(/(member)\s([^\s])+\sas\s([^\s])+/ig) || [];

        assert.ok(query);
        assert.strictEqual(declarations.length, 1);
        assert.strictEqual(declarations[0], "member [Measures].[My_Measure] as [Measures].[Customer_Count]*100");
    });

    QUnit.test("Use fields with expression as function", function(assert) {
        this.store.load({
            columns: [{ dataField: "[Product].[My_Category]" }],
            rows: [{ dataField: "[Ship_Date].[Calendar_Year]" }],
            values: [{
                dataField: "[Measures].[My_Measure]", expression: function() {
                }
            }]
        });

        var query = this.getQuery(),
            declarations = query.match(/(member)\s([^\s])+\sas\s([^\s])+/ig) || [];

        assert.ok(query);
        assert.strictEqual(declarations.length, 0);
    });

    QUnit.test("FilterValues using caption", function(assert) {
        this.store.load({
            columns: [{
                dataField: "[Product].[Category]",
                filterValues: ["Bikes", "Accessories"],
                filterType: "include"
            }],
            rows: [{
                dataField: "[Ship Date].[Calendar Year]",
                filterValues: ["CY 2002", "CY 2003"],
                filterType: "include"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        });

        var query = this.getQuery(),
            filterExpr = query.match(/\(select(.+?)on 0/gi);

        assert.strictEqual(filterExpr.length, 2);
        assert.strictEqual(filterExpr[0], "(SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].[CY 2003]}on 0");
        assert.strictEqual(filterExpr[1], "(SELECT {[Product].[Category].[Bikes],[Product].[Category].[Accessories]}on 0");

    });

    QUnit.test("Numeric value in filterValues", function(assert) {
        this.store.load({
            columns: [{ dataField: "[Product].[Category]", filterValues: [1], filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        });

        var query = this.getQuery(),
            filterExpr = query.match(/\(select(.+?)on 0/gi);

        assert.strictEqual(filterExpr.length, 1);
        assert.strictEqual(filterExpr[0], "(SELECT {[Product].[Category].[1]}on 0");

    });

    QUnit.test("FilterValues using key and caption", function(assert) {
        this.store.load({
            columns: [{ dataField: "[Product].[Category]", filterValues: ["&[1]", "&[3]"], filterType: "include" }],
            rows: [{
                dataField: "[Ship Date].[Calendar Year]",
                filterValues: ["CY 2002", "&[2003]"],
                filterType: "include"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        });

        var query = this.getQuery(),
            filterExpr = query.match(/\(select(.+?)on 0/gi);

        assert.strictEqual(filterExpr.length, 2);
        assert.strictEqual(filterExpr[0], "(SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].&[2003]}on 0");
        assert.strictEqual(filterExpr[1], "(SELECT {[Product].[Category].&[1],[Product].[Category].&[3]}on 0");
    });

    QUnit.test("Parse error response on load", function(assert) {
        this.sendDeferred.resolve(ERROR_RESPONCE);

        this.store.load({
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        }).done(function() {
            assert.ok(false);
        })
            .fail(function(error) {
                assert.ok(error.message.indexOf("Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function.") > -1);
            });
    });

    QUnit.test("T504918. Error in cell", function(assert) {
        this.sendDeferred.resolve('<root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Fact Product Sales Count]</UName><Caption>Fact Product Sales Count</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Fact Product Sales Count</MEMBER_VALUE></Member></Tuple><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Product Actual Cost]</UName><Caption>Product Actual Cost</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>131072</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Product Actual Cost</MEMBER_VALUE></Member></Tuple></Tuples></Axis><Axis name="SlicerAxis"><Tuples><Tuple><Member Hierarchy="[Dim Stores].[Store ID]"><UName>[Dim Stores].[Store ID].[All]</UName><Caption>All</Caption><LName>[Dim Stores].[Store ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Sales Person].[Sales Person ID]"><UName>[Dim Sales Person].[Sales Person ID].[All]</UName><Caption>All</Caption><LName>[Dim Sales Person].[Sales Person ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Customer].[Customer ID]"><UName>[Dim Customer].[Customer ID].[All]</UName><Caption>All</Caption><LName>[Dim Customer].[Customer ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Key]"><UName>[Dim Product].[Product Key].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Name]"><UName>[Dim Product].[Product Name].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Hierarchy]"><UName>[Dim Date].[Hierarchy].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Hierarchy].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Date Key]"><UName>[Dim Date].[Date Key].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Date Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Full Date UK]"><UName>[Dim Date].[Full Date UK].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Full Date UK].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month]"><UName>[Dim Date].[Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month Name]"><UName>[Dim Date].[Month Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter]"><UName>[Dim Date].[Quarter].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter Name]"><UName>[Dim Date].[Quarter Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Week Of Month]"><UName>[Dim Date].[Week Of Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Week Of Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Year]"><UName>[Dim Date].[Year].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Year].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Time].[Time Key]"><UName>[Dim Time].[Time Key].[All]</UName><Caption>All</Caption><LName>[Dim Time].[Time Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value xsi:type="xsd:int">25</Value><Language>1033</Language></Cell><Cell CellOrdinal="1"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value></Cell></CellData></root>');
        this.store.load({
            columns: [],
            rows: [],
            values: [
                { dataField: "[Measures].[Fact Product Sales Count]" },
                { dataField: "[Measures].[Product Actual Cost]" }
            ]
        }).done(function(data) {
            assert.deepEqual(data.values, [[[25, "#N/A"]]], "cell data");
            assert.equal(errors.log.callCount, 1);
            assert.deepEqual(errors.log.lastCall.args, ["W4002", "Read access to the cell is denied."]);
        }).fail(function() {
            assert.ok(false);
        });
    });

    QUnit.test("Same errors in defferent cells", function(assert) {
        this.sendDeferred.resolve('<root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Fact Product Sales Count]</UName><Caption>Fact Product Sales Count</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Fact Product Sales Count</MEMBER_VALUE></Member></Tuple><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Product Actual Cost]</UName><Caption>Product Actual Cost</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>131072</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Product Actual Cost</MEMBER_VALUE></Member></Tuple></Tuples></Axis><Axis name="SlicerAxis"><Tuples><Tuple><Member Hierarchy="[Dim Stores].[Store ID]"><UName>[Dim Stores].[Store ID].[All]</UName><Caption>All</Caption><LName>[Dim Stores].[Store ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Sales Person].[Sales Person ID]"><UName>[Dim Sales Person].[Sales Person ID].[All]</UName><Caption>All</Caption><LName>[Dim Sales Person].[Sales Person ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Customer].[Customer ID]"><UName>[Dim Customer].[Customer ID].[All]</UName><Caption>All</Caption><LName>[Dim Customer].[Customer ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Key]"><UName>[Dim Product].[Product Key].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Name]"><UName>[Dim Product].[Product Name].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Hierarchy]"><UName>[Dim Date].[Hierarchy].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Hierarchy].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Date Key]"><UName>[Dim Date].[Date Key].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Date Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Full Date UK]"><UName>[Dim Date].[Full Date UK].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Full Date UK].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month]"><UName>[Dim Date].[Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month Name]"><UName>[Dim Date].[Month Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter]"><UName>[Dim Date].[Quarter].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter Name]"><UName>[Dim Date].[Quarter Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Week Of Month]"><UName>[Dim Date].[Week Of Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Week Of Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Year]"><UName>[Dim Date].[Year].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Year].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Time].[Time Key]"><UName>[Dim Time].[Time Key].[All]</UName><Caption>All</Caption><LName>[Dim Time].[Time Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value><Language>1033</Language></Cell><Cell CellOrdinal="1"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value></Cell></CellData></root>');
        this.store.load({
            columns: [],
            rows: [],
            values: [
                { dataField: "[Measures].[Fact Product Sales Count]" },
                { dataField: "[Measures].[Product Actual Cost]" }
            ]
        }).done(function(data) {
            assert.deepEqual(data.values, [[["#N/A", "#N/A"]]], "cell data");
            assert.equal(errors.log.callCount, 1);
            assert.deepEqual(errors.log.lastCall.args, ["W4002", "Read access to the cell is denied."]);
        }).fail(function() {
            assert.ok(false);
        });
    });

    QUnit.test("Differrent errors in defferent cells", function(assert) {
        this.sendDeferred.resolve('<root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Fact Product Sales Count]</UName><Caption>Fact Product Sales Count</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Fact Product Sales Count</MEMBER_VALUE></Member></Tuple><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Product Actual Cost]</UName><Caption>Product Actual Cost</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>131072</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Product Actual Cost</MEMBER_VALUE></Member></Tuple></Tuples></Axis><Axis name="SlicerAxis"><Tuples><Tuple><Member Hierarchy="[Dim Stores].[Store ID]"><UName>[Dim Stores].[Store ID].[All]</UName><Caption>All</Caption><LName>[Dim Stores].[Store ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Sales Person].[Sales Person ID]"><UName>[Dim Sales Person].[Sales Person ID].[All]</UName><Caption>All</Caption><LName>[Dim Sales Person].[Sales Person ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Customer].[Customer ID]"><UName>[Dim Customer].[Customer ID].[All]</UName><Caption>All</Caption><LName>[Dim Customer].[Customer ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Key]"><UName>[Dim Product].[Product Key].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Name]"><UName>[Dim Product].[Product Name].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Hierarchy]"><UName>[Dim Date].[Hierarchy].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Hierarchy].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Date Key]"><UName>[Dim Date].[Date Key].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Date Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Full Date UK]"><UName>[Dim Date].[Full Date UK].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Full Date UK].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month]"><UName>[Dim Date].[Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month Name]"><UName>[Dim Date].[Month Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter]"><UName>[Dim Date].[Quarter].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter Name]"><UName>[Dim Date].[Quarter Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Week Of Month]"><UName>[Dim Date].[Week Of Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Week Of Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Year]"><UName>[Dim Date].[Year].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Year].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Time].[Time Key]"><UName>[Dim Time].[Time Key].[All]</UName><Caption>All</Caption><LName>[Dim Time].[Time Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value><Error><ErrorCode>323865234</ErrorCode><Description>Unknown Error.</Description></Error></Value><Language>1033</Language></Cell><Cell CellOrdinal="1"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value></Cell></CellData></root>');
        this.store.load({
            columns: [],
            rows: [],
            values: [
                { dataField: "[Measures].[Fact Product Sales Count]" },
                { dataField: "[Measures].[Product Actual Cost]" }
            ]
        }).done(function(data) {
            assert.deepEqual(data.values, [[["#N/A", "#N/A"]]], "cell data");
            assert.equal(errors.log.callCount, 2);
            assert.deepEqual(errors.log.getCall(0).args, ["W4002", "Unknown Error."]);
            assert.deepEqual(errors.log.getCall(1).args, ["W4002", "Read access to the cell is denied."]);
        }).fail(function() {
            assert.ok(false);
        });
    });

    QUnit.test("Throw error when unexpected response", function(assert) {
        this.sendDeferred.resolve("");
        this.store.load({
            columns: [],
            rows: [],
            values: []
        }).done(function(data) {
            assert.ok(false);
        }).fail(function() {
            assert.equal(errors.Error.lastCall.args[0], "E4023");
            assert.equal(errors.Error.lastCall.args[1], "");
        });
    });

    QUnit.test("Parse time type cell data", function(assert) {
        this.sendDeferred.resolve('<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExecuteResponse xmlns="urn:schemas-microsoft-com:xml-analysis"><return><root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Duracao]</UName><Caption>Duracao</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Duracao</MEMBER_VALUE></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value>28:59:08</Value><FormatString>Long Time</FormatString></Cell></CellData></root></return></ExecuteResponse></soap:Body></soap:Envelope>');

        this.store.load({
            columns: [],
            rows: [],
            values: [{ dataField: "[Measures].[Duracao]" }]
        })
            .done(function(data) {
                assert.strictEqual(getValue(data), "28:59:08");
            });
    });

    QUnit.test("Language Id passed to discover query", function(assert) {
        this.store.getFields();

        this.sendRequest.getCalls().forEach(function(call) {
            assert.equal($(call.args[0].data).find("LocaleIdentifier").text(), languageId);
        });
    });

    QUnit.test("Language Id passed to execute query", function(assert) {
        this.store.load({
            columns: [],
            rows: [],
            values: [{ dataField: "[Measures].[Duracao]" }]
        });

        assert.equal($(this.getRequest(0)).find("LocaleIdentifier").text(), languageId);
    });

    QUnit.test("No LocaleIdentifier in query if unknown locale is set", function(assert) {
        var localization = require("localization"),
            locale = localization.locale();

        localization.locale("unknown");

        try {
            this.store.load({
                columns: [],
                rows: [],
                values: [{ dataField: "[Measures].[Duracao]" }]
            });

            assert.equal($(this.getRequest(0)).find("LocaleIdentifier").length, 0);
        } finally {
            localization.locale(locale);
        }
    });

    QUnit.test("T566739. Do not generate CrossJoin in select statement if skipValues is set to true", function(assert) {
        this.store.load({
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [],
            values: [
                { dataField: "[Measures].[Internet Order Count]", caption: 'Data1' },
                { dataField: "[Measures].[Growth in Customer Base]", caption: 'Data2' },
                { dataField: "[Measures].[Customer Count]", caption: 'Data3' }
            ],
            skipValues: true
        });

        assert.ok(this.getQuery().toLowerCase().indexOf("crossjoin") === -1);
    });

    QUnit.test("Use full item key in descendants expression. T620434", function(assert) {
        this.store.load({
            columns: [],
            rows: [
                { dataField: "[Ship Date].[Calendar].[Calendar]", hierarchyName: "[Ship Date].[Calendar]" },
                { dataField: "[Ship Date].[Calendar].[Month]", hierarchyName: "[Ship Date].[Calendar]" }
            ],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            headerName: "rows",
            path: ["[Ship Date].[Calendar Bla Bla].&[2002]"]
        });

        var query = this.getQuery();

        assert.ok(query.indexOf("{[Ship Date].[Calendar Bla Bla].&[2002]}") >= 0, "Descendants argument has full key");
    });

    QUnit.test("T675232. Build a correct filter query when a member has empty key", function(assert) {
        this.store.load({
            columns: [{
                dataField: "[Product].[Category]",
                filterValues: ["[Product].[Category]&"],
                filterType: "include"
            }],
            rows: [],
            values: []
        });

        var filterExpr = this.getQuery().match(/\(select(.+?)on 0/gi);

        assert.deepEqual(filterExpr, ["(SELECT {[Product].[Category].[Product].[Category]&}on 0"]);
    });

    QUnit.module("getDrillDownItems", stubsEnvironment);

    QUnit.test("getDrillDownItems with empty paths", function(assert) {
        var loadOptions = {
            columns: [{
                dataField: "[Product].[Category]",
                filterValues: ["Bikes", "Accessories"],
                filterType: "include"
            }],
            rows: [{
                dataField: "[Ship Date].[Calendar Year]",
                filterValues: ["CY 2002", "CY 2003"],
                filterType: "include"
            }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
            filters: [{ dataField: "[Product].[Color]", filterValues: ["Red"] }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] });
        assert.strictEqual(this.getQuery(), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM (SELECT {[Product].[Color].[Red]}on 0 FROM (SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].[CY 2003]}on 0 FROM (SELECT {[Product].[Category].[Bikes],[Product].[Category].[Accessories]}on 0 FROM [Adventure Works])))  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("getDrillDownItems with paths", function(assert) {
        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ["Bikes"], rowPath: ["CY 2004"] });
        assert.strictEqual(this.getQuery(), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Product].[Category].[Bikes],[Ship Date].[Calendar Year].[CY 2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("getDrillDownItems with custom columns", function(assert) {
        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }],
        };

        this.store.getDrillDownItems(loadOptions, {
            columnPath: [],
            rowPath: [],
            customColumns: ["Column1", "Column2"]
        });
        assert.strictEqual(this.getQuery(), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS return Column1,Column2");
    });

    QUnit.test("getDrillDownItems with several value fields", function(assert) {
        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{
                dataField: "[Measures].[Customer Count]",
                caption: 'Count'
            }, { dataField: "[Measures].[Internet Sales Order]", caption: 'Sales Order' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], dataIndex: 0 });
        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], dataIndex: 1 });
        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], dataIndex: 2 });

        assert.strictEqual(this.getQuery(0), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
        assert.strictEqual(this.getQuery(1), "drillthrough SELECT [Measures].[Internet Sales Order] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
        assert.strictEqual(this.getQuery(2), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("getDrillDownItems with paths without rows", function(assert) {
        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ["Bikes"], rowPath: [] });
        assert.strictEqual(this.getQuery(), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Product].[Category].[Bikes]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("getDrillDownItems without value fields", function(assert) {
        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] });

        assert.strictEqual(this.getQuery(), "drillthrough SELECT [Measures] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("getDrillDownItems with paths when Hierarchy", function(assert) {
        var loadOptions = {
            columns: [
                {
                    dataField: "[Ship Date].[Calendar].[Calendar Year]",
                    hierarchyName: "[Ship Date].[Calendar]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Category]",
                    hierarchyName: "[Product].[Product Categories]",
                    expanded: true
                },
                {
                    dataField: "[Product].[Product Categories].[Subcategory]",
                    hierarchyName: "[Product].[Product Categories]"
                }
            ],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ["&[2003]", "&[1]", "&[13]"], rowPath: ["CY 2004"] });
        assert.strictEqual(this.getQuery(), "drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2003],[Product].[Product Categories].[Subcategory].&[13],[Ship Date].[Calendar Year].[CY 2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("max drillDownRowCount", function(assert) {
        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ["Bikes"], rowPath: ["CY 2004"], maxRowCount: 120 });
        assert.strictEqual(this.getQuery(), "drillthrough maxrows 120 SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Product].[Category].[Bikes],[Ship Date].[Calendar Year].[CY 2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS");
    });

    QUnit.test("parse drillDown response", function(assert) {
        var textResponse = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExecuteResponse xmlns="urn:schemas-microsoft-com:xml-analysis"><return><root xmlns="urn:schemas-microsoft-com:xml-analysis:rowset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><xsd:schema xmlns:sql="urn:schemas-microsoft-com:xml-sql" targetNamespace="urn:schemas-microsoft-com:xml-analysis:rowset" elementFormDefault="qualified"><xsd:element name="root"><xsd:complexType><xsd:sequence minOccurs="0" maxOccurs="unbounded"><xsd:element name="row" type="row"/></xsd:sequence></xsd:complexType></xsd:element><xsd:simpleType name="uuid"><xsd:restriction base="xsd:string"><xsd:pattern value="[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}"/></xsd:restriction></xsd:simpleType><xsd:complexType name="xmlDocument"><xsd:sequence><xsd:any/></xsd:sequence></xsd:complexType><xsd:complexType name="row"><xsd:sequence><xsd:element sql:field="[Internet Customers].[$Customer.Customer]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Promotion.Promotion]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Sales Territory.Sales Territory Region]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Internet Sales Order Details.Internet Sales Order]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Ship Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Delivery Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Product.Product]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Source Currency.Source Currency Code]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[Customer Count]" name="_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_" minOccurs="0"/></xsd:sequence></xsd:complexType></xsd:schema><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Jon V. Yang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43793   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 29, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>August 3, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 38</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Eugene L. Huang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43767   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 18, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 25, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 30, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Black, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Ruben Torres</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43736   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 10, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 17, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row></root></return></ExecuteResponse></soap:Body></soap:Envelope>';
        this.sendDeferred.resolve(textResponse);

        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] }).done(function(data) {
            assert.strictEqual(data.length, 3);

            assert.deepEqual(data[0], {
                "Customer Customer": "Jon V. Yang",
                "Date Date": "July 22, 2001",
                "Delivery Date Date": "August 3, 2001",
                "Internet Sales Order Details Internet Sales Order": "SO43793   Line 1",
                "Product Product": "Mountain-100 Silver, 38",
                "Promotion Promotion": "No Discount",
                "Sales Territory Sales Territory Region": "Australia",
                "Ship Date Date": "July 29, 2001",
                "Source Currency Source Currency Code": "AUD",
                "Customer Count": "1"
            });
        });

    });

    QUnit.test("create drillDown dataSource", function(assert) {
        var textResponse = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExecuteResponse xmlns="urn:schemas-microsoft-com:xml-analysis"><return><root xmlns="urn:schemas-microsoft-com:xml-analysis:rowset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><xsd:schema xmlns:sql="urn:schemas-microsoft-com:xml-sql" targetNamespace="urn:schemas-microsoft-com:xml-analysis:rowset" elementFormDefault="qualified"><xsd:element name="root"><xsd:complexType><xsd:sequence minOccurs="0" maxOccurs="unbounded"><xsd:element name="row" type="row"/></xsd:sequence></xsd:complexType></xsd:element><xsd:simpleType name="uuid"><xsd:restriction base="xsd:string"><xsd:pattern value="[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}"/></xsd:restriction></xsd:simpleType><xsd:complexType name="xmlDocument"><xsd:sequence><xsd:any/></xsd:sequence></xsd:complexType><xsd:complexType name="row"><xsd:sequence><xsd:element sql:field="[Internet Customers].[$Customer.Customer]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Promotion.Promotion]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Sales Territory.Sales Territory Region]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Internet Sales Order Details.Internet Sales Order]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Ship Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Delivery Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Product.Product]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Source Currency.Source Currency Code]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[Customer Count]" name="_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_" minOccurs="0"/></xsd:sequence></xsd:complexType></xsd:schema><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Jon V. Yang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43793   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 29, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>August 3, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 38</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Eugene L. Huang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43767   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 18, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 25, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 30, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Black, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Ruben Torres</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43736   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 10, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 17, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row></root></return></ExecuteResponse></soap:Body></soap:Envelope>';
        this.sendDeferred.resolve(textResponse);

        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        var drillDownDataSource = this.store.createDrillDownDataSource(loadOptions, { columnPath: [], rowPath: [] });

        drillDownDataSource.paginate(false);

        drillDownDataSource.load().done(function(data) {
            assert.strictEqual(data.length, 3);

            assert.deepEqual(data[0], {
                "Customer Customer": "Jon V. Yang",
                "Date Date": "July 22, 2001",
                "Delivery Date Date": "August 3, 2001",
                "Internet Sales Order Details Internet Sales Order": "SO43793   Line 1",
                "Product Product": "Mountain-100 Silver, 38",
                "Promotion Promotion": "No Discount",
                "Sales Territory Sales Territory Region": "Australia",
                "Ship Date Date": "July 29, 2001",
                "Source Currency Source Currency Code": "AUD",
                "Customer Count": "1"
            });
        });
    });

    QUnit.test("getDrillDownItems - parse error response", function(assert) {
        this.sendDeferred.resolve(ERROR_RESPONCE);

        var loadOptions = {
            columns: [{ dataField: "[Product].[Category]", filterType: "include" }],
            rows: [{ dataField: "[Ship Date].[Calendar Year]", filterType: "include" }],
            values: [{ dataField: "[Measures].[Customer Count]", caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] })
            .done(function() {
                assert.ok(false);
            })
            .fail(function(error) {
                assert.ok(error.message.indexOf("Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function.") > -1);

            });
    });
});

import $ from 'jquery';
import ajax from 'core/utils/ajax';
import pivotGridUtils from '__internal/grids/pivot_grid/m_widget_utils';
import { XmlaStore } from '__internal/grids/pivot_grid/xmla_store/m_xmla_store';
import { errors } from 'common/data/errors';
import localization from 'localization';
import { getLanguageId } from 'common/core/localization/language_codes';

const languageId = getLanguageId();
const ERROR_RESPONCE = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><soap:Fault xmlns="http://schemas.xmlsoap.org/soap/envelope/"><faultcode>XMLAnalysisError.0xc10a004d</faultcode><faultstring>Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function.</faultstring><detail><Error ErrorCode="3238658125" Description="Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function." Source="Microsoft SQL Server 2008 R2 Analysis Services" HelpFile=""><Location xmlns="http://schemas.microsoft.com/analysisservices/2003/engine" xmlns:ddl2="http://schemas.microsoft.com/analysisservices/2003/engine/2" xmlns:ddl2_2="http://schemas.microsoft.com/analysisservices/2003/engine/2/2" xmlns:ddl100="http://schemas.microsoft.com/analysisservices/2008/engine/100" xmlns:ddl100_100="http://schemas.microsoft.com/analysisservices/2008/engine/100/100" xmlns:ddl200="http://schemas.microsoft.com/analysisservices/2010/engine/200" xmlns:ddl200_200="http://schemas.microsoft.com/analysisservices/2010/engine/200/200"><Start><Line>1</Line><Column>77</Column></Start><End><Line>1</Line><Column>203</Column></End><LineOffset>0</LineOffset><TextLength>127</TextLength></Location></Error></detail></soap:Fault></soap:Body></soap:Envelope>';

const stubsEnvironment = {
    beforeEach: function() {
        const that = this;
        sinon.spy(errors, 'log');
        sinon.spy(errors, 'Error');

        this.store = new XmlaStore(this.dataSource);
        that.sendDeferred = $.Deferred();

        that.sendRequest = sinon.stub(pivotGridUtils, 'sendRequest').callsFake(function() {
            return that.sendDeferred;
        });
    },
    afterEach: function() {
        this.sendRequest.restore();
        errors.log.restore();
        errors.Error.restore();
    },

    getRequest: function(num) {
        const call = num === undefined ? this.sendRequest.lastCall : this.sendRequest.getCall(num);
        return call.args[0].data;
    },

    getQuery: function(num) {
        const query = $(this.getRequest(num)).find('Statement').text();
        return query;
    },

    dataSource: {
        url: 'url',
        catalog: 'Adventure Works DW Standard Edition',
        cube: 'Adventure Works'
    }
};


QUnit.module('Misc', stubsEnvironment, () => {

    QUnit.test('Use fields with expression', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[My_Category]',
                expression: '[Poduct].[Category]+[Poduct].[Subcategory]'
            }],
            rows: [{ dataField: '[Ship_Date].[Calendar_Year]' }],
            values: [{ dataField: '[Measures].[My_Measure]', expression: '[Measures].[Customer_Count]*100' }]
        });

        const query = this.getQuery();
        const declarations = query.match(/(member)\s([^\s])+\sas\s([^\s])+/ig) || [];

        assert.ok(query);
        assert.strictEqual(declarations.length, 1);
        assert.strictEqual(declarations[0], 'member [Measures].[My_Measure] as [Measures].[Customer_Count]*100');
    });

    QUnit.test('Use fields with expression as function', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[My_Category]' }],
            rows: [{ dataField: '[Ship_Date].[Calendar_Year]' }],
            values: [{
                dataField: '[Measures].[My_Measure]', expression: function() {
                }
            }]
        });

        const query = this.getQuery();
        const declarations = query.match(/(member)\s([^\s])+\sas\s([^\s])+/ig) || [];

        assert.ok(query);
        assert.strictEqual(declarations.length, 0);
    });

    QUnit.test('FilterValues using caption', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'include'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: ['CY 2002', 'CY 2003'],
                filterType: 'include'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });

        const query = this.getQuery();
        const filterExpr = query.match(/\(select(.+?)on 0/gi);

        assert.strictEqual(filterExpr.length, 2);
        assert.strictEqual(filterExpr[0], '(SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].[CY 2003]}on 0');
        assert.strictEqual(filterExpr[1], '(SELECT {[Product].[Category].[Bikes],[Product].[Category].[Accessories]}on 0');

    });

    QUnit.test('Numeric value in filterValues', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', filterValues: [1], filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });

        const query = this.getQuery();
        const filterExpr = query.match(/\(select(.+?)on 0/gi);

        assert.strictEqual(filterExpr.length, 1);
        assert.strictEqual(filterExpr[0], '(SELECT {[Product].[Category].[1]}on 0');

    });

    QUnit.test('FilterValues using key and caption', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', filterValues: ['&[1]', '&[3]'], filterType: 'include' }],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: ['CY 2002', '&[2003]'],
                filterType: 'include'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });

        const query = this.getQuery();
        const filterExpr = query.match(/\(select(.+?)on 0/gi);

        assert.strictEqual(filterExpr.length, 2);
        assert.strictEqual(filterExpr[0], '(SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].&[2003]}on 0');
        assert.strictEqual(filterExpr[1], '(SELECT {[Product].[Category].&[1],[Product].[Category].&[3]}on 0');
    });

    QUnit.test('Parse error response on load', function(assert) {
        this.sendDeferred.resolve(ERROR_RESPONCE);

        this.store.load({
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function() {
            assert.ok(false);
        })
            .fail(function(error) {
                assert.ok(error.message.indexOf('Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function.') > -1);
            });
    });

    QUnit.test('T504918. Error in cell', function(assert) {
        this.sendDeferred.resolve('<root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Fact Product Sales Count]</UName><Caption>Fact Product Sales Count</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Fact Product Sales Count</MEMBER_VALUE></Member></Tuple><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Product Actual Cost]</UName><Caption>Product Actual Cost</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>131072</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Product Actual Cost</MEMBER_VALUE></Member></Tuple></Tuples></Axis><Axis name="SlicerAxis"><Tuples><Tuple><Member Hierarchy="[Dim Stores].[Store ID]"><UName>[Dim Stores].[Store ID].[All]</UName><Caption>All</Caption><LName>[Dim Stores].[Store ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Sales Person].[Sales Person ID]"><UName>[Dim Sales Person].[Sales Person ID].[All]</UName><Caption>All</Caption><LName>[Dim Sales Person].[Sales Person ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Customer].[Customer ID]"><UName>[Dim Customer].[Customer ID].[All]</UName><Caption>All</Caption><LName>[Dim Customer].[Customer ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Key]"><UName>[Dim Product].[Product Key].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Name]"><UName>[Dim Product].[Product Name].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Hierarchy]"><UName>[Dim Date].[Hierarchy].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Hierarchy].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Date Key]"><UName>[Dim Date].[Date Key].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Date Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Full Date UK]"><UName>[Dim Date].[Full Date UK].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Full Date UK].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month]"><UName>[Dim Date].[Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month Name]"><UName>[Dim Date].[Month Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter]"><UName>[Dim Date].[Quarter].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter Name]"><UName>[Dim Date].[Quarter Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Week Of Month]"><UName>[Dim Date].[Week Of Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Week Of Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Year]"><UName>[Dim Date].[Year].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Year].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Time].[Time Key]"><UName>[Dim Time].[Time Key].[All]</UName><Caption>All</Caption><LName>[Dim Time].[Time Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value xsi:type="xsd:int">25</Value><Language>1033</Language></Cell><Cell CellOrdinal="1"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value></Cell></CellData></root>');
        this.store.load({
            columns: [],
            rows: [],
            values: [
                { dataField: '[Measures].[Fact Product Sales Count]' },
                { dataField: '[Measures].[Product Actual Cost]' }
            ]
        }).done(function(data) {
            assert.deepEqual(data.values, [[[25, '#N/A']]], 'cell data');
            assert.equal(errors.log.callCount, 1);
            assert.deepEqual(errors.log.lastCall.args, ['W4002', 'Read access to the cell is denied.']);
        }).fail(function() {
            assert.ok(false);
        });
    });

    QUnit.test('Same errors in defferent cells', function(assert) {
        this.sendDeferred.resolve('<root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Fact Product Sales Count]</UName><Caption>Fact Product Sales Count</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Fact Product Sales Count</MEMBER_VALUE></Member></Tuple><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Product Actual Cost]</UName><Caption>Product Actual Cost</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>131072</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Product Actual Cost</MEMBER_VALUE></Member></Tuple></Tuples></Axis><Axis name="SlicerAxis"><Tuples><Tuple><Member Hierarchy="[Dim Stores].[Store ID]"><UName>[Dim Stores].[Store ID].[All]</UName><Caption>All</Caption><LName>[Dim Stores].[Store ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Sales Person].[Sales Person ID]"><UName>[Dim Sales Person].[Sales Person ID].[All]</UName><Caption>All</Caption><LName>[Dim Sales Person].[Sales Person ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Customer].[Customer ID]"><UName>[Dim Customer].[Customer ID].[All]</UName><Caption>All</Caption><LName>[Dim Customer].[Customer ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Key]"><UName>[Dim Product].[Product Key].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Name]"><UName>[Dim Product].[Product Name].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Hierarchy]"><UName>[Dim Date].[Hierarchy].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Hierarchy].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Date Key]"><UName>[Dim Date].[Date Key].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Date Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Full Date UK]"><UName>[Dim Date].[Full Date UK].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Full Date UK].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month]"><UName>[Dim Date].[Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month Name]"><UName>[Dim Date].[Month Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter]"><UName>[Dim Date].[Quarter].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter Name]"><UName>[Dim Date].[Quarter Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Week Of Month]"><UName>[Dim Date].[Week Of Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Week Of Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Year]"><UName>[Dim Date].[Year].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Year].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Time].[Time Key]"><UName>[Dim Time].[Time Key].[All]</UName><Caption>All</Caption><LName>[Dim Time].[Time Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value><Language>1033</Language></Cell><Cell CellOrdinal="1"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value></Cell></CellData></root>');
        this.store.load({
            columns: [],
            rows: [],
            values: [
                { dataField: '[Measures].[Fact Product Sales Count]' },
                { dataField: '[Measures].[Product Actual Cost]' }
            ]
        }).done(function(data) {
            assert.deepEqual(data.values, [[['#N/A', '#N/A']]], 'cell data');
            assert.equal(errors.log.callCount, 1);
            assert.deepEqual(errors.log.lastCall.args, ['W4002', 'Read access to the cell is denied.']);
        }).fail(function() {
            assert.ok(false);
        });
    });

    QUnit.test('Differrent errors in defferent cells', function(assert) {
        this.sendDeferred.resolve('<root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Fact Product Sales Count]</UName><Caption>Fact Product Sales Count</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Fact Product Sales Count</MEMBER_VALUE></Member></Tuple><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Product Actual Cost]</UName><Caption>Product Actual Cost</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>131072</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Product Actual Cost</MEMBER_VALUE></Member></Tuple></Tuples></Axis><Axis name="SlicerAxis"><Tuples><Tuple><Member Hierarchy="[Dim Stores].[Store ID]"><UName>[Dim Stores].[Store ID].[All]</UName><Caption>All</Caption><LName>[Dim Stores].[Store ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Sales Person].[Sales Person ID]"><UName>[Dim Sales Person].[Sales Person ID].[All]</UName><Caption>All</Caption><LName>[Dim Sales Person].[Sales Person ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Customer].[Customer ID]"><UName>[Dim Customer].[Customer ID].[All]</UName><Caption>All</Caption><LName>[Dim Customer].[Customer ID].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Key]"><UName>[Dim Product].[Product Key].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Product].[Product Name]"><UName>[Dim Product].[Product Name].[All]</UName><Caption>All</Caption><LName>[Dim Product].[Product Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Hierarchy]"><UName>[Dim Date].[Hierarchy].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Hierarchy].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Date Key]"><UName>[Dim Date].[Date Key].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Date Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Full Date UK]"><UName>[Dim Date].[Full Date UK].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Full Date UK].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month]"><UName>[Dim Date].[Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Month Name]"><UName>[Dim Date].[Month Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Month Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter]"><UName>[Dim Date].[Quarter].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Quarter Name]"><UName>[Dim Date].[Quarter Name].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Quarter Name].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Week Of Month]"><UName>[Dim Date].[Week Of Month].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Week Of Month].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Date].[Year]"><UName>[Dim Date].[Year].[All]</UName><Caption>All</Caption><LName>[Dim Date].[Year].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member><Member Hierarchy="[Dim Time].[Time Key]"><UName>[Dim Time].[Time Key].[All]</UName><Caption>All</Caption><LName>[Dim Time].[Time Key].[(All)]</LName><LNum>0</LNum><DisplayInfo>1000</DisplayInfo></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value><Error><ErrorCode>323865234</ErrorCode><Description>Unknown Error.</Description></Error></Value><Language>1033</Language></Cell><Cell CellOrdinal="1"><Value><Error><ErrorCode>3238658133</ErrorCode><Description>Read access to the cell is denied.</Description></Error></Value></Cell></CellData></root>');
        this.store.load({
            columns: [],
            rows: [],
            values: [
                { dataField: '[Measures].[Fact Product Sales Count]' },
                { dataField: '[Measures].[Product Actual Cost]' }
            ]
        }).done(function(data) {
            assert.deepEqual(data.values, [[['#N/A', '#N/A']]], 'cell data');
            assert.equal(errors.log.callCount, 2);
            assert.deepEqual(errors.log.getCall(0).args, ['W4002', 'Unknown Error.']);
            assert.deepEqual(errors.log.getCall(1).args, ['W4002', 'Read access to the cell is denied.']);
        }).fail(function() {
            assert.ok(false);
        });
    });

    QUnit.test('Throw error when unexpected response', function(assert) {
        this.sendDeferred.resolve('');
        this.store.load({
            columns: [],
            rows: [],
            values: []
        }).done(function(data) {
            assert.ok(false);
        }).fail(function() {
            assert.equal(errors.Error.lastCall.args[0], 'E4023');
            assert.equal(errors.Error.lastCall.args[1], '');
        });
    });

    QUnit.test('Parse time type cell data', function(assert) {
        this.sendDeferred.resolve('<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExecuteResponse xmlns="urn:schemas-microsoft-com:xml-analysis"><return><root xmlns="urn:schemas-microsoft-com:xml-analysis:mddataset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><Axes><Axis name="Axis0"><Tuples><Tuple><Member Hierarchy="[Measures]"><UName>[Measures].[Duracao]</UName><Caption>Duracao</Caption><LName>[Measures].[MeasuresLevel]</LName><LNum>0</LNum><DisplayInfo>0</DisplayInfo><HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME><MEMBER_VALUE>Duracao</MEMBER_VALUE></Member></Tuple></Tuples></Axis></Axes><CellData><Cell CellOrdinal="0"><Value>28:59:08</Value><FormatString>Long Time</FormatString></Cell></CellData></root></return></ExecuteResponse></soap:Body></soap:Envelope>');

        this.store.load({
            columns: [],
            rows: [],
            values: [{ dataField: '[Measures].[Duracao]' }]
        })
            .done(function(data) {
                assert.strictEqual(data.values[0][0][0], '28:59:08');
            });
    });

    QUnit.test('Language Id passed to discover query', function(assert) {
        this.store.getFields();

        this.sendRequest.getCalls().forEach(function(call) {
            assert.equal($(call.args[0].data).find('LocaleIdentifier').text(), languageId);
        });
    });

    QUnit.test('Language Id passed to execute query', function(assert) {
        this.store.load({
            columns: [],
            rows: [],
            values: [{ dataField: '[Measures].[Duracao]' }]
        });

        assert.equal($(this.getRequest(0)).find('LocaleIdentifier').text(), languageId);
    });

    QUnit.test('No LocaleIdentifier in query if unknown locale is set', function(assert) {
        const locale = localization.locale();

        localization.locale('unknown');

        try {
            this.store.load({
                columns: [],
                rows: [],
                values: [{ dataField: '[Measures].[Duracao]' }]
            });

            assert.equal($(this.getRequest(0)).find('LocaleIdentifier').length, 0);
        } finally {
            localization.locale(locale);
        }
    });

    QUnit.test('T566739. Do not generate CrossJoin in select statement if skipValues is set to true', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [],
            values: [
                { dataField: '[Measures].[Internet Order Count]', caption: 'Data1' },
                { dataField: '[Measures].[Growth in Customer Base]', caption: 'Data2' },
                { dataField: '[Measures].[Customer Count]', caption: 'Data3' }
            ],
            skipValues: true
        });

        assert.equal(this.getQuery().toLowerCase().indexOf('crossjoin'), -1);
    });

    QUnit.test('Use full item key in descendants expression. T620434', function(assert) {
        this.store.load({
            columns: [],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: ['[Ship Date].[Calendar Bla Bla].&[2002]']
        });

        const query = this.getQuery();

        assert.ok(query.indexOf('{[Ship Date].[Calendar Bla Bla].&[2002]}') >= 0, 'Descendants argument has full key');
    });

    QUnit.test('T675232. Build a correct filter query when a member has empty key', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['[Product].[Category]&'],
                filterType: 'include'
            }],
            rows: [],
            values: []
        });

        const filterExpr = this.getQuery().match(/\(select(.+?)on 0/gi);

        assert.deepEqual(filterExpr, ['(SELECT {[Product].[Category].[Product].[Category]&}on 0']);
    });

    QUnit.test('T1236954. Build a correct filter query when a member has unknown member', function(assert) {
        this.store.load({
            values: [{
                dataField: '[Measures].[Calculated Cost]',
            }],
            columns: [{
                dataField: '[Activities - Activities].[Activities]',
                filterValues: ['[Activities - Activities].[Activities].[All].UNKNOWNMEMBER',
                    '[Activities - Activities].[Activities].&[24]',
                    '[Activities - Activities].[Activities].&[21]'],
            }],
            rows: [{
                dataField: '[Departments - Activities].[Departments]',
            }],
        });

        const filterExpr = this.getQuery().match(/\(select(.+?)on 0/gi);

        assert.deepEqual(filterExpr, [
            '(SELECT {[Activities - Activities].[Activities].[All].UNKNOWNMEMBER,[Activities - Activities].[Activities].&[24],[Activities - Activities].[Activities].&[21]}on 0',
        ]);
    });
});

QUnit.module('getDrillDownItems', stubsEnvironment, () => {

    QUnit.test('getDrillDownItems with empty paths', function(assert) {
        const loadOptions = {
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'include'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: ['CY 2002', 'CY 2003'],
                filterType: 'include'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [{ dataField: '[Product].[Color]', filterValues: ['Red'] }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] });
        assert.strictEqual(this.getQuery(), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM (SELECT {[Product].[Color].[Red]}on 0 FROM (SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].[CY 2003]}on 0 FROM (SELECT {[Product].[Category].[Bikes],[Product].[Category].[Accessories]}on 0 FROM [Adventure Works])))  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('getDrillDownItems with paths', function(assert) {
        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ['Bikes'], rowPath: ['CY 2004'] });
        assert.strictEqual(this.getQuery(), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Product].[Category].[Bikes],[Ship Date].[Calendar Year].[CY 2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('getDrillDownItems with custom columns', function(assert) {
        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
        };

        this.store.getDrillDownItems(loadOptions, {
            columnPath: [],
            rowPath: [],
            customColumns: ['Column1', 'Column2']
        });
        assert.strictEqual(this.getQuery(), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS return Column1,Column2');
    });

    QUnit.test('getDrillDownItems with several value fields', function(assert) {
        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{
                dataField: '[Measures].[Customer Count]',
                caption: 'Count'
            }, { dataField: '[Measures].[Internet Sales Order]', caption: 'Sales Order' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], dataIndex: 0 });
        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], dataIndex: 1 });
        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], dataIndex: 2 });

        assert.strictEqual(this.getQuery(0), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
        assert.strictEqual(this.getQuery(1), 'drillthrough SELECT [Measures].[Internet Sales Order] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
        assert.strictEqual(this.getQuery(2), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('getDrillDownItems with paths without rows', function(assert) {
        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ['Bikes'], rowPath: [] });
        assert.strictEqual(this.getQuery(), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Product].[Category].[Bikes]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('getDrillDownItems without value fields', function(assert) {
        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] });

        assert.strictEqual(this.getQuery(), 'drillthrough SELECT [Measures] on 0 FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('getDrillDownItems with paths when Hierarchy', function(assert) {
        const loadOptions = {
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]'
                }
            ],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ['&[2003]', '&[1]', '&[13]'], rowPath: ['CY 2004'] });
        assert.strictEqual(this.getQuery(), 'drillthrough SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2003],[Product].[Product Categories].[Subcategory].&[13],[Ship Date].[Calendar Year].[CY 2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('max drillDownRowCount', function(assert) {
        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: ['Bikes'], rowPath: ['CY 2004'], maxRowCount: 120 });
        assert.strictEqual(this.getQuery(), 'drillthrough maxrows 120 SELECT [Measures].[Customer Count] on 0 FROM [Adventure Works] WHERE ([Product].[Category].[Bikes],[Ship Date].[Calendar Year].[CY 2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('parse drillDown response', function(assert) {
        const textResponse = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExecuteResponse xmlns="urn:schemas-microsoft-com:xml-analysis"><return><root xmlns="urn:schemas-microsoft-com:xml-analysis:rowset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><xsd:schema xmlns:sql="urn:schemas-microsoft-com:xml-sql" targetNamespace="urn:schemas-microsoft-com:xml-analysis:rowset" elementFormDefault="qualified"><xsd:element name="root"><xsd:complexType><xsd:sequence minOccurs="0" maxOccurs="unbounded"><xsd:element name="row" type="row"/></xsd:sequence></xsd:complexType></xsd:element><xsd:simpleType name="uuid"><xsd:restriction base="xsd:string"><xsd:pattern value="[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}"/></xsd:restriction></xsd:simpleType><xsd:complexType name="xmlDocument"><xsd:sequence><xsd:any/></xsd:sequence></xsd:complexType><xsd:complexType name="row"><xsd:sequence><xsd:element sql:field="[Internet Customers].[$Customer.Customer]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Promotion.Promotion]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Sales Territory.Sales Territory Region]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Internet Sales Order Details.Internet Sales Order]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Ship Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Delivery Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Product.Product]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Source Currency.Source Currency Code]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[Customer Count]" name="_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_" minOccurs="0"/></xsd:sequence></xsd:complexType></xsd:schema><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Jon V. Yang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43793   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 29, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>August 3, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 38</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Eugene L. Huang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43767   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 18, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 25, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 30, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Black, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Ruben Torres</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43736   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 10, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 17, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row></root></return></ExecuteResponse></soap:Body></soap:Envelope>';
        this.sendDeferred.resolve(textResponse);

        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] }).done(function(data) {
            assert.strictEqual(data.length, 3);

            assert.deepEqual(data[0], {
                'Customer Customer': 'Jon V. Yang',
                'Date Date': 'July 22, 2001',
                'Delivery Date Date': 'August 3, 2001',
                'Internet Sales Order Details Internet Sales Order': 'SO43793   Line 1',
                'Product Product': 'Mountain-100 Silver, 38',
                'Promotion Promotion': 'No Discount',
                'Sales Territory Sales Territory Region': 'Australia',
                'Ship Date Date': 'July 29, 2001',
                'Source Currency Source Currency Code': 'AUD',
                'Customer Count': '1'
            });
        });

    });

    QUnit.test('create drillDown dataSource', function(assert) {
        const textResponse = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExecuteResponse xmlns="urn:schemas-microsoft-com:xml-analysis"><return><root xmlns="urn:schemas-microsoft-com:xml-analysis:rowset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla"><xsd:schema xmlns:sql="urn:schemas-microsoft-com:xml-sql" targetNamespace="urn:schemas-microsoft-com:xml-analysis:rowset" elementFormDefault="qualified"><xsd:element name="root"><xsd:complexType><xsd:sequence minOccurs="0" maxOccurs="unbounded"><xsd:element name="row" type="row"/></xsd:sequence></xsd:complexType></xsd:element><xsd:simpleType name="uuid"><xsd:restriction base="xsd:string"><xsd:pattern value="[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}"/></xsd:restriction></xsd:simpleType><xsd:complexType name="xmlDocument"><xsd:sequence><xsd:any/></xsd:sequence></xsd:complexType><xsd:complexType name="row"><xsd:sequence><xsd:element sql:field="[Internet Customers].[$Customer.Customer]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Promotion.Promotion]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Sales Territory.Sales Territory Region]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Internet Sales Order Details.Internet Sales Order]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Ship Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Delivery Date.Date]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Product.Product]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[$Source Currency.Source Currency Code]" name="_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_" type="xsd:string" minOccurs="0"/><xsd:element sql:field="[Internet Customers].[Customer Count]" name="_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_" minOccurs="0"/></xsd:sequence></xsd:complexType></xsd:schema><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Jon V. Yang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43793   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 29, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>August 3, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 38</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Eugene L. Huang</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43767   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 18, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 25, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 30, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Black, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row><row><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_>Ruben Torres</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Customer.Customer_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_>No Discount</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Promotion.Promotion_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_>Australia</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Sales_x0020_Territory.Sales_x0020_Territory_x0020_Region_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_>SO43736   Line 1</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Internet_x0020_Sales_x0020_Order_x0020_Details.Internet_x0020_Sales_x0020_Order_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_>July 10, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_>July 17, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Ship_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_>July 22, 2001</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Delivery_x0020_Date.Date_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_>Mountain-100 Silver, 44</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Product.Product_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_>AUD</_x005B_Internet_x0020_Customers_x005D_._x005B__x0024_Source_x0020_Currency.Source_x0020_Currency_x0020_Code_x005D_><_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_ xsi:type="xsd:int">1</_x005B_Internet_x0020_Customers_x005D_._x005B_Customer_x0020_Count_x005D_></row></root></return></ExecuteResponse></soap:Body></soap:Envelope>';
        this.sendDeferred.resolve(textResponse);

        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        const drillDownDataSource = this.store.createDrillDownDataSource(loadOptions, { columnPath: [], rowPath: [] });

        drillDownDataSource.paginate(false);

        drillDownDataSource.load().done(function(data) {
            assert.strictEqual(data.length, 3);

            assert.deepEqual(data[0], {
                'Customer Customer': 'Jon V. Yang',
                'Date Date': 'July 22, 2001',
                'Delivery Date Date': 'August 3, 2001',
                'Internet Sales Order Details Internet Sales Order': 'SO43793   Line 1',
                'Product Product': 'Mountain-100 Silver, 38',
                'Promotion Promotion': 'No Discount',
                'Sales Territory Sales Territory Region': 'Australia',
                'Ship Date Date': 'July 29, 2001',
                'Source Currency Source Currency Code': 'AUD',
                'Customer Count': '1'
            });
        });
    });

    QUnit.test('getDrillDownItems - parse error response', function(assert) {
        this.sendDeferred.resolve(ERROR_RESPONCE);

        const loadOptions = {
            columns: [{ dataField: '[Product].[Category]', filterType: 'include' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', filterType: 'include' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        };

        this.store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] })
            .done(function() {
                assert.ok(false);
            })
            .fail(function(error) {
                assert.ok(error.message.indexOf('Query (1, 77) The Fiscal hierarchy is used more than once in the Crossjoin function.') > -1);

            });
    });


});

QUnit.module('Send Request', {
    beforeEach: function() {
        sinon.stub(ajax, 'sendRequest');
        ajax.sendRequest.returns($.Deferred().reject());
        this.dataSource = $.extend(true, {}, stubsEnvironment.dataSource);
    },

    afterEach: function() {
        ajax.sendRequest.restore();
    },

    loadOptions: {
        columns: [
            { dataField: 'DimensionField' }
        ],
        values: [{ dataField: 'MeasureField' }]
    }
}, () => {

    QUnit.test('send ajax request on load', function(assert) {
        const store = new XmlaStore(this.dataSource);

        store.load(this.loadOptions);

        assert.ok(ajax.sendRequest.calledOnce);
        const ajaxArg = ajax.sendRequest.lastCall.args[0];

        assert.strictEqual(ajaxArg.url, this.dataSource.url, 'url');
        assert.strictEqual(ajaxArg.method, 'POST', 'method');
        assert.ok(ajaxArg.data, 'data');
        assert.deepEqual(ajaxArg.xhrFields, {}, 'xhrFields');
        assert.deepEqual(ajaxArg.headers, { 'Content-Type': 'text/xml' }, 'headers');
        assert.strictEqual(ajaxArg.beforeSend, undefined);
    });

    QUnit.test('send ajax request with before send callback', function(assert) {
        const dataSource = this.dataSource;
        const beforeSend = function(settings) {
        // assert beforeSend argument
            assert.strictEqual(settings.url, dataSource.url, 'url');
            assert.strictEqual(settings.method, 'POST', 'method');
            assert.ok(settings.data, 'data');
            assert.deepEqual(settings.xhrFields, {}, 'xhrFields');
            assert.deepEqual(settings.headers, { 'Content-Type': 'text/xml' }, 'headers');
            assert.strictEqual(settings.beforeSend, undefined);

            // act
            settings.headers['my-header'] = 'my-header-value';
        };
        dataSource.beforeSend = beforeSend;

        const store = new XmlaStore(dataSource);

        store.load(this.loadOptions);
        // assert
        assert.ok(ajax.sendRequest.calledOnce);
        const ajaxArg = ajax.sendRequest.lastCall.args[0];

        assert.strictEqual(ajaxArg.url, dataSource.url, 'url');
        assert.strictEqual(ajaxArg.method, 'POST', 'method');
        assert.ok(ajaxArg.data, 'data');
        assert.deepEqual(ajaxArg.xhrFields, {}, 'xhrFields');
        assert.deepEqual(ajaxArg.headers, {
            'Content-Type': 'text/xml',
            'my-header': 'my-header-value'
        }, 'headers');
        assert.strictEqual(ajaxArg.beforeSend, undefined);
    });

});


import $ from 'jquery';
import pivotGridUtils from '__internal/grids/pivot_grid/m_widget_utils';
import { XmlaStore } from '__internal/grids/pivot_grid/xmla_store/m_xmla_store';
import { errors } from 'common/data/errors';

const CATEGORIES_DATA = [
    { key: '[Product].[Category].&[4]', value: 'Accessories', text: 'Accessories', index: 1 },
    { key: '[Product].[Category].&[1]', value: 'Bikes', text: 'Bikes', index: 2 },
    { key: '[Product].[Category].&[3]', value: 'Clothing', text: 'Clothing', index: 3 }
];

const CATEGORIES_HIERARCHY_DATA = [
    { key: '[Product].[Product Categories].[Category].&[4]', value: 'Accessories', text: 'Accessories', index: 1 },
    { key: '[Product].[Product Categories].[Category].&[1]', value: 'Bikes', text: 'Bikes', index: 2 },
    { key: '[Product].[Product Categories].[Category].&[3]', value: 'Clothing', text: 'Clothing', index: 3 }
];

const CALENDAR_YEAR_DATA = [{
    index: 1,
    text: 'CY 2001',
    value: 2001,
    key: '[Ship Date].[Calendar Year].&[2001]'
}, {
    index: 2,
    text: 'CY 2002',
    value: 2002,
    key: '[Ship Date].[Calendar Year].&[2002]'
}, {
    index: 3,
    text: 'CY 2003',
    value: 2003,
    key: '[Ship Date].[Calendar Year].&[2003]'
}, {
    index: 4,
    text: 'CY 2004',
    value: 2004,
    key: '[Ship Date].[Calendar Year].&[2004]'
}];

const CALENDAR_HIERARCHY_YEAR_DATA = [{
    index: 1,
    text: 'CY 2001',
    value: 2001,
    key: '[Ship Date].[Calendar].[Calendar Year].&[2001]'
}, {
    index: 2,
    text: 'CY 2002',
    value: 2002,
    key: '[Ship Date].[Calendar].[Calendar Year].&[2002]'
}, {
    index: 3,
    text: 'CY 2003',
    value: 2003,
    key: '[Ship Date].[Calendar].[Calendar Year].&[2003]'
}, {
    index: 4,
    text: 'CY 2004',
    value: 2004,
    key: '[Ship Date].[Calendar].[Calendar Year].&[2004]'
}];

const stubsEnvironment = {
    beforeEach: function() {
        sinon.spy(errors, 'log');
        sinon.spy(errors, 'Error');

        this.store = new XmlaStore(this.dataSource);
        this.sendDeferred = $.Deferred();

        this.sendRequest = sinon.stub(pivotGridUtils, 'sendRequest').callsFake(() => {
            return this.sendDeferred;
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
        const query = $(this.getRequest(num)).find('Statement').text().trim();
        return query;
    },

    dataSource: {
        url: 'url',
        catalog: 'Adventure Works DW Standard Edition',
        cube: 'Adventure Works'
    }
};

QUnit.module('Adventure Works', stubsEnvironment, () => {
    QUnit.test('XMLA store have filter, key methods', function(assert) {
        assert.strictEqual(this.store.filter(), undefined);
        assert.strictEqual(this.store.key(), undefined);
    });

    QUnit.test('not defined data in description', function(assert) {
        this.store.load({});
        const query = this.getQuery();

        assert.equal(query, 'SELECT {[Measures]} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Adventure Works', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Adventure Works. Expand item', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_YEAR_DATA[2].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Month Of Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Ship Date].[Calendar Year].&[2003]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Adventure Works. Expand column & row', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key]],
            path: [CATEGORIES_DATA[1].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Subcategory].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month Of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2003])},{[Ship Date].[Month Of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Product].[Category].&[1]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Load with expand column & row', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key]],
            columnExpandedPaths: [[CATEGORIES_DATA[1].key]]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Product].[Category].&[1])},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month Of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2003])},{[Ship Date].[Month Of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Adventure Works. Expand second level child', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }, { dataField: '[Ship Date].[Day Of Month]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_YEAR_DATA[2].key, '[Ship Date].[Month Of Year].&[8]']
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Day Of Month].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Ship Date].[Calendar Year].&[2003],[Ship Date].[Month Of Year].&[8]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Adventure Works. Expand child when opposite axis expanded on several levels', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }, { dataField: '[Ship Date].[Day Of Month]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key], [CALENDAR_YEAR_DATA[2].key, '[Ship Date].[Month Of Year].&[8]']],
            path: [CATEGORIES_DATA[1].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Subcategory].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month Of Year].[All])},{([Ship Date].[Day Of Month].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2003])},{[Ship Date].[Month Of Year].allMembers},{([Ship Date].[Day Of Month].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2003])},{([Ship Date].[Month Of Year].&[8])},{[Ship Date].[Day Of Month].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Product].[Category].&[1]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Load expanded axis', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', expanded: true }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Category].allMembers},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Load with expanded hidden level item', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]', expanded: true }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Expanded all items', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', expanded: true }, {
                dataField: '[Product].[Subcategory]',
                expanded: true
            }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', expanded: true }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Category].allMembers},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Loaded with two level expanded items', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                { dataField: '[Ship Date].[Calendar Quarter of Year]', expanded: true },
                { dataField: '[Ship Date].[Month of Year]' },
                { dataField: '[Ship Date].[Day Name]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Calendar Quarter of Year].[All])},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Calendar Quarter of Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Calendar Quarter of Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Expand item with expanded children', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]' },
                { dataField: '[Ship Date].[Calendar Quarter of Year]', expanded: true },
                { dataField: '[Ship Date].[Month of Year]' },
                { dataField: '[Ship Date].[Day Name]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_YEAR_DATA[2].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Quarter of Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Quarter of Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Ship Date].[Calendar Year].&[2003]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('defined only cells', function(assert) {
        this.store.load({
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'SELECT {[Measures].[Customer Count]} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('defined columns and cells', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            values: [{ dataField: '[Measures].[Internet Sales Amount]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Internet Sales Amount]}) SELECT CrossJoin([DX_columns],{[Measures].[Internet Sales Amount]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('defined cells and rows', function(assert) {
        this.store.load({
            rows: [{ dataField: '[Product].[Category]' }],
            values: [{ dataField: '[Measures].[Internet Sales Amount]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Internet Sales Amount]}) SELECT {[Measures].[Internet Sales Amount]} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('defined columns and rows', function(assert) {
        this.store.load({
            rows: [{ dataField: '[Product].[Category]' }],
            columns: [{ dataField: '[Ship Date].[Calendar Year]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures]}) set [DX_rows] as NonEmpty({[Product].[Category].allMembers}, {[Measures]}) SELECT CrossJoin([DX_columns],{[Measures]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('defined columns only', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Ship Date].[Calendar Year]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures]}) SELECT CrossJoin([DX_columns],{[Measures]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('defined rows only', function(assert) {
        this.store.load({
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures]}) SELECT {[Measures]} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Load with two measures', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [
                { dataField: '[Measures].[Customer Count]', caption: 'Count' },
                { dataField: '[Measures].[Order Count]', caption: 'Count' }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count],[Measures].[Order Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count],[Measures].[Order Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count],[Measures].[Order Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('T321308: dxPivotGrid with XMLA store - uncaught exception occurs when all field cells are empty', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Internet Sales Order Details].[Carrier Tracking Number]' }],
            rows: [],
            values: [
                { dataField: '[Measures].[Customer Count]', caption: 'Count' }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Internet Sales Order Details].[Carrier Tracking Number].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('T566739. Get All field values without load values', function(assert) {
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
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Internet Order Count],[Measures].[Growth in Customer Base],[Measures].[Customer Count]}) SELECT [DX_columns] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('T677334. Correct parse result with empty member value', function(assert) {
        this.store.load({
            columns: [],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[0].key]]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month Of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2001])},{[Ship Date].[Month Of Year].allMembers}), {[Measures].[Customer Count]})) SELECT {[Measures].[Customer Count]} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });
});

function getGrandTotalIndexForExpanding(store) {
    if(store instanceof XmlaStore) {
        return undefined;
    } else {
        return 0;
    }
}

QUnit.module('Hierarchies', stubsEnvironment, () => {

    QUnit.test('Load from hierachy', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar].[Calendar Year]',
                hierarchyName: '[Ship Date].[Calendar]'
            }, { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Expand item', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Expand column & row', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            },
            {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }
            ],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            headerName: 'columns',
            rowExpandedPaths: [[CALENDAR_HIERARCHY_YEAR_DATA[2].key]],
            path: [CATEGORIES_HIERARCHY_DATA[1].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({Descendants({[Product].[Product Categories].[Category].&[1]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Expand second level child', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Date]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            rowExpandedPaths: [['&[2003]']],
            headerName: 'rows',
            path: ['[Ship Date].[Calendar].[Calendar Year].&[2003]', '[Ship Date].[Calendar].[Month].&[2003]&[8]']
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({Descendants({[Ship Date].[Calendar].[Month].&[2003]&[8]}, [Ship Date].[Calendar].[Date], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('T1283598. Hierarchy slice should not duplicate hierarchy prefix when path value is a full unique name', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Active Month].[Active Month]' }],
            rows: [
                { dataField: '[Product].[Product Purchaser Type].[Purchaser Type]', hierarchyName: '[Product].[Product Purchaser Type]' },
                { dataField: '[Product].[Product Purchaser Type].[Purchaser Sub Type]', hierarchyName: '[Product].[Product Purchaser Type]' },
                { dataField: '[Product].[Product Nbr]' }
            ],
            values: [{ dataField: '[Measures].[Members]', caption: 'Members' }],
            headerName: 'rows',
            path: [
                '[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial]',
                '[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial].&[Group]'
            ]
        });
        const query = this.getQuery();

        assert.notStrictEqual(
            query.indexOf('WHERE ([Product].[Product Purchaser Type].[Purchaser Type].&[Commercial].&[Group])'),
            -1,
            'WHERE slice contains the full unique name once'
        );
        assert.strictEqual(
            query.indexOf('[Product].[Product Purchaser Type].[Purchaser Sub Type].[Product].[Product Purchaser Type]'),
            -1,
            'WHERE slice does not duplicate the hierarchy prefix'
        );
    });

    QUnit.test('T1283598. Axis SET should not duplicate hierarchy prefix when expanded path value is a full unique name', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Active Month].[Active Month]' }],
            rows: [
                { dataField: '[Product].[Product Purchaser Type].[Purchaser Type]', hierarchyName: '[Product].[Product Purchaser Type]' },
                { dataField: '[Product].[Product Purchaser Type].[Purchaser Sub Type]', hierarchyName: '[Product].[Product Purchaser Type]' },
                { dataField: '[Product].[Product Nbr]' }
            ],
            values: [{ dataField: '[Measures].[Members]', caption: 'Members' }],
            rowExpandedPaths: [
                ['[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial]'],
                ['[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial]', '[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial].&[Group]']
            ]
        });
        const query = this.getQuery();

        assert.notStrictEqual(
            query.indexOf('([Product].[Product Purchaser Type].[Purchaser Type].&[Commercial].&[Group])'),
            -1,
            'axis SET contains the full unique name once'
        );
        assert.strictEqual(
            query.indexOf('[Product].[Product Purchaser Type].[Purchaser Sub Type].[Product].[Product Purchaser Type]'),
            -1,
            'axis SET does not duplicate the hierarchy prefix'
        );
    });

    QUnit.test('T1283598. Drill-down WHERE slice should not duplicate hierarchy prefix when path value is a full unique name', function(assert) {
        this.store.getDrillDownItems({
            columns: [{ dataField: '[Active Month].[Active Month]' }],
            rows: [
                { dataField: '[Product].[Product Purchaser Type].[Purchaser Type]', hierarchyName: '[Product].[Product Purchaser Type]' },
                { dataField: '[Product].[Product Purchaser Type].[Purchaser Sub Type]', hierarchyName: '[Product].[Product Purchaser Type]' },
                { dataField: '[Product].[Product Nbr]' }
            ],
            values: [{ dataField: '[Measures].[Members]', caption: 'Members' }]
        }, {
            columnPath: [],
            rowPath: [
                '[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial]',
                '[Product].[Product Purchaser Type].[Purchaser Type].&[Commercial].&[Group]'
            ],
            dataIndex: 0,
            maxRowCount: 100
        });
        const query = this.getQuery();

        assert.notStrictEqual(
            query.indexOf('WHERE ([Product].[Product Purchaser Type].[Purchaser Type].&[Commercial].&[Group])'),
            -1,
            'drill-down WHERE slice contains the full unique name once'
        );
        assert.strictEqual(
            query.indexOf('[Product].[Product Purchaser Type].[Purchaser Sub Type].[Product].[Product Purchaser Type]'),
            -1,
            'drill-down WHERE slice does not duplicate the hierarchy prefix'
        );
    });

    QUnit.test('Hierarchy. Expand child when opposite axis expanded on several levels', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Date]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            rowExpandedPaths: [
                [CALENDAR_HIERARCHY_YEAR_DATA[2].key],
                [CALENDAR_HIERARCHY_YEAR_DATA[2].key, '[Ship Date].[Calendar].[Month].&[2003]&[8]']
            ],
            path: [CATEGORIES_HIERARCHY_DATA[1].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({Descendants({[Product].[Product Categories].[Category].&[1]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Month].&[2003]&[8]}, [Ship Date].[Calendar].[Date], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy Load expanded axis', function(assert) {
        this.store.load({
            columns: [
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
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) set [DX_rows] as NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Load with expanded hidden level item', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                }
            ],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Expanded all items', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                }
            ],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) set [DX_rows] as NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierachy. Loaded with two level expanded items', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Quarter]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Calendar Quarter], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Quarter]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Expand item with expanded children', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Semester]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Ship Date].[Calendar].[Calendar Quarter]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Calendar Semester], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Calendar Quarter], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy. Expand item with two expanded children', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Semester]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Quarter]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Calendar Semester], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Calendar Quarter], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2003]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Expand item', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Category]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            path: ['&[2003]']
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2003]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Not hierarchy & hierarchy. Expand item', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Product].[Category]' },
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            path: ['&[1]']
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Ship Date].[Calendar].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works] WHERE ([Product].[Category].&[1]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Not hierarchy & hierarchy. expanded not hierarchy level', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Calendar].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Calendar].[Month].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Load expanded axis', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Product].[Category]' }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]},{([Product].[Category].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar].[Calendar Year].allMembers},{[Product].[Category].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Load expanded axis. With filter', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value',
                    groupIndex: 0
                },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value',
                    groupIndex: 0
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value',
                    groupIndex: 1
                }
            ],
            filters: [
                {
                    dataField: '[Product].[Product Categories]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value',
                    area: 'column',
                    filterValues: ['Clothing'],
                    filterType: 'include'
                },
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value',
                    area: 'column',
                    filterValues: ['CY 2003'],
                    filterType: 'include'
                }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]},{([Ship Date].[Calendar].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Product Categories].[Category].allMembers},{[Ship Date].[Calendar].[Calendar Year].allMembers}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Product Categories].[Category].allMembers},{Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM (SELECT CrossJoin({[Product].[Product Categories].[Clothing]},{[Ship Date].[Calendar].[CY 2003]})on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Load expanded axis with expanded not hirarchy children', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Product].[Category]', expanded: true },
                { dataField: '[Product].[Subcategory]' }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]},{([Product].[Category].[All])},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar].[Calendar Year].allMembers},{[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar].[Calendar Year].allMembers},{[Product].[Category].allMembers},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Expand hierarchy item with expanded not hirarchy children', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Category]', expanded: true },
                { dataField: '[Product].[Subcategory]' }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            path: ['&[2003]']
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Category].allMembers},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2003]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Expand column & row.', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Color]' }
            ],
            rows: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            headerName: 'rows',
            columnExpandedPaths: [['[Ship Date].[Calendar].[Calendar Year].&[2002]'], ['[Ship Date].[Calendar].[Calendar Year].&[2003]']],
            path: [CATEGORIES_DATA[1].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]},{([Product].[Color].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar].[Calendar Year].&[2002])},{[Product].[Color].allMembers}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar].[Calendar Year].&[2003])},{[Product].[Color].allMembers}), {[Measures].[Customer Count]})) set [DX_rows] as NonEmpty({[Product].[Subcategory].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Product].[Category].&[1]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. Expand row & column.', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Color]' }
            ],
            rows: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            headerName: 'columns',
            rowExpandedPaths: [[CATEGORIES_DATA[1].key]],
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Color].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Product].[Category].&[1])},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2003]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & not hierarchy. expanded hierarchy level', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Product].[Category]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Month]},{([Product].[Category].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar].[Month].allMembers},{[Product].[Category].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & hierarchy. expanded hierarchy level', function(assert) {
        this.store.load({
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

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]},{([Product].[Product Categories].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar].[Calendar Year].allMembers},{[Product].[Product Categories].[Category].allMembers}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar].[Calendar Year].allMembers},{Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Hierarchy & hierarchy. Expand item with expanded next hierarchy level', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
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
            headerName: 'columns',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[3].key],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Product].[Product Categories].[Category].allMembers}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });
});

QUnit.module('Filtering', stubsEnvironment, () => {
    QUnit.test('FilterValues in row and column fields. Include filter', function(assert) {
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

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].[CY 2003]}on 0 FROM (SELECT {[Product].[Category].[Bikes],[Product].[Category].[Accessories]}on 0 FROM [Adventure Works]))  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('FilterValues in row and column fields. Exclude Filter', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'exclude'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: ['CY 2002', 'CY 2003'],
                filterType: 'exclude'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT Except([Ship Date].[Calendar Year].allMembers,{[Ship Date].[Calendar Year].[CY 2002].parent,Descendants([Ship Date].[Calendar Year].[CY 2002]),[Ship Date].[Calendar Year].[CY 2003].parent,Descendants([Ship Date].[Calendar Year].[CY 2003])})on 0 FROM (SELECT Except([Product].[Category].allMembers,{[Product].[Category].[Bikes].parent,Descendants([Product].[Category].[Bikes]),[Product].[Category].[Accessories].parent,Descendants([Product].[Category].[Accessories])})on 0 FROM [Adventure Works]))  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('FilterValues in columns field', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'include'
            }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Product].[Category].[Bikes],[Product].[Category].[Accessories]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('FilterValues in rows field', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    filterValues: ['CY 2001', 'CY 2002'],
                    filterType: 'exclude'
                },
                {
                    dataField: '[Ship Date].[Month Of Year]',
                    filterValues: ['January', 'February'],
                    filterType: 'include'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT CrossJoin(Except([Ship Date].[Calendar Year].allMembers,{[Ship Date].[Calendar Year].[CY 2001].parent,Descendants([Ship Date].[Calendar Year].[CY 2001]),[Ship Date].[Calendar Year].[CY 2002].parent,Descendants([Ship Date].[Calendar Year].[CY 2002])}),{[Ship Date].[Month Of Year].[January],[Ship Date].[Month Of Year].[February]})on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Filter field. Include type', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [{
                dataField: '[Ship Date].[Month Of Year]',
                filterValues: ['January', 'February'],
                filterType: 'include'
            }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Ship Date].[Month Of Year].[January],[Ship Date].[Month Of Year].[February]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Filter field. Exclude type', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [{
                dataField: '[Ship Date].[Month Of Year]',
                filterValues: ['January', 'February'],
                filterType: 'exclude'
            }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT Except([Ship Date].[Month Of Year].allMembers,{[Ship Date].[Month Of Year].[January].parent,Descendants([Ship Date].[Month Of Year].[January]),[Ship Date].[Month Of Year].[February].parent,Descendants([Ship Date].[Month Of Year].[February])})on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Filter field. Include and exclude filters', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Month Of Year]',
                    filterValues: ['January', 'February'],
                    filterType: 'include'
                },
                {
                    dataField: '[Customer].[Country]',
                    filterValues: ['Australia', 'United Kingdom', 'United States'],
                    filterType: 'exclude'
                }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT CrossJoin({[Ship Date].[Month Of Year].[January],[Ship Date].[Month Of Year].[February]},Except([Customer].[Country].allMembers,{[Customer].[Country].[Australia].parent,Descendants([Customer].[Country].[Australia]),[Customer].[Country].[United Kingdom].parent,Descendants([Customer].[Country].[United Kingdom]),[Customer].[Country].[United States].parent,Descendants([Customer].[Country].[United States])}))on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Ignore filterValues for hierarchyLevel field', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]',
                filterValues: ['Bikes'],
                groupIndex: 1
            }],
            rows: [{ dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Filter hierarchyLevel field. Include type', function(assert) {
        this.store.load({
            'columns': [
                { 'dimension': 'Ship Date', 'dataField': '[Ship Date].[Calendar Year]' }
            ],
            'values': [
                { 'dimension': 'Measures', 'dataField': '[Measures].[Customer Count]' }
            ],

            'filters': [{
                'dataField': '[Ship Date].[Calendar]',
                'hierarchyName': '[Ship Date].[Calendar]',
                'groupName': '[Ship Date].[Calendar]',
                'filterValues': [
                    'H2 CY 2002',
                    ['CY 2003'],
                    ['CY 2004', 'H1 CY 2004'],
                    ['CY 2004', 'H2 CY 2004', 'Q3 CY 2004', 'August 2004'],
                    []
                ]
            }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM (SELECT {[Ship Date].[Calendar].[H2 CY 2002],[Ship Date].[Calendar].[CY 2003],[Ship Date].[Calendar].[H1 CY 2004],[Ship Date].[Calendar].[August 2004],[Ship Date].[Calendar].undefined}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Filter hierarchyLevel field. Exclude type', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Product].[Product Categories]',
                    hierarchyName: '[Product].[Product Categories]',
                    filterValues: ['Clothing', 'Mountain Bikes'],
                    filterType: 'exclude'
                }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM (SELECT Except([Product].[Product Categories].allMembers,{[Product].[Product Categories].[Clothing].parent,Descendants([Product].[Product Categories].[Clothing]),[Product].[Product Categories].[Mountain Bikes].parent,Descendants([Product].[Product Categories].[Mountain Bikes])})on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('FilterValues using full key value in row and column fields. Include filter', function(assert) {
        this.store.load({
            columns: [],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: [CALENDAR_YEAR_DATA[1].key, CALENDAR_YEAR_DATA[2].key],
                filterType: 'include'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) SELECT {[Measures].[Customer Count]} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Ship Date].[Calendar Year].&[2002],[Ship Date].[Calendar Year].&[2003]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });
});

QUnit.module('Sorting', stubsEnvironment, () => {

    QUnit.test('Sorting by value', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'desc', sortBy: 'value' }],
            rows: [{ dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'value' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Month of Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by display text', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'desc', sortBy: 'displayText' }],
            rows: [{ dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'displayText' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Month of Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by display text. Default sorting when sortOrder is undefined', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Ship Date].[Month of Year]', sortBy: 'displayText' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Ship Date].[Month of Year].allMembers}, {[Measures]}) SELECT CrossJoin([DX_columns],{[Measures]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by none', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'asc', sortBy: 'none' }],
            rows: [{ dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'none' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'none' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({[Ship Date].[Month of Year].allMembers}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by none two dimension on axis and expanded item', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Category]',
                    'caption': 'Category',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 131,
                    'sortOrder': 'asc',
                    'areaIndex': 0
                },
                {
                    dataField: '[Product].[Subcategory]',
                    'caption': 'Subcategory',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 156,
                    'sortOrder': 'desc',
                    'areaIndex': 1
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'none' }],
            columnExpandedPaths: [['&[1]']]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Product].[Category].&[1])},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting group by none', function(assert) {
        this.store.load({
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'none'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'none'
                }
            ],
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBy: 'none'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'asc',
                    sortBy: 'none'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'none' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) set [DX_rows] as Union(NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                {
                    dataField: '[Ship Date].[Month of Year]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field when expanded items', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]' },
                {
                    dataField: '[Ship Date].[Month of Year]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            rowExpandedPaths: [['&[2003]'], ['&[2002]']]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2003])},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2002])},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field when expanded items with expanded', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', filterValues: ['CY 2002', 'CY 2003'] },
                {
                    dataField: '[Ship Date].[Month of Year]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    expanded: true
                },

                { dataField: '[Ship Date].[Day of Month]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            rowExpandedPaths: [['&[2002]']]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])},{([Ship Date].[Day of Month].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2002])},{[Ship Date].[Month of Year].allMembers},{([Ship Date].[Day of Month].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Ship Date].[Calendar Year].&[2002])},{[Ship Date].[Month of Year].allMembers},{[Ship Date].[Day of Month].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Ship Date].[Calendar Year].[CY 2002],[Ship Date].[Calendar Year].[CY 2003]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field by caption', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                { dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBySummaryField: 'Count' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting group by Summary field', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field in first field on axis', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortBySummaryField: '[Measures].[Customer Count]'
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field in first field on axis with path', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                expanded: true,
                filterValues: ['Bikes']
            }, { dataField: '[Product].[Subcategory]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Category].allMembers},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Product].[Category].[Bikes]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting columns by row', function(assert) {
        this.store.load({
            rows: [
                { dataField: '[Product].[Category]', expanded: true, filterValues: ['Bikes'] },
                { dataField: '[Product].[Subcategory]' }
            ],
            columns: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) set [DX_rows] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Product].[Category].allMembers},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Product].[Category].[Bikes]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field in with path with length greater then columns count', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', filterValues: ['Bikes'] }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Product].[Category].[Bikes]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary two dimension on axis', function(assert) {
        this.store.load({
            'rows': [
                {
                    'dimension': '[Product]',
                    'dataField': '[Product].[Category]',
                    'caption': 'Category',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 0,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'sortBySummaryField': '[Measures].[Customer Count]',
                    'sortBySummaryPath': ['CY 2004'],
                    'sortOrder': 'desc',
                    'areaIndex': 0
                },
                {
                    'dimension': '[Product]',
                    'dataField': '[Product].[Subcategory]',
                    'caption': 'Subcategory',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 1,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'sortBySummaryField': '[Measures].[Customer Count]',
                    'sortBySummaryPath': ['CY 2004'],
                    'sortOrder': 'desc',
                    'areaIndex': 1
                }
            ],
            'columns': [
                {
                    'dimension': '[Ship Date]',
                    'dataField': '[Ship Date].[Calendar Year]',
                    'caption': 'Ship Date.Calendar Year',
                    'displayFolder': 'Calendar',
                    'isMeasure': false,
                    'area': 'column',
                    'index': 2,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'expanded': false,
                    'areaIndex': 0
                },
                {
                    'dimension': '[Ship Date]',
                    'dataField': '[Ship Date].[Month of Year]',
                    'caption': 'Ship Date.Month of Year',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'column',
                    'index': 3,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'areaIndex': 1
                }],

            'values': [{
                'dimension': '[Measures]',
                'dataField': '[Measures].[Customer Count]',
                'caption': 'Customer Count',
                'displayFolder': 'Internet Customers',
                'isMeasure': true,
                'area': 'data',
                'index': 4,
                'allowSorting': true,
                'allowFiltering': true,
                'allowExpandAll': true,
                'areaIndex': 0
            }],
            'rowExpandedPaths': [['&[3]']]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Ship Date].[Calendar Year].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Product].[Category].allMembers},{([Product].[Subcategory].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({([Product].[Category].&[3])},{[Product].[Subcategory].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting by Summary field when hierarchy in column', function(assert) {
        this.store.load({

            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]',
                expanded: true,
                filterValues: ['Bikes']
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT {[Product].[Product Categories].[Category].[Bikes]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sort fields with several expanded levels when expanded item', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'desc', sortBy: 'value' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]' },
                {
                    dataField: '[Ship Date].[Calendar Quarter of Year]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                { dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'value' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: ['&[2003]']
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Quarter of Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Quarter of Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works] WHERE ([Ship Date].[Calendar Year].&[2003]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sort fields with several expanded levels', function(assert) {
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                {
                    dataField: '[Ship Date].[Calendar Quarter of Year]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                { dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'value' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Category].allMembers}, {[Measures].[Customer Count]}) set [DX_rows] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{([Ship Date].[Calendar Quarter of Year].[All])},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Calendar Quarter of Year].allMembers},{([Ship Date].[Month of Year].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({[Ship Date].[Calendar Year].allMembers},{[Ship Date].[Calendar Quarter of Year].allMembers},{[Ship Date].[Month of Year].allMembers}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sort group when expanded item', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            path: [CALENDAR_HIERARCHY_YEAR_DATA[3].key],
            headerName: 'rows',
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}) set [DX_rows] as NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year].&[2004]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]}) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sort when several groups on axis. Expand item', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            headerName: 'columns',
            path: ['&[2004]'],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Product].[Product Categories].[Category].allMembers}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works] WHERE ([Ship Date].[Calendar].[Calendar Year].&[2004]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sort when several expanded groups on axis', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    filterValues: ['CY 2003', 'CY 2002'],
                    filterType: 'include'
                }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]},{([Product].[Product Categories].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)},{([Product].[Product Categories].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)},{[Product].[Product Categories].[Category].allMembers}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)},{Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM (SELECT {[Ship Date].[Calendar].[CY 2003],[Ship Date].[Calendar].[CY 2002]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sort last group on axis', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },

                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    filterValues: ['CY 2003', 'CY 2002'],
                    filterType: 'include'
                }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]},{([Product].[Product Categories].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)},{([Product].[Product Categories].[All])}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)},{[Product].[Product Categories].[Category].allMembers}), {[Measures].[Customer Count]}),NonEmpty(CrossJoin({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)},{Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}), {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM (SELECT {[Ship Date].[Calendar].[CY 2003],[Ship Date].[Calendar].[CY 2002]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Sorting group in two dimension', function(assert) {
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            rows: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    filterValues: ['CY 2003', 'CY 2002'],
                    filterType: 'include'
                },
                {
                    dataField: '[Product].[Product Categories]',
                    hierarchyName: '[Product].[Product Categories]',
                    filterValues: ['Bikes', 'Clothing'],
                    filterType: 'include'
                }
            ]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty({[Ship Date].[Calendar].[All],[Ship Date].[Calendar].[Calendar Year]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Ship Date].[Calendar].[Calendar Year]}, [Ship Date].[Calendar].[Month], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) set [DX_rows] as Union(NonEmpty({[Product].[Product Categories].[All],[Product].[Product Categories].[Category]}, {[Measures].[Customer Count]}),NonEmpty({Descendants({[Product].[Product Categories].[Category]}, [Product].[Product Categories].[Subcategory], SELF_AND_BEFORE)}, {[Measures].[Customer Count]})) SELECT CrossJoin([DX_columns],{[Measures].[Customer Count]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns,[DX_rows] DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON rows FROM (SELECT CrossJoin({[Ship Date].[Calendar].[CY 2003],[Ship Date].[Calendar].[CY 2002]},{[Product].[Product Categories].[Bikes],[Product].[Product Categories].[Clothing]})on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });
});

QUnit.module('XMLA Store with another cubes', stubsEnvironment, () => {

    QUnit.test('T248791. Dimension with zero level members', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Agrégation par date].[Agrégation par date]', area: 'column' }
            ],
            values: [{ dataField: '[Measures].[Fon_nombre]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as NonEmpty({[Agrégation par date].[Agrégation par date].allMembers}, {[Measures].[Fon_nombre]}) SELECT CrossJoin([DX_columns],{[Measures].[Fon_nombre]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('T248791. Dimension with zero level members. Expand All level', function(assert) {
        this.store.load({
            columns: [
                { dataField: '[Agrégation par date].[Agrégation par date]', area: 'column', expanded: true },
                { dataField: '[Date].[L\'année]' }
            ],
            values: [{ dataField: '[Measures].[Fon_nombre]' }]
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as Union(NonEmpty(CrossJoin({[Agrégation par date].[Agrégation par date].allMembers},{([Date].[L\'année].[All])}), {[Measures].[Fon_nombre]}),NonEmpty(CrossJoin({[Agrégation par date].[Agrégation par date].allMembers},{[Date].[L\'année].allMembers}), {[Measures].[Fon_nombre]})) SELECT CrossJoin([DX_columns],{[Measures].[Fon_nombre]}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });
});

QUnit.module('Subset', stubsEnvironment, () => {
    QUnit.test('Skip and take rows', function(assert) {
        this.store.load({
            rows: [{
                dataField: '[Product].[Subcategory]',
                filterValues: [
                    'Bike Racks',
                    'Bottles and Cages',
                    'Caps',
                    'Cleaners'
                ]
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowSkip: 2,
            rowTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as {[Product].[Subcategory].allMembers} member [DX_rows_count] as COUNT([DX_rows]) SELECT {[DX_rows_count]} on columns FROM (SELECT {[Product].[Subcategory].[Bike Racks],[Product].[Subcategory].[Bottles and Cages],[Product].[Subcategory].[Caps],[Product].[Subcategory].[Cleaners]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take rows if expand', function(assert) {
        this.store.load({
            path: ['&[2001]'],
            area: 'column',
            headerName: 'columns',
            rows: [{
                dataField: '[Customer].[Customer]',
            }],
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }, {
                dataField: '[Ship Date].[Month of Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowSkip: 0,
            rowTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {[Ship Date].[Month of Year].allMembers} member [DX_columns_count] as COUNT([DX_columns]) set [DX_rows] as {[Customer].[Customer].allMembers} member [DX_rows_count] as COUNT([DX_rows]) SELECT {[DX_rows_count],[DX_columns_count]} on columns FROM [Adventure Works] WHERE ([Ship Date].[Calendar Year].&[2001]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take rows if expand and if oppositePath', function(assert) {
        this.store.load({
            area: 'column',
            headerName: 'columns',
            path: ['&[2003]'],
            oppositePath: ['&[4]'], // Accessories
            rows: [{
                dataField: '[Product].[Category]',
            }, {
                dataField: '[Customer].[Customer]',
            }],
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }, {
                dataField: '[Ship Date].[Month of Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowSkip: 0,
            rowTake: 3
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {[Ship Date].[Month of Year].allMembers} member [DX_columns_count] as COUNT([DX_columns]) set [DX_rows] as {[Customer].[Customer].allMembers} member [DX_rows_count] as COUNT([DX_rows]) SELECT {[DX_rows_count],[DX_columns_count]} on columns FROM [Adventure Works] WHERE ([Ship Date].[Calendar Year].&[2003],[Product].[Category].&[4]) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take columns', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 2,
            columnTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {[Ship Date].[Calendar Year].allMembers} member [DX_columns_count] as COUNT([DX_columns]) SELECT {[DX_columns_count]} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('take columns', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 0,
            columnTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {[Ship Date].[Calendar Year].allMembers} member [DX_columns_count] as COUNT([DX_columns]) SELECT {[DX_columns_count]} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take columns with searchValue', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product]', searchValue: 'Men\'s'
            }],
            columnSkip: 2,
            columnTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {Filter([Product].[Product].allMembers, instr([Product].[Product].currentmember.member_caption,\'Men\'\'s\') > 0)} member [DX_columns_count] as COUNT([DX_columns]) SELECT {[DX_columns_count]} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take columns with wrong searchValue', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Product]', searchValue: 'wrong'
            }],
            columnSkip: 2,
            columnTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {Filter([Product].[Product].allMembers, instr([Product].[Product].currentmember.member_caption,\'wrong\') > 0)} member [DX_columns_count] as COUNT([DX_columns]) SELECT {[DX_columns_count]} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take rows and columns', function(assert) {
        this.store.load({
            columns: [{
                dataField: '[Product].[Subcategory]',
                filterValues: [
                    'Bike Racks',
                    'Bike Stands',
                    'Bottles and Cages',
                    'Caps',
                    'Cleaners'
                ]
            }],
            rows: [{ dataField: '[Product].[Category]' }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 2,
            columnTake: 2,
            rowSkip: 1,
            rowTake: 1
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_columns] as {[Product].[Subcategory].allMembers} member [DX_columns_count] as COUNT([DX_columns]) set [DX_rows] as {[Product].[Category].allMembers} member [DX_rows_count] as COUNT([DX_rows]) SELECT {[DX_rows_count],[DX_columns_count]} on columns FROM (SELECT {[Product].[Subcategory].[Bike Racks],[Product].[Subcategory].[Bike Stands],[Product].[Subcategory].[Bottles and Cages],[Product].[Subcategory].[Caps],[Product].[Subcategory].[Cleaners]}on 0 FROM [Adventure Works])  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });


    QUnit.test('Skip and take rows and columns with empty dimensions', function(assert) {
        this.store.load({
            columns: [],
            rows: [],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 2,
            columnTake: 2,
            rowSkip: 1,
            rowTake: 1
        });
        const query = this.getQuery();

        assert.equal(query, 'SELECT {} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take rows with sortOrder desc', function(assert) {
        this.store.load({
            rows: [{
                dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc'
            }],
            values: [],
            rowSkip: 2,
            rowTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as {[Ship Date].[Month of Year].allMembers} member [DX_rows_count] as COUNT([DX_rows]) SELECT {[DX_rows_count]} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });

    QUnit.test('Skip and take rows with sortOrder desc amd sortBy displayText', function(assert) {
        this.store.load({
            rows: [{
                dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'displayText'
            }],
            values: [],
            rowSkip: 2,
            rowTake: 2
        });
        const query = this.getQuery();

        assert.equal(query, 'with set [DX_rows] as {[Ship Date].[Month of Year].allMembers} member [DX_rows_count] as COUNT([DX_rows]) SELECT {[DX_rows_count]} on columns FROM [Adventure Works]  CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS');
    });
});

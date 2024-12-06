QUnit.testStart(function() {
    const markup =
'<!--qunit-fixture-->\
    <div id="container">\
        <div id="treeList">\
        </div>\
    </div>\
';

    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';
import '__internal/grids/tree_list/m_widget';
import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { noop } from 'core/utils/common';
import { setupTreeListModules, MockColumnsController, MockDataController } from '../../helpers/treeListMocks.js';

fx.off = true;

const setupModule = function() {
    const that = this;

    that.items = [
        { data: { field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) }, values: ['test1', 1, '1/01/2001'], rowType: 'data', dataIndex: 0, isExpanded: true, level: 0, node: { level: 0, hasChildren: true } },
        { data: { field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }, values: ['test2', 2, '2/02/2002'], rowType: 'data', dataIndex: 1, isExpanded: true, level: 1, node: { level: 1, hasChildren: true } },
        { data: { field1: 'test3', field2: 3, field3: new Date(2003, 2, 3) }, values: ['test3', 3, '3/03/2003'], rowType: 'data', dataIndex: 2, isExpanded: false, level: 2, node: { level: 2, hasChildren: false } }
    ];
    that.columns = [{ dataField: 'field1' }, { dataField: 'field2' }, { dataField: 'field3' }];

    that.setupTreeList = function() {
        setupTreeListModules(that, ['data', 'columns', 'rows'], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController(that.columns),
                data: new MockDataController({ items: that.items })
            }
        });
    };
};

const teardownModule = function() {
    this.dispose();
};

QUnit.module('Rows view', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('Render rows when all items collapsed', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.items = this.items.slice(0, 1);
        this.items[0].isExpanded = false;
        this.setupTreeList();

        // act
        this.rowsView.render($testElement);

        // assert
        const $rowElements = $testElement.find('tbody > .dx-data-row');
        const $cellElements = $rowElements.find('td');
        assert.equal($rowElements.length, 1, 'count data row');
        assert.equal($cellElements.length, 3, 'count cell');

        const $iconElement = $cellElements.eq(0).find('.dx-treelist-empty-space');
        assert.ok($cellElements.eq(0).hasClass('dx-treelist-cell-expandable'), 'cell is expandable');
        assert.equal($iconElement.length, 1, 'count empty space of first cell of first row');
        assert.ok($iconElement.eq(0).hasClass('dx-treelist-collapsed'), 'expand icon');
    });

    QUnit.test('Render rows when all items expanded', function(assert) {
    // arrange
        let $iconElement;
        const $testElement = $('#treeList');

        this.setupTreeList();

        // act
        this.rowsView.render($testElement);

        // assert
        const $rowElements = $testElement.find('tbody > .dx-data-row');
        const $cellElements = $rowElements.find('td');
        assert.equal($rowElements.length, 3, 'count data row');
        assert.equal($cellElements.length, 9, 'count cell');

        $iconElement = $cellElements.eq(0).find('.dx-treelist-empty-space');
        assert.equal($iconElement.length, 1, 'count empty space of first cell of first row');
        assert.ok($iconElement.eq(0).hasClass('dx-treelist-expanded'), 'expand icon');

        $iconElement = $cellElements.eq(3).find('.dx-treelist-empty-space');
        assert.equal($iconElement.length, 2, 'count empty space of first cell of second row');
        assert.notOk($iconElement.eq(0).hasClass('dx-treelist-expanded'), 'empty space');
        assert.ok($iconElement.eq(1).hasClass('dx-treelist-expanded'), 'expand icon');

        $iconElement = $cellElements.eq(6).find('.dx-treelist-empty-space');
        assert.equal($iconElement.length, 3, 'count empty space of first cell of third row');
        assert.notOk($iconElement.eq(0).hasClass('dx-treelist-expanded'), 'empty space');
        assert.notOk($iconElement.eq(1).hasClass('dx-treelist-expanded'), 'empty space');
        assert.notOk($iconElement.eq(2).hasClass('dx-treelist-expanded'), 'empty space');
    });
});

QUnit.module('Expand/Collapse rows', {
    beforeEach: function() {
        const that = this;

        that.options = {
            dataSource: [
                { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
            ],
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            expandedRowKeys: []
        };

        that.setupTreeList = function() {
            setupTreeListModules(that, ['data', 'columns', 'rows', 'editing', 'editorFactory'], {
                initViews: true
            });
        };
    },
    afterEach: function() {
        this.dispose();
    }
}, () => {

    QUnit.test('Expand row', function(assert) {
    // arrange
        let $rowElements;
        const $testElement = $('#treeList');

        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        $rowElements = $testElement.find('tbody > .dx-data-row');
        assert.equal($rowElements.length, 1, 'count data row');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-expanded').length, 0, 'hasn\'t expand icon');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-collapsed').length, 1, 'has collapse icon');

        // act
        $rowElements.find('.dx-treelist-collapsed').trigger('dxclick');

        // assert
        $rowElements = $testElement.find('tbody > .dx-data-row');
        assert.equal($rowElements.length, 2, 'count data row');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-expanded').length, 1, 'hasn\'t expand icon');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-collapsed').length, 0, 'has collapse icon');
    });

    QUnit.test('Collapse row', function(assert) {
    // arrange
        let $rowElements;
        const $testElement = $('#treeList');

        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        $rowElements = $testElement.find('tbody > .dx-data-row');
        assert.equal($rowElements.length, 1, 'count data row');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-expanded').length, 0, 'hasn\'t expand icon');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-collapsed').length, 1, 'has collapse icon');

        // arrange
        $rowElements.find('.dx-treelist-collapsed').trigger('dxclick');

        // assert
        $rowElements = $testElement.find('tbody > .dx-data-row');
        assert.equal($rowElements.length, 2, 'count data row');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-expanded').length, 1, 'hasn\'t expand icon');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-collapsed').length, 0, 'has collapse icon');

        // act
        $rowElements.first().find('.dx-treelist-expanded').trigger('dxclick');

        // assert
        $rowElements = $testElement.find('tbody > .dx-data-row');
        assert.equal($rowElements.length, 1, 'count data row');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-expanded').length, 0, 'hasn\'t expand icon');
        assert.equal($rowElements.first().find('td').first().find('.dx-treelist-collapsed').length, 1, 'has collapse icon');
    });

    QUnit.test('Expand row on row click when edit mode is \'batch\'', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowUpdating: true
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        $testElement.find('tbody td').first().find('.dx-treelist-collapsed').first().trigger('dxclick');

        // assert
        assert.ok(!$testElement.find('tbody td').first().hasClass('dx-editor-cell'), 'cell isn\'t edit');
        assert.equal($testElement.find('tbody > .dx-data-row').length, 2, 'count data row');
    });

    QUnit.test('Collapse row on row click when edit mode is \'batch\'', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowUpdating: true
        };
        this.options.expandedRowKeys = [1];

        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        assert.equal($testElement.find('tbody > .dx-data-row').length, 2, 'count data row');

        // act
        $testElement.find('tbody td').first().find('.dx-treelist-expanded').first().trigger('dxclick');

        // assert
        assert.equal($testElement.find('tbody > .dx-data-row').length, 1, 'count data row');
    });

    // T1196383
    QUnit.test('Watchers should be destroyed after rows are repainted when repaintChangesOnly is enabled', function(assert) {
        // arrange
        const disposeFuncs = [];
        const $testElement = $('#treeList');

        this.options.repaintChangesOnly = true;

        this.setupTreeList();

        sinon.stub(this.rowsView, '_addWatchMethod').callsFake((options, row) => {
            const source = row || options;

            source.watch = () => {
                disposeFuncs.push(sinon.spy());

                return disposeFuncs[disposeFuncs.length - 1];
            };
            source.update = noop;

            if(source !== options) {
                options.watch = source.watch.bind(source);
            }
        });

        this.rowsView.render($testElement);

        // assert
        assert.strictEqual(disposeFuncs.length, 2, 'count dispose function');
        assert.notOk(disposeFuncs.some((dispose) => dispose.called), 'dispose functions were not called');

        // arrange
        const prevDisposeFuncs = disposeFuncs.slice();

        // act
        this.rowsView.render($testElement);

        // assert
        assert.ok(prevDisposeFuncs.every((dispose) => dispose.called), 'dispose functions were called');
    });
});


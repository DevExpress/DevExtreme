import $ from 'jquery';
import 'ui/tree_list';
import 'common.css!';


QUnit.testStart(function() {
    const markup =
        '<div id="treeList"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('TreeList markup', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('markup init', function(assert) {
    const $element = $('#treeList').dxTreeList();
    const $container = $element.children();
    const $headersView = $container.children('.dx-treelist-headers');
    const $rowsView = $container.children('.dx-treelist-rowsview');

    assert.ok($element.hasClass('dx-treelist'), 'dx-treelist');
    assert.ok($container.hasClass('dx-treelist-container'), 'dx-treelist');
    assert.equal($headersView.length, 1, 'headers view');
    assert.equal($headersView.find('td').length, 0, 'headers view has no cell');
    assert.equal($rowsView.length, 1, 'rows view');
    assert.ok($rowsView.hasClass('dx-empty'), 'rows view is empty');
    assert.equal($rowsView.find('td').length, 0, 'rows view has no cell');
});

QUnit.test('markup with dataSource', function(assert) {
    const $element = $('#treeList').dxTreeList({
        dataSource: [
            { id: 1, parentId: 0, name: 'Alex' },
            { id: 2, parentId: 1, name: 'Bob' },
            { id: 3, parentId: 2, name: 'Tom' }
        ],
        expandedRowKeys: [1],
        keyExpr: 'id',
        parentIdExpr: 'parentId'
    });

    this.clock.tick(30);

    const $container = $element.children();
    const $headersView = $container.children('.dx-treelist-headers');
    const $rowsView = $container.children('.dx-treelist-rowsview');

    assert.ok($element.hasClass('dx-treelist'), 'dx-widget');
    assert.ok($container.hasClass('dx-treelist-container'), 'dx-treelist');

    assert.equal($headersView.length, 1, 'headers view');
    assert.equal($headersView.find('td').length, 3, 'headers view has 3 cells');
    assert.equal($headersView.find('td').eq(0).text(), 'Id', 'first column title');
    assert.equal($headersView.find('td').eq(1).text(), 'Parent Id', 'second column title');
    assert.equal($headersView.find('td').eq(2).text(), 'Name', 'third column title');

    assert.equal($rowsView.length, 1, 'rows view');
    assert.notOk($rowsView.hasClass('dx-empty'), 'rows view is not empty');
    assert.equal($rowsView.find('table').length, 1, 'one table');
    assert.equal($rowsView.find('.dx-data-row').length, 2, 'data row count');
    assert.equal($rowsView.find('.dx-data-row td').length, 6, 'rows view has 6 data cells');
    assert.equal($rowsView.find('td').length, 9, 'rows view has 15 cells (6 data cells + 3 free space cells)');

    const $dataCells = $rowsView.find('.dx-data-row td');
    assert.equal($dataCells.find('.dx-treelist-expanded').length, 1, 'first row is expanded');
    assert.equal($dataCells.eq(0).text(), '1', 'value of the first cell of the first row');
    assert.equal($dataCells.eq(1).text(), '0', 'value of the second cell of the first row');
    assert.equal($dataCells.eq(2).text(), 'Alex', 'value of the third cell of the first row');

    assert.equal($dataCells.eq(3).find('.dx-treelist-collapsed').length, 1, 'first row is collapsed');
    assert.equal($dataCells.eq(3).text(), '2', 'value of the first cell of the first row');
    assert.equal($dataCells.eq(4).text(), '1', 'value of the second cell of the first row');
    assert.equal($dataCells.eq(5).text(), 'Bob', 'value of the third cell of the first row');
});

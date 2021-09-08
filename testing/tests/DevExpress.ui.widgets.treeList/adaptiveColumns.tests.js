QUnit.testStart(function() {
    const markup =
        '<div class="dx-treelist dx-widget">\
            <div id="container"></div>\
        </div>';
    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';
import 'ui/tree_list/ui.tree_list';

import $ from 'jquery';
import treeListMocks from '../../helpers/treeListMocks.js';
import renderer from 'core/renderer';

function setupTreeList(that, $treeListContainer) {
    that.$element = function() {
        return $treeListContainer ? $treeListContainer : renderer('.dx-treelist');
    };

    if(that.columns !== null) {
        that.columns = that.columns || [
            { dataField: 'firstName', index: 0, allowEditing: true, allowExporting: true },
            { dataField: 'lastName', index: 1, allowEditing: true, allowExporting: true }
        ];
    }

    that.items = that.items || [
        { id: 1, parentId: 0, firstName: 'TestTestTestTestTestTestTestTest1', lastName: 'Psy' },
        { id: 2, parentId: 1, firstName: 'Super', lastName: 'Star' }
    ];

    that.options = $.extend({}, {
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        rootValue: 0,
        columns: that.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: that.items
        },
        expandedRowKeys: [],
        columnHidingEnabled: true
    }, that.options);

    that.setupOptions = {
        initViews: true
    };

    treeListMocks.setupTreeListModules(that, ['data', 'columns', 'rows', 'columnHeaders', 'masterDetail', 'editing', 'editingRowBased', 'editingCellBased', 'adaptivity', 'columnsResizingReordering', 'keyboardNavigation', 'gridView'], that.setupOptions);
}

QUnit.module('API', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('The detail adaptive row should have the node property', function(assert) {
    // arrange
        $('.dx-treelist').width(200);

        setupTreeList(this);
        this.rowsView.render($('#container'));
        this.resizingController.updateDimensions();
        this.clock.tick();

        // act
        this.adaptiveColumnsController.expandAdaptiveDetailRow(1);
        this.clock.tick();

        // assert
        const rows = this.getVisibleRows();
        assert.ok($('.dx-adaptive-detail-row').length, 'render field items');
        assert.strictEqual(rows[1].rowType, 'detailAdaptive', 'detail adaptive row');
        assert.deepEqual(rows[1].node, rows[0].node, 'detail adaptive row has the node property');
    });
});

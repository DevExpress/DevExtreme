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
import { setupTreeListModules, MockColumnsController, MockDataController } from '../../helpers/treeListMocks.js';

fx.off = true;

function createGridView(options, userOptions) {
    this.options = $.extend({}, {
        showColumnHeaders: true
    }, userOptions);

    setupTreeListModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'gridView'],
        {
            initViews: true,
            controllers: {
                data: options.dataController,
                columns: options.columnsController
            },
            views: {
                gridView: options.gridViewType && new options.gridViewType(this)
            }
        });

    this.$element = function() {
        return $('#treeList');
    };

    return this._views.gridView;
}

QUnit.module('Synchronize columns', {
    beforeEach: function() {
        this.createGridView = createGridView;
    }
}, () => {

    QUnit.test('Synchronization widths of columns when \'columnAutoWidth\' option is enabled', function(assert) {
    // arrange
        const done = assert.async();
        let $cellElement;
        let realWidth = 0;
        const columnsController = new MockColumnsController([
            {
                caption: 'Column 1',
                cellTemplate: function($container, options) {
                    return $('<div/>', { css: { display: 'inline-block' } }).text(options.value);
                }
            },
            { caption: 'Column 2' }
        ]);
        const dataController = new MockDataController({
            items: [{ rowType: 'data', values: ['Test Test Test Test Test Test Test Test Test', 'Test'], node: { hasChildren: true }, level: 0 }]
        });
        const gridView = this.createGridView({
            columnsController: columnsController,
            dataController: dataController
        }, { columnAutoWidth: true });
        const $testElement = $('<div />').width(350).appendTo($('#treeList'));

        // act
        gridView.render($testElement);
        columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        // assert
        // wait for a font to load
        setTimeout(function() {
            $cellElement = $testElement.find('.dx-treelist-rowsview').find('tbody > tr').first().children().first();
            $.each($cellElement.children(), function() {
                realWidth += $(this).outerWidth();
            });

            assert.ok($cellElement.width() >= Math.round(realWidth), 'correct width of first column');
            done();
        });
    });
});


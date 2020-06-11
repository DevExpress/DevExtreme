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

import 'common.css!';
import 'generic_light.css!';
import 'ui/tree_list/ui.tree_list';
import $ from 'jquery';
import fx from 'animation/fx';
import { setupTreeListModules, MockColumnsController, MockDataController } from '../../helpers/treeListMocks.js';

fx.off = true;

const setupModule = function() {
    const that = this;

    that.options = {};
    that.columns = [
        { caption: 'Column 1', visible: true },
        { caption: 'Column 2', visible: true },
        { caption: 'Column 3', visible: true }
    ];

    that.setupTreeList = function() {
        setupTreeListModules(that, ['data', 'columns', 'headerPanel', 'editing', 'columnChooser'], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController(that.columns),
                data: new MockDataController({ items: [] })
            }
        });
    };
};

const teardownModule = function() {
    this.dispose();
};

QUnit.module('Header panel', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('Draw edit buttons', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowUpdating: true,
            allowAdding: true
        };
        this.setupTreeList();

        // act
        this.headerPanel.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-treelist-addrow-button').length, 1, 'cancel button');
        assert.equal($testElement.find('.dx-treelist-save-button').length, 1, 'cancel button');
        assert.equal($testElement.find('.dx-treelist-cancel-button').length, 1, 'cancel button');
    });

    QUnit.test('Draw column chooser button', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.columnChooser = {
            enabled: true
        };
        this.setupTreeList();

        // act
        this.headerPanel.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-treelist-column-chooser-button').length, 1, 'cancel button');
    });
});


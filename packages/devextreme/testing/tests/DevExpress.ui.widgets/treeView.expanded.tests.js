import $ from 'jquery';
import fx from 'animation/fx';
import 'ui/tree_view';

import 'generic_light.css!';


const { module, test, testStart } = QUnit;

testStart(function() {
    const markup = '<div id="treeView"></div>';

    $('#qunit-fixture').html(markup);
});

const initTree = function(options) {
    return $('#treeView').dxTreeView(options);
};

module('Expanded items', {
    beforeEach() {
        fx.off = true;
    },
    afterEach() {
        fx.off = false;
    }
}, () => {

    test('Content ready event is thrown once when the expandAll is called', function(assert) {
        const done = assert.async();
        assert.expect(1);
        const $treeView = initTree({
            items: [{
                text: '1',
                id: 1,
                items: [{
                    text: '11',
                    id: 11,
                    items: [{
                        text: '111',
                        id: 111
                    }]
                }]
            }],
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.on('contentReady', () => {
            assert.ok(true, 'event is thrown once');
            done();
        });

        treeView.expandAll();
    });
});

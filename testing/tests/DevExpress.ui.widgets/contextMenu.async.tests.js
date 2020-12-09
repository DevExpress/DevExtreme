import $ from 'jquery';
import ContextMenu from 'ui/context_menu';

import 'ui/button';
import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '\
        <div id="simpleMenu"></div>\
        <div id="menuTarget"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Context menu', () => {
    // T755681
    QUnit.test('Context menu should shown in the same position after repaint()', function(assert) {
        assert.expect(5);

        const menuTargetSelector = '#menuTarget';
        const instance = new ContextMenu($('#simpleMenu'), {
            items: [{ text: 'item 1' }],
            target: menuTargetSelector,
        });

        $(menuTargetSelector).trigger($.Event('dxcontextmenu', {
            pageX: 120,
            pageY: 50
        }));

        const $target = $(menuTargetSelector);
        new Promise((resolve) => {
            instance.option('onShown', (e) => {
                const position = e.component._overlay.option('position');
                assert.equal(position.at, 'top left', 'at of overlay position');
                assert.equal(position.my, 'top left', 'my of overlay position');
                assert.equal(position.of.pageX, 120, 'pageX of overlay position');
                assert.equal(position.of.pageY, 50, 'pageX of overlay position');
                assert.equal(position.of.target, $target.get(0), 'target of overlay position');
                resolve();
            });

            instance.repaint();
        });
    });

    QUnit.test('Add item on positioning', function(assert) {
        const menuTargetSelector = '#menuTarget';
        const instance = new ContextMenu($('#simpleMenu'), {
            items: [{ text: 'item 1' }],
            target: menuTargetSelector,
            onPositioning: (actionArgs) => {
                actionArgs.component.option('items').push({ text: 'item 2' });
            }
        });

        $(menuTargetSelector).trigger($.Event('dxcontextmenu', {
            pageX: 120,
            pageY: 50
        }));

        assert.strictEqual(instance.option('items').length, 2, 'items.length');
    });
});


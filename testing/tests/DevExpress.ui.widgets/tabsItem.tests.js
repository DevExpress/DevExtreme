import $ from 'jquery';
import Tabs from 'ui/tabs';

import 'generic_light.css!';

QUnit.module('badge builtin', () => {
    const TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
    const BADGE_CLASS = 'dx-badge';

    QUnit.test('badge should be rendered correctly by default', function(assert) {
        const widget = new Tabs($('<div>'), {
            items: [{}]
        });
        const $item = widget.itemElements().eq(0);

        const $badge = $item.children('.' + TABS_ITEM_BADGE_CLASS);
        assert.ok(!$badge.length);
    });


    QUnit.test('badge should be rendered correctly with value = 22', function(assert) {
        const widget = new Tabs($('<div>'), {
            items: [{ badge: 22 }]
        });
        const $item = widget.itemElements().eq(0);

        const $badge = $item.children().eq(-1);
        assert.ok($badge.hasClass(TABS_ITEM_BADGE_CLASS) && $badge.hasClass(BADGE_CLASS), 'badge created correctly');
        assert.equal($badge.text(), '22', 'badge has correct text');
    });

    QUnit.test('badge should be rendered correctly after value changed', function(assert) {
        const widget = new Tabs($('<div>'), {
            items: [{ badge: 22 }]
        });
        const $item = widget.itemElements().eq(0);

        widget.option('items[0].badge', null);

        const $badge = $item.children('.' + TABS_ITEM_BADGE_CLASS);
        assert.ok(!$badge.length);
    });
});


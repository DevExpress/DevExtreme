var $ = require('jquery'),
    Tabs = require('ui/tabs');

QUnit.module('badge builtin', () => {
    var TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge',
        BADGE_CLASS = 'dx-badge';

    QUnit.test('badge should be rendered correctly by default', function(assert) {
        var widget = new Tabs($('<div>'), {
                items: [{}]
            }),
            $item = widget.itemElements().eq(0);

        var $badge = $item.children('.' + TABS_ITEM_BADGE_CLASS);
        assert.ok(!$badge.length);
    });


    QUnit.test('badge should be rendered correctly with value = 22', function(assert) {
        var widget = new Tabs($('<div>'), {
                items: [{ badge: 22 }]
            }),
            $item = widget.itemElements().eq(0);

        var $badge = $item.children().eq(-1);
        assert.ok($badge.hasClass(TABS_ITEM_BADGE_CLASS) && $badge.hasClass(BADGE_CLASS), 'badge created correctly');
        assert.equal($badge.text(), '22', 'badge has correct text');
    });

    QUnit.test('badge should be rendered correctly after value changed', function(assert) {
        var widget = new Tabs($('<div>'), {
                items: [{ badge: 22 }]
            }),
            $item = widget.itemElements().eq(0);

        widget.option('items[0].badge', null);

        var $badge = $item.children('.' + TABS_ITEM_BADGE_CLASS);
        assert.ok(!$badge.length);
    });
});


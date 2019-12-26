const $ = require('jquery');
const List = require('ui/list');

var LIST_ITEM_ICON_CONTAINER_CLASS = 'dx-list-item-icon-container',
    LIST_ITEM_ICON_CLASS = 'dx-list-item-icon',
    LIST_ITEM_CHEVRON_CONTAINER_CLASS = 'dx-list-item-chevron-container',
    LIST_ITEM_CHEVRON_CLASS = 'dx-list-item-chevron';

QUnit.module('showChevron builtin', () => {
    QUnit.test('showChevron should be rendered correctly by default', function(assert) {
        var widget = new List($('<div>'), {
                items: [{}]
            }),
            $item = widget.itemElements().eq(0);

        var $chevronContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
        assert.ok(!$chevronContainer.length);

        widget.$element().remove(); // NOTE: strange fix timers
    });

    QUnit.test('showChevron should be rendered correctly with value = true', function(assert) {
        var widget = new List($('<div>'), {
                items: [{ showChevron: true }]
            }),
            $item = widget.itemElements().eq(0);

        var $chevronContainer = $item.children().eq(-1),
            $chevron = $chevronContainer.children();
        assert.ok($chevronContainer.hasClass(LIST_ITEM_CHEVRON_CONTAINER_CLASS), 'container created correctly');
        assert.ok($chevron.hasClass(LIST_ITEM_CHEVRON_CLASS), 'chevron created correctly');

        widget.$element().remove(); // NOTE: strange fix timers
    });

    QUnit.test('showChevron should be rendered correctly after value changed', function(assert) {
        var widget = new List($('<div>'), {
                items: [{ showChevron: true }]
            }),
            $item = widget.itemElements().eq(0);

        widget.option('items[0].showChevron', false);

        var $chevronContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
        assert.ok(!$chevronContainer.length);

        widget.$element().remove(); // NOTE: strange fix timers
    });
});

QUnit.module('icon builtin', () => {
    QUnit.test('icon rendering', function(assert) {
        var widget = new List($('<div>'), {
                items: [{ icon: 'box' }]
            }),
            $item = widget.itemElements().eq(0);

        assert.equal($item.find('.' + LIST_ITEM_ICON_CONTAINER_CLASS).length, 1, 'container has been removed');
        assert.equal($item.find('.' + LIST_ITEM_ICON_CLASS).length, 1, 'icon has been removed');

        widget.option('items[0].icon', null);

        $item = widget.itemElements().eq(0);
        assert.equal($item.find('.' + LIST_ITEM_ICON_CONTAINER_CLASS).length, 0, 'container has been removed');
        assert.equal($item.find('.' + LIST_ITEM_ICON_CLASS).length, 0, 'icon has been removed');

        widget.$element().remove(); // NOTE: strange fix timers
    });
});

QUnit.module('badge builtin', () => {
    var LIST_ITEM_BADGE_CONTAINER_CLASS = 'dx-list-item-badge-container',
        LIST_ITEM_BADGE_CLASS = 'dx-list-item-badge',
        BADGE_CLASS = 'dx-badge';

    QUnit.test('badge should be rendered correctly by default', function(assert) {
        var widget = new List($('<div>'), {
                items: [{}]
            }),
            $item = widget.itemElements().eq(0);

        var $badgeContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
        assert.ok(!$badgeContainer.length);

        widget.$element().remove(); // NOTE: strange fix timers
    });

    QUnit.test('badge should be rendered correctly with value = true', function(assert) {
        var widget = new List($('<div>'), {
                items: [{ badge: 5 }]
            }),
            $item = widget.itemElements().eq(0);

        var $badgeContainer = $item.children().eq(-1),
            $badge = $badgeContainer.children();

        assert.ok($badgeContainer.hasClass(LIST_ITEM_BADGE_CONTAINER_CLASS), 'container created correctly');
        assert.ok($badge.hasClass(LIST_ITEM_BADGE_CLASS), 'badge created correctly');
        assert.ok($badge.hasClass(BADGE_CLASS), 'badge created correctly');
        assert.equal($badge.text(), '5', 'badge has correct text');

        widget.$element().remove(); // NOTE: strange fix timers
    });

    QUnit.test('badge should be rendered correctly after value changed', function(assert) {
        var widget = new List($('<div>'), {
                items: [{ badge: 5 }]
            }),
            $item = widget.itemElements().eq(0);

        widget.option('items[0].badge', null);

        var $badgeContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
        assert.ok(!$badgeContainer.length);

        widget.$element().remove(); // NOTE: strange fix timers
    });

    QUnit.test('badge should be rendered correctly after value changed with enabled chevron', function(assert) {
        var widget = new List($('<div>'), {
                items: [{ showChevron: true }]
            }),
            $item = widget.itemElements().eq(0);

        widget.option('items[0].badge', 5);

        var $badgeContainer = $item.children().eq(-2);
        assert.ok($badgeContainer.hasClass(LIST_ITEM_BADGE_CONTAINER_CLASS));

        widget.$element().remove(); // NOTE: strange fix timers
    });
});


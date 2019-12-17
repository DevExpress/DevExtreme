const $ = require('jquery');
const List = require('ui/list');

QUnit.module('showChevron builtin');

const LIST_ITEM_ICON_CONTAINER_CLASS = 'dx-list-item-icon-container';
const LIST_ITEM_ICON_CLASS = 'dx-list-item-icon';
const LIST_ITEM_CHEVRON_CONTAINER_CLASS = 'dx-list-item-chevron-container';
const LIST_ITEM_CHEVRON_CLASS = 'dx-list-item-chevron';

QUnit.test('showChevron should be rendered correctly by default', function(assert) {
    const widget = new List($('<div>'), {
        items: [{}]
    });
    const $item = widget.itemElements().eq(0);

    const $chevronContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
    assert.ok(!$chevronContainer.length);

    widget.$element().remove(); // NOTE: strange fix timers
});

QUnit.test('showChevron should be rendered correctly with value = true', function(assert) {
    const widget = new List($('<div>'), {
        items: [{ showChevron: true }]
    });
    const $item = widget.itemElements().eq(0);

    const $chevronContainer = $item.children().eq(-1);
    const $chevron = $chevronContainer.children();
    assert.ok($chevronContainer.hasClass(LIST_ITEM_CHEVRON_CONTAINER_CLASS), 'container created correctly');
    assert.ok($chevron.hasClass(LIST_ITEM_CHEVRON_CLASS), 'chevron created correctly');

    widget.$element().remove(); // NOTE: strange fix timers
});

QUnit.test('showChevron should be rendered correctly after value changed', function(assert) {
    const widget = new List($('<div>'), {
        items: [{ showChevron: true }]
    });
    const $item = widget.itemElements().eq(0);

    widget.option('items[0].showChevron', false);

    const $chevronContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
    assert.ok(!$chevronContainer.length);

    widget.$element().remove(); // NOTE: strange fix timers
});

QUnit.module('icon builtin');

QUnit.test('icon rendering', function(assert) {
    const widget = new List($('<div>'), {
        items: [{ icon: 'box' }]
    });
    let $item = widget.itemElements().eq(0);

    assert.equal($item.find('.' + LIST_ITEM_ICON_CONTAINER_CLASS).length, 1, 'container has been removed');
    assert.equal($item.find('.' + LIST_ITEM_ICON_CLASS).length, 1, 'icon has been removed');

    widget.option('items[0].icon', null);

    $item = widget.itemElements().eq(0);
    assert.equal($item.find('.' + LIST_ITEM_ICON_CONTAINER_CLASS).length, 0, 'container has been removed');
    assert.equal($item.find('.' + LIST_ITEM_ICON_CLASS).length, 0, 'icon has been removed');

    widget.$element().remove(); // NOTE: strange fix timers
});


QUnit.module('badge builtin');

const LIST_ITEM_BADGE_CONTAINER_CLASS = 'dx-list-item-badge-container';
const LIST_ITEM_BADGE_CLASS = 'dx-list-item-badge';
const BADGE_CLASS = 'dx-badge';

QUnit.test('badge should be rendered correctly by default', function(assert) {
    const widget = new List($('<div>'), {
        items: [{}]
    });
    const $item = widget.itemElements().eq(0);

    const $badgeContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
    assert.ok(!$badgeContainer.length);

    widget.$element().remove(); // NOTE: strange fix timers
});

QUnit.test('badge should be rendered correctly with value = true', function(assert) {
    const widget = new List($('<div>'), {
        items: [{ badge: 5 }]
    });
    const $item = widget.itemElements().eq(0);

    const $badgeContainer = $item.children().eq(-1);
    const $badge = $badgeContainer.children();

    assert.ok($badgeContainer.hasClass(LIST_ITEM_BADGE_CONTAINER_CLASS), 'container created correctly');
    assert.ok($badge.hasClass(LIST_ITEM_BADGE_CLASS), 'badge created correctly');
    assert.ok($badge.hasClass(BADGE_CLASS), 'badge created correctly');
    assert.equal($badge.text(), '5', 'badge has correct text');

    widget.$element().remove(); // NOTE: strange fix timers
});

QUnit.test('badge should be rendered correctly after value changed', function(assert) {
    const widget = new List($('<div>'), {
        items: [{ badge: 5 }]
    });
    const $item = widget.itemElements().eq(0);

    widget.option('items[0].badge', null);

    const $badgeContainer = $item.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS);
    assert.ok(!$badgeContainer.length);

    widget.$element().remove(); // NOTE: strange fix timers
});

QUnit.test('badge should be rendered correctly after value changed with enabled chevron', function(assert) {
    const widget = new List($('<div>'), {
        items: [{ showChevron: true }]
    });
    const $item = widget.itemElements().eq(0);

    widget.option('items[0].badge', 5);

    const $badgeContainer = $item.children().eq(-2);
    assert.ok($badgeContainer.hasClass(LIST_ITEM_BADGE_CONTAINER_CLASS));

    widget.$element().remove(); // NOTE: strange fix timers
});

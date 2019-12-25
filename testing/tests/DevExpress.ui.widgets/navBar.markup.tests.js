var $ = require('jquery');

require('ui/nav_bar');

QUnit.testStart(function() {
    var markup =
        '<div id="navbar">';

    $('#qunit-fixture').html(markup);
});

var toSelector = function(cssClass) {
    return '.' + cssClass;
};

var NAVBAR_ITEM_CLASS = 'dx-nav-item',
    NAVBAR_TEXT_ITEM_CLASS = 'dx-navbar-text-item',

    TAB_SELECTED_CLASS = 'dx-tab-selected';


QUnit.module('rendering', () => {
    QUnit.test('item without icon should have correct class', function(assert) {
        var $navBar = $('#navbar').dxNavBar({
            items: [
                { text: '0', icon: 'home' },
                { text: '1' }
            ]
        });

        var $items = $navBar.dxNavBar('itemElements');

        assert.ok(!$items.eq(0).hasClass(NAVBAR_TEXT_ITEM_CLASS), 'class was not added');
        assert.ok($items.eq(1).hasClass(NAVBAR_TEXT_ITEM_CLASS), 'class was added');
    });

    QUnit.test('selected item should have selected class on rendering', function(assert) {
        var $navBar = $('#navbar').dxNavBar({
            items: [
                1,
                2
            ],
            selectedItem: 1
        });

        var $item = $navBar.find(toSelector(NAVBAR_ITEM_CLASS)).eq(0);

        assert.ok($item.hasClass(TAB_SELECTED_CLASS), 'selection present');
    });
});


var $ = require('jquery'),
    MenuBase = require('ui/context_menu/ui.menu_base');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="menu"></div>';

    $('#qunit-fixture').html(markup);
});

var DX_MENU_BASE_CLASS = 'dx-menu-base';


function createMenu(options) {
    var element = $('#menu'),
        instance = new MenuBase(element, options);

    return { instance: instance, element: element };
}

QUnit.module('Menu markup');

QUnit.test('Create menu with default css', function(assert) {
    var menuBase = createMenu();

    assert.ok(menuBase.element.hasClass(DX_MENU_BASE_CLASS));
});

QUnit.test('Render custom CSS class', function(assert) {
    var menu = createMenu({ cssClass: 'testCssClass' });

    assert.ok(menu.element.hasClass('testCssClass'));
});

import $ from 'jquery';
import MenuBase from 'ui/context_menu/ui.menu_base';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="menu"></div>';

    $('#qunit-fixture').html(markup);
});

const DX_MENU_BASE_CLASS = 'dx-menu-base';


function createMenu(options) {
    const element = $('#menu');
    const instance = new MenuBase(element, options);

    return { instance: instance, element: element };
}

QUnit.module('Menu markup', () => {
    QUnit.test('Create menu with default css', function(assert) {
        const menuBase = createMenu();

        assert.ok(menuBase.element.hasClass(DX_MENU_BASE_CLASS));
    });

    QUnit.test('Render custom CSS class', function(assert) {
        const menu = createMenu({ cssClass: 'testCssClass' });

        assert.ok(menu.element.hasClass('testCssClass'));
    });
});


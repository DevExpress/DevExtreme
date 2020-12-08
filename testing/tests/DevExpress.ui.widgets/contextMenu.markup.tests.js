import $ from 'jquery';
import ContextMenu from 'ui/context_menu';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="simpleMenu"></div>';

    $('#qunit-fixture').html(markup);
});

const DX_HAS_CONTEXT_MENU_CLASS = 'dx-has-context-menu';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#simpleMenu');
    }
};

QUnit.module('ContextMenu markup', moduleConfig, () => {
    QUnit.test('context menu should have correct css class', function(assert) {
        new ContextMenu(this.$element, {});

        assert.ok(this.$element.hasClass(DX_HAS_CONTEXT_MENU_CLASS), 'context menu have correct class');
    });

    QUnit.test('aria role', function(assert) {
        new ContextMenu(this.$element, {});

        assert.equal(this.$element.attr('role'), undefined, 'aria role is not defined because menu items renders in body (aXe accessibility testing)');
    });
});


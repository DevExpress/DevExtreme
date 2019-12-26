var $ = require('jquery'),
    ContextMenu = require('ui/context_menu');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="simpleMenu"></div>';

    $('#qunit-fixture').html(markup);
});

var DX_HAS_CONTEXT_MENU_CLASS = 'dx-has-context-menu';

var moduleConfig = {
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


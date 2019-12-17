define(function(require) {
    if(QUnit.urlParams['nojquery']) {
        return;
    }

    var $ = require('jquery');

    require('/artifacts/js/dx.all.debug.js');


    QUnit.module('jquery integration');

    QUnit.test('renderer uses correct strategy', function(assert) {
        var node = document.createElement('div');
        var element = new DevExpress.ui.dxButton(node).element();

        assert.ok(element instanceof window.jQuery);
    });

    QUnit.test('$.fn plugins works with both strategies', function(assert) {
        var $element = $('<div>');

        assert.equal(typeof $element.dxButton, 'function');
    });
});

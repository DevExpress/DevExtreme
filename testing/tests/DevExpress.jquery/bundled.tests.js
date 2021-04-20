define(function(require) {
    if(QUnit.urlParams['nojquery']) {
        return;
    }

    const $ = require('jquery');

    require('/artifacts/js/dx.all.debug.js');


    QUnit.module('jquery integration');

    QUnit.test('renderer uses correct strategy', function(assert) {
        const node = document.createElement('div');
        const element = new DevExpress.ui.dxButton(node).element();

        assert.ok(element instanceof window.jQuery);
    });

    QUnit.test('$.fn plugins works with both strategies', function(assert) {
        const $element = $('<div>');

        assert.equal(typeof $element.dxButton, 'function');
    });
});

import $ from 'jquery';
import 'integration/jquery';
import dxButton from 'ui/button';

if(!QUnit.urlParams['nojquery']) {
    QUnit.module('jquery integration');

    QUnit.test('renderer uses correct strategy', function(assert) {
        const node = document.createElement('div');
        const element = new dxButton(node).element();

        assert.ok(element instanceof window.jQuery);
    });

    QUnit.test('$.fn plugins works with both strategies', function(assert) {
        const $element = $('<div>');

        assert.equal(typeof $element.dxButton, 'function');
    });
}

import $ from 'jquery';

import 'ui/overlay/ui.overlay';

QUnit.testStart(function() {
    const markup = '<div id="overlay"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('default options');

QUnit.test('height and width are \'auto\' on SSR', function(assert) {
    const overlay = $('#overlay').dxOverlay().dxOverlay('instance');
    const overlayElementStyles = overlay.element().style;

    assert.equal(overlay.option('height'), null, 'height is \'null\'');
    assert.equal(overlay.option('width'), null, 'width is \'null\'');
    assert.equal(overlayElementStyles.width, '', 'element has no width');
    assert.equal(overlayElementStyles.height, '', 'element has no height');
});

QUnit.test('should not raise any error if there is no window and enableBodyScroll is used', function(assert) {
    assert.expect(1);

    try {
        const overlay = $('#overlay').dxOverlay({
            visible: true,
            enableBodyScroll: true,
        }).dxOverlay('instance');

        overlay.option('enableBodyScroll', false);

    } catch(e) {
        assert.ok(false, `error: ${e.message}`);
    } finally {
        assert.ok(true, 'no errors were raised');
    }
});


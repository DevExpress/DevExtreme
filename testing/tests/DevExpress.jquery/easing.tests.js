define(function(require) {
    var $ = require('jquery'),
        easing = require('animation/easing');

    require('integration/jquery');

    if(QUnit.urlParams['nojquery']) {
        return;
    }

    QUnit.module('easing');

    QUnit.test('css transition timing func parsing', function(assert) {
        var convert = easing.convertTransitionTimingFuncToEasing;

        var easingName = convert('cubic-bezier(0.190, 1.000, 0.220, 1.000)');
        assert.equal(easingName, 'cubicbezier_0p19_1_0p22_1');

        assert.equal($.easing['cubicbezier_0p19_1_0p22_1'](0.0056, 14, 0, 1, 2500).toFixed(3), 0.029);
    });

    QUnit.test('register a custom easing function using jQuery', function(assert) {
        var customEasing = function() {
        };
        $.easing['dx-custom-easing'] = customEasing;
        assert.equal(easing.getEasing('dx-custom-easing'), customEasing);
    });
});

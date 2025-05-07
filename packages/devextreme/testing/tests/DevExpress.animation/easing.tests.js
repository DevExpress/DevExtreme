const easing = require('common/core/animation/easing');

QUnit.module('easing');

QUnit.test('css transition timing func parsing', function(assert) {
    const convert = easing.convertTransitionTimingFuncToEasing;
    const getEasing = easing.getEasing;

    let easingName = convert('linear');
    assert.equal(easingName, 'cubicbezier_0_0_1_1');

    easingName = convert('swing');
    assert.equal(easingName, 'cubicbezier_0p445_0p05_0p55_0p95');

    easingName = convert('ease-in-out');
    assert.equal(easingName, 'cubicbezier_0p42_0_0p58_1');

    easingName = convert('cubic-bezier(0.190, 1.000, 0.220, 1.000)');
    assert.equal(easingName, 'cubicbezier_0p19_1_0p22_1');

    assert.equal(getEasing('cubicbezier_0p19_1_0p22_1')(0.0056, 14, 0, 1, 2500).toFixed(3), 0.029);
    assert.equal(getEasing('cubicbezier_0p19_1_0p22_1')(0.156, 390, 0, 1, 2500).toFixed(3), 0.667);
    assert.equal(getEasing('cubicbezier_0p19_1_0p22_1')(0.344, 860, 0, 1, 2500).toFixed(3), 0.924);
    assert.equal(getEasing('cubicbezier_0p19_1_0p22_1')(0.9864, 2466, 0, 1, 2500).toFixed(3), 1);
});

QUnit.test('Fallback \'linear\' easing should be added in `easing` object', function(assert) {
    const convert = easing.convertTransitionTimingFuncToEasing;
    const getEasing = easing.getEasing;

    const easingName = convert('nonexistentEasing');
    assert.equal(easingName, 'linear');
    assert.equal(typeof getEasing(easingName), 'function');
});

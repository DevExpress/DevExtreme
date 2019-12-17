var $ = require('jquery'),
    inkRipple = require('ui/widget/utils.ink_ripple'),
    fx = require('animation/fx');

var INKRIPPLE_CLASS = 'dx-inkripple',
    INKRIPPLE_WAVE_CLASS = 'dx-inkripple-wave',
    INKRIPPLE_WAVE_SHOWING_CLASS = 'dx-inkripple-showing',
    INKRIPPLE_WAVE_HIDING_CLASS = 'dx-inkripple-hiding';

var moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('rendering', moduleConfig);

QUnit.test('inkRipple is rendered after the first \'showWave\' call', function(assert) {
    var $element = $('<div>'),
        inkRippleInstance = inkRipple.render();

    assert.equal($element.find('.' + INKRIPPLE_CLASS).length, 0, 'inkRipple element is not rendered before first active event');

    inkRippleInstance.showWave({ element: $element, event: {} });
    assert.equal($element.find('.' + INKRIPPLE_CLASS).length, 1, 'inkRipple element is rendered inside element');
});

QUnit.test('wave class depend on called method', function(assert) {
    var $element = $('<div>'),
        inkRippleInstance = inkRipple.render();

    inkRippleInstance.showWave({ element: $element, event: {} });
    var $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS);
    this.clock.tick();

    assert.ok($wave.hasClass(INKRIPPLE_WAVE_SHOWING_CLASS), 'wave has showing class after the \'showWave\' method call');
    assert.ok(!$wave.hasClass(INKRIPPLE_WAVE_HIDING_CLASS), 'wave has no hiding class after the \'showWave\' method call');

    inkRippleInstance.hideWave({ element: $element, event: {} });
    this.clock.tick();

    assert.ok($wave.hasClass(INKRIPPLE_WAVE_HIDING_CLASS), 'wave has hiding class after the \'hideWave\' method call');
    assert.ok(!$wave.hasClass(INKRIPPLE_WAVE_SHOWING_CLASS), 'wave has no showing class after the \'hideWave\' method call');
});

QUnit.test('showing wave class is removed if call hideWave after showWave immediately', function(assert) {
    var $element = $('<div>'),
        inkRippleInstance = inkRipple.render();

    inkRippleInstance.showWave({ element: $element, event: {} });
    var $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS);

    inkRippleInstance.hideWave({ element: $element, event: {} });
    this.clock.tick();
    assert.ok(!$wave.hasClass(INKRIPPLE_WAVE_SHOWING_CLASS), 'wave has no showing class after the \'hideWave\' method call');
});

QUnit.test('number of waves depend on \'wavesNumber\' option', function(assert) {
    var $element = $('<div>'),
        wavesNumber = 2,
        inkRippleInstance = inkRipple.render({
            wavesNumber: wavesNumber
        });

    inkRippleInstance.showWave({ element: $element, event: {} });
    var $waves = $element.find('.' + INKRIPPLE_WAVE_CLASS);
    assert.equal($waves.length, wavesNumber, 'the number of waves is correct');
});

QUnit.test('ink ripple wave has correct size', function(assert) {
    var elementSize = 30,
        borderSize = 2,
        waveSize = parseInt(Math.sqrt(2) * (elementSize + 2 + borderSize)),
        $element = $('<div>').css({
            height: elementSize,
            width: elementSize,
            border: borderSize + 'px solid black'
        }),
        waveSizeCoefficient = 3,
        inkRippleInstance = inkRipple.render({
            waveSizeCoefficient: waveSizeCoefficient
        });

    inkRippleInstance.showWave({ element: $element, event: {} });
    var $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS);

    assert.equal($wave.height(), waveSize * waveSizeCoefficient, 'wave height is correct');
    assert.equal($wave.width(), waveSize * waveSizeCoefficient, 'wave width is correct');
});

QUnit.test('ink ripple wave size is diagonal size of element', function(assert) {
    var elementHeight = 30,
        elementWidth = 50,
        waveSize = parseInt(Math.sqrt(elementHeight * elementHeight + elementWidth * elementWidth)),
        $element = $('<div>').css({
            height: elementHeight,
            width: elementWidth
        }),
        inkRippleInstance = inkRipple.render({
            waveSizeCoefficient: 1
        });

    inkRippleInstance.showWave({ element: $element, event: {} });
    var $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS);

    assert.equal($wave.height(), $wave.width(), 'wave height and width are equal');
    assert.equal($wave.height(), waveSize, 'wave size is correct');
});

QUnit.test('wave is rendered in the center of ink ripple if the \'isCentered\' option is set to true', function(assert) {
    var elementWidth = 30,
        elementHeight = 40,
        waveSize = parseInt(Math.sqrt(elementHeight * elementHeight + elementWidth * elementWidth)),
        $element = $('<div>').css({
            width: elementWidth,
            height: elementHeight
        }),
        waveSizeCoefficient = 2,
        rippleSize = waveSize * waveSizeCoefficient,
        inkRippleInstance = inkRipple.render({
            waveSizeCoefficient: waveSizeCoefficient,
            isCentered: true
        });

    inkRippleInstance.showWave({ element: $element, event: {} });

    var $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS),
        expectedLeft = (elementWidth - rippleSize) / 2,
        expectedTop = (elementHeight - rippleSize) / 2;

    assert.equal(parseInt($wave.css('left')), expectedLeft, 'the \'left\' position is correct');
    assert.equal(parseInt($wave.css('top')), expectedTop, 'the \'right\' position is correct');
});

QUnit.test('wave is rendered in place of click by default', function(assert) {
    var elementSize = 30,
        waveSize = parseInt(Math.sqrt(2) * elementSize),
        $element = $('<div>').css({
            height: elementSize,
            width: elementSize
        }),
        waveSizeCoefficient = 2,
        rippleSize = waveSize * waveSizeCoefficient,
        inkRippleInstance = inkRipple.render({
            waveSizeCoefficient: waveSizeCoefficient
        });

    var pageX = 10,
        pageY = 20,
        e = $.Event('dxactive', {
            element: $element,
            pageX: pageX,
            pageY: pageY
        });

    inkRippleInstance.showWave({ element: $element, event: e });

    var $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS),
        wavePosition = $wave.position();

    assert.equal(parseInt($wave.css('left')), pageX - wavePosition.left - rippleSize / 2, 'the \'left\' position is correct');
    assert.equal(parseInt($wave.css('top')), pageY - wavePosition.top - rippleSize / 2, 'the \'top\' position is correct');
});

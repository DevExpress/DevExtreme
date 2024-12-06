const $ = require('jquery');
const inkRipple = require('ui/widget/utils.ink_ripple');
const fx = require('common/core/animation/fx');

const INKRIPPLE_CLASS = 'dx-inkripple';
const INKRIPPLE_WAVE_CLASS = 'dx-inkripple-wave';
const INKRIPPLE_WAVE_SHOWING_CLASS = 'dx-inkripple-showing';
const INKRIPPLE_WAVE_HIDING_CLASS = 'dx-inkripple-hiding';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
        this.$element.remove();
    }
};

QUnit.module('rendering', moduleConfig);

QUnit.test('inkRipple is rendered after the first \'showWave\' call', function(assert) {
    const $element = $('<div>');
    const inkRippleInstance = inkRipple.render();

    assert.equal($element.find('.' + INKRIPPLE_CLASS).length, 0, 'inkRipple element is not rendered before first active event');

    inkRippleInstance.showWave({ element: $element, event: {} });
    assert.equal($element.find('.' + INKRIPPLE_CLASS).length, 1, 'inkRipple element is rendered inside element');
});

QUnit.test('wave class depend on called method', function(assert) {
    const inkRippleInstance = inkRipple.render();

    inkRippleInstance.showWave({ element: this.$element, event: {} });
    const $wave = this.$element.find('.' + INKRIPPLE_WAVE_CLASS);
    this.clock.tick();

    assert.ok($wave.hasClass(INKRIPPLE_WAVE_SHOWING_CLASS), 'wave has showing class after the \'showWave\' method call');
    assert.ok(!$wave.hasClass(INKRIPPLE_WAVE_HIDING_CLASS), 'wave has no hiding class after the \'showWave\' method call');

    inkRippleInstance.hideWave({ element: this.$element, event: {} });
    this.clock.tick();

    assert.ok($wave.hasClass(INKRIPPLE_WAVE_HIDING_CLASS), 'wave has hiding class after the \'hideWave\' method call');
    assert.ok(!$wave.hasClass(INKRIPPLE_WAVE_SHOWING_CLASS), 'wave has no showing class after the \'hideWave\' method call');
});

QUnit.test('showing wave class is removed if call hideWave after showWave immediately', function(assert) {
    const inkRippleInstance = inkRipple.render();

    inkRippleInstance.showWave({ element: this.$element, event: {} });
    const $wave = this.$element.find('.' + INKRIPPLE_WAVE_CLASS);

    inkRippleInstance.hideWave({ element: this.$element, event: {} });
    this.clock.tick();
    assert.ok(!$wave.hasClass(INKRIPPLE_WAVE_SHOWING_CLASS), 'wave has no showing class after the \'hideWave\' method call');
});

QUnit.test('number of waves depend on \'wavesNumber\' option', function(assert) {
    const wavesNumber = 2;
    const inkRippleInstance = inkRipple.render({
        wavesNumber: wavesNumber
    });

    inkRippleInstance.showWave({ element: this.$element, event: {} });
    const $waves = this.$element.find('.' + INKRIPPLE_WAVE_CLASS);
    assert.equal($waves.length, wavesNumber, 'the number of waves is correct');
});

QUnit.test('ink ripple wave has correct size', function(assert) {
    const elementSize = 30;
    const borderSize = 2;
    const waveSize = parseInt(Math.sqrt(2) * (elementSize + 2 + borderSize));
    this.$element.css({
        height: elementSize,
        width: elementSize,
        border: borderSize + 'px solid black'
    });
    const waveSizeCoefficient = 3;
    const inkRippleInstance = inkRipple.render({
        waveSizeCoefficient: waveSizeCoefficient
    });

    inkRippleInstance.showWave({ element: this.$element, event: {} });
    const $wave = this.$element.find('.' + INKRIPPLE_WAVE_CLASS);

    assert.equal($wave.height(), waveSize * waveSizeCoefficient, 'wave height is correct');
    assert.equal($wave.width(), waveSize * waveSizeCoefficient, 'wave width is correct');
});

QUnit.test('ink ripple wave size is diagonal size of element', function(assert) {
    const elementHeight = 30;
    const elementWidth = 50;
    const waveSize = parseInt(Math.sqrt(elementHeight * elementHeight + elementWidth * elementWidth));
    this.$element.css({
        height: elementHeight,
        width: elementWidth
    });
    const inkRippleInstance = inkRipple.render({
        waveSizeCoefficient: 1
    });

    inkRippleInstance.showWave({ element: this.$element, event: {} });
    const $wave = this.$element.find('.' + INKRIPPLE_WAVE_CLASS);

    assert.equal($wave.height(), $wave.width(), 'wave height and width are equal');
    assert.equal($wave.height(), waveSize, 'wave size is correct');
});

QUnit.test('wave is rendered in the center of ink ripple if the \'isCentered\' option is set to true', function(assert) {
    const elementWidth = 30;
    const elementHeight = 40;
    const waveSize = parseInt(Math.sqrt(elementHeight * elementHeight + elementWidth * elementWidth));
    this.$element.css({
        width: elementWidth,
        height: elementHeight
    });
    const waveSizeCoefficient = 2;
    const rippleSize = waveSize * waveSizeCoefficient;
    const inkRippleInstance = inkRipple.render({
        waveSizeCoefficient: waveSizeCoefficient,
        isCentered: true
    });

    inkRippleInstance.showWave({ element: this.$element, event: {} });

    const $wave = this.$element.find('.' + INKRIPPLE_WAVE_CLASS);
    const expectedLeft = (elementWidth - rippleSize) / 2;
    const expectedTop = (elementHeight - rippleSize) / 2;

    assert.equal(parseInt($wave.css('left')), expectedLeft, 'the \'left\' position is correct');
    assert.equal(parseInt($wave.css('top')), expectedTop, 'the \'right\' position is correct');
});

QUnit.test('wave is rendered in place of click by default', function(assert) {
    const elementSize = 30;
    const waveSize = parseInt(Math.sqrt(2) * elementSize);
    const $element = $('<div>').css({
        height: elementSize,
        width: elementSize
    });
    const waveSizeCoefficient = 2;
    const rippleSize = waveSize * waveSizeCoefficient;
    const inkRippleInstance = inkRipple.render({
        waveSizeCoefficient: waveSizeCoefficient
    });

    const pageX = 10;
    const pageY = 20;
    const e = $.Event('dxactive', {
        element: $element,
        pageX: pageX,
        pageY: pageY
    });

    inkRippleInstance.showWave({ element: $element, event: e });

    const $wave = $element.find('.' + INKRIPPLE_WAVE_CLASS);
    const wavePosition = $wave.position();

    assert.equal(parseInt($wave.css('left')), pageX - wavePosition.left - rippleSize / 2, 'the \'left\' position is correct');
    assert.equal(parseInt($wave.css('top')), pageY - wavePosition.top - rippleSize / 2, 'the \'top\' position is correct');
});

import $ from 'jquery';
import registerComponent from 'core/component_registrator';
import Widget from 'ui/test-widget.j';

const nameSpace = {};

QUnit.testStart(function() {
    const markup = '<div id="component"></div>' + '<div id="anotherComponent"></div>';

    $('#qunit-fixture').html(markup);
});

const RTL_CLASS = 'dx-rtl';

QUnit.module('Markup tests', {
    beforeEach: function(module) {
        // it needs for Preact timers https://github.com/preactjs/preact/blob/master/hooks/src/index.js#L273
        this.clock = sinon.useFakeTimers();
        registerComponent('TestComponent', nameSpace, Widget);
    },

    afterEach: function() {
        delete $.fn.TestComponent;
        this.clock.tick(100);
        this.clock.restore();
    }
});


QUnit.test('initial markup', function(assert) {
    const $element = $('#component').TestComponent({});

    assert.ok(!$element.hasClass(RTL_CLASS), 'element hasn\'t a RTL class');
});

QUnit.test('init option \'rtlEnabled\' is true', function(assert) {
    const $element = $('#component').TestComponent({ rtlEnabled: true });

    assert.ok($element.hasClass(RTL_CLASS), 'element has a RTL class');
});

QUnit.test('init with custom dimensions', function(assert) {
    const element = $('#component').TestComponent({ width: 150, height: 75 }).get(0);

    assert.equal(element.style.width, '150px', 'width is correct');
    assert.equal(element.style.height, '75px', 'height is correct');
});

[
    { width: null, height: null },
    { width: 50, height: 25 },
    { width: 0, height: 0 },
    { width: '', height: '' }
].forEach(({ width, height }) => {
    QUnit.test(`change dimensions from predefined values, width => ${width}, height => ${height}`, function(assert) {
        const instance = $('#component').TestComponent({ width: 150, height: 75 }).TestComponent('instance');
        const element = instance.$element().get(0);
        const getExpectedValue = (dimension) => typeof dimension === 'number' ? dimension + 'px' : '';

        instance.option({
            width,
            height
        });

        assert.equal(element.style.width, getExpectedValue(width), `width => ${width}, value is correct`);
        assert.equal(element.style.height, getExpectedValue(height), `height => ${height}, value is correct`);
    });

    QUnit.test(`change dimensions from default values, width => ${width}, height => ${height}`, function(assert) {
        const instance = $('#component').TestComponent({}).TestComponent('instance');
        const element = instance.$element().get(0);
        const getExpectedValue = (dimension) => typeof dimension === 'number' ? dimension + 'px' : '';

        instance.option({
            width,
            height
        });

        assert.equal(element.style.width, getExpectedValue(width), `width => ${width}, value is correct`);
        assert.equal(element.style.height, getExpectedValue(height), `height => ${height}, value is correct`);
    });
});

QUnit.module('accessKey');

QUnit.test('should set "accesskey" attribute if "focusStateEnabled" is true and "disable" is false', function(assert) {
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: false,
        accessKey: 'y'
    });
    const instance = $widget.dxTestWidget('instance');

    assert.strictEqual($widget.attr('accesskey'), void 0);

    instance.option('focusStateEnabled', true);
    assert.strictEqual($widget.attr('accesskey'), 'y');

    instance.option('accessKey', 'g');
    assert.strictEqual($widget.attr('accesskey'), 'g');

    instance.option('disabled', true);
    assert.strictEqual($widget.attr('accesskey'), void 0);
});

QUnit.testInActiveWindow('should take a focus if the accessKey is pressed', function(assert) {
    const done = assert.async();
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: true,
        accessKey: 'y'
    });

    window.setTimeout(() => {
        $widget.trigger($.Event('dxclick', { screenX: 0, offsetX: 0, pageX: 0 }));

        window.setTimeout(() => {
            assert.ok($widget.hasClass('dx-state-focused'));
            done();
        }, 0);
    }, 50);
});

QUnit.test('should not fire click event if the accessKey is pressed', function(assert) {
    const done = assert.async();
    let isImmediatePropagationStopped = true;
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: true,
        accessKey: 'y'
    });

    window.setTimeout(() => {
        $widget.on('dxclick', () => isImmediatePropagationStopped = false);
        $widget.trigger($.Event('dxclick', { screenX: 0, offsetX: 0, pageX: 0 }));
        window.setTimeout(() => {
            assert.ok(isImmediatePropagationStopped);
            done();
        }, 0);
    }, 50);
});

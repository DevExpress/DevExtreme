import $ from 'jquery';
import 'ui/test-widget.j';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="component"></div>
        <div id="anotherComponent"></div>
    `);
});

const config = {
    beforeEach: function(module) {
        // it needs for Preact timers https://github.com/preactjs/preact/blob/master/hooks/src/index.js#L273
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.tick(100);
        this.clock.restore();
    }
};

QUnit.module('RTL', config);

QUnit.test('should not add rtl marker class by default', function(assert) {
    const $element = $('#component').dxTestWidget();

    assert.notOk($element.hasClass('dx-rtl'));
});

QUnit.test('should add rtl marker class if the "rtlEnabled" is true', function(assert) {
    const $element = $('#component').dxTestWidget({ rtlEnabled: true });

    assert.ok($element.hasClass('dx-rtl'));
});

QUnit.module('Width/Height', config);

QUnit.test('should render dimensions', function(assert) {
    const $element = $('#component').dxTestWidget({ width: 150, height: 75 });
    const instance = $element.dxTestWidget('instance');

    assert.deepEqual($element.css(['width', 'height']), { width: '150px', height: '75px' });

    instance.option({ width: 200, height: 300 });
    assert.deepEqual($element.css(['width', 'height']), { width: '200px', height: '300px' });
});

QUnit.test('should ignore incorrect dimensions', function(assert) {
    const $element = $('#component').dxTestWidget({ width: 100, height: 100 });
    const style = $element.get(0).style;
    const instance = $element.dxTestWidget('instance');

    assert.strictEqual(style.width, '100px');
    assert.strictEqual(style.height, '100px');

    instance.option({ width: null, height: null });
    assert.strictEqual(style.width, '');
    assert.strictEqual(style.height, '');

    instance.option({ width: '', height: '' });
    assert.strictEqual(style.width, '');
    assert.strictEqual(style.height, '');
});

QUnit.module('accessKey');

QUnit.test('should not add "accesskey" attribute if "focusStateEnabled" is false', function(assert) {
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: false,
        accessKey: 'y'
    });

    assert.strictEqual($widget.attr('accesskey'), void 0);
});

QUnit.test('should not add "accesskey" attribute if "disabled" is true', function(assert) {
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: true,
        disabled: true,
        accessKey: 'y'
    });

    assert.strictEqual($widget.attr('accesskey'), void 0);
});

QUnit.test('should change "accesskey" attribute', function(assert) {
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: true,
        accessKey: 'y'
    });
    const instance = $widget.dxTestWidget('instance');

    instance.option('accessKey', 'g');
    assert.strictEqual($widget.attr('accesskey'), 'g');
});

// NOTE: get rid of async qunit tests
QUnit.testInActiveWindow('should take a focus if the accessKey is pressed', function(assert) {
    const done = assert.async();
    const $widget = $('#component').dxTestWidget({
        focusStateEnabled: true,
        accessKey: 'y'
    });

    window.setTimeout(() => {
        // NOTE: access key pressing emulation
        $widget.trigger($.Event('dxclick', { screenX: 0, offsetX: 0, pageX: 0 }));
        window.setTimeout(() => {
            assert.ok($widget.hasClass('dx-state-focused'));
            done();
        }, 0);
    }, 50);
});

// NOTE: get rid of async qunit tests
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

QUnit.module('Container', config);

QUnit.test('should not remove attributes from container after render', function(assert) {
    const $container = $('#component').attr({
        'custom-attr': 'v1',
        'class': 'my-widget-class'
    });
    const widget = $container.dxTestWidget({}).dxTestWidget('instance');

    assert.strictEqual(widget.$element().attr('id'), 'component');
    assert.strictEqual(widget.$element().attr('custom-attr'), 'v1');
    assert.ok($container.hasClass('my-widget-class'));
    assert.deepEqual(widget.option.elementAttr, undefined);
});

QUnit.test('should rewrite container attributes after render', function(assert) {
    const $container = $('#component').attr({ 'custom-attr': 'v1' });
    const widget = $container.dxTestWidget({
        elementAttr: { 'custom-attr': 'v2' }
    }).dxTestWidget('instance');

    assert.strictEqual(widget.$element().attr('custom-attr'), 'v2');
    assert.deepEqual(widget.option().elementAttr, { 'custom-attr': 'v2' });
});

QUnit.test('should save attributes after rerender', function(assert) {
    const widget = $('#component').dxTestWidget({
        elementAttr: { 'custom-attr': 'v2' }
    }).dxTestWidget('instance');

    // NOTE: force rerender
    widget.option('elementAttr', { 'a': 'v' });

    assert.strictEqual(widget.$element().attr('id'), 'component');
});

QUnit.test('should not recreate container element', function(assert) {
    const $container = $('#component');
    const container = $container.get(0);
    const widget = $container.dxTestWidget({}).dxTestWidget('instance');

    assert.strictEqual(widget.$element().get(0), container);
});

QUnit.test('should not recreate container element after rerender', function(assert) {
    const $container = $('#component');
    const container = $container.get(0);
    const widget = $container.dxTestWidget({}).dxTestWidget('instance');

    // NOTE: force rerender
    widget.option('elementAttr', { 'a': 'v' });

    assert.strictEqual(widget.$element().get(0), container);
});

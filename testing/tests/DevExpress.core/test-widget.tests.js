import $ from 'jquery';
import 'ui/test-widget.j';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="component"></div>
        <div id="anotherComponent"></div>
    `);
});

QUnit.module('RTL');

QUnit.test('should not add rtl marker class by default', function(assert) {
    const $element = $('#component').dxTestWidget();

    assert.notOk($element.hasClass('dx-rtl'));
});

QUnit.test('should add rtl marker class if the "rtlEnabled" is true', function(assert) {
    const $element = $('#component').dxTestWidget({ rtlEnabled: true });

    assert.ok($element.hasClass('dx-rtl'));
});

QUnit.module('Width/Height');

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

/* eslint-disable spellcheck/spell-checker */
import $ from 'jquery';
import 'renovation/widget.j';

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

QUnit.module('Props: width/height', config);

QUnit.test('should overwrite predefined dimensions', function(assert) {
    const $element = $('#component');
    const style = $element.get(0).style;

    $element.css({ width: '20px', height: '30px' });
    assert.strictEqual(style.width, '20px');
    assert.strictEqual(style.height, '30px');

    $element.dxrWidget({ width: void 0, height: void 0 });
    // assert.strictEqual(style.width, '20px');
    // assert.strictEqual(style.height, '30px');

    $element.css({ width: '20px', height: '30px' });
    assert.strictEqual(style.width, '20px');
    assert.strictEqual(style.height, '30px');

    $element.dxrWidget({ width: null, height: null });
    // assert.strictEqual(style.width, '');
    // assert.strictEqual(style.height, '');

    $element.css({ width: '20px', height: '30px' });
    assert.strictEqual(style.width, '20px');
    assert.strictEqual(style.height, '30px');

    $element.dxrWidget({ width: '', height: '' });
    assert.strictEqual(style.width, '');
    assert.strictEqual(style.height, '');
});

QUnit.module('Props: accessKey');

QUnit.test('should change "accesskey" attribute', function(assert) {
    const $widget = $('#component').dxrWidget({
        focusStateEnabled: true,
        accessKey: 'y'
    });
    const instance = $widget.dxrWidget('instance');

    instance.option('accessKey', 'g');
    assert.strictEqual($widget.attr('accesskey'), 'g');
});

QUnit.module('Container', config);

QUnit.test('should not remove attributes from container after render', function(assert) {
    const $container = $('#component').attr({
        'custom-attr': 'v1',
        'class': 'my-widget-class'
    });
    const widget = $container.dxrWidget({}).dxrWidget('instance');

    assert.strictEqual(widget.$element().attr('id'), 'component');
    assert.strictEqual(widget.$element().attr('custom-attr'), 'v1');
    assert.ok($container.hasClass('my-widget-class'));
    assert.deepEqual(widget.option.elementAttr, undefined);
});

QUnit.test('should rewrite container attributes after render', function(assert) {
    const $container = $('#component').attr({ 'custom-attr': 'v1' });
    const widget = $container.dxrWidget({
        elementAttr: { 'custom-attr': 'v2' }
    }).dxrWidget('instance');

    assert.strictEqual(widget.$element().attr('custom-attr'), 'v2');
    assert.deepEqual(widget.option().elementAttr, { 'custom-attr': 'v2' });
});

QUnit.test('should save attributes after rerender', function(assert) {
    const widget = $('#component').dxrWidget({
        elementAttr: { 'custom-attr': 'v2' }
    }).dxrWidget('instance');

    // NOTE: force rerender
    widget.option('elementAttr', { 'a': 'v' });

    assert.strictEqual(widget.$element().attr('id'), 'component');
});

QUnit.test('should not recreate container element', function(assert) {
    const $container = $('#component');
    const container = $container.get(0);
    const widget = $container.dxrWidget({}).dxrWidget('instance');

    assert.strictEqual(widget.$element().get(0), container);
});

QUnit.test('should not recreate container element after rerender', function(assert) {
    const $container = $('#component');
    const container = $container.get(0);
    const widget = $container.dxrWidget({}).dxrWidget('instance');

    // NOTE: force rerender
    widget.option('elementAttr', { 'a': 'v' });

    assert.strictEqual(widget.$element().get(0), container);
});

QUnit.module('Preact Wrapper', config);

QUnit.test('should create in separate element', function(assert) {
    $('<div>').dxrWidget({});

    assert.ok(true, 'no exceptions');
});

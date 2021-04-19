import $ from 'jquery';
import 'renovation/ui/common/widget.j';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="component"></div>
    `);
});

const moduleConfig = {
    Widget(options = {}) {
        $('#component').dxWidget(options);
        return $('#component');
    }
};

QUnit.module('Props: width/height', moduleConfig, () => {
    QUnit.test('should overwrite predefined dimensions', function(assert) {
        const $element = $('#component');
        const style = $element.get(0).style;

        $element.css({ width: '20px', height: '30px' });
        assert.strictEqual(style.width, '20px');
        assert.strictEqual(style.height, '30px');

        this.Widget({ width: void 0, height: void 0 });
        // assert.strictEqual(style.width, '20px');
        // assert.strictEqual(style.height, '30px');

        $element.css({ width: '20px', height: '30px' });
        assert.strictEqual(style.width, '20px');
        assert.strictEqual(style.height, '30px');

        this.Widget({ width: null, height: null });
        // assert.strictEqual(style.width, '');
        // assert.strictEqual(style.height, '');

        $element.css({ width: '20px', height: '30px' });
        assert.strictEqual(style.width, '20px');
        assert.strictEqual(style.height, '30px');

        this.Widget({ width: '', height: '' });
        assert.strictEqual(style.width, '');
        assert.strictEqual(style.height, '');
    });
});

QUnit.module('Props: accessKey', moduleConfig, () => {
    QUnit.test('should change "accesskey" attribute', function(assert) {
        const $widget = this.Widget({
            focusStateEnabled: true,
            accessKey: 'y'
        });

        this.Widget({ accessKey: 'g' });
        assert.strictEqual($widget.attr('accesskey'), 'g');
    });
});

QUnit.module('Container', moduleConfig, () => {
    QUnit.test('should not remove attributes from container after render', function(assert) {
        const $container = $('#component').attr({
            'custom-attr': 'v1',
            'class': 'my-widget-class'
        });
        const widget = this.Widget({}).dxWidget('instance');

        assert.strictEqual(widget.$element().attr('id'), 'component');
        assert.strictEqual(widget.$element().attr('custom-attr'), 'v1');
        assert.ok($container.hasClass('my-widget-class'));
        assert.deepEqual(widget.option.elementAttr, undefined);
    });

    QUnit.test('should rewrite container attributes after render', function(assert) {
        $('#component').attr({ 'custom-attr': 'v1' });
        const widget = this.Widget({
            elementAttr: { 'custom-attr': 'v2' }
        }).dxWidget('instance');

        assert.strictEqual(widget.$element().attr('custom-attr'), 'v2');
        assert.deepEqual(widget.option().elementAttr, { 'custom-attr': 'v2' });
    });

    QUnit.test('should save attributes after rerender', function(assert) {
        const widget = this.Widget({
            elementAttr: { 'custom-attr': 'v2' }
        }).dxWidget('instance');

        // NOTE: force rerender
        this.Widget({ elementAttr: { 'a': 'v' } });

        assert.strictEqual(widget.$element().attr('id'), 'component');
    });

    QUnit.test('should not recreate container element', function(assert) {
        const $container = $('#component');
        const container = $container.get(0);
        const widget = this.Widget({}).dxWidget('instance');

        assert.strictEqual(widget.$element().get(0), container);
    });

    QUnit.test('should not recreate container element after rerender', function(assert) {
        const $container = $('#component');
        const container = $container.get(0);
        const widget = this.Widget({}).dxWidget('instance');

        // NOTE: force rerender
        this.Widget({ elementAttr: { 'a': 'v' } });

        assert.strictEqual(widget.$element().get(0), container);
    });

    QUnit.test('should not remove container on dispose', function(assert) {
        const widget = this.Widget({}).dxWidget('instance');
        widget.dispose();

        assert.strictEqual($('#component').length, 1, 'container is not removed');
    });
});

QUnit.module('Component Wrapper', moduleConfig, () => {
    QUnit.test('should create in separate element', function(assert) {
        $('<div>').dxWidget({});

        assert.ok(true, 'no exceptions');
    });
});

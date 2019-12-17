var $ = require('jquery'),
    Widget = require('ui/widget/ui.widget'),
    registerComponent = require('core/component_registrator');

require('common.css!');

(function() {

    var WIDGET_CLASS = 'dx-widget',
        DISABLED_STATE_CLASS = 'dx-state-disabled';

    var DxWidget = Widget.inherit({});
    registerComponent('dxWidget', DxWidget);


    QUnit.testStart(function() {
        var markup = '\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
            <div id="widthRootStylePercent" style="width: 50%;"></div>\
            </div>';

        $('#qunit-fixture').html(markup);
    });

    QUnit.module('Widget markup');

    QUnit.test('markup init', function(assert) {
        var element = $('#widget').dxWidget({});

        assert.ok(element.hasClass(WIDGET_CLASS));
    });

    QUnit.test('widget with a custom dimensions', function(assert) {
        var element = $('#widget').dxWidget({ width: 150, height: 100 });

        assert.strictEqual(element[0].style.width, '150px', 'outer width of the element must be equal to custom width');
        assert.strictEqual(element[0].style.height, '100px', 'outer height of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        var $element = $('#widthRootStyle').dxWidget(),
            instance = $element.dxWidget('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, '300px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom percent width', function(assert) {
        var $element = $('#widthRootStylePercent').dxWidget();

        assert.strictEqual($element[0].style.width, '50%');
    });

    QUnit.test('widget should be visible by default', function(assert) {
        var element = $('#widget').dxWidget(),
            instance = element.dxWidget('instance');

        assert.ok(instance.option('visible'));
        assert.ok(!element.hasClass('dx-state-invisible'));

        instance.option('visible', false);

        assert.ok(element.hasClass('dx-state-invisible'));
    });

    QUnit.test('widget should not be visible if \'visible\' option value = false', function(assert) {
        var element = $('#widget').dxWidget({ visible: false }),
            instance = element.dxWidget('instance');

        assert.ok(element.hasClass('dx-state-invisible'));

        instance.option('visible', true);

        assert.ok(!element.hasClass('dx-state-invisible'));
    });

    QUnit.test('\'hint\' option has \'title\' value', function(assert) {
        var hintText = 'titleText',
            element = $('#widget').dxWidget({
                hint: hintText
            }),
            instance = element.dxWidget('instance');

        assert.equal(instance.option('hint'), hintText, 'Option hint is correct');
        assert.equal(element.attr('title'), hintText, ' \'title\' attribute of widget is correct');

        instance.option('hint', undefined);

        assert.equal(instance.option('hint'), undefined, ' hint option value is correct');
        assert.equal(element.attr('title'), undefined, ' \'title\' attribute of widget is undefined');
    });

    QUnit.test('\'disabled\' option with \'true\' value atthaches \'dx-state-disabled\' class', function(assert) {
        var element = $('#widget').dxWidget({
            disabled: true
        });

        assert.ok(element.hasClass(DISABLED_STATE_CLASS));
    });

    QUnit.test('\'disabled\' option with undefined value not attaches \'dx-state-disabled\' class', function(assert) {
        var element = $('#widget').dxWidget({
            disabled: undefined
        });

        assert.ok(!element.hasClass(DISABLED_STATE_CLASS));
    });
})();

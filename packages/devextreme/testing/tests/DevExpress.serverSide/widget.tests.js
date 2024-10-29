import '../DevExpress.ui/widget.markup.tests.js';
import $ from 'jquery';
import Widget from 'ui/widget/ui.widget';
import registerComponent from 'core/component_registrator';

const DxWidget = Widget.inherit({});
registerComponent('dxWidget', DxWidget);

QUnit.module('Widgets in SSR mode', {}, () => {
    QUnit.test('checking visibility in SSR mode not throw errors (T1259705)', function(assert) {
        const TestWidget = Widget.inherit({});

        const $element = $('#widget').dxWidget({ width: 0, height: 0 });

        const component = new TestWidget($element, { visible: true });

        // act
        component._isVisible();

        // assert
        assert.ok(true);
    });
});



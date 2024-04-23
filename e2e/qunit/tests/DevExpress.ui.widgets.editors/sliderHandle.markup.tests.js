import $ from 'jquery';
import SliderHandle from 'ui/slider/ui.slider_handle';

const SLIDER_HANDLE_CLASS = 'dx-slider-handle';

QUnit.testStart(() => {
    const markup =
        '<div id="sliderHandle"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('render', () => {
    QUnit.test('should have "dx-slider-handle" class', function(assert) {
        const sliderHandle = new SliderHandle($('#sliderHandle'), {});

        assert.ok(sliderHandle.$element().hasClass(SLIDER_HANDLE_CLASS));
    });

    QUnit.test('should have "slider" role', function(assert) {
        const sliderHandle = new SliderHandle($('#sliderHandle'), {});

        assert.strictEqual(sliderHandle.$element().attr('role'), 'slider');
    });

    QUnit.test('should pass value option to "valuenow" aria prop', function(assert) {
        const sliderHandle = new SliderHandle($('#sliderHandle'), {
            value: 12
        });

        assert.strictEqual(sliderHandle.$element().attr('aria-valuenow'), '12');

        sliderHandle.option('value', 20);
        assert.strictEqual(sliderHandle.$element().attr('aria-valuenow'), '20');
    });
});

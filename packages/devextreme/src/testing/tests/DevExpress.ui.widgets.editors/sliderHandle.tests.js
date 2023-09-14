import $ from 'jquery';
import SliderHandle from 'ui/slider/ui.slider_handle';
import SliderTooltip from 'ui/slider/ui.slider_tooltip';

QUnit.testStart(() => {
    const markup =
        '<div id="sliderHandle"></div>';

    $('#qunit-fixture').html(markup);
});

const getSliderTooltip = (sliderHandle) => {
    return sliderHandle
        .$element()
        .find('.dx-tooltip');
};

QUnit.module('public methods', {
    beforeEach: function() {
        this.sliderHandle = new SliderHandle($('#sliderHandle'), { tooltip: { enabled: true } });
        const $tooltip = getSliderTooltip(this.sliderHandle);
        this.tooltip = SliderTooltip.getInstance($tooltip);
    }
}, () => {
    QUnit.test('repaint should call sliderTooltip repaint', function(assert) {
        const tooltipRepaintSpy = sinon.spy(this.tooltip, 'repaint');

        this.sliderHandle.repaint();

        assert.ok(tooltipRepaintSpy.called);
    });

    QUnit.test('updateTooltipPosition should call sliderTooltip updatePosition', function(assert) {
        const tooltipUpdatePositionSpy = sinon.spy(this.tooltip, 'updatePosition');

        this.sliderHandle.updateTooltipPosition();

        assert.ok(tooltipUpdatePositionSpy.called);
    });
});

QUnit.module('tooltip integration', () => {
    QUnit.test('sliderHandle should create SliderTooltip with correct parameters', function(assert) {
        const initConfig = {
            value: 20,
            tooltip: {
                format: () => {},
                position: 'bottom',
                enabled: true,
                showMode: 'onHover'
            }
        };

        const sliderHandle = new SliderHandle($('#sliderHandle'), initConfig);
        const $sliderTooltip = getSliderTooltip(sliderHandle);
        const sliderTooltip = SliderTooltip.getInstance($sliderTooltip);
        const sliderTooltipOptions = sliderTooltip.option();

        assert.strictEqual(sliderTooltipOptions.target, sliderHandle.$element(), 'target is correct');
        assert.strictEqual(sliderTooltipOptions.container.get(0), sliderTooltip.$element().get(0), 'container is correct');
        assert.strictEqual(sliderTooltipOptions.position, initConfig.tooltip.position, 'position is correct');
        assert.strictEqual(sliderTooltipOptions.visible, initConfig.tooltip.enabled, 'visible is correct');
        assert.strictEqual(sliderTooltipOptions.format, initConfig.tooltip.format, 'format is correct');
        assert.strictEqual(sliderTooltipOptions.showMode, initConfig.tooltip.showMode, 'showMode is correct');
        assert.strictEqual(sliderTooltipOptions.value, initConfig.value, 'value is correct');
    });

    QUnit.module('on option change', {
        beforeEach: function() {
            this.sliderHandle = new SliderHandle($('#sliderHandle'), { tooltip: { enabled: true } });
            const $sliderTooltip = getSliderTooltip(this.sliderHandle);
            this.sliderTooltip = SliderTooltip.getInstance($sliderTooltip);
        }
    }, () => {
        QUnit.test('should pass value to SliderTooltip', function(assert) {
            this.sliderHandle.option('value', 200);

            assert.strictEqual(this.sliderTooltip.option('value'), 200);
        });

        QUnit.test('should pass tooltip.enabled to SliderTooltip as visible', function(assert) {
            this.sliderHandle.option('tooltip.enabled', true);

            assert.strictEqual(this.sliderTooltip.option('visible'), true);
        });

        QUnit.test('should pass tooltip options to SliderTooltip', function(assert) {
            this.sliderHandle.option('tooltip.showMode', 'always');

            assert.strictEqual(this.sliderTooltip.option('showMode'), 'always');
        });
    });
});

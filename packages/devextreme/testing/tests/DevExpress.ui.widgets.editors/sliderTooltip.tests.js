import $ from 'jquery';
import SliderTooltip from 'ui/slider/ui.slider_tooltip';

const SLIDER_TOOLTIP_VISIBILITY_CLASS = 'dx-slider-tooltip-visible-on-hover';

QUnit.testStart(() => {
    const markup =
        `
        <div id='container'>
            <div id="sliderTooltip"></div>
        </div>
        `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('SliderTooltip', {
    beforeEach: function() {
        this.$container = $('#container');
        const initialOptions = {
            target: this.$container,
            container: this.$container
        };
        this.$sliderTooltip = $('#sliderTooltip');
        this.init = (options) => {
            this.sliderTooltip = new SliderTooltip(this.$sliderTooltip, $.extend({}, initialOptions, options));
        };
        this.reinit = (options) => {
            this.sliderTooltip.dispose();
            this.init(options);
        };

        this.init({});
    }
}, () => {
    QUnit.test('default options', function(assert) {
        const defaultOptions = {
            visible: false,
            position: 'top',
            hideOnOutsideClick: false,
            hideTopOverlayHandler: null,
            hideOnParentScroll: false,
            animation: null,
            templatesRenderAsynchronously: false,
            _fixWrapperPosition: false,
            useResizeObserver: false,
            showMode: 'onHover',
            value: 0
        };

        Object.entries(defaultOptions).forEach(([name, value]) => {
            assert.strictEqual(this.sliderTooltip.option(name), value, `${name} option default value is correct`);
        });
    });

    QUnit.module('render', {
        beforeEach: function() {
            this.isTooltipRendered = () => {
                return !!this.$container.find(this.$sliderTooltip).length;
            };
        }
    }, () => {
        [true, false].forEach((visible) => {
            QUnit.test(`tooltip should be ${visible === true ? '' : 'not'} rendered if visible=${visible}`, function(assert) {
                this.reinit({ visible });

                assert.strictEqual(this.isTooltipRendered(), visible);
            });

            QUnit.test(`tooltip should be ${visible === true ? '' : 'not'} after runtime change visible=${visible}`, function(assert) {
                this.reinit({ visible: !visible });

                this.sliderTooltip.option({ visible });

                assert.strictEqual(this.isTooltipRendered(), visible);
            });
        });
    });

    QUnit.module('showMode', {
        beforeEach: function() {
            this.hasContainerHoverVisibilityClass = () => this.$container.hasClass(SLIDER_TOOLTIP_VISIBILITY_CLASS);
        }
    }, () => {
        ['always', 'onHover'].forEach((showMode) => {
            const isHoverMode = showMode === 'onHover';

            QUnit.test(`container should have ${isHoverMode ? '' : 'not'} dx-slider-tooltip-visible-on-hover class if showMode=${showMode}`, function(assert) {
                this.reinit({ showMode });

                assert.strictEqual(this.hasContainerHoverVisibilityClass(), isHoverMode);
            });

            QUnit.test(`container should have ${isHoverMode ? '' : 'not'} dx-slider-tooltip-visible-on-hover class after runtime change showMode=${showMode}`, function(assert) {
                this.reinit({ showMode: isHoverMode ? 'always' : 'onHover' });

                this.sliderTooltip.option({ showMode });

                assert.strictEqual(this.hasContainerHoverVisibilityClass(), isHoverMode);
            });
        });
    });

    QUnit.module('content rendering', {
        beforeEach: function() {
            this.getText = () => this.sliderTooltip.$content().text();
        }
    }, () => {
        QUnit.test('content text is updated after value change', function(assert) {
            this.sliderTooltip.option('value', 15);

            assert.strictEqual(this.getText(), '15');
        });

        QUnit.test('position should be updated after content rendering', function(assert) {
            const positionedStub = sinon.stub();
            this.sliderTooltip.on('positioned', positionedStub);

            this.sliderTooltip.option('value', 15);

            assert.ok(positionedStub.called);
        });

        QUnit.test('should not raise any error if value=undefined', function(assert) {
            try {
                this.sliderTooltip.option('value', undefined);
                assert.ok(true, 'no error is raised');
            } catch(e) {
                assert.ok(false, e);
            }
        });

        QUnit.module('format', () => {
            QUnit.test('default format just renders value as a text', function(assert) {
                assert.strictEqual(this.getText(), '0', 'default format is correct');
            });

            QUnit.test('format can be configured on init', function(assert) {
                this.reinit({
                    format: (value) => `(${value})`
                });

                assert.strictEqual(this.getText(), '(0)', 'default format is correct');
            });

            QUnit.test('format can be configured runtime', function(assert) {
                this.sliderTooltip.option({
                    format: (value) => `(${value})`
                });

                assert.strictEqual(this.getText(), '(0)', 'default format is correct');
            });
        });
    });

    QUnit.module('public methods', () => {
        QUnit.test('updatePosition', function(assert) {
            const positionedStub = sinon.stub();
            this.sliderTooltip.on('positioned', positionedStub);

            this.sliderTooltip.updatePosition();

            assert.ok(positionedStub.called);
        });
    });
});

import $ from 'jquery';

import Connector, {
    STEPPER_CONNECTOR_VALUE_CLASS,
    STEPPER_CONNECTOR_CONTAINER_CLASS,
} from '__internal/ui/stepper/connector';

import 'fluent_blue_light.css!';


QUnit.testStart(() => {
    const markup =
        `<style nonce="qunit-test">
        #container {
            position: relative;
            width: 400px;
            height: 400px;
        }

        #connector .dx-stepper-connector-value {
            transition: none !important;
        }
    </style>

    <div id="container">
        <div id="connector"></div>
    </div>`;

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = { }, selector = '#connector') => {
            this.instance = new Connector($(selector), options);
            this.$element = this.instance.$element();
        };

        init();

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
        };

        this.getContainer = () => {
            return this.$element.find(`.${STEPPER_CONNECTOR_CONTAINER_CLASS}`);
        };

        this.getConnectorValue = () => {
            return this.$element.find(`.${STEPPER_CONNECTOR_VALUE_CLASS}`);
        };
    }
};

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('Stepper should be initialized with StepperConnector type', function(assert) {
        assert.ok(this.instance instanceof Connector);
    });
});

QUnit.module('Size option', moduleConfig, () => {
    [
        { orientation: 'horizontal', dimension: 'width', newOrientation: 'vertical', newDimension: 'height' },
        { orientation: 'vertical', dimension: 'height', newOrientation: 'horizontal', newDimension: 'width' },
    ].forEach(({ orientation, dimension, newOrientation, newDimension }) => {
        QUnit.test(`connector should have ${dimension}=100% by default (orientation=${orientation})`, function(assert) {
            this.reinit({ orientation });

            assert.strictEqual(this.$element.css(dimension), '400px');
        });

        QUnit.test(`connector should correctly set ${dimension} on init (orientation=${orientation})`, function(assert) {
            this.reinit({
                orientation,
                size: 50,
            });

            assert.strictEqual(this.$element.css(dimension), '200px');
        });

        QUnit.test(`connector should correctly update styles on runtime orientation change from ${orientation} to ${newOrientation}`, function(assert) {
            this.reinit({
                orientation,
                size: 75,
            });

            assert.strictEqual(this.getContainer().css(dimension), '300px');
            assert.strictEqual(this.getContainer().css(newDimension), '2px');

            this.instance.option('orientation', newOrientation);

            assert.strictEqual(this.getContainer().css(dimension), '2px');
            assert.strictEqual(this.getContainer().css(newDimension), '300px');
        });
    });
});

QUnit.module('Value option', moduleConfig, () => {
    [
        { orientation: 'horizontal', dimension: 'width', newOrientation: 'vertical', newDimension: 'height' },
        { orientation: 'vertical', dimension: 'height', newOrientation: 'horizontal', newDimension: 'width' },
    ].forEach(({ orientation, dimension, newOrientation, newDimension }) => {
        QUnit.test(`connector should correctly set ${dimension} on init (orientation=${orientation})`, function(assert) {
            this.reinit({
                orientation,
                value: 50,
            });

            assert.strictEqual(this.getConnectorValue().css(dimension), '200px');
        });

        QUnit.test(`connector should correctly update styles on runtime orientation change from ${orientation} to ${newOrientation}`, function(assert) {
            this.reinit({
                orientation,
                value: 75,
            });

            assert.strictEqual(this.getConnectorValue().css(dimension), '300px');
            assert.strictEqual(this.getConnectorValue().css(newDimension), '2px');

            this.instance.option('orientation', newOrientation);

            assert.strictEqual(this.getConnectorValue().css(dimension), '2px');
            assert.strictEqual(this.getConnectorValue().css(newDimension), '300px');
        });

        QUnit.test('connector value should correctly update styles on runtime value change', function(assert) {
            this.reinit({
                orientation,
                value: 20,
            });

            assert.strictEqual(this.getConnectorValue().css(dimension), '80px');
            assert.strictEqual(this.getConnectorValue().css(newDimension), '2px');

            this.instance.option('value', 50);

            assert.strictEqual(this.getConnectorValue().css(dimension), '200px');
            assert.strictEqual(this.getConnectorValue().css(newDimension), '2px');
        });
    });
});

import $ from 'jquery';

import Connector, {
    STEPPER_CONNECTOR_CLASS,
    STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS,
    STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS,
    STEPPER_CONNECTOR_CONTAINER_CLASS,
    STEPPER_CONNECTOR_VALUE_CLASS,
} from '__internal/ui/stepper/connector';

QUnit.testStart(() => {
    const markup = '<div id="connector"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = { }, selector = '#connector') => {
            this.instance = new Connector($(selector), options);
            this.$element = $(this.instance.$element());
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


QUnit.module('Stepper connector markup', moduleConfig, () => {
    QUnit.test(`Stepper connector root element should have ${STEPPER_CONNECTOR_CLASS} class`, function(assert) {
        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_CLASS), true);
    });

    QUnit.test('Stepper root element should have horizontal class by default', function(assert) {
        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('Stepper root element should have vertical class if orientation is vertical', function(assert) {
        this.reinit({ orientation: 'vertical' });

        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('stepper root element should have correct orientation class if orientation option change at runtime', function(assert) {
        this.instance.option('orientation', 'vertical');

        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS), true);

        this.instance.option('orientation', 'horizontal');

        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS), true);
        assert.strictEqual(this.$element.hasClass(STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS), false);
    });

    QUnit.test(`connector content element should be rendered inside root container with the ${STEPPER_CONNECTOR_CONTAINER_CLASS} class`, function(assert) {
        assert.strictEqual(this.getContainer().length, 1, 'content element was rendered');
        assert.strictEqual(this.getContainer().parent().is(this.$element), true, 'content element is rendered inside root container');
    });

    QUnit.test(`connector value element should be rendered inside content with the ${STEPPER_CONNECTOR_VALUE_CLASS} class`, function(assert) {
        assert.strictEqual(this.getConnectorValue().length, 1, 'value element was rendered');
        assert.strictEqual(this.getConnectorValue().parent().is(this.getContainer()), true, 'value element is rendered inside content');
    });
});

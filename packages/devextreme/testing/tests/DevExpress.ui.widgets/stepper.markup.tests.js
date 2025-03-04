import $ from 'jquery';

import 'ui/stepper';
import {
    STEPPER_CLASS,
    STEPPER_ITEM_CLASS,
    STEPPER_VERTICAL_ORIENTATION_CLASS,
    STEPPER_HORIZONTAL_ORIENTATION_CLASS,
} from '__internal/ui/stepper/stepper';

QUnit.testStart(function() {
    const markup = '<div id="stepper"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#stepper').dxStepper(options);
            this.instance = this.$element.dxStepper('instance');
        };

        init();

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        this.getItems = () => {
            return this.$element.find(`.${STEPPER_ITEM_CLASS}`);
        };
    }
};

QUnit.module('Stepper markup', moduleConfig, () => {
    QUnit.test(`Stepper root element should have ${STEPPER_CLASS} class`, function(assert) {
        assert.strictEqual(this.$element.hasClass(STEPPER_CLASS), true);
    });

    QUnit.test('Stepper root element should have horizontal class by default', function(assert) {
        assert.strictEqual(this.$element.hasClass(STEPPER_VERTICAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(STEPPER_HORIZONTAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('Stepper root element should have vertical class if orientation is vertical', function(assert) {
        this.reinit({ orientation: 'vertical' });

        assert.strictEqual(this.$element.hasClass(STEPPER_HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(STEPPER_VERTICAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('stepper root element should have correct orientation class if orientation option change at runtime', function(assert) {
        this.instance.option('orientation', 'vertical');

        assert.strictEqual(this.$element.hasClass(STEPPER_HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(STEPPER_VERTICAL_ORIENTATION_CLASS), true);

        this.instance.option('orientation', 'horizontal');

        assert.strictEqual(this.$element.hasClass(STEPPER_HORIZONTAL_ORIENTATION_CLASS), true);
        assert.strictEqual(this.$element.hasClass(STEPPER_VERTICAL_ORIENTATION_CLASS), false);
    });
});

QUnit.module('Render', moduleConfig, () => {
    QUnit.test('with steps declared using string values', function(assert) {
        this.reinit({ dataSource: ['Pane_1', 'Pane_2', 'Pane_3'] });

        assert.strictEqual(this.getItems().length, 3);
    });

    QUnit.test('with single step', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Step_1') }] });

        assert.strictEqual(this.getItems().length, 1);
    });

    QUnit.test('with two steps', function(assert) {
        this.reinit({
            items: [{ text: 'Step_1' }, { text: 'Step_2' }]
        });

        const $items = this.getItems();

        assert.strictEqual(this.getItems().length, 2, 'stepper is rendered with two steps');

        assert.strictEqual($items.eq(0).text(), 'Step_1', 'first pane was rendered');
        assert.strictEqual($items.eq(1).text(), 'Step_2', 'second pane was rendered');
    });
});

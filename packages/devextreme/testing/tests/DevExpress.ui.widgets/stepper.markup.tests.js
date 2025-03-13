import $ from 'jquery';

import 'ui/stepper';
import {
    STEPPER_CLASS,
    STEP_CLASS,
    STEP_LIST_CLASS,
    STEP_SELECTED_CLASS,
    STEPPER_VERTICAL_ORIENTATION_CLASS,
    STEPPER_HORIZONTAL_ORIENTATION_CLASS,
    STEP_INDICATOR_CLASS,
    STEP_TEXT_CLASS,
    STEP_TITLE_CLASS,
} from '__internal/ui/stepper/stepper';

const STEP_CONTENT_CLASS = 'dx-step-content';
const ICON_CLASS = 'dx-icon';

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

        this.getStepList = () => {
            return this.$element.find(`.${STEP_LIST_CLASS}`);
        };

        this.getItems = () => {
            return this.$element.find(`.${STEP_CLASS}`);
        };

        this.getStepByIndex = (index) => {
            return this.getItems().eq(index);
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

    QUnit.test(`Selected step should have ${STEP_SELECTED_CLASS} class by default`, function(assert) {
        this.reinit({
            items: [{}, {}, {}],
            selectedIndex: 1
        });

        assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_SELECTED_CLASS), false);
        assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_SELECTED_CLASS), true);
        assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_SELECTED_CLASS), false);
    });

    QUnit.test(`Selected step should have ${STEP_SELECTED_CLASS} class after change selectedIndex at runtime`, function(assert) {
        this.reinit({
            items: [{}, {}, {}],
            selectedIndex: 1
        });

        this.instance.option('selectedIndex', 2);

        assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_SELECTED_CLASS), false);
        assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_SELECTED_CLASS), false);
        assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_SELECTED_CLASS), true);
    });

    QUnit.test(`Step content should contain indicator with ${STEP_INDICATOR_CLASS} class by default`, function(assert) {
        this.reinit({
            items: [{}],
        });

        const $stepContent = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);

        assert.strictEqual($stepContent.children().length, 1);
        assert.strictEqual($stepContent.children().eq(0).hasClass(STEP_INDICATOR_CLASS), true);
    });

    QUnit.test(`Step indicator should contain text icon with ${STEP_TEXT_CLASS} class by default`, function(assert) {
        this.reinit({
            items: [{}],
        });

        const $stepText = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`).children().eq(0);

        assert.strictEqual($stepText.children().length, 1);
        assert.strictEqual($stepText.children().eq(0).hasClass(STEP_TEXT_CLASS), true);
    });

    QUnit.test(`Step indicator should contain icon with ${ICON_CLASS} class if icon option is set`, function(assert) {
        const icon = 'test';
        this.reinit({
            items: [{
                text: 'test',
                icon,
            }],
        });

        const $stepText = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`).children().eq(0);

        assert.strictEqual($stepText.children().length, 1);
        assert.strictEqual($stepText.children().eq(0).hasClass(STEP_TEXT_CLASS), false);
        assert.strictEqual($stepText.children().eq(0).hasClass(ICON_CLASS), true);
        assert.strictEqual($stepText.children().eq(0).hasClass(`${ICON_CLASS}-${icon}`), true);
    });

    QUnit.test(`Step content should contain step title with ${STEP_TITLE_CLASS} class if title option is set`, function(assert) {
        this.reinit({
            items: [{
                title: 'test',
            }],
        });

        const $stepContent = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);

        assert.strictEqual($stepContent.children().length, 2);
        assert.strictEqual($stepContent.children().eq(1).hasClass(STEP_TITLE_CLASS), true);
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

    QUnit.test('step list element should be rendered inside root container with the correct class', function(assert) {
        this.reinit({
            items: []
        });

        assert.strictEqual(this.getStepList().length, 1, 'step list container was rendered');
        assert.strictEqual(this.getStepList().parent().is(this.$element), true, 'step list container rendered inside root container');
    });

    QUnit.test('Step items should be rendered inside the step list container', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}, {}]
        });

        assert.strictEqual(this.getStepList().children().length, 5, 'steps are rendered in the list container');
    });
});

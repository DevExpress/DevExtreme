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
import {
    STEP_COMPLETED_CLASS,
    STEP_INVALID_CLASS,
    STEP_VALID_ICON,
    STEP_INVALID_ICON,
} from '__internal/ui/stepper/stepper_item';

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

    QUnit.module('Completed steps', () => {
        QUnit.test(`Steps before selected should have ${STEP_COMPLETED_CLASS} class by default`, function(assert) {
            this.reinit({
                items: [{}, {}, {}],
                selectedIndex: 1
            });

            assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_COMPLETED_CLASS), false);
            assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_COMPLETED_CLASS), false);
        });

        QUnit.test(`Steps before selected should have ${STEP_COMPLETED_CLASS} class after selection changed`, function(assert) {
            this.reinit({
                items: [{}, {}, {}],
                selectedIndex: 0,
                linear: false,
            });

            this.getStepByIndex(2).trigger('dxclick');

            assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_COMPLETED_CLASS), false);
        });


        QUnit.test(`Steps before selected should have ${STEP_COMPLETED_CLASS} class after change selectedIndex at runtime`, function(assert) {
            this.reinit({
                items: [{}, {}, {}],
                selectedIndex: 0
            });

            this.instance.option('selectedIndex', 2);

            assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_COMPLETED_CLASS), false);
        });

        QUnit.test(`Steps before selected should have ${STEP_COMPLETED_CLASS} class after change selectedItem at runtime`, function(assert) {
            const items = [{}, {}, {}];

            this.reinit({
                items,
                selectedIndex: 0
            });

            this.instance.option('selectedItem', items[2]);

            assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_COMPLETED_CLASS), true);
            assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_COMPLETED_CLASS), false);
        });
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

QUnit.module('Step.isValid', moduleConfig, () => {
    QUnit.test(`step should have the ${STEP_INVALID_CLASS} class in invalid state`, function(assert) {
        this.reinit({
            items: [{}, { isValid: true }, { isValid: false }, { isValid: undefined }]
        });

        assert.strictEqual(this.getItems().eq(0).hasClass(STEP_INVALID_CLASS), false, 'isValid is not declared');
        assert.strictEqual(this.getItems().eq(1).hasClass(STEP_INVALID_CLASS), false, 'isValid has true value');
        assert.strictEqual(this.getItems().eq(2).hasClass(STEP_INVALID_CLASS), true, 'isValid has false value');
        assert.strictEqual(this.getItems().eq(3).hasClass(STEP_INVALID_CLASS), false, 'isValid has undefined value');
    });

    QUnit.test(`step should update the ${STEP_INVALID_CLASS} class after change isValid option at runtime`, function(assert) {
        this.reinit({
            items: [{ isValid: false }]
        });

        assert.strictEqual(this.getItems().eq(0).hasClass(STEP_INVALID_CLASS), true, `${STEP_INVALID_CLASS} is added`);

        this.instance.option('items[0].isValid', true);

        assert.strictEqual(this.getItems().eq(0).hasClass(STEP_INVALID_CLASS), false, `${STEP_INVALID_CLASS} is removed`);

        this.instance.option('items[0].isValid', false);

        assert.strictEqual(this.getItems().eq(0).hasClass(STEP_INVALID_CLASS), true, `${STEP_INVALID_CLASS} is added`);

        this.instance.option('items[0].isValid', undefined);

        assert.strictEqual(this.getItems().eq(0).hasClass(STEP_INVALID_CLASS), false, `${STEP_INVALID_CLASS} is removed`);
    });

    [
        { options: { isValid: true, icon: 'test', text: 'test' }, expectedIcon: STEP_VALID_ICON },
        { options: { isValid: false, icon: 'test', text: 'test' }, expectedIcon: STEP_INVALID_ICON },
        { options: { isValid: undefined, icon: 'test', text: 'test' }, expectedIcon: 'test' },
    ].forEach(({ options, expectedIcon }) => {
        QUnit.test(`Step indicator should contain '${expectedIcon}' icon, step options: ${JSON.stringify(options)}`, function(assert) {
            this.reinit({
                items: [options],
            });

            const $stepText = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`).children().eq(0);

            assert.strictEqual($stepText.children().length, 1);
            assert.strictEqual($stepText.children().eq(0).hasClass(STEP_TEXT_CLASS), false);
            assert.strictEqual($stepText.children().eq(0).hasClass(ICON_CLASS), true);
            assert.strictEqual($stepText.children().eq(0).hasClass(`${ICON_CLASS}-${expectedIcon}`), true);
        });

        QUnit.test(`Step indicator should be updated to '${expectedIcon}' icon after update step.isValid option at runtime`, function(assert) {
            this.reinit({
                items: [{
                    icon: 'test',
                    text: 'Step 1',
                    title: 'Step title',
                }],
            });

            this.instance.option('items[0].isValid', options.isValid);

            const $stepText = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`).children().eq(0);

            assert.strictEqual($stepText.children().length, 1);
            assert.strictEqual($stepText.children().eq(0).hasClass(STEP_TEXT_CLASS), false);
            assert.strictEqual($stepText.children().eq(0).hasClass(ICON_CLASS), true);
            assert.strictEqual($stepText.children().eq(0).hasClass(`${ICON_CLASS}-${expectedIcon}`), true);
        });
    });
});

QUnit.module('Step.hint', moduleConfig, () => {
    QUnit.test('Step should not have a title attribute if the hint is not defined', function(assert) {
        this.reinit({
            items: [{}, { hint: undefined }, { hint: null }]
        });

        const items = this.getItems();
        assert.notOk(items.eq(0).attr('title'), 'Title is not set when hint is missing');
        assert.notOk(items.eq(1).attr('title'), 'Title is not set when hint is undefined');
        assert.notOk(items.eq(2).attr('title'), 'Title is not set when hint is null');
    });

    QUnit.test('Step should have a title attribute with the correct value when hint is defined', function(assert) {
        this.reinit({
            items: [{ hint: '' }, { hint: 'hint text' }, { hint: 0 }, { hint: false }, { hint: NaN }]
        });

        const items = this.getItems();
        assert.strictEqual(items.eq(0).attr('title'), '', 'Title is correctly set for an empty string hint');
        assert.strictEqual(items.eq(1).attr('title'), 'hint text', 'Title is correctly set for a text hint');
        assert.strictEqual(items.eq(2).attr('title'), '0', 'Title is correctly set for a numeric hint');
        assert.strictEqual(items.eq(3).attr('title'), undefined, 'Title is not added when hint is false');
        assert.strictEqual(items.eq(4).attr('title'), 'NaN', 'Title is not added when hint is NaN');
    });

    QUnit.test('Step title should update when the hint option value changes at runtime', function(assert) {
        this.reinit({
            items: [{ hint: 'Hint value' }]
        });

        const items = this.getItems();
        assert.strictEqual(items.eq(0).attr('title'), 'Hint value', 'Initial title is set correctly');

        this.instance.option('items[0].hint', 'New hint value');

        assert.strictEqual(items.eq(0).attr('title'), 'New hint value', 'Title is updated when hint changes');
    });

    QUnit.test('Step title should be removed when hint is set to undefined or null', function(assert) {
        this.reinit({
            items: [{ hint: 'Initial hint' }]
        });

        const items = this.getItems();
        assert.strictEqual(items.eq(0).attr('title'), 'Initial hint', 'Initial title is set correctly');

        this.instance.option('items[0].hint', undefined);
        assert.notOk(items.eq(0).attr('title'), 'Title is removed when hint is set to undefined');

        this.instance.option('items[0].hint', 'New hint');
        assert.strictEqual(items.eq(0).attr('title'), 'New hint', 'Title is set correctly after hint update');

        this.instance.option('items[0].hint', null);
        assert.notOk(items.eq(0).attr('title'), 'Title is removed when hint is set to null');
    });
});

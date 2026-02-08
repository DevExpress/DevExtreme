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
    STEP_CAPTION_CLASS,
    STEP_LABEL_CLASS,
    STEP_OPTIONAL_MARK_CLASS,
} from '__internal/ui/stepper/stepper';
import {
    STEP_COMPLETED_CLASS,
    STEP_INVALID_CLASS,
    STEP_VALID_ICON,
    STEP_INVALID_ICON,
} from '__internal/ui/stepper/stepper_item';
import { HOVER_STATE_CLASS } from '__internal/core/widget/widget';

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

    QUnit.test(`Selected step should have ${STEP_SELECTED_CLASS} class after change selectionChanging was cancelled and Step.isValid changed`, function(assert) {
        this.reinit({
            items: [{}, {}, {}],
            selectedIndex: 0,
            onSelectionChanging: (e) => {
                e.cancel = true;
                e.component.option('items[0].isValid', false);
            },
        });

        this.getStepByIndex(1).trigger('dxclick');

        assert.strictEqual(this.getStepByIndex(0).hasClass(STEP_SELECTED_CLASS), true, 'First step has selected class');
        assert.strictEqual(this.getStepByIndex(1).hasClass(STEP_SELECTED_CLASS), false, 'Second step has not selected class');
        assert.strictEqual(this.getStepByIndex(2).hasClass(STEP_SELECTED_CLASS), false, 'Third step has not selected class');
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

    QUnit.test(`Step content should contain step label with ${STEP_LABEL_CLASS} class if label option is set`, function(assert) {
        this.reinit({
            items: [{
                label: 'test',
            }],
        });

        const $stepContent = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);
        const $stepLabel = $stepContent.children().eq(1);

        assert.strictEqual($stepContent.children().length, 2);
        assert.strictEqual($stepLabel.hasClass(STEP_CAPTION_CLASS), true);
        assert.strictEqual($stepLabel.children().length, 1);
        assert.strictEqual($stepLabel.children().eq(0).hasClass(STEP_LABEL_CLASS), true);
    });

    QUnit.test(`Step content should contain step optional mark with ${STEP_OPTIONAL_MARK_CLASS} class if optional=true`, function(assert) {
        this.reinit({
            items: [{
                optional: true,
            }],
        });

        const $stepContent = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);
        const $stepLabel = $stepContent.children().eq(1);

        assert.strictEqual($stepContent.children().length, 2);
        assert.strictEqual($stepLabel.hasClass(STEP_CAPTION_CLASS), true);
        assert.strictEqual($stepLabel.children().length, 1);
        assert.strictEqual($stepLabel.children().eq(0).hasClass(STEP_OPTIONAL_MARK_CLASS), true);
    });

    QUnit.test('Step content should contain step label and optional mark if both set', function(assert) {
        this.reinit({
            items: [{
                label: 'test',
                optional: true,
            }],
        });

        const $stepContent = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);
        const $stepLabel = $stepContent.children().eq(1);

        assert.strictEqual($stepContent.children().length, 2);
        assert.strictEqual($stepLabel.hasClass(STEP_CAPTION_CLASS), true);
        assert.strictEqual($stepLabel.children().length, 2);
        assert.strictEqual($stepLabel.children().eq(0).hasClass(STEP_LABEL_CLASS), true);
        assert.strictEqual($stepLabel.children().eq(1).hasClass(STEP_OPTIONAL_MARK_CLASS), true);
    });

    QUnit.test(`Step content should update ${STEP_LABEL_CLASS} class after change label option at runtime`, function(assert) {
        this.reinit({
            items: [{}],
        });

        const $stepContentBeforeChange = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);

        assert.strictEqual($stepContentBeforeChange.children().length, 1);

        this.instance.option('items[0].label', 'Test label');

        const $stepContent = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);
        const $stepLabel = $stepContent.children().eq(1);

        assert.strictEqual($stepContent.children().length, 2);
        assert.strictEqual($stepLabel.hasClass(STEP_CAPTION_CLASS), true);
        assert.strictEqual($stepLabel.children().length, 1);
        assert.strictEqual($stepLabel.children().eq(0).hasClass(STEP_LABEL_CLASS), true);
    });

    QUnit.test(`Step content should update ${STEP_OPTIONAL_MARK_CLASS} class after change optional option at runtime`, function(assert) {
        this.reinit({
            items: [{
                label: 'Test',
            }],
        });

        const $stepContentBeforeChange = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`);
        const $stepLabelBeforeChange = $stepContentBeforeChange.children().eq(1);

        assert.strictEqual($stepContentBeforeChange.children().length, 2);
        assert.strictEqual($stepLabelBeforeChange.hasClass(STEP_CAPTION_CLASS), true);
        assert.strictEqual($stepLabelBeforeChange.children().length, 1);

        this.instance.option('items[0].optional', true);

        const $stepLabel = this.getStepByIndex(0).find(`.${STEP_CONTENT_CLASS}`).children().eq(1);

        assert.strictEqual($stepLabel.children().length, 2);
        assert.strictEqual($stepLabel.children().eq(1).hasClass(STEP_OPTIONAL_MARK_CLASS), true);
    });

    QUnit.module('Hover steps', () => {
        QUnit.test(`Selected and neighbor items have ${HOVER_STATE_CLASS} on hover`, function(assert) {
            this.reinit({
                items: [{}, {}, {}, {}, {}],
                selectedIndex: 2,
            });

            const $selectedStep = this.getStepByIndex(3);

            $selectedStep.trigger('mouseenter');

            assert.strictEqual($selectedStep.hasClass(HOVER_STATE_CLASS), true, `Selected step has ${HOVER_STATE_CLASS} class`);

            const $prevStep = this.getStepByIndex(1);

            $selectedStep.trigger('mouseleave');
            $prevStep.trigger('mouseenter');

            assert.strictEqual($selectedStep.hasClass(HOVER_STATE_CLASS), false, `Selected step has not ${HOVER_STATE_CLASS} class`);
            assert.strictEqual($prevStep.hasClass(HOVER_STATE_CLASS), true, `Previous step has ${HOVER_STATE_CLASS} class`);

            const $nextStep = this.getStepByIndex(3);

            $prevStep.trigger('mouseleave');
            $nextStep.trigger('mouseenter');

            assert.strictEqual($prevStep.hasClass(HOVER_STATE_CLASS), false, `Previous step has not ${HOVER_STATE_CLASS} class`);
            assert.strictEqual($nextStep.hasClass(HOVER_STATE_CLASS), true, `Next step has ${HOVER_STATE_CLASS} class`);
        });

        QUnit.test(`In linear mode non-neighbor steps not have ${HOVER_STATE_CLASS} on hover`, function(assert) {
            this.reinit({
                items: [{}, {}, {}, {}, {}, {}, {}],
                selectedIndex: 2,
                linear: true,
            });

            const $stepBeforePrev = this.getStepByIndex(0);

            $stepBeforePrev.trigger('mouseenter');

            assert.strictEqual($stepBeforePrev.hasClass(HOVER_STATE_CLASS), false, `Step before previous has not ${HOVER_STATE_CLASS} class`);

            const $stepAfterNext = this.getStepByIndex(4);

            $stepAfterNext.trigger('mouseenter');

            assert.strictEqual($stepAfterNext.hasClass(HOVER_STATE_CLASS), false, `Step after next has not ${HOVER_STATE_CLASS} class`);

            const $lastStep = this.getStepByIndex(-1);

            $lastStep.trigger('mouseenter');

            assert.strictEqual($lastStep.hasClass(HOVER_STATE_CLASS), false, `Last step has not ${HOVER_STATE_CLASS} class`);
        });

        QUnit.test(`In non-linear mode non-neighbor steps have ${HOVER_STATE_CLASS} on hover`, function(assert) {
            this.reinit({
                items: [{}, {}, {}, {}, {}, {}, {}],
                selectedIndex: 2,
                linear: false,
            });

            const $stepBeforePrev = this.getStepByIndex(0);

            $stepBeforePrev.trigger('mouseenter');

            assert.strictEqual($stepBeforePrev.hasClass(HOVER_STATE_CLASS), true, `Step before previous has ${HOVER_STATE_CLASS} class`);

            const $stepAfterNext = this.getStepByIndex(4);

            $stepBeforePrev.trigger('mouseleave');
            $stepAfterNext.trigger('mouseenter');

            assert.strictEqual($stepBeforePrev.hasClass(HOVER_STATE_CLASS), false, `Step before previous has not ${HOVER_STATE_CLASS} class`);
            assert.strictEqual($stepAfterNext.hasClass(HOVER_STATE_CLASS), true, `Step after next has ${HOVER_STATE_CLASS} class`);

            const $lastStep = this.getStepByIndex(-1);

            $stepAfterNext.trigger('mouseleave');
            $lastStep.trigger('mouseenter');

            assert.strictEqual($stepAfterNext.hasClass(HOVER_STATE_CLASS), false, `Step after next has not ${HOVER_STATE_CLASS} class`);
            assert.strictEqual($lastStep.hasClass(HOVER_STATE_CLASS), true, `Last step has ${HOVER_STATE_CLASS} class`);
        });
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
                    label: 'Step label',
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
        assert.strictEqual(items.eq(0).attr('title'), undefined, 'Title is not set when hint is missing');
        assert.strictEqual(items.eq(1).attr('title'), undefined, 'Title is not set when hint is undefined');
        assert.strictEqual(items.eq(2).attr('title'), undefined, 'Title is not set when hint is null');
    });

    QUnit.test('Step should have a title attribute with the correct value when hint is defined', function(assert) {
        this.reinit({
            items: [{ hint: '' }, { hint: 'hint text' }, { hint: 0 }, { hint: true }, { hint: NaN }]
        });

        const items = this.getItems();
        assert.strictEqual(items.eq(0).attr('title'), '', 'Title is correctly set for an empty string hint');
        assert.strictEqual(items.eq(1).attr('title'), 'hint text', 'Title is correctly set for a text hint');
        assert.strictEqual(items.eq(2).attr('title'), '0', 'Title is correctly set for a numeric hint');
        assert.strictEqual(items.eq(3).attr('title'), 'true', 'Title is correctly set when hint is boolean');
        assert.strictEqual(items.eq(4).attr('title'), 'NaN', 'Title is correctly set when hint is NaN');
    });

    QUnit.test('Step label should update when the hint option value changes at runtime', function(assert) {
        this.reinit({
            items: [{ hint: 'Hint value' }]
        });

        const items = this.getItems();
        assert.strictEqual(items.eq(0).attr('title'), 'Hint value', 'Initial title is set correctly');

        this.instance.option('items[0].hint', 'New hint value');

        assert.strictEqual(items.eq(0).attr('title'), 'New hint value', 'Title is updated when hint changes');
    });

    QUnit.test('Step label should be removed when hint is set to undefined or null', function(assert) {
        this.reinit({
            items: [{ hint: 'Initial hint' }]
        });

        const items = this.getItems();
        assert.strictEqual(items.eq(0).attr('title'), 'Initial hint', 'Initial title is set correctly');

        this.instance.option('items[0].hint', undefined);
        assert.strictEqual(items.eq(0).attr('title'), undefined, 'Title is removed when hint is set to undefined');

        this.instance.option('items[0].hint', 'New hint');
        assert.strictEqual(items.eq(0).attr('title'), 'New hint', 'Title is set correctly after hint update');

        this.instance.option('items[0].hint', null);
        assert.strictEqual(items.eq(0).attr('title'), undefined, 'Title is removed when hint is set to null');
    });
});

QUnit.module('Aria accessibility', moduleConfig, () => {
    QUnit.test('Stepper root element should have role=tablist', function(assert) {
        assert.strictEqual(this.$element.attr('role'), 'tablist');
    });

    ['horizontal', 'vertical'].forEach((orientation) => {
        QUnit.test(`Root element for ${orientation} stepper should have aria-orientation=${orientation}`, function(assert) {
            this.reinit({
                orientation,
            });

            assert.strictEqual(this.$element.attr('aria-orientation'), orientation);
        });
    });

    [
        { initial: 'horizontal', updated: 'vertical' },
        { initial: 'vertical', updated: 'horizontal' },
    ].forEach((orientation) => {
        QUnit.test(`Root element for ${orientation} stepper should have aria-orientation=${orientation.updated} after change orientation in runtime`, function(assert) {
            this.reinit({
                orientation: orientation.initial,
            });

            this.instance.option('orientation', orientation.updated);

            assert.strictEqual(this.$element.attr('aria-orientation'), orientation.updated);
        });
    });

    QUnit.test('Step element should have role=tab', function(assert) {
        this.reinit({
            items: [{}],
        });

        assert.strictEqual(this.getStepByIndex(0).attr('role'), 'tab');
    });

    QUnit.test('Selected step element should have aria-selected=true', function(assert) {
        this.reinit({
            items: [{}, {}, {}],
            selectedIndex: 1,
        });

        assert.strictEqual(this.getStepByIndex(0).attr('aria-selected'), 'false', 'First step has aria-selected=false');
        assert.strictEqual(this.getStepByIndex(1).attr('aria-selected'), 'true', 'Second step has aria-selected=true');
        assert.strictEqual(this.getStepByIndex(2).attr('aria-selected'), 'false', 'Third step has aria-selected=false');
    });

    QUnit.test('Selected step should have aria-selected=true after change selectedIndex at runtime', function(assert) {
        this.reinit({
            items: [{}, {}, {}],
            selectedIndex: 1
        });

        this.instance.option('selectedIndex', 2);

        assert.strictEqual(this.getStepByIndex(0).attr('aria-selected'), 'false', 'First step has aria-selected=false');
        assert.strictEqual(this.getStepByIndex(1).attr('aria-selected'), 'false', 'Second step has aria-selected=false');
        assert.strictEqual(this.getStepByIndex(2).attr('aria-selected'), 'true', 'Third step has aria-selected=true');
    });

    QUnit.test('Disabled step element should have aria-disabled=true', function(assert) {
        this.reinit({
            items: [{}, { disabled: true }, {}],
        });

        assert.strictEqual(this.getStepByIndex(0).attr('aria-disabled'), undefined, 'First step has no aria-disabled attribute');
        assert.strictEqual(this.getStepByIndex(1).attr('aria-disabled'), 'true', 'Second step has aria-selected=true');
        assert.strictEqual(this.getStepByIndex(2).attr('aria-disabled'), undefined, 'Third step has no aria-disabled attribute');
    });

    QUnit.test('Disabled step should have aria-disabled=true after disabling step at runtime', function(assert) {
        this.reinit({
            items: [{}, {}, {}],
        });

        this.instance.option('items[1].disabled', true);

        assert.strictEqual(this.getStepByIndex(0).attr('aria-disabled'), undefined, 'First step has no aria-disabled attribute');
        assert.strictEqual(this.getStepByIndex(1).attr('aria-disabled'), 'true', 'Second step has aria-selected=true');
        assert.strictEqual(this.getStepByIndex(2).attr('aria-disabled'), undefined, 'Third step has no aria-disabled attribute');
    });
});

import $ from 'jquery';
import Stepper from 'ui/stepper';

import keyboardMock from '../../helpers/keyboardMock.js';
import Connector, {
    STEPPER_CONNECTOR_CLASS,
} from '__internal/ui/stepper/connector';

import {
    STEP_CLASS,
    STEP_INDICATOR_CLASS,
    STEP_TITLE_CLASS,
} from '__internal/ui/stepper/stepper';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="stepper"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = { }, selector = '#stepper') => {
            this.$element = $(selector).dxStepper(options);
            this.$connector = this.$element.find(`.${STEPPER_CONNECTOR_CLASS}`);
            this.instance = this.$element.dxStepper('instance');
        };

        init();

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
        };

        this.getItems = () => {
            return this.$element.find(`.${STEP_CLASS}`);
        };

        this.getConnector = () => {
            return Connector.getInstance(this.$connector);
        };
    }
};

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('Stepper should be initialized with Stepper type', function(assert) {
        assert.ok(this.instance instanceof Stepper);
    });

    QUnit.test('items count should be the same as datasource items count', function(assert) {
        this.reinit({ dataSource: [{ text: 'Step_1' }, { text: 'Step_2' }, { text: 'Step_3' }] });

        assert.strictEqual(this.getItems().length, 3);
    });

    QUnit.test('items should be able to be initialized with template', function(assert) {
        this.reinit({
            dataSource: [{
                template: () => $('<div>').text('Pane 1') }, {
                template: () => $('<div>').text('Pane 2') }, {
                template: () => $('<div>').text('Pane 3') }
            ],
        });

        assert.strictEqual(this.getItems().length, 3);
    });
});

QUnit.module('Navigation', moduleConfig, () => {
    QUnit.test('In linear mode only next or previous steps can be selected on click', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}],
            selectedIndex: 1,
            linear: true,
        });

        this.getItems().eq(3).trigger('dxclick');

        assert.equal(this.instance.option('selectedIndex'), 1, 'selectedIndex not changed');

        this.getItems().eq(2).trigger('dxclick');

        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex changed');
    });

    [true, false].forEach((linear) => {
        QUnit.test(`selectionChanged callback should not be triggered when is already selected, linear=${linear}`, function(assert) {
            let count = 0;

            this.reinit({
                items: [{}, {}, {}, {}],
                selectedIndex: 1,
                linear,
                onSelectionChanged: function(e) {
                    count += 1;
                },
            });

            this.getItems().eq(2)
                .trigger('dxclick')
                .trigger('dxclick');

            assert.equal(count, 1, 'action triggered only once');
            assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex changed');
        });
    });

    QUnit.test('In linear mode only next or previous steps can be selected by keyboard (selectOnFocus=false)', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}],
            selectedIndex: 1,
            linear: true,
            selectOnFocus: false,
        });

        const keyboard = keyboardMock(this.$element);

        keyboard
            .keyDown('right')
            .keyDown('right')
            .keyDown('enter');

        assert.equal(this.instance.option('selectedIndex'), 1, 'selectedIndex not changed');

        keyboard
            .keyDown('left')
            .keyDown('enter');

        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex changed');
    });

    QUnit.test('In linear mode Home/End keys should select previous/next item', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}],
            selectedIndex: 1,
            linear: true,
        });

        const keyboard = keyboardMock(this.$element);

        keyboard.keyDown('end');

        assert.equal(this.instance.option('selectedIndex'), 2, 'selected next item');

        keyboard.keyDown('home');

        assert.equal(this.instance.option('selectedIndex'), 1, 'selected previous item');
    });

    QUnit.test('Connector value should change on selection changed', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}, {}],
            selectedIndex: 1,
            linear: false,
        });

        assert.equal(this.getConnector().option('value'), '25%', 'initial connector value is correct');

        this.getItems().eq(3).trigger('dxclick');

        assert.equal(this.getConnector().option('value'), '75%', 'connector value changed');
    });

    QUnit.test('Connector value should change if selectedIndex changed in runtime', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}, {}],
            selectedIndex: 1,
            linear: false,
        });

        assert.equal(this.getConnector().option('value'), '25%', 'initial connector value is correct');

        this.instance.option('selectedIndex', 3);

        assert.equal(this.getConnector().option('value'), '75%', 'connector value changed');
    });

    QUnit.test('Connector value should change if selectedItem changed in runtime', function(assert) {
        const items = [{}, {}, {}, {}, {}];
        this.reinit({
            items,
            selectedIndex: 1,
            linear: false,
        });

        assert.equal(this.getConnector().option('value'), '25%', 'initial connector value is correct');

        this.instance.option('selectedItem', items[3]);

        assert.equal(this.getConnector().option('value'), '75%', 'connector value changed');
    });
});

QUnit.module('Item data', moduleConfig, () => {
    QUnit.test('Item indicator should contain item 1-based index by default', function(assert) {
        this.reinit({
            items: [{}, {}, {}],
        });

        const $steps = this.getItems();
        const getIndicatorText = (index) => $steps.eq(index).find(`.${STEP_INDICATOR_CLASS}`).text();

        assert.strictEqual(getIndicatorText(0), '1');
        assert.strictEqual(getIndicatorText(1), '2');
        assert.strictEqual(getIndicatorText(2), '3');
    });

    QUnit.test('Item text option should overwrite default indicator text', function(assert) {
        this.reinit({
            items: [{ text: 'test1' }, { text: 'test2' }, {}],
        });

        const $steps = this.getItems();
        const getIndicatorText = (index) => $steps.eq(index).find(`.${STEP_INDICATOR_CLASS}`).text();

        assert.strictEqual(getIndicatorText(0), 'test1');
        assert.strictEqual(getIndicatorText(1), 'test2');
        assert.strictEqual(getIndicatorText(2), '3');
    });

    QUnit.test('Item should have title that is passed in options', function(assert) {
        this.reinit({
            items: [
                { title: 'Step 1' },
                { text: 'Step 2', title: 'Step 2' },
                { icon: 'test', title: 'Step 3' }
            ],
        });

        const $steps = this.getItems();
        const getStepTitle = (index) => $steps.eq(index).find(`.${STEP_TITLE_CLASS}`).text();

        assert.strictEqual(getStepTitle(0), 'Step 1');
        assert.strictEqual(getStepTitle(1), 'Step 2');
        assert.strictEqual(getStepTitle(2), 'Step 3');
    });
});

QUnit.module('Connector integration', moduleConfig, () => {
    QUnit.test('orientation should be passed to connector on initialization', function(assert) {
        this.reinit({ orientation: 'vertical' });

        assert.deepEqual(this.getConnector().option('orientation'), 'vertical', 'orientation value is passed');
    });

    QUnit.test('orientation should be passed to connector at runtime', function(assert) {
        this.instance.option({ orientation: 'vertical' });

        assert.deepEqual(this.getConnector().option('orientation'), 'vertical', 'orientation value is passed');
    });
});

QUnit.module('Focus', moduleConfig, () => {
    QUnit.test('focusedElement should be cleared after focusout, and the selected step should have focus class after focusing', function(assert) {
        this.reinit({
            items: [{}, {}, {}, {}],
            selectedIndex: 1,
            linear: false,
            selectOnFocus: false,
        });

        const keyboard = keyboardMock(this.$element);

        keyboard
            .keyDown('right')
            .keyDown('right');

        assert.equal(this.getItems().eq(3).hasClass('dx-state-focused'), true, 'focused class is added');

        this.$element.focusout();

        assert.equal(this.getItems().eq(3).hasClass('dx-state-focused'), false, 'focused class is removed after focusout');
        assert.equal(this.instance.option('focusedElement'), null, 'focusedElement is cleared after focusout');

        this.$element.focus();

        assert.equal(this.getItems().eq(1).hasClass('dx-state-focused'), true, 'focused class is applied to the selected element after focusing');
    });
});

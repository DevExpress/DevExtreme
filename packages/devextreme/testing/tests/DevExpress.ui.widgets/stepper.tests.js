import $ from 'jquery';
import 'ui/splitter';

import Stepper from 'ui/stepper';

import 'generic_light.css!';

import {
    STEPPER_ITEM_CLASS
} from '__internal/ui/stepper/stepper';

QUnit.testStart(() => {
    const markup = '<div id="stepper"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = { }, selector = '#stepper') => {
            this.$element = $(selector).dxStepper(options);
            this.instance = this.$element.dxStepper('instance');
        };

        init();

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
        };

        this.getItems = () => {
            return this.$element.find(`.${STEPPER_ITEM_CLASS}`);
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

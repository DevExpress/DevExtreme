const $ = require('jquery');
const ko = require('knockout');

require('integration/knockout');
require('ui/text_box');
require('ui/validation_group');
require('ui/validator');

const customers = [{
    ID: 1,
    CompanyName: 'Super Mart of the West',
}, {
    ID: 2,
    CompanyName: 'Electronics Depot',
}];

QUnit.testStart(function() {
    const markup =
    `<div>
        <div id="textBox" data-bind="dxTextBox: getOptions({
            value: value, inputAttr: { 'aria-label': displayName }
            })">
        </div>
        <div data-bind="dxValidationGroup: {}">
            <div id="textBoxValid" data-bind="dxTextBox: getOptions({
                value: value, inputAttr: { 'aria-label': displayName }
                }),
                dxValidator: {}">
            </div>
        </div>
    </div>`;

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        this.index = ko.observable(0);
        this.computed = ko.pureComputed(() => {
            const currentCustomer = customers[this.index()];
            return {
                placeholder: currentCustomer.CompanyName,
            };
        });
        this.viewModel = {
            getOptions: (options) => {
                const otherOptions = this.computed();
                return $.extend({}, options, otherOptions);
            },
            value: '',
            displayName: ko.pureComputed(() => `Test${this.index()}`)

        };
    }
};

QUnit.module('attributes config', moduleConfig);
QUnit.test('knockout should be able to write into computed(T1141816)', function(assert) {
    ko.applyBindings(this.viewModel, document.getElementById('textBox'));
    const input = $('#textBox input');

    assert.equal(input.attr('aria-label'), 'Test0');
    this.index((this.index() + 1) % 10);
    assert.equal(input.attr('aria-label'), 'Test1');
});

QUnit.test('recursion should not be infinite if validationGroup is set to option', function(assert) {
    ko.applyBindings(this.viewModel, document.getElementById('textBoxValid'));
    const input = $('#textBoxValid input');

    assert.equal(input.attr('aria-label'), 'Test0');
    this.index((this.index() + 1) % 10);
    assert.equal(input.attr('aria-label'), 'Test1');
});

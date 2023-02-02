const $ = require('jquery');
const ko = require('knockout');

require('integration/knockout');
require('ui/text_box');

QUnit.testStart(function() {
    const markup =
        `<div id="textBox" data-bind="dxTextBox: getOptions({
            value: value, inputAttr: { 'aria-label': displayName }
            })">
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.test('knockout should be able to write into computed(T1141816)', function(assert) {
    const customers = [{
        ID: 1,
        CompanyName: 'Super Mart of the West',
    }, {
        ID: 2,
        CompanyName: 'Electronics Depot',
    }];
    const computed = ko.pureComputed(() => {
        const currentCustomer = customers[index()];
        return {
            placeholder: currentCustomer.CompanyName,
        };
    });
    const index = ko.observable(0);

    const viewModel = {
        getOptions: (options) => {
            const otherOptions = computed();
            return $.extend({}, options, otherOptions);
        },
        value: '',
        displayName: ko.pureComputed(() => `Test${index()}`)

    };
    ko.applyBindings(viewModel, document.getElementById('textBox'));
    const input = $('#textBox input');

    assert.equal(input.attr('aria-label'), 'Test0');
    index((index() + 1) % 10);
    assert.equal(input.attr('aria-label'), 'Test1');
});

const $ = require('jquery');
const ko = require('knockout');

require('ui/text_box');
require('integration/knockout');

if(QUnit.urlParams['nojquery'] && QUnit.urlParams['nocsp']) {
    QUnit.module('textBox');
} else {
    QUnit.module.skip('textBox');
}

QUnit.testStart(function() {
    const markup = '<div id="text-box" data-bind="dxTextBox: { placeholder: placeholder }">';

    $('#qunit-fixture').html(markup);
});

const PLACEHOLDER_CLASS = 'dx-placeholder';

QUnit.test('text box placeholder must have a string value', function(assert) {
    const $textBox = $('#text-box');

    ko.applyBindings({ placeholder: ko.computed(_ => 'CUSTOM') }, $textBox.get(0));

    const $placeholder = $textBox.find(`.${PLACEHOLDER_CLASS}`);

    assert.strictEqual($placeholder.attr('data-dx_placeholder'), 'CUSTOM',);
});

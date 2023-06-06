const $ = require('jquery');
const ko = require('knockout');

const TextBox = require('ui/text_box');
require('integration/knockout');

if(QUnit.urlParams['nojquery'] && QUnit.urlParams['nocsp']) {
    QUnit.module('textBox');
} else {
    QUnit.module.skip('textBox');
}

QUnit.testStart(function() {
    const markup = '<div id="text-box">';

    $('#qunit-fixture').html(markup);
});

const PLACEHOLDER_CLASS = 'dx-placeholder';

QUnit.test('text box placeholder must have a string value', function(assert) {
    const $textBox = $('#text-box');

    new TextBox($textBox, { placeholder: ko.computed(_ => 'CUSTOM') });

    const $placeholder = $textBox.find(`.${PLACEHOLDER_CLASS}`);

    assert.strictEqual($placeholder.attr('data-dx_placeholder'), 'CUSTOM',);
});

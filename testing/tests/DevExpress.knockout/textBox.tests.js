import ko from 'knockout';
import TextBox from 'ui/text_box';

import 'integration/knockout';

const PLACEHOLDER_CLASS = 'dx-placeholder';

const shouldRunTest = QUnit.urlParams['nojquery'] && QUnit.urlParams['nocsp'];

if(shouldRunTest) {
    QUnit.module('textBox');
} else {
    QUnit.module.skip('textBox');
}

QUnit.testStart(function() {
    const textBoxContainer = document.createElement('div');

    textBoxContainer.setAttribute('id', 'text-box');

    document.getElementById('qunit-fixture').appendChild(textBoxContainer);
});

QUnit.test('text box placeholder must have a string value', function(assert) {
    const $textBox = document.getElementById('text-box');

    new TextBox($textBox, { placeholder: ko.computed(_ => 'CUSTOM') });

    const $placeholder = document.getElementsByClassName(PLACEHOLDER_CLASS)[0];

    assert.strictEqual($placeholder.getAttribute('data-dx_placeholder'), 'CUSTOM');
});

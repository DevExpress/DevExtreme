import $ from 'jquery';
import { dropDownEditorsList } from '../../helpers/widgetsList.js';

import { widgetTestModule, WIDGET_AMOUNT_PER_FILE } from './dropDownParts/dropDownOptions.tests.js';

const dropDownEditorsNames = Object.keys(dropDownEditorsList);

QUnit.testStart(function() {
    const markup = '<div id="editor"></div>\
    <div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

dropDownEditorsNames.slice(WIDGET_AMOUNT_PER_FILE * 4).forEach(widgetTestModule);

QUnit.test('editors splitted by WIDGET_AMOUNT_PER_FILE=2', function(assert) {
    assert.strictEqual(dropDownEditorsNames.length <= WIDGET_AMOUNT_PER_FILE * 5, true, 'amount of tested editors is correct, if not -- move extras to separate file');
});

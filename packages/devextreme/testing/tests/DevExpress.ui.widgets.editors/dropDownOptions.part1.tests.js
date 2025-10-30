import $ from 'jquery';
import { dropDownEditorsList } from '../../helpers/widgetsList.js';

import { widgetTestModule } from './dropDownParts/dropDownOptions.tests.js';

const dropDownEditorsNames = Object.keys(dropDownEditorsList);

QUnit.testStart(function() {
    const markup = '<div id="editor"></div>\
    <div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

dropDownEditorsNames.slice(0, 2).forEach(widgetTestModule);

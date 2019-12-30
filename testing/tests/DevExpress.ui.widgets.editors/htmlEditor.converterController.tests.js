import $ from 'jquery';

import 'common.css!';

QUnit.testStart(() => {
    const markup = '<div id="htmlEditor"></div>';

    $('#qunit-fixture').html(markup);
});

import './htmlEditorParts/converterController.tests.js';

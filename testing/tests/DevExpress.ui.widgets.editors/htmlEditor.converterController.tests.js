import $ from 'jquery';

import 'common.css!';
import '../../helpers/ignoreQuillTimers.js';

QUnit.testStart(() => {
    const markup = '<div id="htmlEditor"></div>';

    $('#qunit-fixture').html(markup);
});

import './htmlEditorParts/converterController.tests.js';

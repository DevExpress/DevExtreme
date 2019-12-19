import $ from 'jquery';
import 'common.css!';

QUnit.testStart(() => {
    const markup = '<div id="fileManager"></div>';
    $('#qunit-fixture').html(markup);
});

import './fileManagerParts/markup.tests.js';
import './fileManagerParts/contextMenu.tests.js';
import './fileManagerParts/detailsView.tests.js';
import './fileManagerParts/toolbar.tests.js';
import './fileManagerParts/navigation.tests.js';
import './fileManagerParts/editing.tests.js';
import './fileManagerParts/adaptivity.tests.js';

import './fileManagerParts/ajaxProvider.tests.js';
import './fileManagerParts/arrayProvider.tests.js';
import './fileManagerParts/webAPIProvider.tests.js';

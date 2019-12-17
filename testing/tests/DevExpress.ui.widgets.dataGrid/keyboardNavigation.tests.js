QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

import $ from 'jquery';
import './keyboardNavigationParts/keyboardController.tests.js';
import './keyboardNavigationParts/keyboardKeys.tests.js';
import './keyboardNavigationParts/rowsView.tests.js';
import './keyboardNavigationParts/realControllers.tests.js';
import './keyboardNavigationParts/customization.tests.js';
import './keyboardNavigationParts/accessibility.tests.js';

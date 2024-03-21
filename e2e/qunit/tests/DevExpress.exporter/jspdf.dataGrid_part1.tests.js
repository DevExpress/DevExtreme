import $ from 'jquery';
import 'ui/data_grid';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

import './jspdfParts/jspdf.dataGrid.table.tests.js';
import './jspdfParts/jspdf.dataGrid.multiline.tests.js';
import './jspdfParts/jspdf.dataGrid.wordwrap.tests.js';
import './jspdfParts/jspdf.dataGrid.styles.tests.js';
import './jspdfParts/jspdf.dataGrid.borderColors.tests.js';
import './jspdfParts/jspdf.dataGrid.borderWidths.tests.js';
import './jspdfParts/jspdf.dataGrid.bands.tests.js';

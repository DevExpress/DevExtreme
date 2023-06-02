import $ from 'jquery';
import 'ui/data_grid';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

import './jspdfParts/jspdf.dataGrid.customDrawCell.tests.js';
import './jspdfParts/jspdf.dataGrid.splitting.tests.js';
import './jspdfParts/jspdf.dataGrid.splittingMultipageRow.tests.js';
import './jspdfParts/jspdf.dataGrid.measureUnits.tests.js';
import './jspdfParts/jspdf.dataGrid.columnDataTypes.tests.js';
import './jspdfParts/jspdf.dataGrid.columnDataFormats.tests.js';
import './jspdfParts/jspdf.dataGrid.loadPanel.tests.js';
import './jspdfParts/jspdf.dataGrid.options.tests.js';


import $ from 'jquery';
import 'ui/data_grid';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

import './jspdfParts/jspdf.dataGrid.grouping.tests.js';
import './jspdfParts/jspdf.dataGrid.summaries.tests.js';
import './jspdfParts/jspdf.dataGrid.verticalAlign.tests.js';
import './jspdfParts/jspdf.dataGrid.horizontalAlign.tests.js';
import './jspdfParts/jspdf.dataGrid.pageMargin.tests.js';
import './jspdfParts/jspdf.dataGrid.columnAutoWidth.tests.js';

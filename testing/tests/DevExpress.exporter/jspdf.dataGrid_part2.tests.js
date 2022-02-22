import $ from 'jquery';

import 'ui/data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdfParts/v3/jspdf_v3.dataGrid_utils.js';

import { JSPdfGroupingTests } from './jspdfParts/v3/jspdf_v3.dataGrid.grouping.tests.js';
import { JSPdfSummariesTests } from './jspdfParts/v3/jspdf_v3.dataGrid.summaries.tests.js';
import { JSPdfVerticalAlignTests } from './jspdfParts/v3/jspdf_v3.dataGrid.verticalAlign.tests.js';
import { JSPdfHorizontalAlignTests } from './jspdfParts/v3/jspdf_v3.dataGrid.horizontalAlign.tests.js';
import { JSPdfPageMarginsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.pageMargin.tests.js';
import { JSPdfColumnWidthsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.columnAutoWidth.tests.js';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

JSPdfGroupingTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfSummariesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfVerticalAlignTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfHorizontalAlignTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnWidthsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfPageMarginsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);

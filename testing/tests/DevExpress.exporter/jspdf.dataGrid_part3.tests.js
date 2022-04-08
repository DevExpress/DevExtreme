import $ from 'jquery';

import 'ui/data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdfParts/v3/jspdf_v3.dataGrid_utils.js';

import { JSPdfCustomDrawCellTests } from './jspdfParts/v3/jspdf_v3.dataGrid.customDrawCell.tests.js';
import { JSPdfSplittingTests } from './jspdfParts/v3/jspdf_v3.dataGrid.splitting.tests.js';
import { JSPdfMeasureUnitsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.measureUnits.tests.js';
import { JSPdfColumnDataTypesTests } from './jspdfParts/v3/jspdf_v3.dataGrid.columnDataTypes.tests.js';
import { JSPdfColumnDataFormatsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.columnDataFormats.tests.js';
import { JSPdfLoadPanelTests } from './jspdfParts/v3/jspdf_v3.dataGrid.loadPanel.tests.js';
import { JSPdfOptionsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.options.tests.js';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

JSPdfCustomDrawCellTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfSplittingTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfMeasureUnitsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnDataTypesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnDataFormatsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfLoadPanelTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfOptionsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);

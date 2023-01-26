import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { LoadPanelTests } from '../commonParts/loadPanel.tests.js';
import { moduleConfig, createDataGrid } from './jspdf.dataGrid_utils.js';

[
    { enabled: true },
    { enabled: false },
    { enabled: 'auto' },
    {},
    null,
    undefined,
    false,
    true,
].forEach((loadPanel) => {
    LoadPanelTests.runTests(moduleConfig, exportDataGrid, (options) => createDataGrid(options),
        {
            dataSource: [{ f1: 'f1_1' }],
            loadPanel,
        }, 'jsPDFDocument');
});

LoadPanelTests.runTests(moduleConfig, exportDataGrid, (options) => createDataGrid(options),
    {
        dataSource: [{ f1: 'f1_1' }],
    }, 'jsPDFDocument');

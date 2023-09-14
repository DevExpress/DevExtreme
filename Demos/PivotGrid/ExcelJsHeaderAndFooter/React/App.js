import React from 'react';

import PivotGrid, {
  FieldChooser,
  FieldPanel,
  Export,
} from 'devextreme-react/pivot-grid';
import CheckBox from 'devextreme-react/check-box';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';

import { sales } from './data.js';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    expanded: true,
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
    filterValues: [[2013], [2014], [2015]],
    expanded: false,
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }, {
    caption: 'Country',
    dataField: 'country',
    area: 'filter',
  }],
  store: sales,
});

const App = () => {
  const [exportDataFieldHeaders, setExportDataFieldHeaders] = React.useState(false);
  const [exportRowFieldHeaders, setExportRowFieldHeaders] = React.useState(false);
  const [exportColumnFieldHeaders, setExportColumnFieldHeaders] = React.useState(false);
  const [exportFilterFieldHeaders, setExportFilterFieldHeaders] = React.useState(false);

  const onExporting = React.useCallback((e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    worksheet.columns = [
      { width: 30 }, { width: 20 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
    ];

    exportPivotGrid({
      component: e.component,
      worksheet,
      topLeftCell: { row: 4, column: 1 },
      keepColumnWidths: false,
      exportDataFieldHeaders,
      exportRowFieldHeaders,
      exportColumnFieldHeaders,
      exportFilterFieldHeaders,
    }).then((cellRange) => {
      // Header
      const headerRow = worksheet.getRow(2);
      headerRow.height = 30;

      const columnFromIndex = worksheet.views[0].xSplit + 1;
      const columnToIndex = columnFromIndex + 3;
      worksheet.mergeCells(2, columnFromIndex, 2, columnToIndex);

      const headerCell = headerRow.getCell(columnFromIndex);
      headerCell.value = 'Sales Amount by Region';
      headerCell.font = { name: 'Segoe UI Light', size: 22, bold: true };
      headerCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

      // Footer
      const footerRowIndex = cellRange.to.row + 2;
      const footerCell = worksheet.getRow(footerRowIndex).getCell(cellRange.to.column);
      footerCell.value = 'www.wikipedia.org';
      footerCell.font = { color: { argb: 'BFBFBF' }, italic: true };
      footerCell.alignment = { horizontal: 'right' };
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
      });
    });
  }, [
    exportColumnFieldHeaders,
    exportDataFieldHeaders,
    exportFilterFieldHeaders,
    exportRowFieldHeaders,
  ]);

  return (
    <React.Fragment>
      <div className="long-title">
        <h3>Sales Amount by Region</h3>
      </div>
      <PivotGrid
        dataSource={dataSource}
        height={440}
        showBorders={true}
        allowSorting={true}
        allowFiltering={true}
        onExporting={onExporting}
      >
        <FieldPanel
          showDataFields={true}
          showRowFields={true}
          showColumnFields={true}
          showFilterFields={true}
          allowFieldDragging={true}
          visible={true}>
        </FieldPanel>
        <FieldChooser enabled={false} />
        <Export enabled={true} />
      </PivotGrid>
      <div className="export-options">
        <div className="caption">Export Options</div>
        <div className="options">
          <CheckBox id="export-data-field-headers"
            value={exportDataFieldHeaders}
            onValueChange={setExportDataFieldHeaders}
            text="Export Data Field Headers" />
          <CheckBox id="export-row-field-headers"
            value={exportRowFieldHeaders}
            onValueChange={setExportRowFieldHeaders}
            text="Export Row Field Headers" />
          <CheckBox id="export-column-field-headers"
            value={exportColumnFieldHeaders}
            onValueChange={setExportColumnFieldHeaders}
            text="Export Column Field Headers" />
          <CheckBox id="export-filter-field-headers"
            value={exportFilterFieldHeaders}
            onValueChange={setExportFilterFieldHeaders}
            text="Export Filter Field Headers" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;

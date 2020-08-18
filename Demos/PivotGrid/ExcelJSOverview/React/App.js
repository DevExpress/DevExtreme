import React from 'react';

import PivotGrid, {
  FieldChooser,
  Export
} from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from 'file-saver';
*/
import { exportPivotGrid } from 'devextreme/excel_exporter';

import { sales } from './data.js';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    dataField: 'region',
    area: 'row',
    expanded: true
  }, {
    caption: 'City',
    dataField: 'city',
    area: 'row',
    width: 150
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
    expanded: true
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    area: 'data',
    summaryType: 'sum',
    format: 'currency',
  }],
  store: sales
});

export default function App() {
  const onExporting = (e) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    exportPivotGrid({
      component: e.component,
      worksheet: worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
      });
    });
    e.cancel = true;
  };

  return (
    <React.Fragment>
      <PivotGrid
        dataSource={dataSource}
        height={440}
        showBorders={true}
        rowHeaderLayout="tree"
        onExporting={onExporting}
      >
        <FieldChooser enabled={false} />
        <Export enabled={true} />
      </PivotGrid>
    </React.Fragment>
  );
}

import React from 'react';
import DataGrid, {
  Column, Grouping, Export, Selection, Paging, Pager,
} from 'devextreme-react/data-grid';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { customers } from './data.js';

const exportFormats = ['pdf'];
const onExporting = (e) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();
  exportDataGrid({
    jsPDFDocument: doc,
    component: e.component,
    indent: 5,
  }).then(() => {
    doc.save('Companies.pdf');
  });
};
const App = () => (
  <DataGrid
    dataSource={customers}
    keyExpr="ID"
    allowColumnReordering={true}
    showBorders={true}
    onExporting={onExporting}
  >
    <Selection mode="multiple" />
    <Grouping autoExpandAll={true} />
    <Paging defaultPageSize={10} />
    <Export
      enabled={true}
      formats={exportFormats}
      allowExportSelectedData={true}
    />
    <Pager visible={true} />

    <Column
      dataField="CompanyName"
      dataType="string"
    />
    <Column
      dataField="Phone"
      dataType="string"
    />
    <Column
      dataField="Fax"
      dataType="string"
    />
    <Column
      dataField="City"
      dataType="string"
    />
    <Column
      dataField="State"
      dataType="string"
      groupIndex={0}
    />
  </DataGrid>
);
export default App;

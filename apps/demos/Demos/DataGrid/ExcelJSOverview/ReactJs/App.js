import React from 'react';
import DataGrid, {
  Column,
  Export,
  Selection,
  GroupPanel,
  Grouping,
} from 'devextreme-react/data-grid';
import { Workbook } from 'devextreme-exceljs-fork';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme-react/common/export/excel';
import { employees } from './data.js';

const onExporting = (e) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Main sheet');
  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
    });
  });
};
const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={employees}
    keyExpr="ID"
    width="100%"
    showBorders={true}
    onExporting={onExporting}
  >
    <Selection mode="multiple" />
    <GroupPanel visible={true} />
    <Grouping autoExpandAll={true} />

    <Column dataField="FirstName" />
    <Column dataField="LastName" />
    <Column dataField="City" />
    <Column
      dataField="State"
      groupIndex={0}
    />
    <Column
      dataField="Position"
      width={130}
    />
    <Column
      dataField="BirthDate"
      dataType="date"
      width={100}
    />
    <Column
      dataField="HireDate"
      dataType="date"
      width={100}
    />

    <Export
      enabled={true}
      allowExportSelectedData={true}
    />
  </DataGrid>
);
export default App;

import React from 'react';

import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import { jsPDF } from 'jspdf';

import { exportDataGrid } from 'devextreme/pdf_exporter';

import { customers } from './data.js';

export default function App() {
  const dataGridRef = React.createRef();

  const exportGrid = React.useCallback(() => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    const dataGrid = dataGridRef.current.instance;

    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGrid,
      indent: 5,
    }).then(() => {
      doc.save('Companies.pdf');
    });
  });

  return (
    <DataGrid
      ref={dataGridRef}
      dataSource={customers}
      keyExpr="ID"
      allowColumnReordering={true}
      showBorders={true}
    >
      <GroupPanel visible={true} />
      <SearchPanel visible={true} />
      <Grouping autoExpandAll={true} />
      <Paging defaultPageSize={10} />

      <Column dataField='CompanyName' dataType='string' />
      <Column dataField='Phone' dataType='string' />
      <Column dataField='Fax' dataType='string' />
      <Column dataField='City' dataType='string' />
      <Column dataField='State' dataType='string' groupIndex={0} />
      <Toolbar>
        <Item name="groupPanel" />
        <Item location="after">
          <Button
            icon='exportpdf'
            text='Export to PDF'
            onClick={exportGrid}
          />
        </Item>
        <Item name="searchPanel" />
      </Toolbar>
    </DataGrid>
  );
}

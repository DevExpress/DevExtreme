import React from 'react';

import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { customers } from './data.js';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

const dataGridRef = React.createRef();

export default function App() {
  function exportGrid() {
    const doc = new jsPDF();
    const dataGrid = dataGridRef.current.instance;

    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: dataGrid
    }).then(() => {
      doc.save('Customers.pdf');
    });
  }

  return (
    <React.Fragment>
      <div>
        <Button
          id='exportButton'
          icon='exportpdf'
          text='Export to PDF'
          onClick={exportGrid}
        />
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
        </DataGrid>
      </div>
    </React.Fragment>
  );
}

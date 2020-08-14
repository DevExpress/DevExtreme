import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = service.getEmployees();
  }
  render() {
    return (
      <div>
        <Button
          text="Export to PDF"
          onClick={this.onExport}
        />
        <DataGrid
          id="gridContainer"
          dataSource={this.dataSource}
          showBorders={true}>
          <Column dataField="Prefix" width={60} caption="Title" />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column dataField="Position" width={130} />
          <Column dataField="BirthDate" width={100} dataType="date" />
          <Column dataField="HireDate" width={100} dataType="date" />
        </DataGrid>
      </div>
    );
  }

  onExport(e) {
    var headRow = [['Prefix', 'FirstName', 'LastName', 'City', 'State', 'Position', 'BirthDate', 'HireDate']];
    var bodyRows = [];
    var data = service.getEmployees();
    for(let i = 0; i < data.length; i++) {
      var val = data[i];
      bodyRows.push([val.FirstName, val.LastName, val.Prefix, val.City, val.State, val.Position, val.BirthDate, val.HireDate]);
    }

    var autoTableOptions = {
      theme: 'plain',
      tableLineColor: 149,
      tableLineWidth: 0.1,
      styles: { textColor: 51, lineColor: 149, lineWidth: 0 },
      columnStyles: {},
      headStyles: { fontStyle: 'normal', textColor: 149, lineWidth: 0.1 },
      bodyStyles: { lineWidth: 0.1 },
      head: headRow,
      body: bodyRows
    };

    const doc = new jsPDF();
    doc.autoTable(autoTableOptions);
    doc.save('filePDF.pdf');

    e.cancel = true;
  }
}

export default App;

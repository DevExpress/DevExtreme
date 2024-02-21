import React, { useCallback, useState } from 'react';
import DataGrid, { Column, Selection } from 'devextreme-react/data-grid';
import { employees } from './data.js';

const App = () => {
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);
  const [selectedRowPicture, setSelectedRowPicture] = useState('');
  const [selectedRowNotes, setSelectedRowNotes] = useState('');
  const onSelectionChanged = useCallback(({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    setShowEmployeeInfo(!!data);
    setSelectedRowNotes(data && data.Notes);
    setSelectedRowPicture(data && data.Picture);
  }, []);
  return (
    <React.Fragment>
      <DataGrid
        dataSource={employees}
        showBorders={true}
        hoverStateEnabled={true}
        keyExpr="ID"
        onSelectionChanged={onSelectionChanged}
      >
        <Selection mode="single" />
        <Column
          dataField="Prefix"
          caption="Title"
          width={70}
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column
          dataField="Position"
          width={180}
        />
        <Column
          dataField="BirthDate"
          dataType="date"
        />
        <Column
          dataField="HireDate"
          dataType="date"
        />
      </DataGrid>
      {showEmployeeInfo && (
        <div id="employee-info">
          <img
            src={selectedRowPicture}
            className="employee-photo"
          />
          <p className="employee-notes">{selectedRowNotes}</p>
        </div>
      )}
    </React.Fragment>
  );
};
export default App;

import React from 'react';
import DataGrid, { Column, MasterDetail, Selection } from 'devextreme-react/data-grid';
import { employees } from './data.js';

const onContentReady = (e) => {
  if (!e.component.getSelectedRowKeys().length) {
    e.component.selectRowsByIndexes([0]);
  }
};
const onSelectionChanged = (e) => {
  e.component.collapseAll(-1);
  e.component.expandRow(e.currentSelectedRowKeys[0]);
};
const renderDetail = (props) => {
  const { Picture, Notes } = props.data;
  return (
    <div className="employee-info">
      <img
        className="employee-photo"
        alt="Employee Photo"
        src={Picture}
      />
      <p className="employee-notes">{Notes}</p>
    </div>
  );
};
const App = () => (
  <DataGrid
    id="grid-container"
    dataSource={employees}
    keyExpr="ID"
    onSelectionChanged={onSelectionChanged}
    onContentReady={onContentReady}
    showBorders={true}
  >
    <Selection mode="single" />
    <Column
      dataField="Prefix"
      width={70}
      caption="Title"
    />
    <Column dataField="FirstName" />
    <Column dataField="LastName" />
    <Column
      dataField="Position"
      width={170}
    />
    <Column
      dataField="State"
      width={125}
    />
    <Column
      dataField="BirthDate"
      dataType="date"
    />
    <MasterDetail
      enabled={false}
      render={renderDetail}
    />
  </DataGrid>
);
export default App;

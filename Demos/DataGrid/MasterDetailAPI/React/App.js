import React from 'react';
import DataGrid, {
  Column,
  MasterDetail,
  Selection
} from 'devextreme-react/data-grid';
import { employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.contentReady = this.contentReady.bind(this);
    this.selectionChanged = this.selectionChanged.bind(this);
  }
  render() {
    return (
      <DataGrid
        id="grid-container"
        dataSource={employees}
        keyExpr="ID"
        onSelectionChanged={this.selectionChanged}
        onContentReady={this.contentReady}
        showBorders={true}
      >
        <Selection mode="single" />
        <Column dataField="Prefix" width={70} caption="Title" />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" width={170} />
        <Column dataField="State" width={125} />
        <Column dataField="BirthDate" dataType="date" />
        <MasterDetail enabled={false} render={renderDetail} />
      </DataGrid>
    );
  }
  contentReady(e) {
    if (!e.component.getSelectedRowKeys().length)
    { e.component.selectRowsByIndexes(0); }
  }
  selectionChanged(e) {
    e.component.collapseAll(-1);
    e.component.expandRow(e.currentSelectedRowKeys[0]);
  }
}

function renderDetail(props) {
  let { Picture, Notes } = props.data;
  return (
    <div className="employee-info">
      <img className="employee-photo" src={Picture} />
      <p className="employee-notes">{Notes}</p>
    </div>
  );
}

export default App;

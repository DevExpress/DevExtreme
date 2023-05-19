import React from 'react';
import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';
import DataGrid, {
  Column, Editing, Lookup, Texts, Selection,
} from 'devextreme-react/data-grid';
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';
import { SelectBox } from 'devextreme-react/select-box';
import {
  employees, states, directions, directionLabel,
} from './data.js';

const optionDirections = ['auto', 'up', 'down'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowIndex: -1,
    };
    this.grid = null;
    this.selectionChanged = this.selectedChanged.bind(this);
    this.directionChanged = this.directionChanged.bind(this);
    this.addRow = this.addRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.editRow = this.editRow.bind(this);
  }

  selectedChanged(e) {
    this.setState({
      selectedRowIndex: e.component.getRowIndexByKey(e.selectedRowKeys[0]),
    });
  }

  directionChanged(e) {
    config({
      floatingActionButtonConfig: directions[e.selectedItem],
    });

    repaintFloatingActionButton();
  }

  editRow() {
    this.grid.instance.editRow(this.state.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  deleteRow() {
    this.grid.instance.deleteRow(this.state.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  addRow() {
    this.grid.instance.addRow();
    this.grid.instance.deselectAll();
  }

  render() {
    const { selectedRowIndex } = this.state;

    return (
      <div>
        <DataGrid
          id="grid"
          dataSource={employees}
          keyExpr="ID"
          ref={(ref) => { this.grid = ref; }}
          showBorders={true}
          onSelectionChanged={this.selectionChanged}>
          <Column dataField="Prefix" caption="Title" />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="Position" width={130} />
          <Column dataField="StateID" caption="State" width={125}>
            <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="BirthDate" dataType="date" width={125} />
          <Selection mode="single" />
          <Editing mode="popup">
            <Texts confirmDeleteMessage="" />
          </Editing>
        </DataGrid>
        <SpeedDialAction
          icon="add"
          label="Add row"
          index={1}
          onClick={this.addRow} />
        <SpeedDialAction
          icon="trash"
          label="Delete row"
          index={2}
          visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
          onClick={this.deleteRow} />
        <SpeedDialAction
          icon="edit"
          label="Edit row"
          index={3}
          visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
          onClick={this.editRow} />
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Direction: </span>
            <SelectBox
              dataSource={optionDirections}
              defaultValue="auto"
              inputAttr={directionLabel}
              onSelectionChanged={this.directionChanged}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

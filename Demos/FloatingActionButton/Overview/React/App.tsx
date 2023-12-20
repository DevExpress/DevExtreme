import React, { useCallback, useRef, useState } from 'react';
import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';
import DataGrid, {
  Column, Editing, Lookup, Texts, Selection, DataGridTypes,
} from 'devextreme-react/data-grid';
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';
import {
  employees, states, directions, directionLabel,
} from './data.ts';

const optionDirections = ['auto', 'up', 'down'];

const App = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const gridRef = useRef(null);

  const selectedChanged = useCallback((e: DataGridTypes.SelectionChangedEvent) => {
    setSelectedRowIndex(e.component.getRowIndexByKey(e.selectedRowKeys[0]));
  }, [setSelectedRowIndex]);

  const directionChanged = useCallback((e: SelectBoxTypes.SelectionChangedEvent) => {
    config({
      floatingActionButtonConfig: directions[e.selectedItem],
    });

    repaintFloatingActionButton();
  }, []);

  const editRow = useCallback(() => {
    gridRef.current.instance.editRow(selectedRowIndex);
    gridRef.current.instance.deselectAll();
  }, [gridRef, selectedRowIndex]);

  const deleteRow = useCallback(() => {
    gridRef.current.instance.deleteRow(selectedRowIndex);
    gridRef.current.instance.deselectAll();
  }, [gridRef, selectedRowIndex]);

  const addRow = useCallback(() => {
    gridRef.current.instance.addRow();
    gridRef.current.instance.deselectAll();
  }, [gridRef]);

  return (
    <div>
      <DataGrid
        id="grid"
        dataSource={employees}
        keyExpr="ID"
        ref={gridRef}
        showBorders={true}
        onSelectionChanged={selectedChanged}>
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
        onClick={addRow} />
      <SpeedDialAction
        icon="trash"
        label="Delete row"
        index={2}
        visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
        onClick={deleteRow} />
      <SpeedDialAction
        icon="edit"
        label="Edit row"
        index={3}
        visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
        onClick={editRow} />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Direction: </span>
          <SelectBox
            dataSource={optionDirections}
            defaultValue="auto"
            inputAttr={directionLabel}
            onSelectionChanged={directionChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

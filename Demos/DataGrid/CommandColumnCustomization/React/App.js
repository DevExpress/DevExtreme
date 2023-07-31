import React from 'react';
import DataGrid, {
  Button, Column, Editing, Lookup,
} from 'devextreme-react/data-grid';

import service from './data.js';

const states = service.getStates();

const isChief = (position) => position && ['CEO', 'CMO'].indexOf(position.trim().toUpperCase()) >= 0;

const allowDeleting = (e) => !isChief(e.row.data.Position);

const onRowValidating = (e) => {
  const position = e.newData.Position;

  if (isChief(position)) {
    e.errorText = `The company can have only one ${position.toUpperCase()}. Please choose another position.`;
    e.isValid = false;
  }
};

const onEditorPreparing = (e) => {
  if (e.parentType === 'dataRow' && e.dataField === 'Position') {
    e.editorOptions.readOnly = isChief(e.value);
  }
};

const isCloneIconVisible = (e) => !e.row.isEditing;

const isCloneIconDisabled = (e) => isChief(e.row.data.Position);

const App = () => {
  const [employees, setEmployees] = React.useState(service.getEmployees());

  const cloneIconClick = React.useCallback((e) => {
    const clonedItem = { ...e.row.data, ID: service.getMaxID() };

    setEmployees((prevState) => {
      const updatedEmployees = [...prevState];
      updatedEmployees.splice(e.row.rowIndex, 0, clonedItem);
      return updatedEmployees;
    });
    e.event.preventDefault();
  }, []);

  return (
    <DataGrid
      id="gridContainer"
      dataSource={employees}
      keyExpr="ID"
      showBorders={true}
      onRowValidating={onRowValidating}
      onEditorPreparing={onEditorPreparing}>
      <Editing
        mode="row"
        useIcons={true}
        allowUpdating={true}
        allowDeleting={allowDeleting} />
      <Column type="buttons" width={110}>
        <Button name="edit" />
        <Button name="delete" />
        <Button hint="Clone" icon="copy" visible={isCloneIconVisible} disabled={isCloneIconDisabled} onClick={cloneIconClick} />
      </Column>
      <Column dataField="Prefix" caption="Title" />
      <Column dataField="FirstName" />
      <Column dataField="LastName" />
      <Column dataField="Position" width={130} />
      <Column dataField="StateID" caption="State" width={125}>
        <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" />
      </Column>
      <Column dataField="BirthDate" dataType="date" width={125} />
    </DataGrid>
  );
};

export default App;

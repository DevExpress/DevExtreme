import React from 'react';
import DataGrid, {
  Column, Editing, ValidationRule, Button, Toolbar, Item, Scrolling,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import Guid from 'devextreme/core/guid';
import { dataSource, positionLabel, scrollingModeLabel } from './data.js';

const newRowPositionOptions = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];
const scrollingModeOptions = ['standard', 'virtual'];

function App() {
  const [newRowPosition, setNewRowPosition] = React.useState('viewportTop');
  const [scrollingMode, setScrollingMode] = React.useState('standard');
  const [changes, setChanges] = React.useState([]);
  const [editRowKey, setEditRowKey] = React.useState(null);

  const onAddButtonClick = React.useCallback((e) => {
    const key = new Guid().toString();
    setChanges([{
      key,
      type: 'insert',
      insertAfterKey: e.row.key,
    }]);
    setEditRowKey(key);
  }, []);

  const isAddButtonVisible = React.useCallback(({ row }) => !row.isEditing, []);

  const onRowInserted = React.useCallback((e) => {
    e.component.navigateToRow(e.key);
  }, []);

  return <React.Fragment>
    <DataGrid
      id='gridContainer'
      dataSource={dataSource}
      showBorders={true}
      columnAutoWidth={true}
      remoteOperations={true}
      onRowInserted={onRowInserted}
    >
      <Scrolling
        mode={scrollingMode}
      />
      <Editing
        mode='row'
        allowAdding={true}
        allowDeleting={true}
        allowUpdating={true}
        confirmDelete={false}
        useIcons={true}
        newRowPosition={newRowPosition}
        changes={changes}
        onChangesChange={setChanges}
        editRowKey={editRowKey}
        onEditRowKeyChange={setEditRowKey}
      />

      <Column dataField='OrderID' allowEditing={false} />
      <Column dataField='OrderDate' dataType='date'>
        <ValidationRule type='required' />
      </Column>
      <Column dataField='ShipName' />
      <Column dataField='ShipCity' />
      <Column dataField='ShipPostalCode' />
      <Column dataField='ShipCountry' />
      <Column type='buttons'>
        <Button icon='add'
          onClick={onAddButtonClick}
          visible={isAddButtonVisible}
        />
        <Button name='delete' />
        <Button name='save' />
        <Button name='cancel' />
      </Column>

      <Toolbar>
        <Item name='addRowButton' showText='always' />
      </Toolbar>
    </DataGrid>

    <div className='options'>
      <div className='caption'>Options</div>
      <div className='option-container'>
        <div className='option'>
          <span>New Row Position</span>
          <SelectBox
            id='newRowPositionSelectBox'
            value={newRowPosition}
            inputAttr={positionLabel}
            items={newRowPositionOptions}
            onValueChange={setNewRowPosition}
          />
        </div>
        <div className='option'>
          <span>Scrolling Mode</span>
          <SelectBox
            id='scrollingModeSelectBox'
            value={scrollingMode}
            inputAttr={scrollingModeLabel}
            items={scrollingModeOptions}
            onValueChange={setScrollingMode}
          />
        </div>
      </div>
    </div>
  </React.Fragment>;
}

export default App;

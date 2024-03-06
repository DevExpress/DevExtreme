import React, {
  useCallback, useEffect, useMemo, useReducer,
} from 'react';
import DataGrid, {
  Column, DataGridTypes, Editing,
} from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import 'whatwg-fetch';

import reducer, { State } from './reducer.ts';
import {
  saveChange, loadOrders, setChanges, setEditRowKey,
} from './actions.ts';

const initialState: State = {
  data: [],
  changes: [],
  editRowKey: null,
  isLoading: false,
};

const loadPanelPosition = { of: '#gridContainer' };

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changesText = useMemo(() => JSON.stringify(state.changes.map((change) => ({
    type: change.type,
    key: change.type !== 'insert' ? change.key : undefined,
    data: change.data,
  })), null, ' '), [state.changes]);

  useEffect(() => {
    loadOrders(dispatch);
  }, []);

  const onSaving = useCallback((e: DataGridTypes.SavingEvent) => {
    e.cancel = true;
    e.promise = saveChange(dispatch, e.changes[0]);
  }, []);

  const onChangesChange = useCallback((changes: DataGridTypes.DataChange[]) => {
    setChanges(dispatch, changes);
  }, []);

  const onEditRowKeyChange = useCallback((editRowKey) => {
    setEditRowKey(dispatch, editRowKey);
  }, []);

  return (
    <React.Fragment>
      <LoadPanel
        position={loadPanelPosition}
        visible={state.isLoading}
      />
      <DataGrid
        id="gridContainer"
        keyExpr="OrderID"
        dataSource={state.data}
        showBorders
        repaintChangesOnly
        onSaving={onSaving}>
        <Editing
          mode="row"
          allowAdding
          allowDeleting
          allowUpdating
          changes={state.changes}
          onChangesChange={onChangesChange}
          editRowKey={state.editRowKey}
          onEditRowKeyChange={onEditRowKeyChange}
        />
        <Column dataField="OrderID" allowEditing={false}></Column>
        <Column dataField="ShipName"></Column>
        <Column dataField="ShipCountry"></Column>
        <Column dataField="ShipCity"></Column>
        <Column dataField="ShipAddress"></Column>
        <Column dataField="OrderDate" dataType="date"></Column>
        <Column dataField="Freight"></Column>
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Edit Row Key:</span>
          <div id="editRowKey">{state.editRowKey === null ? 'null' : state.editRowKey.toString()}</div>
        </div>
        <div className="option">
          <span>Changes:</span>
          <div id="changes">{changesText}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;

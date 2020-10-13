import React from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import 'whatwg-fetch';

import reducer from './reducer.js';
import { saveChange, loadOrders, setChanges, setEditRowKey } from './actions.js';

const initialState = {
  data: [],
  changes: [],
  editRowKey: null,
  isLoading: false
};

const loadPanelPosition = { of: '#gridContainer' };

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const changesText = React.useMemo(() => {
    return JSON.stringify(state.changes.map((change) => ({
      type: change.type,
      key: change.type !== 'insert' ? change.key : undefined,
      data: change.data
    })), null, ' ');
  }, [state.changes]);

  React.useEffect(() => {
    loadOrders(dispatch);
  }, []);

  const onSaving = React.useCallback((e) => {
    e.cancel = true;
    e.promise = saveChange(dispatch, e.changes[0]);
  }, []);

  const onOptionChanged = React.useCallback((e) => {
    if (e.fullName === 'editing.editRowKey') {
      setEditRowKey(dispatch, e.value);
    } else if (e.fullName === 'editing.changes') {
      setChanges(dispatch, e.value);
    }
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
        showBorders={true}
        repaintChangesOnly={true}
        onSaving={onSaving}
        onOptionChanged={onOptionChanged}>
        <Editing
          mode="row"
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
          changes={state.changes}
          editRowKey={state.editRowKey}
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
          <div id="editRowKey">{state.editRowKey === null ? "null" : state.editRowKey.toString()}</div>
        </div>
        <div className="option">
          <span>Changes:</span>
          <div id="changes">{changesText}</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;

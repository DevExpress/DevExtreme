import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import DataGrid, {
  Column, Editing, Paging, Lookup,
} from 'devextreme-react/data-grid';
import { employees, states } from './data.js';

const App = () => {
  const [events, setEvents] = useState([]);
  const logEvent = useCallback((eventName) => {
    setEvents((previousEvents) => [eventName, ...previousEvents]);
  }, []);
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  const logEditingStart = useCallback(() => logEvent('EditingStart'), [logEvent]);
  const logInitNewRow = useCallback(() => logEvent('InitNewRow'), [logEvent]);
  const logRowInserting = useCallback(() => logEvent('RowInserting'), [logEvent]);
  const logRowInserted = useCallback(() => logEvent('RowInserted'), [logEvent]);
  const logRowUpdating = useCallback(() => logEvent('RowUpdating'), [logEvent]);
  const logRowUpdated = useCallback(() => logEvent('RowUpdated'), [logEvent]);
  const logRowRemoving = useCallback(() => logEvent('RowRemoving'), [logEvent]);
  const logRowRemoved = useCallback(() => logEvent('RowRemoved'), [logEvent]);
  const logSaving = useCallback(() => logEvent('Saving'), [logEvent]);
  const logSaved = useCallback(() => logEvent('Saved'), [logEvent]);
  const logEditCanceling = useCallback(() => logEvent('EditCanceling'), [logEvent]);
  const logEditCanceled = useCallback(() => logEvent('EditCanceled'), [logEvent]);
  return (
    <>
      <DataGrid
        id="gridContainer"
        dataSource={employees}
        keyExpr="ID"
        allowColumnReordering={true}
        showBorders={true}
        onEditingStart={logEditingStart}
        onInitNewRow={logInitNewRow}
        onRowInserting={logRowInserting}
        onRowInserted={logRowInserted}
        onRowUpdating={logRowUpdating}
        onRowUpdated={logRowUpdated}
        onRowRemoving={logRowRemoving}
        onRowRemoved={logRowRemoved}
        onSaving={logSaving}
        onSaved={logSaved}
        onEditCanceling={logEditCanceling}
        onEditCanceled={logEditCanceled}
      >
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />

        <Column
          dataField="Prefix"
          caption="Title"
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column
          dataField="Position"
          width={130}
        />
        <Column
          dataField="StateID"
          caption="State"
          width={125}
        >
          <Lookup
            dataSource={states}
            displayExpr="Name"
            valueExpr="ID"
          />
        </Column>
        <Column
          dataField="BirthDate"
          width={125}
          dataType="date"
        />
      </DataGrid>

      <div id="events">
        <div>
          <div className="caption">Fired events</div>
          <Button
            id="clear"
            text="Clear"
            onClick={clearEvents}
          />
        </div>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default App;

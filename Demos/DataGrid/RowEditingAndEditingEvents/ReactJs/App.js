import React from 'react';
import Button from 'devextreme-react/button';
import DataGrid, {
  Column, Editing, Paging, Lookup,
} from 'devextreme-react/data-grid';
import { employees, states } from './data.js';

const App = () => {
  const [events, setEvents] = React.useState([]);
  const logEvent = React.useCallback((eventName) => {
    setEvents((previousEvents) => [eventName, ...previousEvents]);
  }, []);
  const clearEvents = React.useCallback(() => {
    setEvents([]);
  }, []);
  return (
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={employees}
        keyExpr="ID"
        allowColumnReordering={true}
        showBorders={true}
        onEditingStart={() => logEvent('EditingStart')}
        onInitNewRow={() => logEvent('InitNewRow')}
        onRowInserting={() => logEvent('RowInserting')}
        onRowInserted={() => logEvent('RowInserted')}
        onRowUpdating={() => logEvent('RowUpdating')}
        onRowUpdated={() => logEvent('RowUpdated')}
        onRowRemoving={() => logEvent('RowRemoving')}
        onRowRemoved={() => logEvent('RowRemoved')}
        onSaving={() => logEvent('Saving')}
        onSaved={() => logEvent('Saved')}
        onEditCanceling={() => logEvent('EditCanceling')}
        onEditCanceled={() => logEvent('EditCanceled')}
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
    </React.Fragment>
  );
};
export default App;

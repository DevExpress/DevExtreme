import React from 'react';

import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Guid from 'devextreme/core/guid';
import Grid from './Grid.js';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH}api/DataGridCollaborativeEditing`;
const groupId = new Guid().toJSON();

const createStore = () => AspNetData.createStore({
  key: 'ID',
  loadUrl: url,
  insertUrl: url,
  updateUrl: url,
  deleteUrl: url,
  onBeforeSend(operation, ajaxSettings) {
    ajaxSettings.data.groupId = groupId;
  },
});

const store1 = createStore();
const store2 = createStore();

const updateStores = (events) => {
  store1.push(events);
  store2.push(events);
};

const App = () => {
  React.useEffect(() => {
    const hubUrl = `${BASE_PATH}dataGridCollaborativeEditingHub?GroupId=${groupId}`;
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    connection.start()
      .then(() => {
        connection.on('update', (key, data) => {
          updateStores([{ type: 'update', key, data }]);
        });

        connection.on('insert', (data) => {
          updateStores([{ type: 'insert', data }]);
        });

        connection.on('remove', (key) => {
          updateStores([{ type: 'remove', key }]);
        });
      });
  }, []);

  return (
    <div className="tables">
      <div className="column">
        <Grid dataSource={store1} />
      </div>
      <div className="column">
        <Grid dataSource={store2} />
      </div>
    </div>
  );
};

export default App;

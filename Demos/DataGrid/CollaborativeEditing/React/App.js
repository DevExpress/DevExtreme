import React from 'react';

import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Grid from './Grid.js';
import Guid from 'devextreme/core/guid';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH }api/DataGridCollaborativeEditing`;
const groupId = new Guid().toJSON();

function createStore() {
  return AspNetData.createStore({
    key: 'ID',
    loadUrl: url,
    insertUrl: url,
    updateUrl: url,
    deleteUrl: url,
    onBeforeSend: function(operation, ajaxSettings) {
      ajaxSettings.data.groupId = groupId;
    }
  });
}

const store1 = createStore();
const store2 = createStore();

function updateStores(events) {
  store1.push(events);
  store2.push(events);
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
  }
}

const hubUrl = `${BASE_PATH}dataGridCollaborativeEditingHub?GroupId=${groupId}`;
const connection = new HubConnectionBuilder()
  .withUrl(hubUrl, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
  })
  .build();

connection.start()
  .then(function() {
    connection.on('update', function(key, data) {
      updateStores([{ type: 'update', key: key, data: data }]);
    });

    connection.on('insert', function(data) {
      updateStores([{ type: 'insert', data: data }]);
    });

    connection.on('remove', function(key) {
      updateStores([{ type: 'remove', key: key }]);
    });
  });

export default App;

import React from 'react';
import DataGrid, {
  Column
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { HubConnectionBuilder } from '@aspnet/signalr';

import PriceCell from './PriceCell.js';
import ChangeCell from './ChangeCell.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { connectionStarted: false, dataSource: null };

    var hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub')
      .build();

    var store = new CustomStore({
      load: () => hubConnection.invoke('getAllStocks'),
      key: 'symbol'
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data) => {
          store.push([{ type: 'update', key: data.symbol, data: data }]);
        });
        this.setState({ connectionStarted: true, dataSource: store });
      });
  }

  render() {
    return (
      <div>
        {this.state.connectionStarted &&
          (<DataGrid
            id="gridContainer"
            dataSource={this.state.dataSource}
            showBorders={true}
            repaintChangesOnly={true}
            highlightChanges={true}
          >
            <Column dataField="lastUpdate" dataType="date" width={115} format="longTime" />
            <Column dataField="symbol" />
            <Column dataField="price" dataType="number" format="#0.####" cellRender={PriceCell} />
            <Column dataField="change" dataType="number" width={140} format="#0.####" cellRender={ChangeCell} />
            <Column dataField="dayOpen" dataType="number" format="#0.####" />
            <Column dataField="dayMin" dataType="number" format="#0.####" />
            <Column dataField="dayMax" dataType="number" format="#0.####" />
          </DataGrid>)
        }
      </div>
    );
  }
}

export default App;

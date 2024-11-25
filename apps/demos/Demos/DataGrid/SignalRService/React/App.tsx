import React, { useEffect, useState } from 'react';
import DataGrid, {
  Column,
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';

import PriceCell from './PriceCell.tsx';
import ChangeCell from './ChangeCell.tsx';

const App = () => {
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    const store = new CustomStore({
      load: () => hubConnection.invoke('getAllStocks'),
      key: 'symbol',
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data) => {
          store.push([{ type: 'update', key: data.symbol, data }]);
        });
        setConnectionStarted(true);
        setDataSource(store);
      });
  }, []);

  return (
    <div>
      {connectionStarted && (
        <DataGrid
          id="gridContainer"
          dataSource={dataSource}
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
        </DataGrid>
      )}
    </div>
  );
};

export default App;

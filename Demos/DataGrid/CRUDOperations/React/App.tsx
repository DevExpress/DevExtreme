// eslint-disable-next-line no-unused-vars
/* global RequestInit */
import React from 'react';
import {
  DataGrid, Column, Editing, Scrolling, Lookup, Summary, TotalItem, DataGridTypes,
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';

import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';
import 'whatwg-fetch';

const refreshModeLabel = { 'aria-label': 'Refresh Mode' };
const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const REFRESH_MODES = ['full', 'reshape', 'repaint'];

const App = () => {
  const [ordersData] = React.useState(new CustomStore({
    key: 'OrderID',
    load: () => sendRequest(`${URL}/Orders`),
    insert: (values) => sendRequest(`${URL}/InsertOrder`, 'POST', {
      values: JSON.stringify(values),
    }),
    update: (key, values) => sendRequest(`${URL}/UpdateOrder`, 'PUT', {
      key,
      values: JSON.stringify(values),
    }),
    remove: (key) => sendRequest(`${URL}/DeleteOrder`, 'DELETE', {
      key,
    }),
  }));
  const [customersData] = React.useState(new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => sendRequest(`${URL}/CustomersLookup`),
  }));
  const [shippersData] = React.useState(new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => sendRequest(`${URL}/ShippersLookup`),
  }));

  const [requests, setRequests] = React.useState([]);
  const [refreshMode, setRefreshMode] = React.useState<DataGridTypes.GridsEditRefreshMode>('reshape');

  const handleRefreshModeChange = React.useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setRefreshMode(e.value);
  }, []);

  const clearRequests = React.useCallback(() => {
    setRequests([]);
  }, []);

  const logRequest = React.useCallback((method, url: string, data: Record<string, any>) => {
    const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');

    const time = formatDate(new Date(), 'HH:mm:ss');
    const request = [time, method, url.slice(URL.length), args].join(' ');

    setRequests((prevRequests: ConcatArray<string>) => [request].concat(prevRequests));
  }, []);

  // eslint-disable-next-line consistent-return, space-before-function-paren
  const sendRequest = React.useCallback(async (url: string, method = 'GET', data = {}) => {
    logRequest(method, url, data);

    const request: RequestInit = {
      method, credentials: 'include',
    };

    if (['DELETE', 'POST', 'PUT'].includes(method)) {
      const params = Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

      request.body = params;
      request.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
    }

    const response = await fetch(url, request);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const result = isJson ? await response.json() : {};

    if (!response.ok) {
      throw result.Message;
    }

    return method === 'GET' ? result.data : {};
  }, [logRequest]);

  return (
    <React.Fragment>
      <DataGrid
        id="grid"
        showBorders={true}
        dataSource={ordersData}
        repaintChangesOnly={true}
      >
        <Editing
          refreshMode={refreshMode}
          mode="cell"
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
        />

        <Scrolling mode="virtual" />

        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderDate" dataType="date" />
        <Column dataField="Freight" />
        <Column dataField="ShipCountry" />
        <Column
          dataField="ShipVia"
          caption="Shipping Company"
          dataType="number"
        >
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>

        <Summary>
          <TotalItem column="CustomerID" summaryType="count" />
          <TotalItem column="Freight" summaryType="sum" valueFormat="#0.00" />
        </Summary>
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Refresh Mode: </span>
          <SelectBox
            value={refreshMode}
            inputAttr={refreshModeLabel}
            items={REFRESH_MODES}
            onValueChanged={handleRefreshModeChange}
          />
        </div>
        <div id="requests">
          <div>
            <div className="caption">Network Requests</div>
            <Button id="clear" text="Clear" onClick={clearRequests} />
          </div>
          <ul>
            {requests.map((request, index) => <li key={index}>{request}</li>)}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;

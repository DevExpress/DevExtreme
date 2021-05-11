import React from 'react';

import { DataGrid, Column, Editing, Scrolling, Lookup, Summary, TotalItem } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';

import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';
import 'whatwg-fetch';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const REFRESH_MODES = ['full', 'reshape', 'repaint'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ordersData: new CustomStore({
        key: 'OrderID',
        load: () => this.sendRequest(`${URL}/Orders`),
        insert: (values) => this.sendRequest(`${URL}/InsertOrder`, 'POST', {
          values: JSON.stringify(values)
        }),
        update: (key, values) => this.sendRequest(`${URL}/UpdateOrder`, 'PUT', {
          key: key,
          values: JSON.stringify(values)
        }),
        remove: (key) => this.sendRequest(`${URL}/DeleteOrder`, 'DELETE', {
          key: key
        })
      }),
      customersData: new CustomStore({
        key: 'Value',
        loadMode: 'raw',
        load: () => this.sendRequest(`${URL}/CustomersLookup`)
      }),
      shippersData: new CustomStore({
        key: 'Value',
        loadMode: 'raw',
        load: () => this.sendRequest(`${URL}/ShippersLookup`)
      }),
      requests: [],
      refreshMode: 'reshape'
    };

    this.clearRequests = this.clearRequests.bind(this);
    this.handleRefreshModeChange = this.handleRefreshModeChange.bind(this);
  }

  sendRequest(url, method, data) {
    method = method || 'GET';
    data = data || {};

    this.logRequest(method, url, data);

    if(method === 'GET') {
      return fetch(url, {
        method: method,
        credentials: 'include'
      }).then(result => result.json().then(json => {
        if(result.ok) return json.data;
        throw json.Message;
      }));
    }

    const params = Object.keys(data).map((key) => {
      return `${encodeURIComponent(key) }=${ encodeURIComponent(data[key])}`;
    }).join('&');

    return fetch(url, {
      method: method,
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      credentials: 'include'
    }).then(result => {
      if(result.ok) {
        return result.text().then(text => text && JSON.parse(text));
      } else {
        return result.json().then(json => {
          throw json.Message;
        });
      }
    });
  }

  logRequest(method, url, data) {
    const args = Object.keys(data || {}).map(function(key) {
      return `${key }=${ data[key]}`;
    }).join(' ');

    const time = formatDate(new Date(), 'HH:mm:ss');
    const request = [time, method, url.slice(URL.length), args].join(' ');

    this.setState((state) => {
      return { requests: [request].concat(state.requests) };
    });
  }

  clearRequests() {
    this.setState({ requests: [] });
  }

  handleRefreshModeChange(e) {
    this.setState({ refreshMode: e.value });
  }

  render() {
    const { refreshMode, ordersData, customersData, shippersData } = this.state;
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

          <Scrolling
            mode="virtual"
          />

          <Column dataField="CustomerID" caption="Customer">
            <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          </Column>

          <Column dataField="OrderDate" dataType="date">
          </Column>

          <Column dataField="Freight">
          </Column>

          <Column dataField="ShipCountry">
          </Column>

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
              items={REFRESH_MODES}
              onValueChanged={this.handleRefreshModeChange}
            />
          </div>
          <div id="requests">
            <div>
              <div className="caption">Network Requests</div>
              <Button id="clear" text="Clear" onClick={this.clearRequests} />
            </div>
            <ul>
              {this.state.requests.map((request, index) => <li key={index}>{request}</li>)}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;

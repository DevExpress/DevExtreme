import React from 'react';

import RowTemplate from './RowTemplate.js';

import SelectBox from 'devextreme-react/select-box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const years = ['2010', '2011', '2012'];

const dataSource = new DataSource({
  store: new CustomStore({
    load: () => {
      return fetch('../../../../data/resourceData.json')
        .then(e => e.json())
        .catch(() => { throw 'Data Loading Error'; });
    },
    loadMode: 'raw'
  }),
  filter: ['month', '<=', '12'],
  paginate: false
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.source = dataSource;
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <h3 className="long-title">Monthly Prices of Aluminium, Nickel and Copper</h3>
        <div id="chart-demo">
          <table
            className="demo-table"
            border="1"
          >
            <tbody>
              <tr>
                <th />
                <th>Aluminium (USD/ton)</th>
                <th>Nickel (USD/ton)</th>
                <th>Copper (USD/ton)</th>
              </tr>
              {
                years.map((year, index) => {
                  return <RowTemplate key={index} year={year} source={this.source} />;
                })
              }
            </tbody>
          </table>
          <div className="action">
            <SelectBox
              id="choose-months"
              dataSource={months}
              width={70}
              defaultValue={months[0]}
              onValueChanged={this.onValueChanged}
            />
            <div className="label">Choose a number of months:
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  onValueChanged(e) {
    this.source.filter(['month', '<=', e.value]);
    this.source.load();
  }
}

export default App;

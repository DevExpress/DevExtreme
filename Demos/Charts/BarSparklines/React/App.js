import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import RowTemplate from './RowTemplate.js';

const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const years = ['2010', '2011', '2012'];
const monthLabel = { 'aria-label': 'Month' };

const dataSource = new DataSource({
  store: new CustomStore({
    load: () => fetch('../../../../data/resourceData.json')
      .then((e) => e.json())
      .catch(() => { throw new Error('Data Loading Error'); }),
    loadMode: 'raw',
  }),
  filter: ['month', '<=', '12'],
  paginate: false,
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
        <div className="long-title"><h3>Monthly Prices of Aluminium, Nickel and Copper</h3></div>
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
                years.map((year, index) => <RowTemplate
                  key={index}
                  year={year}
                  source={this.source} />)
              }
            </tbody>
          </table>
          <div className="action">
            <div className="label">Choose a number of months:
            </div>
            <SelectBox
              id="choose-months"
              dataSource={months}
              inputAttr={monthLabel}
              defaultValue={months[0]}
              onValueChanged={this.onValueChanged}
            />
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

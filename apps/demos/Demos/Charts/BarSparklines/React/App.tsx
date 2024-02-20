import React, { useCallback } from 'react';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import RowTemplate from './RowTemplate.tsx';

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

function App() {
  const onValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    dataSource.filter(['month', '<=', e.value]);
    dataSource.load();
  }, []);

  return (
    <React.Fragment>
      <div className="long-title"><h3>Monthly Prices of Aluminium, Nickel and Copper</h3></div>
      <div id="chart-demo">
        <table
          className="demo-table"
          style={{ border: 1 }}
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
                source={dataSource} />)
            }
          </tbody>
        </table>
        <div className="action">
          <div className="label">Choose a number of months:</div>
          <SelectBox
            id="choose-months"
            dataSource={months}
            inputAttr={monthLabel}
            defaultValue={months[0]}
            onValueChanged={onValueChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;

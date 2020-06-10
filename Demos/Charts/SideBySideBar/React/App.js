import React from 'react';

import { Chart, Series, CommonSeriesSettings, Label, Format, Legend, Export } from 'devextreme-react/chart';
import { grossProductData } from './data.js';

class App extends React.Component {

  render() {
    return (
      <Chart id="chart"
        title="Gross State Product within the Great Lakes Region"
        dataSource={grossProductData}
        onPointClick={this.onPointClick}
      >
        <CommonSeriesSettings
          argumentField="state"
          type="bar"
          hoverMode="allArgumentPoints"
          selectionMode="allArgumentPoints"
        >
          <Label visible={true}>
            <Format type="fixedPoint" precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField="state"
          valueField="year2004"
          name="2004"
        />
        <Series
          valueField="year2001"
          name="2001"
        />
        <Series
          valueField="year1998"
          name="1998"
        />
        <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
        <Export enabled={true} />
      </Chart>
    );
  }

  onPointClick(e) {
    e.target.select();
  }
}

export default App;

import React from 'react';
import RangeSelector, { Chart, Series } from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalProduction: calculateTotalProduction()
    };
    this.processRange = this.processRange.bind(this);
  }

  render() {
    return (
      <div id="range-selector-demo">
        <RangeSelector
          id="range-selector"
          title="Copper Production in 2013"
          dataSource={dataSource}
          onValueChanged={this.processRange}
        >
          <Chart>
            <Series type="bar" argumentField="country" valueField="copper" />
          </Chart>
        </RangeSelector>
        <h2>Total: { this.state.totalProduction } tons</h2>
      </div>
    );
  }

  processRange(e) {
    this.setState({
      totalProduction: calculateTotalProduction(e.value)
    });
  }
}

const formatNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format;

function calculateTotalProduction(range = []) {
  let startIndex = 0;
  let endIndex = dataSource.length;

  dataSource.forEach((item, index) => {
    if (item.country == range[0]) {
      startIndex = index;
    }
    if (item.country == range[1]) {
      endIndex = index + 1;
    }
  });

  return formatNumber(dataSource
    .slice(startIndex, endIndex)
    .reduce((total, item) => total + item.copper, 0));
}

export default App;

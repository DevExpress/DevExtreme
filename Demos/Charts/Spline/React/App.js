import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
  Format,
} from 'devextreme-react/chart';
import { architectureSources, sharingStatisticsInfo, seriesTypeLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'spline',
    };
    this.types = ['spline', 'stackedspline', 'fullstackedspline'];
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Chart
          palette="Violet"
          dataSource={sharingStatisticsInfo}
          title="Architecture Share Over Time (Count)"
        >
          <CommonSeriesSettings
            argumentField="year"
            type={this.state.type}
          />
          <CommonAxisSettings>
            <Grid visible={true} />
          </CommonAxisSettings>
          {
            architectureSources.map((item) => <Series
              key={item.value}
              valueField={item.value}
              name={item.name} />)
          }
          <Margin bottom={20} />
          <ArgumentAxis
            allowDecimals={false}
            axisDivisionFactor={60}
          >
            <Label>
              <Format type="decimal" />
            </Label>
          </ArgumentAxis>
          <Legend
            verticalAlignment="top"
            horizontalAlignment="right"
          />
          <Export enabled={true} />
          <Tooltip enabled={true} />
        </Chart>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Series Type </span>
            <SelectBox
              dataSource={this.types}
              inputAttr={seriesTypeLabel}
              value={this.state.type}
              onValueChanged={this.handleChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleChange(e) {
    this.setState({ type: e.value });
  }
}

export default App;

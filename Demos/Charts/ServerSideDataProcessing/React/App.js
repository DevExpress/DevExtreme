import React from 'react';

import DataSource from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';

import Chart, {
  ValueAxis,
  ArgumentAxis,
  CommonPaneSettings,
  Grid,
  Series,
  Label,
  Legend,
  Size,
  Border,
  Tooltip,
  Export,
  LoadingIndicator
} from 'devextreme-react/chart';

import SelectBox from 'devextreme-react/select-box';

import { months } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.chartDataSource = new DataSource({
      store: {
        type: 'odata',
        url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/WeatherItems'
      },
      postProcess: function(results) {
        return results[0].DayItems;
      },
      expand: 'DayItems',
      filter: ['Id', '=', 1],
      paginate: false
    });

    this.onValueChanged = (data) => {
      this.chartDataSource.filter(['Id', '=', data.value]);
      this.chartDataSource.load();
    };
  }

  render() {
    return (
      <div id="chart-demo">
        <Chart
          title="Temperature in Barcelona, 2012"
          dataSource={this.chartDataSource}>
          <Size height={420} />
          <ValueAxis
            grid={{ opacity: 0.2 }}
            valueType="numeric"
          >
            <Label customizeText={this.customizeLabel} />
          </ValueAxis>
          <ArgumentAxis type="discrete">
            <Grid visible={true} opacity={0.5} />
          </ArgumentAxis>
          <CommonPaneSettings>
            <Border
              visible={true}
              width={2}
              top={false}
              right={false}
            />
          </CommonPaneSettings>
          <Series
            argumentField="Number"
            valueField="Temperature"
            type="spline"
          />
          <Legend visible={false} />
          <Export enabled={true} />
          <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltip} />
          <LoadingIndicator enabled={true} />
        </Chart>

        <div className="action">
          <SelectBox
            id="selectbox"
            width={150}
            valueExpr="id"
            displayExpr="name"
            items={months}
            defaultValue={1}
            onValueChanged={this.onValueChanged} />
          <div className="label">Choose a month:
          </div>
        </div>
      </div>
    );
  }

  customizeLabel(e) {
    return `${e.valueText}${'&#176C'}`;
  }
}

function customizeTooltip(arg) {
  return {
    text: `${arg.valueText}${'&#176C'}`
  };
}

export default App;

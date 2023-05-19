import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  PolarChart,
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  ValueAxis,
  Margin,
  Export,
} from 'devextreme-react/polar-chart';
import { windSources, windRoseData, periodLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      periodValues: windRoseData[0].values,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div id="chart-demo">
        <PolarChart
          id="radarChart"
          palette="Soft"
          dataSource={this.state.periodValues}
          onLegendClick={this.onLegendClick}
          title="Wind Rose, Philadelphia PA"
        >
          <CommonSeriesSettings type="stackedbar" />
          {
            windSources.map((item) => <Series
              key={item.value}
              valueField={item.value}
              name={item.name} />)
          }
          <Margin
            bottom={50}
            left={100}
          />
          <ArgumentAxis
            discreteAxisDivisionMode="crossLabels"
            firstPointOnStartAngle={true}
          />
          <ValueAxis valueMarginsEnabled={false} />
          <Export enabled={true} />
        </PolarChart>
        <div className="center">
          <SelectBox
            width="300"
            dataSource={windRoseData}
            inputAttr={periodLabel}
            displayExpr="period"
            valueExpr="values"
            value={this.state.periodValues}
            onValueChanged={this.handleChange}
          />
        </div>
      </div>
    );
  }

  onLegendClick({ target: series }) {
    if (series.isVisible()) {
      series.hide();
    } else {
      series.show();
    }
  }

  handleChange({ value }) {
    this.setState({ periodValues: value });
  }
}

export default App;

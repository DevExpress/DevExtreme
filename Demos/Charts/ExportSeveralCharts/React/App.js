import React from 'react';
import Chart, { Series, Label, Legend } from 'devextreme-react/chart';
import PieChart, { Series as PieSeries, Label as PieLabel, Connector } from 'devextreme-react/pie-chart';
import { Button } from 'devextreme-react/button';
import { allMedals, goldMedals } from './data.js';
import { exportWidgets } from 'devextreme/viz/export';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.pieChartRef = React.createRef();
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div id="chart-demo">
        <div className="charts">
          <Chart
            id="chart"
            ref={this.chartRef}
            dataSource={goldMedals}
            rotated={true}
            title="Olympic Gold Medals in 2008"
          >
            <Series
              type="bar"
              argumentField="country"
              valueField="medals"
              color="#f3c40b"
            >
              <Label visible={true} />
            </Series>
            <Legend visible={false} />
          </Chart>
          <PieChart
            id="pieChart"
            ref={this.pieChartRef}
            dataSource={allMedals}
            palette="Harmony Light"
            title={'Total Olympic Medals\n in 2008'}
          >
            <PieSeries
              argumentField="country"
              valueField="medals"
            >
              <PieLabel visible={true}>
                <Connector visible={true} />
              </PieLabel>
            </PieSeries>
          </PieChart>
        </div>
        <div className="controls-pane">
          <Button
            id="export"
            width={145}
            icon="export"
            text="Export"
            type="default"
            onClick={this.onClick}
          />
        </div>
      </div>
    );
  }

  get chart() {
    return this.chartRef.current.instance;
  }

  get pieChart() {
    return this.pieChartRef.current.instance;
  }

  onClick() {
    exportWidgets([[this.chart, this.pieChart]], {
      fileName: 'chart',
      format: 'PNG'
    });
  }
}

export default App;

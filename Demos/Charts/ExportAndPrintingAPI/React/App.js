import React from 'react';
import { mountains } from './data.js';

import Chart, {
  Series,
  Legend,
  Tooltip,
  ArgumentAxis,
  Label,
  ValueAxis,
  VisualRange
} from 'devextreme-react/chart';
import PrintButton from 'devextreme-react/button';
import ExportButton from 'devextreme-react/button';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.printChart = this.printChart.bind(this);
    this.exportChart = this.exportChart.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Chart
          id="chart"
          ref={this.chartRef}
          dataSource={mountains}
          title="The Highest Mountains"
        >
          <Series argumentField="name" valueField="height" type="bar" color="#E55253" />
          <ArgumentAxis visible={true} />
          <ValueAxis>
            <VisualRange startValue={8000} />
            <Label customizeText={customizeLabelText} />
          </ValueAxis>
          <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltipText}
          />
          <Legend visible={false} />
        </Chart>
        <div id="buttonGroup">
          <PrintButton icon="print"
            text="Print"
            onClick={this.printChart}
          />
          &nbsp;
          <ExportButton icon="export"
            text="Export"
            onClick={this.exportChart}
          />
        </div>
      </React.Fragment>
    );
  }

  get chart() {
    return this.chartRef.current.instance;
  }

  printChart() {
    this.chart.print();
  }

  exportChart() {
    this.chart.exportTo('Example', 'png');
  }
}

function customizeTooltipText(pointInfo) {
  return {
    text: `<span class='title'>${pointInfo.argumentText
    }</span><br />&nbsp;<br />System: ${pointInfo.point.data.system
    }<br />Height: ${pointInfo.valueText} m`
  };
}

function customizeLabelText({ value }) {
  return `${value} m`;
}

export default App;

import React from 'react';
import PieChart, {
  Series, Tooltip, Size, Legend,
} from 'devextreme-react/pie-chart';
import { SelectBox } from 'devextreme-react/select-box';
import { populationData, regionLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRegion: null,
    };

    this.pieChartRef = React.createRef();
    this.onPointClick = this.onPointClick.bind(this);
    this.onRegionChanged = this.onRegionChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <PieChart
          ref={this.pieChartRef}
          dataSource={populationData}
          onPointClick={this.onPointClick}
          type="doughnut"
          palette="Soft Pastel"
          title="The Population of Continents and Regions"
        >
          <Series argumentField="region" />
          <Size height={350} />
          <Tooltip
            enabled={false}
            format="millions"
            customizeTooltip={customizeTooltip}
          />
          <Legend visible={false} />
        </PieChart>
        <div className="controls-pane">
          <SelectBox
            width={250}
            dataSource={populationData}
            inputAttr={regionLabel}
            displayExpr="region"
            valueExpr="region"
            placeholder="Choose region"
            value={this.state.selectedRegion}
            onValueChanged={this.onRegionChanged}
          />
        </div>
      </React.Fragment>
    );
  }

  get pieChart() {
    return this.pieChartRef.current.instance;
  }

  onPointClick({ target: point }) {
    this.showTooltip(point);
  }

  onRegionChanged({ value }) {
    const point = this.pieChart.getAllSeries()[0].getPointsByArg(value)[0];
    this.showTooltip(point);
  }

  showTooltip(point) {
    point.showTooltip();
    this.setState({
      selectedRegion: point.argument,
    });
  }
}

function customizeTooltip(pointInfo) {
  return {
    text: `${pointInfo.argumentText}<br/>${pointInfo.valueText}`,
  };
}

export default App;

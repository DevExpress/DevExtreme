import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import PieChart, {
  Series,
  Label,
  Margin,
  Export,
  Legend,
  Animation,
} from 'devextreme-react/pie-chart';

import { dataSource, resolutionModeLabel } from './data.js';

const resolveModes = ['shift', 'hide', 'none'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resolveMode: resolveModes[0],
    };
    this.setResolveMode = this.setResolveMode.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <PieChart
          id="pie"
          dataSource={dataSource}
          palette="Bright"
          title="Olympic Medals in 2008"
          resolveLabelOverlapping={this.state.resolveMode}
        >
          <Series
            argumentField="country"
            valueField="medals"
          >
            <Label visible={true} customizeText={formatText} />
          </Series>
          <Margin bottom={20} />
          <Export enabled={true} />
          <Legend visible={false} />
          <Animation enabled={false} />
        </PieChart>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Label Overlapping Resolution Mode </span>
            <SelectBox
              dataSource={resolveModes}
              inputAttr={resolutionModeLabel}
              value={this.state.resolveMode}
              onValueChanged={this.setResolveMode}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  setResolveMode(data) {
    this.setState({
      resolveMode: data.value,
    });
  }
}

function formatText(arg) {
  return `${arg.argumentText} (${arg.percentText})`;
}

export default App;

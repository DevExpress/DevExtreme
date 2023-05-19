import React from 'react';
import {
  LinearGauge, Scale, Label, Tooltip, Export, Title, Font,
} from 'devextreme-react/linear-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { dataSource, departmentLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dataSource[0].primary,
      subvalues: dataSource[0].secondary,
    };

    this.onValueChanged = ({ value }) => {
      this.setState({
        value: value.primary,
        subvalues: value.secondary,
      });
    };
  }

  render() {
    return (
      <div id="gauge-demo">
        <LinearGauge
          id="gauge"
          value={this.state.value}
          subvalues={this.state.subvalues}
        >
          <Scale startValue={0} endValue={10} tickInterval={2}>
            <Label customizeText={this.customizeText} />
          </Scale>
          <Tooltip enabled={true} customizeTooltip={this.customizeTooltip} />
          <Export enabled={true} />
          <Title text="Power of Air Conditioners in Store Departments (kW)">
            <Font size={28} />
          </Title>
        </LinearGauge>
        <SelectBox
          id="selectbox"
          dataSource={dataSource}
          inputAttr={departmentLabel}
          defaultValue={dataSource[0]}
          width={200}
          displayExpr="name"
          onValueChanged={this.onValueChanged}
        />
      </div>
    );
  }

  customizeText({ valueText }) {
    return `${valueText} kW`;
  }

  customizeTooltip(arg) {
    let result = `${arg.valueText} kW`;
    if (arg.index >= 0) {
      result = `Secondary ${(arg.index + 1)}: ${result}`;
    } else {
      result = `Primary: ${result}`;
    }
    return {
      text: result,
    };
  }
}

export default App;

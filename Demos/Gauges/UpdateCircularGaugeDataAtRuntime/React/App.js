import React from 'react';
import {
  CircularGauge, Scale, Label, RangeContainer, Range, Tooltip, Title, Font,
} from 'devextreme-react/circular-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { dataSource, seasonLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: dataSource[0].mean,
      subvalues: [dataSource[0].min, dataSource[0].max],
    };
    this.onSelectionChanged = ({ selectedItem }) => {
      this.setState({
        value: selectedItem.mean,
        subvalues: [selectedItem.min, selectedItem.max],
      });
    };
  }

  render() {
    return (
      <div id="gauge-demo">
        <CircularGauge
          id="gauge"
          value={this.state.value}
          subvalues={this.state.subvalues}
        >
          <Scale startValue={10} endValue={40} tickInterval={5}>
            <Label customizeText={this.customizeText} />
          </Scale>
          <RangeContainer>
            <Range startValue={10} endValue={20} color="#0077BE" />
            <Range startValue={20} endValue={30} color="#E6E200" />
            <Range startValue={30} endValue={40} color="#77DD77" />
          </RangeContainer>
          <Tooltip enabled={true} />
          <Title text="Temperature in the Greenhouse">
            <Font size={28} />
          </Title>
        </CircularGauge>
        <SelectBox
          id="seasons"
          width={150}
          inputAttr={seasonLabel}
          dataSource={dataSource}
          defaultValue={dataSource[0]}
          displayExpr="name"
          onSelectionChanged={this.onSelectionChanged}
        />
      </div>
    );
  }

  customizeText({ valueText }) {
    return `${valueText} °C`;
  }
}

export default App;

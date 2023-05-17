import React from 'react';
import {
  CircularGauge, Scale, Label, Tooltip, Title, Font,
} from 'devextreme-react/circular-gauge';
import { NumberBox } from 'devextreme-react/number-box';
import { Button } from 'devextreme-react/button';

const mainGeneratorLabel = { 'aria-label': 'Main Generator' };
const additionalGeneratorOneLabel = { 'aria-label': 'Additional Generator One' };
const additionalGeneratorTwoLabel = { 'aria-label': 'Additional Generator Two' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainGeneratorValue: 34,
      additionalGenerator1Value: 12,
      additionalGenerator2Value: 23,
    };

    this.updateValues = () => {
      const gauge = this.gaugeRef.instance;
      gauge.value(this.state.mainGeneratorValue);
      gauge.subvalues([this.state.additionalGenerator1Value, this.state.additionalGenerator2Value]);
    };

    this.setMainGeneratorValue = (e) => {
      this.setState({
        mainGeneratorValue: e.value,
      });
    };

    this.setAdditionalGenerator1Value = (e) => {
      this.setState({
        additionalGenerator1Value: e.value,
      });
    };

    this.setAdditionalGenerator2Value = (e) => {
      this.setState({
        additionalGenerator2Value: e.value,
      });
    };

    this.storeGaugeRef = (ref) => {
      this.gaugeRef = ref;
    };
  }

  componentDidMount() {
    this.updateValues();
  }

  render() {
    return (
      <div id="gauge-demo">
        <div className="widget-container">
          <CircularGauge
            id="gauge"
            ref={this.storeGaugeRef}
          >
            <Scale startValue={10} endValue={40} tickInterval={5}>
              <Label customizeText={this.customizeText} />
            </Scale>
            <Tooltip enabled={true} />
            <Title text="Generators Voltage (kV)">
              <Font size={28} />
            </Title>
          </CircularGauge>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Main generator</span>&nbsp;
            <NumberBox
              id="main-generator"
              value={this.state.mainGeneratorValue}
              onValueChanged={this.setMainGeneratorValue}
              min={10}
              max={40}
              width={100}
              showSpinButtons={true}
              inputAttr={mainGeneratorLabel}
            />
          </div>
          <div className="option">
            <span>Additional generator 1</span>&nbsp;
            <NumberBox
              id="additional-generator-one"
              value={this.state.additionalGenerator1Value}
              onValueChanged={this.setAdditionalGenerator1Value}
              min={10}
              max={40}
              width={100}
              showSpinButtons={true}
              inputAttr={additionalGeneratorOneLabel}
            />
          </div>
          <div className="option">
            <span>Additional generator 2</span>&nbsp;
            <NumberBox
              id="additional-generator-two"
              value={this.state.additionalGenerator2Value}
              onValueChanged={this.setAdditionalGenerator2Value}
              min={10}
              max={40}
              width={100}
              showSpinButtons={true}
              inputAttr={additionalGeneratorTwoLabel}
            />
          </div>
          <div className="option">
            <Button
              id="edit"
              width={100}
              text="Apply"
              onClick={this.updateValues}
            />
          </div>
        </div>
      </div>
    );
  }

  customizeText({ valueText }) {
    return `${valueText} kV`;
  }
}

export default App;

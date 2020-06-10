import React from 'react';
import { Slider } from 'devextreme-react/slider';
import { NumberBox } from 'devextreme-react/number-box';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sliderValue: 10 };
    this.setSliderValue = this.setSliderValue.bind(this);
  }
  render() {
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <Slider min={0} max={100} defaultValue={90} />
            </div>
          </div>
          <div className="dx-field custom-height-slider">
            <div className="dx-field-label">With labels</div>
            <div className="dx-field-value">
              <Slider min={0} max={100} defaultValue={50} label={{
                visible: true,
                position: 'top',
                format
              }} />
            </div>
          </div>
          <div className="dx-field custom-height-slider">
            <div className="dx-field-label">With tooltip</div>
            <div className="dx-field-value">
              <Slider min={0} max={100} defaultValue={35} tooltip={{
                enabled: true,
                showMode: 'always',
                position: 'bottom',
                format
              }} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Without range highlighting</div>
            <div className="dx-field-value">
              <Slider min={0} max={100} defaultValue={20} showRange={false} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With discrete step</div>
            <div className="dx-field-value">
              <Slider min={0} max={100} defaultValue={10} step={10} tooltip={{ enabled: true }} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <Slider min={0} max={100} defaultValue={50} disabled={true} />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Event Handling and API</div>
          <div className="dx-field">
            <Slider min={0}
              max={100}
              value={this.state.sliderValue}
              onValueChanged={this.setSliderValue} />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Slider value</div>
            <div className="dx-field-value">
              <NumberBox min={0}
                max={100}
                value={this.state.sliderValue}
                showSpinButtons={true}
                onValueChanged={this.setSliderValue} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  setSliderValue({ value }) {
    this.setState({ sliderValue: value });
  }
}

function format(value) {
  return `${value}%`;
}

export default App;

import React from 'react';
import { RangeSlider, NumberBox } from 'devextreme-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: 10,
      endValue: 90
    };
    this.onRangeChanged = this.onRangeChanged.bind(this);
    this.onStartChanged = this.onStartChanged.bind(this);
    this.onEndChanged = this.onEndChanged.bind(this);
  }
  render() {
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={[20, 60]} />
            </div>
          </div>
          <div className="dx-field custom-height-slider">
            <div className="dx-field-label">With labels</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={[35, 65]} label={{
                visible: true,
                format,
                position: 'top'
              }} />
            </div>
          </div>
          <div className="dx-field custom-height-slider">
            <div className="dx-field-label">With tooltips</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={[15, 65]} tooltip={{
                enabled: true,
                format,
                showMode: 'always',
                position: 'bottom'
              }} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Without range highlighting</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={[20, 80]} showRange={false} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With discrete step</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={[20, 70]} step={10} tooltip={{ enabled: true }} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={[25, 75]} disabled={true} />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Event Handling and API</div>
          <div className="dx-field">
            <RangeSlider min={0} max={100} start={this.state.startValue} end={this.state.endValue} onValueChanged={this.onRangeChanged} />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Start value</div>
            <div className="dx-field-value">
              <NumberBox value={this.state.startValue} min={0} max={100} showSpinButtons={true} onValueChanged={this.onStartChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">End value</div>
            <div className="dx-field-value">
              <NumberBox value={this.state.endValue} min={0} max={100} showSpinButtons={true} onValueChanged={this.onEndChanged} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  onRangeChanged(data) {
    this.setState({
      startValue: data.start,
      endValue: data.end
    });
  }
  onStartChanged(data) {
    this.setState({
      startValue: data.value
    });
  }
  onEndChanged(data) {
    this.setState({
      endValue: data.value
    });
  }
}

function format(value) {
  return `${value}%`;
}

export default App;

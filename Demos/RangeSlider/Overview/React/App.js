import React from 'react';
import RangeSlider, { Tooltip, Label } from 'devextreme-react/range-slider';
import NumberBox from 'devextreme-react/number-box';

const defaultValues = {
  defaultMode: [20, 60],
  labels: [35, 65],
  tooltips: [15, 65],
  withoutRangeHighlighting: [20, 80],
  discreteStep: [20, 70],
  disabled: [25, 75],
};

const startValueLabel = { 'aria-label': 'Start Value' };
const endValueLabel = { 'aria-label': 'End Value' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: 10,
      endValue: 90,
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
              <RangeSlider min={0} max={100} defaultValue={defaultValues.defaultMode} />
            </div>
          </div>
          <div className="dx-field custom-height-slider">
            <div className="dx-field-label">With labels</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={defaultValues.labels}>
                <Label visible={true} format={format} position="top" />
              </RangeSlider>
            </div>
          </div>
          <div className="dx-field custom-height-slider">
            <div className="dx-field-label">With tooltips</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={defaultValues.tooltips}>
                <Tooltip enabled={true} format={format} showMode="always" position="bottom" />
              </RangeSlider>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Without range highlighting</div>
            <div className="dx-field-value">
              <RangeSlider
                min={0}
                max={100}
                defaultValue={defaultValues.withoutRangeHighlighting}
                showRange={false} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With discrete step</div>
            <div className="dx-field-value">
              <RangeSlider min={0} max={100} defaultValue={defaultValues.discreteStep} step={10}>
                <Tooltip enabled="true" />
              </RangeSlider>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <RangeSlider
                min={0}
                max={100}
                defaultValue={defaultValues.disabled}
                disabled={true} />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Process Value Changes</div>
          <div className="dx-field">
            <div className="dx-field-label">On handle movement</div>
            <div className="dx-field-value">
              <RangeSlider
                min={0}
                max={100}
                start={this.state.startValue}
                end={this.state.endValue}
                onValueChanged={this.onRangeChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">On handle release</div>
            <div className="dx-field-value">
              <RangeSlider
                min={0}
                max={100}
                start={this.state.startValue}
                end={this.state.endValue}
                valueChangeMode="onHandleRelease"
                onValueChanged={this.onRangeChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Start value</div>
            <div className="dx-field-value">
              <NumberBox
                value={this.state.startValue}
                min={0}
                max={100}
                showSpinButtons={true}
                inputAttr={startValueLabel}
                onValueChanged={this.onStartChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">End value</div>
            <div className="dx-field-value">
              <NumberBox
                value={this.state.endValue}
                min={0}
                max={100}
                showSpinButtons={true}
                inputAttr={endValueLabel}
                onValueChanged={this.onEndChanged} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  onRangeChanged(data) {
    this.setState({
      startValue: data.start,
      endValue: data.end,
    });
  }

  onStartChanged(data) {
    this.setState({
      startValue: data.value,
    });
  }

  onEndChanged(data) {
    this.setState({
      endValue: data.value,
    });
  }
}

function format(value) {
  return `${value}%`;
}

export default App;

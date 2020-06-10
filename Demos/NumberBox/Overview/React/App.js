import React from 'react';
import { NumberBox } from 'devextreme-react/number-box';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 30,
      value: 16
    };
    this.valueChanged = this.valueChanged.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }
  valueChanged(e) {
    this.setState({
      value: e.value
    });
  }
  keyDown(e) {
    const event = e.event;
    const str = event.key || String.fromCharCode(event.which);
    if(/^[.,e]$/.test(str)) {
      event.preventDefault();
    }
  }
  render() {
    let { value, max } = this.state;
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <NumberBox />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With spin and clear buttons</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={20.5}
                showSpinButtons={true}
                showClearButton={true}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={20.5}
                showSpinButtons={true}
                showClearButton={true}
                disabled={true}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With max and min values</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={15}
                min={10}
                max={20}
                showSpinButtons={true}
              />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Event Handling</div>
          <div className="dx-field">
            <div className="dx-field-label">This month sales</div>
            <div className="dx-field-value">
              <NumberBox
                value={value}
                max={max}
                min={0}
                showSpinButtons={true}
                onKeyDown={this.keyDown}
                onValueChanged={this.valueChanged}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Stock</div>
            <div className="dx-field-value">
              <NumberBox
                min={0}
                showSpinButtons={false}
                readOnly={true}
                value={ max - value }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

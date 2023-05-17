import React from 'react';
import { NumberBox } from 'devextreme-react/number-box';

const simpleLabel = { 'aria-label': 'Simple' };
const withSpinAndButtonsLabel = { 'aria-label': 'With Spin And Buttons' };
const disabledLabel = { 'aria-label': 'Disabled' };
const maxAndMinLabel = { 'aria-label': 'Min And Max' };
const salesLabel = { 'aria-label': 'Sales' };
const stockLabel = { 'aria-label': 'Stock' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 30,
      value: 16,
    };
    this.valueChanged = this.valueChanged.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  valueChanged(e) {
    this.setState({
      value: e.value,
    });
  }

  keyDown(e) {
    const { event } = e;
    const str = event.key || String.fromCharCode(event.which);
    if (/^[.,e]$/.test(str)) {
      event.preventDefault();
    }
  }

  render() {
    const { value, max } = this.state;
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <NumberBox inputAttr={simpleLabel} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With spin and clear buttons</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={20.5}
                showSpinButtons={true}
                showClearButton={true}
                inputAttr={withSpinAndButtonsLabel}
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
                inputAttr={disabledLabel}
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
                inputAttr={maxAndMinLabel}
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
                inputAttr={salesLabel}
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
                inputAttr={stockLabel}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

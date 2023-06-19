import React from 'react';
import { CheckBox } from 'devextreme-react/check-box';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      checkBoxValue: null,
    };
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  onValueChanged(args) {
    this.setState({
      checkBoxValue: args.value,
    });
  }

  render() {
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Checked</div>
            <div className="dx-field-value">
              <CheckBox defaultValue={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Unchecked</div>
            <div className="dx-field-value">
              <CheckBox defaultValue={false} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Indeterminate</div>
            <div className="dx-field-value">
              <CheckBox defaultValue={null} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Three state mode</div>
            <div className="dx-field-value">
              <CheckBox
                enableThreeStateBehavior={true}
                defaultValue={null}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Handle value change</div>
            <div className="dx-field-value">
              <CheckBox value={this.state.checkBoxValue} onValueChanged={this.onValueChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <CheckBox
                disabled={true}
                value={this.state.checkBoxValue}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Custom size</div>
            <div className="dx-field-value">
              <CheckBox
                defaultValue={null}
                iconSize={30}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With label</div>
            <div className="dx-field-value">
              <CheckBox
                defaultValue={true}
                text="Label"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

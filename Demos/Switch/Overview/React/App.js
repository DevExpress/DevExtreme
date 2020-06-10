import React from 'react';
import { Switch } from 'devextreme-react/switch';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: false
    };

    this.valueChanged = this.valueChanged.bind(this);
  }
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Switched on</div>
            <div className="dx-field-value">
              <Switch defaultValue={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Switched off</div>
            <div className="dx-field-value">
              <Switch defaultValue={false} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Value change handling</div>
            <div className="dx-field-value">
              <Switch
                value={this.state.value}
                onValueChanged={this.valueChanged}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <Switch
                value={this.state.value}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  valueChanged(e) {
    this.setState({
      value: e.value
    });
  }
}

export default App;

import React from 'react';
import { TextBox } from 'devextreme-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: 'smith@corp.com'
    };
    this.rules = { 'X': /[02-9]/ };
    this.valueChanged = this.valueChanged.bind(this);
  }
  valueChanged(data) {
    this.setState({
      emailValue: `${data.value.replace(/\s/g, '').toLowerCase() }@corp.com`
    });
  }
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <TextBox defaultValue="John Smith" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With placeholder</div>
            <div className="dx-field-value">
              <TextBox placeholder="Enter full name here..." />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With clear button</div>
            <div className="dx-field-value">
              <TextBox defaultValue="John Smith"
                showClearButton={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Password mode</div>
            <div className="dx-field-value">
              <TextBox mode="password"
                placeholder="Enter password"
                showClearButton={true}
                defaultValue="f5lzKs0T" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Text mask</div>
            <div className="dx-field-value">
              <TextBox mask="+1 (X00) 000-0000"
                maskRules={this.rules} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <TextBox defaultValue="John Smith"
                disabled={true} />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Events and API</div>
          <div className="dx-field">
            <div className="dx-field-label">Full Name</div>
            <div className="dx-field-value">
              <TextBox defaultValue="Smith"
                showClearButton={true}
                placeholder="Enter full name"
                valueChangeEvent="keyup"
                onValueChanged={this.valueChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Email (read only)</div>
            <div className="dx-field-value">
              <TextBox readOnly={true}
                hoverStateEnabled={false}
                value={this.state.emailValue} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

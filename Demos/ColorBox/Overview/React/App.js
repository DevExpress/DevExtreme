import React from 'react';
import ColorBox from 'devextreme-react/color-box';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { color: '#f05b41' };
    this.handleColorChange = ({ value }) => this.setState({ color: value });
  }

  render() {
    return (
      <React.Fragment>
        <div className="form">
          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-label">Default mode</div>
              <div className="dx-field-value">
                <ColorBox
                  defaultValue="#f05b41"
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">With alpha channel editing</div>
              <div className="dx-field-value">
                <ColorBox
                  defaultValue="#f05b41"
                  editAlphaChannel={true}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Custom button captions</div>
              <div className="dx-field-value">
                <ColorBox
                  defaultValue="#f05b41"
                  applyButtonText="Apply"
                  cancelButtonText="Decline"
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Read only</div>
              <div className="dx-field-value">
                <ColorBox
                  defaultValue="#f05b41"
                  readOnly={true}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Disabled</div>
              <div className="dx-field-value">
                <ColorBox
                  defaultValue="#f05b41"
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="dx-fieldset">
            <div className="dx-fieldset-header">Event Handling</div>
            <div className="hero-block">
              <div className="color-block" style={{ backgroundColor: this.state.color }}>
                <div className="superhero"></div>
              </div>
              <div className="hero-color-box">
                <ColorBox
                  value={this.state.color}
                  applyValueMode="instantly"
                  onValueChanged={this.handleColorChange}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;

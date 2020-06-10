import React from 'react';

import { Button } from 'devextreme-react/button';
import { CheckBox } from 'devextreme-react/check-box';
import { LoadPanel } from 'devextreme-react/load-panel';
import { employee } from './data.js';

const position = { of: '#employee' };

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      employeeInfo: {},
      loadPanelVisible: false,
      showIndicator: true,
      shading: true,
      showPane: true,
      closeOnOutsideClick: false
    };

    this.onClick = this.onClick.bind(this);
    this.hideLoadPanel = this.hideLoadPanel.bind(this);
    this.onShowIndicatorChange = this.onShowIndicatorChange.bind(this);
    this.onShadingChange = this.onShadingChange.bind(this);
    this.onShowPaneChange = this.onShowPaneChange.bind(this);
    this.onCloseOnOutsideClickChange = this.onCloseOnOutsideClickChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <h1>John Heart</h1>
        &nbsp;
        <Button text="Load Data" onClick={this.onClick}></Button>

        <div id="employee">

          <p>
            Birth date: <b>{this.state.employeeInfo.Birth_Date}</b>
          </p>

          <p className="address">
            Address:<br />
            <b>{this.state.employeeInfo.City}</b><br />
            <span>{this.state.employeeInfo.Zipcode}</span> <span>{this.state.employeeInfo.Address}</span>
          </p>

          <p>
            Phone: <b>{this.state.employeeInfo.Mobile_Phone}</b><br />
            Email: <b>{this.state.employeeInfo.Email}</b>
          </p>
        </div>

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          position={position}
          onHiding={this.hideLoadPanel}
          visible={this.state.loadPanelVisible}
          showIndicator={this.state.showIndicator}
          shading={this.state.shading}
          showPane={this.state.showPane}
          closeOnOutsideClick={this.state.closeOnOutsideClick}
        />

        <div className="options">

          <div className="caption">Options</div>

          <div className="option">
            <CheckBox
              text="With indicator"
              value={this.state.showIndicator}
              onValueChanged={this.onShowIndicatorChange}
            />
          </div>

          <div className="option">
            <CheckBox
              text="With overlay"
              value={this.state.shading}
              onValueChanged={this.onShadingChange}
            />
          </div>

          <div className="option">
            <CheckBox
              text="With pane"
              value={this.state.showPane}
              onValueChanged={this.onShowPaneChange}
            />
          </div>

          <div className="option">
            <CheckBox
              text="Close on outside click"
              value={this.state.closeOnOutsideClick}
              onValueChanged={this.onCloseOnOutsideClickChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  onClick() {
    this.setState({
      employeeInfo: {},
      loadPanelVisible: true
    }, () => {
      setTimeout(this.hideLoadPanel, 3000);
    });
  }

  hideLoadPanel() {
    this.setState({
      loadPanelVisible: false,
      employeeInfo: employee
    });
  }

  onShowIndicatorChange(e) {
    this.setState({
      showIndicator: e.value
    });
  }

  onShadingChange(e) {
    this.setState({
      shading: e.value
    });
  }

  onShowPaneChange(e) {
    this.setState({
      showPane: e.value
    });
  }

  onCloseOnOutsideClickChange(e) {
    this.setState({
      closeOnOutsideClick: e.value
    });
  }
}

export default App;

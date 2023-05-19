import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import NumberBox from 'devextreme-react/number-box';
import Form from 'devextreme-react/form';
import service from './data.js';

const labelModes = ['outside', 'static', 'floating', 'hidden'];
const labelLocations = ['left', 'top'];
const columnsCount = ['auto', 1, 2, 3];
const minColumnWidths = [150, 200, 300];
const widthLabel = { 'aria-label': 'Width' };
const companyLabel = { 'aria-label': 'Company' };
const labelModeLabel = { 'aria-label': 'Label Mode' };
const labelLocationLabel = { 'aria-label': 'Label Location' };
const columnCountLabel = { 'aria-label': 'Column Count' };
const minCountWidthLabel = { 'aria-label': 'Min Count Width' };

class App extends React.Component {
  constructor() {
    super();
    this.companies = service.getCompanies();
    this.state = {
      labelMode: 'floating',
      labelLocation: 'left',
      readOnly: false,
      showColon: true,
      minColWidth: 300,
      colCount: 2,
      company: this.companies[0],
    };
    this.onCompanyChanged = this.onCompanyChanged.bind(this);
    this.onLabelModeChanged = this.onLabelModeChanged.bind(this);
    this.onLabelLocationChanged = this.onLabelLocationChanged.bind(this);
    this.onReadOnlyChanged = this.onReadOnlyChanged.bind(this);
    this.onShowColonChanged = this.onShowColonChanged.bind(this);
    this.onMinColWidthChanged = this.onMinColWidthChanged.bind(this);
    this.onColumnsCountChanged = this.onColumnsCountChanged.bind(this);
    this.onFormWidthChanged = this.onFormWidthChanged.bind(this);
  }

  render() {
    const {
      labelMode,
      labelLocation,
      readOnly,
      showColon,
      minColWidth,
      colCount,
      company,
      width,
    } = this.state;

    const companySelectorLabelMode = labelMode === 'outside'
      ? 'hidden'
      : labelMode;

    return (
      <div id="form-demo">
        <div className="widget-container">
          { labelMode === 'outside' && (<div>Select company:</div>) }
          <SelectBox
            displayExpr="Name"
            dataSource={this.companies}
            inputAttr={companyLabel}
            labelMode={companySelectorLabelMode}
            label='Select company'
            value={company}
            onValueChanged={this.onCompanyChanged}
          />
          <Form
            id="form"
            labelMode={labelMode}
            formData={company}
            readOnly={readOnly}
            showColonAfterLabel={showColon}
            labelLocation={labelLocation}
            minColWidth={minColWidth}
            colCount={colCount}
            width={width}
          />
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Label mode:</span>
            <SelectBox
              items={labelModes}
              inputAttr={labelModeLabel}
              value={labelMode}
              onValueChanged={this.onLabelModeChanged}
            />
          </div>
          <div className="option">
            <span>Label location:</span>
            <SelectBox
              items={labelLocations}
              inputAttr={labelLocationLabel}
              value={labelLocation}
              onValueChanged={this.onLabelLocationChanged}
            />
          </div>
          <div className="option">
            <span>Columns count:</span>
            <SelectBox
              items={columnsCount}
              value={colCount}
              inputAttr={columnCountLabel}
              onValueChanged={this.onColumnsCountChanged}
            />
          </div>
          <div className="option">
            <span>Min column width:</span>
            <SelectBox
              items={minColumnWidths}
              value={minColWidth}
              inputAttr={minCountWidthLabel}
              onValueChanged={this.onMinColWidthChanged}
            />
          </div>
          <div className="option">
            <span>Form width:</span>
            <NumberBox
              max={550}
              value={width}
              inputAttr={widthLabel}
              onValueChanged={this.onFormWidthChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="readOnly"
              value={readOnly}
              onValueChanged={this.onReadOnlyChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="showColonAfterLabel"
              value={showColon}
              onValueChanged={this.onShowColonChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onCompanyChanged(e) {
    this.setState({
      company: e.value,
    });
  }

  onLabelModeChanged(e) {
    this.setState({
      labelMode: e.value,
    });
  }

  onLabelLocationChanged(e) {
    this.setState({
      labelLocation: e.value,
    });
  }

  onReadOnlyChanged(e) {
    this.setState({
      readOnly: e.value,
    });
  }

  onShowColonChanged(e) {
    this.setState({
      showColon: e.value,
    });
  }

  onMinColWidthChanged(e) {
    this.setState({
      minColWidth: e.value,
    });
  }

  onColumnsCountChanged(e) {
    this.setState({
      colCount: e.value,
    });
  }

  onFormWidthChanged(e) {
    this.setState({
      width: e.value,
    });
  }
}

export default App;

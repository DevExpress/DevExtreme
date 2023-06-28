import React from 'react';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import { SelectBox } from 'devextreme-react';
import { employees, applyValueModeLabel, lookupLabel } from './data.js';

const applyValueModes = ['instantly', 'useButtons'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null,
      applyValueMode: 'instantly',
    };
    this.onValueChanged = this.onValueChanged.bind(this);
    this.changeApplyValueMode = this.changeApplyValueMode.bind(this);
  }

  render() {
    const { selectedValue, applyValueMode } = this.state;
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <Lookup
              value={selectedValue}
              items={employees}
              displayExpr={getDisplayExpr}
              placeholder="Select employee"
              inputAttr={lookupLabel}
              onValueChanged={this.onValueChanged}
              applyValueMode={applyValueMode}
            >
              <DropDownOptions showTitle={false} />
            </Lookup>
          </div>
        </div>
        {selectedValue
          && <div className="selected">
            <div className="frame">
              <img src={selectedValue.Picture} />
            </div>
            <div id="selected-employee-notes">{selectedValue.Notes}</div>
          </div>
        }

        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <div className="label">Apply Value Mode</div>
            <SelectBox
              items={applyValueModes}
              inputAttr={applyValueModeLabel}
              value={applyValueMode}
              onValueChanged={this.changeApplyValueMode} />
          </div>
        </div>
      </div>
    );
  }

  onValueChanged(e) {
    this.setState({
      selectedValue: e.value,
    });
  }

  changeApplyValueMode(e) {
    this.setState({
      applyValueMode: e.value,
    });
  }
}

function getDisplayExpr(item) {
  return item ? `${item.FirstName} ${item.LastName}` : '';
}

export default App;

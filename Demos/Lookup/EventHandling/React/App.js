import React from 'react';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import { employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null
    };
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  render() {
    const selectedValue = this.state.selectedValue;
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <Lookup
              value={selectedValue}
              items={employees}
              displayExpr={getDisplayExpr}
              placeholder="Select employee"
              onValueChanged={this.onValueChanged}
            >
              <DropDownOptions showTitle={false} />
            </Lookup>
          </div>
        </div>
        {selectedValue &&
          <div className="selected">
            <img src={selectedValue.Picture} />
            <span>{selectedValue.Notes}</span>
          </div>
        }
      </div>
    );
  }

  onValueChanged(e) {
    this.setState({
      selectedValue: e.value
    });
  }
}

function getDisplayExpr(item) {
  return item ? `${item.FirstName} ${item.LastName}` : '';
}

export default App;

import React from 'react';
import { DateBox } from 'devextreme-react';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: new Date(1981, 3, 27)
    };
    this.now = new Date();
    this.firstWorkDay2017 = new Date(2017, 0, 3);
    this.min = new Date(1900, 0, 1);
    this.dateClear = new Date(2015, 11, 1, 6);
    this.disabledDates = service.getFederalHolidays();
    this.onValueChanged = this.onValueChanged.bind(this);
  }
  get diffInDay() {
    return `${Math.floor(Math.abs(((new Date()).getTime() - this.state.value.getTime()) / (24 * 60 * 60 * 1000))) } days`;
  }
  onValueChanged(e) {
    this.setState({
      value: e.value
    });
  }
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Date</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.now}
                type="date" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Time</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.now}
                type="time" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Date and time</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.now}
                type="datetime" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Custom format</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.now}
                displayFormat="EEEE, MMM dd" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Date picker</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.now}
                pickerType="rollers" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Clear button</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.dateClear}
                type="time"
                showClearButton={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.now}
                type="datetime"
                disabled={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disable certain dates</div>
            <div className="dx-field-value">
              <DateBox defaultValue={this.firstWorkDay2017}
                type="date"
                pickerType="calendar"
                disabledDates={this.disabledDates} />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Event Handling</div>
          <div className="dx-field">
            <div className="dx-field-label">Set Birthday</div>
            <div className="dx-field-value">
              <DateBox applyValueMode="useButtons"
                value={this.state.value}
                min={this.min}
                max={this.now}
                onValueChanged={this.onValueChanged} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-value">
          Your age is <div id="age">{this.diffInDay}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

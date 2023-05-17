import React from 'react';
import DateBox from 'devextreme-react/date-box';

const date = new Date(2018, 9, 16, 15, 8, 12);
const dataTimeLabel = { 'aria-label': 'Date Time' };
const dateLabel = { 'aria-label': 'Date' };

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Locale-dependent format</div>
            <div className="dx-field-value">
              <DateBox
                type="datetime"
                placeholder="12/31/2018, 2:52 PM"
                showClearButton={true}
                inputAttr={dataTimeLabel}
                useMaskBehavior={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Built-in predefined format</div>
            <div className="dx-field-value">
              <DateBox defaultValue={date}
                placeholder="10/16/2018"
                showClearButton={true}
                inputAttr={dateLabel}
                useMaskBehavior={true}
                type="date"
                displayFormat="shortdate" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">LDML pattern</div>
            <div className="dx-field-value">
              <DateBox defaultValue={date}
                placeholder="Tuesday, 16 of Oct, 2018 14:52"
                showClearButton={true}
                inputAttr={dateLabel}
                useMaskBehavior={true}
                displayFormat="EEEE, d of MMM, yyyy HH:mm" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Format with literal characters</div>
            <div className="dx-field-value">
              <DateBox defaultValue={date}
                placeholder="Year: 2018"
                showClearButton={true}
                useMaskBehavior={true}
                inputAttr={dateLabel}
                type="date"
                displayFormat={"'Year': yyyy"} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

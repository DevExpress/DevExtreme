import React from 'react';
import DateBox from 'devextreme-react/date-box';

import service from './data.js';

const dateTimeLabel = { 'aria-label': 'Date Time' };
const dateLabel = { 'aria-label': 'Date' };
const timeLabel = { 'aria-label': 'Time' };
const disabledLabel = { 'aria-label': 'Disabled' };
const pickerLabel = { 'aria-label': 'Picker' };
const clearLabel = { 'aria-label': 'Clear' };
const customFormatLabel = { 'aria-label': 'Custom Format' };
const birthDateLabel = { 'aria-label': 'Birth Date' };

function App() {
  const [value, setValue] = React.useState(new Date(1981, 3, 27));
  const now = new Date();
  const firstWorkDay2017 = new Date(2017, 0, 3);
  const min = new Date(1900, 0, 1);
  const dateClear = new Date(2015, 11, 1, 6);
  const disabledDates = service.getFederalHolidays();

  const diffInDay = React.useMemo(() => `${Math.floor(
    Math.abs((new Date().getTime() - value.getTime()) / (24 * 60 * 60 * 1000)),
  )} days`,
  [value]);

  const onValueChanged = React.useCallback((e) => {
    setValue(e.value);
  }, []);

  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Date</div>
          <div className="dx-field-value">
            <DateBox defaultValue={now} inputAttr={dateLabel} type="date" />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Time</div>
          <div className="dx-field-value">
            <DateBox defaultValue={now} inputAttr={timeLabel} type="time" />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Date and time</div>
          <div className="dx-field-value">
            <DateBox defaultValue={now} inputAttr={dateTimeLabel} type="datetime" />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Custom format</div>
          <div className="dx-field-value">
            <DateBox
              defaultValue={now}
              inputAttr={customFormatLabel}
              displayFormat="EEEE, MMM dd"
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Date picker</div>
          <div className="dx-field-value">
            <DateBox defaultValue={now} inputAttr={pickerLabel} pickerType="rollers" />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Clear button</div>
          <div className="dx-field-value">
            <DateBox
              defaultValue={dateClear}
              type="time"
              inputAttr={clearLabel}
              showClearButton={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <DateBox
              defaultValue={now}
              type="datetime"
              inputAttr={disabledLabel}
              disabled={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disable certain dates</div>
          <div className="dx-field-value">
            <DateBox
              defaultValue={firstWorkDay2017}
              type="date"
              pickerType="calendar"
              inputAttr={disabledLabel}
              disabledDates={disabledDates}
            />
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Event Handling</div>
        <div className="dx-field">
          <div className="dx-field-label">Set Birthday</div>
          <div className="dx-field-value">
            <DateBox
              applyValueMode="useButtons"
              value={value}
              min={min}
              max={now}
              inputAttr={birthDateLabel}
              onValueChanged={onValueChanged}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-value">Your age is <div id="age">{diffInDay}</div></div>
        </div>
      </div>
    </div>
  );
}

export default App;

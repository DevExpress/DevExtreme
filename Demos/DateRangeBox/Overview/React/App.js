import React from 'react';
import DateRangeBox from 'devextreme-react/date-range-box';

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date();
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const initialValue = [
  new Date(now.getTime() - msInDay * 3),
  new Date(now.getTime() + msInDay * 3),
];
const min = new Date(now.setDate(1));
const max = new Date(now.setDate(lastDay));

function convertRangeToDays([startDate, endDate]) {
  const diffInDay = Math.floor(Math.abs((endDate - startDate) / msInDay));

  return diffInDay + 1;
}

export default function App() {
  const [selectedDays, setSelectedDays] = React.useState(convertRangeToDays(initialValue));

  const onCurrentValueChange = React.useCallback(({ value: [startDate, endDate] }) => {
    let daysCount = 0;

    if (startDate && endDate) {
      daysCount = convertRangeToDays([startDate, endDate]);
    }

    setSelectedDays(daysCount);
  }, [setSelectedDays]);

  return (
    <div className="dx-fieldset">
      <div className="dx-field">
        <div className="dx-field-label multiline-label">
          <span>Default functionality</span>
          <div className="selected-days-wrapper ">
            <span>Days selected: </span>
            <span>{ selectedDays }</span>
          </div>
        </div>
        <div className="dx-field-value">
          <DateRangeBox
            defaultValue={initialValue}
            onValueChanged={onCurrentValueChange}
          />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Custom format</div>
        <div className="dx-field-value">
          <DateRangeBox
            defaultValue={initialValue}
            displayFormat="EEEE, MMM dd"
          />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Use buttons to apply selection</div>
        <div className="dx-field-value">
          <DateRangeBox applyValueMode="useButtons" />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Single-calendar View</div>
        <div className="dx-field-value">
          <DateRangeBox multiView={false} />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Calendar only appears on icon click</div>
        <div className="dx-field-value">
          <DateRangeBox openOnFieldClick={false} />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Limit available dates (this month)</div>
        <div className="dx-field-value">
          <DateRangeBox
            min={min}
            max={max}
          />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">Clear button</div>
        <div className="dx-field-value">
          <DateRangeBox
            defaultValue={initialValue}
            showClearButton
          />
        </div>
      </div>
    </div>
  );
}

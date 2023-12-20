import React, { useCallback, useRef, useState } from 'react';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import Calendar, { CalendarTypes } from 'devextreme-react/calendar';

const selectionModes = ['single', 'multiple', 'range'];
const selectionModeLabel = { 'aria-label': 'Selection Mode' };

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
const isDateDisabled = ({ view, date }) => view === 'month' && isWeekend(date);
const now = new Date().getTime();
const msInDay = 1000 * 60 * 60 * 24;
const initialValue = [now, now + msInDay];

export default function App() {
  const calendar = useRef(null);
  const [selectWeekOnClick, setSelectWeekOnClick] = useState(true);
  const [selectionMode, setSelectionMode] = useState<CalendarTypes.CalendarSelectionMode>('multiple');
  const [minDateValue, setMinDateValue] = useState(null);
  const [maxDateValue, setMaxDateValue] = useState(null);
  const [weekendDisabled, setWeekendDisabled] = useState(null);

  const onSelectWeekOnClickChange = useCallback(({ value }) => {
    setSelectWeekOnClick(value);
  }, [setSelectWeekOnClick]);

  const onSelectionModeChange = useCallback(({ value }) => {
    setSelectionMode(value);
  }, [setSelectionMode]);

  const onMinDateChange = useCallback(({ value }) => {
    setMinDateValue(
      value ? new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3) : null,
    );
  }, [setMinDateValue]);

  const onMaxDateChange = useCallback(({ value }) => {
    setMaxDateValue(
      value ? new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3) : null,
    );
  }, [setMaxDateValue]);

  const onDisableWeekendChange = useCallback(({ value }) => {
    setWeekendDisabled(value);
  }, [setWeekendDisabled]);

  const onClearButtonClick = useCallback(() => {
    calendar.current.instance.clear();
  }, []);

  return (
    <div id="calendar-demo">
      <div className="calendar-container">
        <Calendar
          ref={calendar}
          showWeekNumbers={true}
          selectWeekOnClick={selectWeekOnClick}
          selectionMode={selectionMode}
          min={minDateValue}
          max={maxDateValue}
          defaultValue={initialValue}
          disabledDates={weekendDisabled ? isDateDisabled : null}
        />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            defaultValue={true}
            text="Select week on click"
            onValueChanged={onSelectWeekOnClickChange}
          />
        </div>
        <div className="option">
          <span>Selection mode</span>
          <SelectBox
            dataSource={selectionModes}
            value={selectionMode}
            inputAttr={selectionModeLabel}
            onValueChanged={onSelectionModeChange}
          />
        </div>
        <div className="option caption">
          <span>Date availability</span>
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Set minimum date"
            onValueChanged={onMinDateChange}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Set maximum date"
            onValueChanged={onMaxDateChange}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Disable weekends"
            onValueChanged={onDisableWeekendChange}
          />
        </div>
        <div className="option">
          <Button
            text="Clear value"
            onClick={onClearButtonClick}
          />
        </div>
      </div>
    </div>
  );
}

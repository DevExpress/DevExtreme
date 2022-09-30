import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import Calendar from 'devextreme-react/calendar';
import CustomCell, { isWeekend } from './CustomCell.js';

const zoomLevels = ['month', 'year', 'decade', 'century'];

export default function App() {
  const [minDateValue, setMinDateValue] = React.useState(null);
  const [maxDateValue, setMaxDateValue] = React.useState(null);
  const [weekendDisabled, setWeekendDisabled] = React.useState(null);
  const [firstDay, setFirstDay] = React.useState(0);
  const [showWeekNumbers, setShowWeekNumbers] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(new Date());
  const [useCellTemplate, setUseCellTemplate] = React.useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState('month');

  const onCurrentValueChange = React.useCallback(({ value }) => {
    setCurrentValue(value);
  }, [setCurrentValue]);

  const onDisabledChange = React.useCallback(({ value }) => {
    setDisabled(value);
  }, [setDisabled]);

  const onZoomLevelChange = React.useCallback(({ value }) => {
    setZoomLevel(value);
  }, [setZoomLevel]);

  const onMinDateChange = React.useCallback(({ value }) => {
    setMinDateValue(
      value ? new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3) : null,
    );
  }, [setMinDateValue]);

  const onMaxDateChanged = React.useCallback(({ value }) => {
    setMaxDateValue(
      value ? new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3) : null,
    );
  }, [setMaxDateValue]);

  const onDisableWeekendChange = React.useCallback(({ value }) => {
    setWeekendDisabled(value);
  }, [setWeekendDisabled]);

  const onFirstDayChange = React.useCallback(({ value }) => {
    setFirstDay(value ? 1 : 0);
  }, [setFirstDay]);

  const onShowWeekNumbersChange = React.useCallback(({ value }) => {
    setShowWeekNumbers(value);
  }, [setShowWeekNumbers]);

  const onUseCellTemplateChange = React.useCallback(({ value }) => {
    setUseCellTemplate(!!value);
  }, [setUseCellTemplate]);

  const isDateDisabled = React.useCallback(({ view, date }) => view === 'month' && isWeekend(date), []);

  const onOptionChange = React.useCallback((e) => {
    if (e.name === 'zoomLevel') {
      onZoomLevelChange(e);
    }
  }, [onZoomLevelChange]);

  return (
    <React.Fragment>
      <div className="widget-container">
        <Calendar
          id="calendar-container"
          value={currentValue}
          onValueChanged={onCurrentValueChange}
          onOptionChanged={onOptionChange}
          min={minDateValue}
          max={maxDateValue}
          disabledDates={weekendDisabled ? isDateDisabled : null}
          firstDayOfWeek={firstDay}
          showWeekNumbers={showWeekNumbers}
          disabled={disabled}
          zoomLevel={zoomLevel}
          cellRender={useCellTemplate ? CustomCell : null}
        />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Specified min value"
            onValueChanged={onMinDateChange}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Specified max value"
            onValueChanged={onMaxDateChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Disable weekend"
            onValueChanged={onDisableWeekendChange}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Monday as the first day of a week"
            onValueChanged={onFirstDayChange}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Show week numbers"
            onValueChanged={onShowWeekNumbersChange}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Use the Custom Cell Template"
            onValueChanged={onUseCellTemplateChange}
          />
        </div>
        <div className="option">
          <CheckBox
            value={disabled}
            text="Disabled"
            onValueChanged={onDisabledChange}
          />
        </div>
        <div className="option">
          <span>Zoom level</span>
          <SelectBox
            dataSource={zoomLevels}
            value={zoomLevel}
            onValueChanged={onZoomLevelChange}
          />
        </div>
        <div className="option">
          <span>Selected date</span>
          <DateBox
            id="selected-date"
            value={currentValue}
            width="100%"
            onValueChanged={onCurrentValueChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}


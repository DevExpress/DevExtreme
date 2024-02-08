import React, { useCallback, useState } from 'react';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import Calendar, { CalendarTypes } from 'devextreme-react/calendar';
import CustomCell from './CustomCell.tsx';

const zoomLevels = ['month', 'year', 'decade', 'century'];
const weekNumberRules = ['auto', 'firstDay', 'firstFourDays', 'fullWeek'];
const weekDays = [
  { id: 0, text: 'Sunday' },
  { id: 1, text: 'Monday' },
  { id: 2, text: 'Tuesday' },
  { id: 3, text: 'Wednesday' },
  { id: 4, text: 'Thursday' },
  { id: 5, text: 'Friday' },
  { id: 6, text: 'Saturday' },
];

const dateBoxLabel = { 'aria-label': 'Date' };
const zoomLevelLabel = { 'aria-label': 'Zoom Level' };
const dayLabel = { 'aria-label': 'First Day of Week' };
const ruleLabel = { 'aria-label': 'Week Number Rule' };

export default function App() {
  const [zoomLevel, setZoomLevel] = useState<CalendarTypes.CalendarZoomLevel>('month');
  const [currentValue, setCurrentValue] = useState(new Date());
  const [useCellTemplate, setUseCellTemplate] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [showWeekNumbers, setShowWeekNumbers] = useState(false);
  const [firstDay, setFirstDay] = useState<CalendarTypes.FirstDayOfWeek>(0);
  const [weekNumberRule, setWeekNumberRule] = useState<CalendarTypes.WeekNumberRule>('auto');

  const onCurrentValueChange = useCallback(
    ({ value }) => {
      setCurrentValue(value);
    },
    [setCurrentValue],
  );

  const onDisabledChange = useCallback(
    ({ value }) => {
      setDisabled(value);
    },
    [setDisabled],
  );

  const onZoomLevelChange = useCallback(
    ({ value }) => {
      setZoomLevel(value);
    },
    [setZoomLevel],
  );

  const onFirstDayChange = useCallback(
    ({ value }) => {
      setFirstDay(value);
    },
    [setFirstDay],
  );

  const onWeekNumberRuleChange = useCallback(
    ({ value }) => {
      setWeekNumberRule(value);
    },
    [setWeekNumberRule],
  );

  const onShowWeekNumbersChange = useCallback(
    ({ value }) => {
      setShowWeekNumbers(value);
    },
    [setShowWeekNumbers],
  );

  const onUseCellTemplateChange = useCallback(
    ({ value }) => {
      setUseCellTemplate(!!value);
    },
    [setUseCellTemplate],
  );

  const onOptionChange = useCallback(
    (e: { name: string }) => {
      if (e.name === 'zoomLevel') {
        onZoomLevelChange(e);
      }
    },
    [onZoomLevelChange],
  );

  return (
    <div id="calendar-demo">
      <div className="calendar-container">
        <Calendar
          value={currentValue}
          onValueChanged={onCurrentValueChange}
          onOptionChanged={onOptionChange}
          firstDayOfWeek={firstDay}
          weekNumberRule={weekNumberRule}
          showWeekNumbers={showWeekNumbers}
          disabled={disabled}
          zoomLevel={zoomLevel}
          cellComponent={useCellTemplate ? CustomCell : null}
        />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Zoom level</span>
          <SelectBox
            dataSource={zoomLevels}
            value={zoomLevel}
            inputAttr={zoomLevelLabel}
            onValueChanged={onZoomLevelChange}
          />
        </div>
        <div className="option">
          <span>Selected date</span>
          <DateBox
            id="selected-date"
            value={currentValue}
            onValueChanged={onCurrentValueChange}
            inputAttr={dateBoxLabel}
          />
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Use custom cell template"
            onValueChanged={onUseCellTemplateChange}
          />
        </div>
        <div className="option">
          <CheckBox
            value={disabled}
            text="Disable the calendar"
            onValueChanged={onDisabledChange}
          />
        </div>
        <div className="caption option">
          <span>Week numeration</span>
        </div>
        <div className="option">
          <CheckBox
            defaultValue={false}
            text="Show week numbers"
            onValueChanged={onShowWeekNumbersChange}
          />
        </div>
        <div className="option">
          <span>First day of week</span>
          <SelectBox
            dataSource={weekDays}
            inputAttr={dayLabel}
            displayExpr="text"
            valueExpr="id"
            value={firstDay}
            onValueChanged={onFirstDayChange}
          />
        </div>
        <div className="option">
          <span>Week number rule</span>
          <SelectBox
            dataSource={weekNumberRules}
            inputAttr={ruleLabel}
            value={weekNumberRule}
            onValueChanged={onWeekNumberRuleChange}
          />
        </div>
      </div>
    </div>
  );
}

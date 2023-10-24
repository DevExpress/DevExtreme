import React from 'react';
import Utils from './utils.js';

const DateCell = (props) => {
  const { currentView, date, text } = props.itemData;
  const isDisabled = currentView === 'month' ? Utils.isWeekend(date) : Utils.isDisableDate(date);
  return (
    <div className={isDisabled ? 'disable-date' : null}>
      <div>{text}</div>
    </div>
  );
};
export default DateCell;

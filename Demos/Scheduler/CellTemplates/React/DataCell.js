import React from 'react';
import Utils from './utils.js';

export default function DataCell(props) {
  const { startDate } = props.itemData;
  const isDisableDate = Utils.isHoliday(startDate) || Utils.isWeekend(startDate);
  const isDinner = Utils.isDinner(startDate);
  const cssClasses = [];

  if(isDisableDate) {
    cssClasses.push('disable-date');
  } else if(isDinner) {
    cssClasses.push('dinner');
  }

  return (
    <div className={cssClasses} />
  );
}

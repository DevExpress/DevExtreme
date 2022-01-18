import React from 'react';
import Utils from './utils.js';

export default function DataCell(props) {
  const { startDate } = props.itemData;
  const isDisableDate = Utils.isHoliday(startDate) || Utils.isWeekend(startDate);
  const isDinner = Utils.isDinner(startDate);
  let cssClasses = props.className
    ? props.className
    : '';

  if (isDisableDate) {
    cssClasses += ' disable-date';
  } else if (isDinner) {
    cssClasses += ' dinner';
  }

  return (
    <div className={cssClasses}>
      {props.children}
    </div>
  );
}

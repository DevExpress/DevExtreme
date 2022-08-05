import React from 'react';
import Utils from './utils.js';

export default function DataCell(props) {
  const { startDate } = props.itemData;
  const isDinner = Utils.isDinner(startDate);
  let cssClasses = props.className
    ? props.className
    : '';

  if (Utils.isDisableDate(startDate)) {
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

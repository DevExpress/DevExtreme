import React from 'react';
import Utils from './utils.js';

const DataCell = (props) => {
  const { startDate } = props.data;
  const isDinner = Utils.isDinner(startDate);
  let cssClasses = props.className || '';
  if (Utils.isDisableDate(startDate)) {
    cssClasses += ' disable-date';
  } else if (isDinner) {
    cssClasses += ' dinner';
  }
  return <div className={cssClasses}>{props.children}</div>;
};
export default DataCell;

import React from 'react';
import Utils from './utils.js';

export default function DateCell(props) {
  const { date, text } = props.itemData;
  const isWeekend = Utils.isWeekend(date);

  return (
    <div className={isWeekend ? 'disable-date' : null}>
      <div>{text}</div>
    </div>
  );
}

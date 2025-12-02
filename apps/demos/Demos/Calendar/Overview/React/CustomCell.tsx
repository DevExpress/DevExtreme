import React from 'react';

export function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

const holidays = [
  [1, 0],
  [4, 6],
  [25, 11],
];

export function isHoliday(date: Date) {
  return holidays.some((item) => date.getDate() === item[0] && date.getMonth() === item[1]);
}

function getCellCssClass({ date, view }) {
  let cssClass = '';

  if (view === 'month') {
    if (!date) {
      cssClass = 'week-number';
    } else {
      if (isWeekend(date)) {
        cssClass = 'weekend';
      }

      if (isHoliday(date)) {
        cssClass = 'holiday';
      }
    }
  }

  return cssClass;
}

function CustomCell({ data: cell }) {
  const { text } = cell;

  const className = getCellCssClass(cell);

  return <span className={className}>{text}</span>;
}

export default CustomCell;

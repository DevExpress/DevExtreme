import React from 'react';
import { SchedulerTypes } from 'devextreme-react/scheduler';
import Utils from './utils.ts';

interface DateCellProps {
  itemData: any;
  currentView: SchedulerTypes.ViewType;
}

const DateCell = (props: DateCellProps) => {
  const { currentView, date, text } = props.itemData;
  const isDisabled = currentView === 'month'
    ? Utils.isWeekend(date)
    : Utils.isDisableDate(date);

  return (
    <div className={isDisabled ? 'disable-date' : undefined}>
      <div>{text}</div>
    </div>
  );
};

export default DateCell;
